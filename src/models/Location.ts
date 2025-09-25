import mongoose, { Schema, Document, Model } from "mongoose";
import { ICity } from "./City";

export interface ILocation extends Document {
  name: string;
  city: ICity["_id"];
}

const LocationSchema: Schema<ILocation> = new Schema({
  name: { type: String, required: true },
  city: { type: Schema.Types.ObjectId, ref: "City", required: true },
});

export default (mongoose.models.Location as Model<ILocation>) ||
  mongoose.model<ILocation>("Location", LocationSchema);
