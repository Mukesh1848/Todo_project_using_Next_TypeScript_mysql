import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return authenticateToken(req, res, async () => {
  // console.log(req.query);
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.status(200).json(rows);
    } catch (error) {
        console.log(error);
    }
    });
}
