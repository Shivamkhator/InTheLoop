import mongoose, { Schema } from "mongoose";
import { NextResponse } from "next/server";

// --- Assuming imports from your project structure ---
// NOTE: These models and dbConnect must exist in your actual project.
// We are only defining the logic here.
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Category from "@/models/Category";
import City from "@/models/City";
import Location from "@/models/Location";
import * as NodeRedis from "@/lib/redis";
import { headers } from "next/headers";

// ---CACHE SETTING---
const CACHE_TTL_SECONDS = 20; // 20 seconds cache duration
const CACHE_KEY = "all_upcoming_events";

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
          "Cache-Control": `public, max-age=60, s-maxage=60`,
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
        "Cache-Control": `public, max-age=60, s-maxage=60`,
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
    // Note: Location is tied to the City ID
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

    // 3. Invalidate Redis cache for 'Read All' endpoint
    await NodeRedisClient.del(CACHE_KEY);
    console.log("Redis cache invalidated after POST.");

    // 4. Invalidate Vercel CDN cache (optional but good practice)
    const revalidationHeaders = new Headers();
    revalidationHeaders.set("Cache-Control", "max-age=0, must-revalidate");

    return NextResponse.json(event, {
      status: 201,
      headers: revalidationHeaders,
    });
  } catch (error) {
    console.error("POST Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
