import { Request, Response } from "express";
import { signupUser, loginUser } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const result = await signupUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};
