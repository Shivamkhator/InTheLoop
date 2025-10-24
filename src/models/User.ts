import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  username?: string;
  role: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    role: { type: String, enum: ["user", "creator"], default: "user" },
  },
  { timestamps: true }
);

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
