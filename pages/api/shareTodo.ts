import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return authenticateToken(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { todoId, userIds, permissions } = req.body;

    console.log(req.body);

    if (!todoId || !userIds || !Array.isArray(userIds) || !permissions) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    try {
      for (const userId of userIds) {
        await pool.query(
          `INSERT INTO shared_todos (todo_id, user_id, permissions) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE permissions = 
           CONCAT_WS(',', permissions, VALUES(permissions))`,
          [todoId, userId, permissions.join(",")]
        );
      }

      res.status(200).json({ message: "Todo shared successfully" });
    } catch (error) {
      console.error("Error sharing todo:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}
