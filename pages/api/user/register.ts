import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../databse/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ error: "All The Fields are Mandatory...!" });
  }

  try {
    // Check if the Email already exists
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already Exists...!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserting the new user into the database
    const [result] = await pool.query(
      "INSERT INTO users (userName, email, password) VALUES (?, ?, ?)",
      [userName, email, hashedPassword]
    );

    res.status(201).json({ id: result.insertId, userName, email, hashedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error when registering user...!" });
  }
}
