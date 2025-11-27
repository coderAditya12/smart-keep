import mongoose, { Schema } from "mongoose";
const ArticleSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    originalUrl: {
        type: String,
        required: [true, "Original URL is required"],
        trim: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    aiSummary: {
        type: String,
        required: [true, "AI Summary is required"],
    },
    tags: {
        type: [String],
        default: [],
        index: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
ArticleSchema.index({ userId: 1, originalUrl: 1 }, { unique: true });
export const Article = mongoose.model("Article", ArticleSchema);
