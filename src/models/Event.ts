import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "./Category";
import { ICity } from "./City";
import { ILocation } from "./Location";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  image?: string;
  category: ICategory["_id"];
  city: ICity["_id"];
  location: ILocation["_id"];
  shortDescription?: string;
  creatorId?: string;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    image: { type: String,
      default: "https://images.pexels.com/photos/8381889/pexels-photo-8381889.jpeg"
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    shortDescription: { type: String, maxlength: 50, default: "", required: true },
    creatorId: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
