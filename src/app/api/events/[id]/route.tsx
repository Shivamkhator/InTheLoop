import { NextResponse } from "next/server";

// --- Assuming imports from your project structure ---
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Category from "@/models/Category";
import City from "@/models/City";
import Location from "@/models/Location";
import * as NodeRedis from "@/lib/redis";

const CACHE_KEY = "all_upcoming_events";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const NodeRedisClient = NodeRedis.default;
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // A unique cache key for the individual event
    const SINGLE_EVENT_CACHE_KEY = `event:${id}`;

    try {
        await dbConnect();

        // 1. Check Redis Cache for single event
        const cachedEvent = await NodeRedisClient.get(SINGLE_EVENT_CACHE_KEY);
        if (cachedEvent) {
            console.log(`Serving event ID ${id} from Redis cache (SINGLE HIT)`);
            return NextResponse.json(JSON.parse(cachedEvent), { status: 200 });
        }
        
        // 2. Fetch from Database
        const event = await Event.findById(id)
            .populate("category")
            .populate("city")
            .populate({ path: "location", populate: { path: "city" } });

        if (!event) {
            return NextResponse.json({ error: "Event not found." }, { status: 404 });
        }

        // 3. Cache the result for future requests (e.g., cache for 1 hour)
        const eventData = JSON.stringify(event);
        await NodeRedisClient.set(SINGLE_EVENT_CACHE_KEY, eventData, 'EX', 3600); 
        console.log(`Event ID ${id} fetched from DB and cached.`);


        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.error("GET Single Event Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}
// -----------------------------------------------------------------------------

// ---------------- DELETE ----------------
/**
 * Handles DELETE requests to /api/events/[id].
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const NodeRedisClient = NodeRedis.default;
    const { id } = params;
    
    // Define the single event cache key here too, so we can invalidate it
    const SINGLE_EVENT_CACHE_KEY = `event:${id}`;

    try {
        await dbConnect();

        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return NextResponse.json({ error: "Event not found." }, { status: 404 });
        }

        // Invalidate the 'Read All' cache AND the specific single event cache
        await NodeRedisClient.del(CACHE_KEY);
        await NodeRedisClient.del(SINGLE_EVENT_CACHE_KEY);
        console.log(`Event ID ${id} deleted and related caches invalidated.`);

        return NextResponse.json(
            { message: "Event deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE Event Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// ---------------- PUT (UPDATE) with Cache Invalidation ----------------
/**
 * Handles PUT requests to /api/events/[id].
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const NodeRedisClient = NodeRedis.default;
    const { id } = params;
    
    // Define the single event cache key here too
    const SINGLE_EVENT_CACHE_KEY = `event:${id}`;

    try {
        await dbConnect();
        const body = await req.json();

        // 1. Find or Create supporting documents for updates
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

        // 2. Prepare the update object
        const updateData = {
            title: body.title,
            description: body.description,
            date: body.date,
            image: body.image,
            category: category._id,
            city: city._id,
            location: location._id,
        };

        // 3. Find and update the Event
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate("category")
            .populate("city")
            .populate({ path: "location", populate: { path: "city" } });

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found." }, { status: 404 });
        }

        // 4. Invalidate the 'Read All' cache AND the specific single event cache
        await NodeRedisClient.del(CACHE_KEY);
        await NodeRedisClient.del(SINGLE_EVENT_CACHE_KEY);
        
        // OPTIONAL: Re-cache the newly updated single event (Read-Through pattern)
        const eventData = JSON.stringify(updatedEvent);
        await NodeRedisClient.set(SINGLE_EVENT_CACHE_KEY, eventData, 'EX', 3600); 
        
        console.log(`Event ID ${id} updated and caches invalidated/refreshed.`);

        return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error) {
        console.error("PUT Event Error:", error);
        if ((error as any).name === "ValidationError") {
            const messages = Object.values((error as any).errors)
                .map((err: any) => err.message)
                .join(", ");
            return NextResponse.json(
                { error: `Validation Failed: ${messages}` },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}