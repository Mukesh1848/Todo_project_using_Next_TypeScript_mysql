import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from 'next';
import {User} from '../helperFunctions/interfaceHelper'


const JWT_SECRET = "cjsbwdbhwnhwbyfhbnbndbdhwduqjn";

export const generateToken = (user: { id: string; username: string }): string => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


export async function authenticateToken(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
      jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    //  (req as any).user = user;
    (req as any).user = user as User;
       next();
  });
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden' });
  }
}

// export const authenticateToken = (req: any, res: any, next: any): void => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = user;
//     next();
//   });
// };


