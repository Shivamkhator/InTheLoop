import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Category from "@/models/Category";
import City from "@/models/City";
import Location from "@/models/Location";
// NOTE: We only use the NodeRedis client since Mongoose requires Node.js runtime.
import * as NodeRedis from "@/lib/redis"; // ioredis client
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
      return Response.json(JSON.parse(cachedEvents), {
        headers: { 
          'X-Cache-Status': 'REDIS-HIT',
          // 💡 CDN Caching: Tell Vercel and the browser to cache this response for 60s
          'Cache-Control': `public, max-age=60, s-maxage=60`
        }
      });
    }

    // 2. CACHE MISS: FETCH FROM DATABASE (SLOW)
    console.log("Fetching from DB (CACHE MISS)");
    await dbConnect();
    
    const events = await Event.find({})
      .populate("category")
      .populate("city")
      .populate({ path: "location", populate: { path: "city" } });

    if(events.length > 0){
      // 3. SET REDIS CACHE (for future requests)
      await NodeRedisClient.set(CACHE_KEY, JSON.stringify(events), "EX", CACHE_TTL_SECONDS);
    }

    return Response.json(events, {
      headers: { 
        'X-Cache-Status': 'DB-FETCH',
        // 💡 CDN Caching: Tell Vercel and the browser to cache this response for 60s
        'Cache-Control': `public, max-age=60, s-maxage=60`
      }
    });
  } catch (error: any) {
    console.error("GET Events Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- POST (CREATE) with Cache Invalidation ----------------

export async function POST(req: Request) {
  const NodeRedisClient = NodeRedis.default;
  try {
    await dbConnect();
    const body = await req.json();

    // ... [Your Mongoose logic to find or create referenced docs] ...
    const category = await Category.findOneAndUpdate({ name: body.category }, { name: body.category }, { upsert: true, new: true });
    const city = await City.findOneAndUpdate({ name: body.city }, { name: body.city }, { upsert: true, new: true });
    const location = await Location.findOneAndUpdate({ name: body.location, city: city._id }, { name: body.location, city: city._id }, { upsert: true, new: true });

    const event = await Event.create({
      title: body.title, description: body.description, date: body.date, image: body.image, 
      category: category._id, city: city._id, location: location._id,
    });

    // 1. Invalidate Redis cache
    await NodeRedisClient.del(CACHE_KEY);
    console.log("Redis cache invalidated");

    // 2. Invalidate Vercel CDN cache by setting the Cache-Control header
    const revalidationHeaders = new Headers();
    revalidationHeaders.set('Cache-Control', 'max-age=0, must-revalidate');

    return Response.json(event, { status: 201, headers: revalidationHeaders });
  } catch (error: any) {
    console.error("POST Event Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}