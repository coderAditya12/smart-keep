import { model, Schema } from "mongoose";
import { IUser } from "../types/user.type.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
  },
  {
    timestamps: true,
  }
);
const User = model<IUser>("User", userSchema);
export default User;
