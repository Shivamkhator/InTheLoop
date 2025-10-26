import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Booking from "@/models/Bookings";
import Event from "@/models/Event"; // ✅ NEW: Registers Event
import Location from "@/models/Location";
import City from "@/models/City";

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId" },
        { status: 400 }
      );
    }

    const userBookings = await Booking.find({ userId })
      .populate({
        path: "eventId",
        select: "title date location city image",
        populate: [
          { path: "location", select: "name" },
          { path: "city", select: "name" },
        ],
      })
      .sort({ bookingDate: -1 })
      .lean()
      .exec();

    const validBookings = userBookings.filter(
      (booking) => booking.eventId !== null
    );

    return NextResponse.json(validBookings, { status: 200 });
  } catch (error) {
    console.error("User Bookings GET Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
