import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  createdAt: Date;
}

export interface IArticle {
  userId: mongoose.Types.ObjectId;
  originalUrl: string;
  title: string;
  description?: string;
  aiSummary: string;
  tags: string[];
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
