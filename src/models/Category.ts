import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon?: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  icon: { type: String },
});

export default (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>("Category", CategorySchema);
