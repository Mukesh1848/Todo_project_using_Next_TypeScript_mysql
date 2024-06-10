import { comparePassword, generateToken } from "@/utils/auth";
import pool from "../../../databse/db";
import { NextApiRequest, NextApiResponse } from "next";

// Define the shape of a User object
interface User {
  id: number;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Query the database and expect an array of User objects in response
      // const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

      // If no user is found, respond with an error
      if (rows.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      // Extract the first user from the result
      const user = rows[0];

      // Compare the provided password with the stored password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      // Generate a token for the user
      const token = generateToken(user);

      // Update the user's token in the database
      await pool.query("UPDATE users SET token = ? WHERE id = ?", [
        token,
        user.id,
      ]);

      // Respond with success message and token
      res.status(200).json({ message: "User Login Successfully...!", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  } else {
    // If the request method is not POST, respond with method not allowed
    res.status(405).json({ message: "Method not allowed" });
  }
}
