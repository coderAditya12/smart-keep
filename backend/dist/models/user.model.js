import { model, Schema } from "mongoose";
const userSchema = new Schema({
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
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
}, {
    timestamps: true,
});
const User = model("User", userSchema);
export default User;
