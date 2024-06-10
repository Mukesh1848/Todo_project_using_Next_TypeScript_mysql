import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";
import { AuthenticatedRequest } from "../../helperFunctions/interfaceHelper";

export default async function helper(req: NextApiRequest, res: NextApiResponse) {
  return authenticateToken(req, res, async () => {
    // const userId = req.user.id;
    const userId = (req as AuthenticatedRequest).user.id;

    if (!userId) {
      res.json({ error: "userId not Found" });
    }

    try {
      const [rows] = await pool.query("SELECT userName FROM users WHERE id = ?", [userId]);

      if (rows.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json({ userName: rows[0].userName });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
