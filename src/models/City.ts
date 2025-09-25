import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICity extends Document {
  name: string;
  state?: string;
  country?: string;
}

const CitySchema: Schema<ICity> = new Schema({
  name: { type: String, required: true },
  state: { type: String },
  country: { type: String },
});

export default (mongoose.models.City as Model<ICity>) ||
  mongoose.model<ICity>("City", CitySchema);
