import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose"; 
import Booking from "@/models/Bookings";

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const { eventId, userId, status } = body;

        if (!eventId || !userId) {
            return NextResponse.json({ message: "Missing eventId or userId" }, { status: 400 });
        }
        
        // 1. Check for duplicate booking
        const existingBooking = await Booking.findOne({ eventId, userId, status: "confirmed" });
        if (existingBooking) {
             return NextResponse.json({ message: "A confirmed booking for this user and event already exists." }, { status: 409 });
        }

        // 2. Create the new booking document
        const newBooking = await Booking.create({
            eventId,
            userId,
            status: status || "confirmed",
            bookingDate: new Date(),
        });

        // Use .lean() or .toObject() to return a plain JS object
        return NextResponse.json(newBooking.toObject(), { status: 201 });

    } catch (error) {
        console.error("Booking POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
  try {
    await connectDB();

    const allBookings = await Booking.find({})
      .select("eventId userId status")
      .lean()
      .exec();

    return NextResponse.json(allBookings, { status: 200 });
  } catch (error) {
    console.error("Bookings GET Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}