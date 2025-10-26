import mongoose, { Schema, Document, Model } from "mongoose";
import { IEvent } from "./Event";

export interface IBooking extends Document {
    eventId: mongoose.Types.ObjectId | IEvent;
    userId: string;
    bookingDate: Date;
    status: string;
}

const BookingSchema: Schema<IBooking> = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        userId: { type: String, required: true },
        bookingDate: { type: Date, default: Date.now },
        status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    },
    { timestamps: true }
);

export default (mongoose.models.Booking as Model<IBooking>) ||
    mongoose.model<IBooking>("Booking", BookingSchema);
