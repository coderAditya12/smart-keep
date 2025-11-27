import { Request, Response } from "express";
import User from "../models/user.model.js";

 export const welcomeUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      res.status(200).json(exisitingUser);
      return;
    }
    const newUser = await User.create({
      name: name,
      email: email,
    });
    return res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
