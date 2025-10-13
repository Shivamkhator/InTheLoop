import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// --- Assuming imports from your project structure ---
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Category from "@/models/Category";
import City from "@/models/City";
import Location from "@/models/Location";
import * as NodeRedis from "@/lib/redis";

// ---CACHE SETTING---
// Keep TTL low for the Redis node cache, as CDN/revalidatePath handles the external caching.
const CACHE_TTL_SECONDS = 10; 
const CACHE_KEY = "all_upcoming_events";
// IMPORTANT: Use the actual client-facing path if this is a route handler
const EVENTS_PATH = "/api/events"; 

// ---------------- GET (READ) with Node/Redis Caching + CDN Headers ----------------

export async function GET() {
  const NodeRedisClient = NodeRedis.default;
  try {
    // 1. CHECK REDIS CACHE
    const cachedEvents = await NodeRedisClient.get(CACHE_KEY);

    if (cachedEvents) {
      console.log("Serving from Redis cache (NODE HIT)");
      return NextResponse.json(JSON.parse(cachedEvents), {
        headers: {
          "X-Cache-Status": "REDIS-HIT",
          // FIX: Shorten CDN cache (s-maxage) to 1 second. 
          // This respects revalidatePath immediately. Browser (max-age) is 0.
          "Cache-Control": `public, max-age=0, s-maxage=1, must-revalidate`,
        },
      });
    }

    // 2. CACHE MISS: FETCH FROM DATABASE (SLOW)
    console.log("Fetching from DB (CACHE MISS)");
    await dbConnect();

    // Fetch all events and populate all linked fields for a rich data response
    const events = await Event.find({})
      .populate("category")
      .populate("city")
      .populate({ path: "location", populate: { path: "city" } });

    if (events.length > 0) {
      // 3. SET REDIS CACHE (for future requests)
      // Node cache is set for 10 seconds to serve subsequent requests quickly 
      // *if no mutation occurs*.
      await NodeRedisClient.set(
        CACHE_KEY,
        JSON.stringify(events),
        "EX",
        CACHE_TTL_SECONDS
      );
    }

    return NextResponse.json(events, {
      headers: {
        "X-Cache-Status": "DB-FETCH",
        // FIX: Shorten CDN cache (s-maxage) to 1 second. 
        "Cache-Control": `public, max-age=0, s-maxage=1, must-revalidate`,
      },
    });
  } catch (error) {
    console.error("GET Events Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- POST (CREATE) with Cache Invalidation ----------------

export async function POST(req) {
  const NodeRedisClient = NodeRedis.default;
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Find or Create supporting documents (Category, City, Location)
    const category = await Category.findOneAndUpdate(
      { name: body.category },
      { name: body.category, icon: body.icon },
      { upsert: true, new: true }
    );
    const city = await City.findOneAndUpdate(
      { name: body.city },
      { name: body.city, state: body.state, country: body.country },
      { upsert: true, new: true }
    );
    const location = await Location.findOneAndUpdate(
      { name: body.location, city: city._id },
      { name: body.location, city: city._id },
      { upsert: true, new: true }
    );

    // 2. Create the main Event document
    const event = await Event.create({
      title: body.title,
      description: body.description,
      date: body.date,
      image: body.image,
      category: category._id,
      city: city._id,
      location: location._id,
    });

    // 3. Invalidate Redis cache: Ensures the next GET will hit the DB for fresh data
    await NodeRedisClient.del(CACHE_KEY);
    console.log("Redis cache invalidated after POST.");

    // 4. Force Vercel CDN/Next.js data cache revalidation: Triggers CDN purge
    revalidatePath(EVENTS_PATH);

    return NextResponse.json(event, {
      status: 201,
      headers: {
        "Cache-Control": "max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("POST Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- PUT (UPDATE) with Cache Invalidation ----------------
// NOTE: This assumes PUT is called via /api/events/[id] and updates the entire document.

export async function PUT(req, { params }) {
  const NodeRedisClient = NodeRedis.default;
  try {
    await dbConnect();
    const body = await req.json();
    // Assuming the URL is /api/events/SOME_ID
    const id = params.id; 

    if (!id) {
      return NextResponse.json({ error: "Event ID is required for update" }, { status: 400 });
    }

    // 1. Find or Create supporting documents (Category, City, Location)
    const category = await Category.findOneAndUpdate(
      { name: body.category },
      { name: body.category, icon: body.icon },
      { upsert: true, new: true }
    );
    const city = await City.findOneAndUpdate(
      { name: body.city },
      { name: body.city, state: body.state, country: body.country },
      { upsert: true, new: true }
    );
    const location = await Location.findOneAndUpdate(
      { name: body.location, city: city._id },
      { name: body.location, city: city._id },
      { upsert: true, new: true }
    );

    // 2. Update the main Event document
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        date: body.date,
        image: body.image,
        category: category._id,
        city: city._id,
        location: location._id,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 3. Invalidate Redis cache
    await NodeRedisClient.del(CACHE_KEY);
    console.log("Redis cache invalidated after PUT.");

    // 4. Force Vercel CDN/Next.js data cache revalidation
    revalidatePath(EVENTS_PATH);

    return NextResponse.json(updatedEvent, {
      status: 200,
      headers: { "Cache-Control": "max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("PUT Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- DELETE with Cache Invalidation ----------------
// NOTE: This assumes DELETE is called via /api/events/[id].

export async function DELETE(req, { params }) {
  const NodeRedisClient = NodeRedis.default;
  try {
    // Assuming the URL is /api/events/SOME_ID
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Event ID is required for deletion" }, { status: 400 });
    }

    await dbConnect();

    const result = await Event.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 1. Invalidate Redis cache
    await NodeRedisClient.del(CACHE_KEY);
    console.log("Redis cache invalidated after DELETE.");

    // 2. Force Vercel CDN/Next.js data cache revalidation
    revalidatePath(EVENTS_PATH);

    return NextResponse.json({ message: "Event deleted successfully" }, {
      status: 200,
      headers: { "Cache-Control": "max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}