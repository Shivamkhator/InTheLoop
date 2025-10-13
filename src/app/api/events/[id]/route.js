import { NextResponse } from "next/server";

// --- Assuming imports from your project structure ---
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Category from "@/models/Category";
import City from "@/models/City";
import Location from "@/models/Location";
import * as NodeRedis from "@/lib/redis";

const CACHE_KEY = "all_upcoming_events";

export async function DELETE(req, { params }) {
  const NodeRedisClient = NodeRedis.default;
  try {
    const { id } = params;
    await dbConnect();

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // Invalidate the 'Read All' cache
    await NodeRedisClient.del(CACHE_KEY);
    console.log(`Event ID ${id} deleted and Redis cache invalidated.`);

    return NextResponse.json(
      { message: "Event deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- PUT (UPDATE) with Cache Invalidation ----------------

/**
 * Handles PUT requests to update a specific Event document.
 * URL: /api/events/[id]
 */
export async function PUT(req, { params }) {
  const NodeRedisClient = NodeRedis.default;
  try {
    const { id } = params;
    await dbConnect();
    const body = await req.json();

    // 1. Find or Create supporting documents for updates
    // (This is crucial if the category, city, or location name was changed in the form)
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

    // 4. Invalidate the 'Read All' cache
    await NodeRedisClient.del(CACHE_KEY);
    console.log(`Event ID ${id} updated and Redis cache invalidated.`);

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("PUT Event Error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
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
