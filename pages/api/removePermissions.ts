import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return authenticateToken(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { todoId, userIds, permissions } = req.body;

    if (!todoId || !userIds || !Array.isArray(userIds) || !permissions) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    try {
      for (const userId of userIds) {
        const [result] = await pool.query(
          "SELECT permissions FROM shared_todos WHERE todo_id = ? AND user_id = ?",
          [todoId, userId]
        );

        if (result.length === 0) {
          return res.status(404).json({
            message: `No shared todo found for todoId: ${todoId} and userId: ${userId}`,
          });
        }

        const existingPermissions = result[0].permissions.split(",");
        const updatedPermissions = existingPermissions.filter(
          (permission: string) => !permissions.includes(permission)
        );

        await pool.query(
          "UPDATE shared_todos SET permissions = ? WHERE todo_id = ? AND user_id = ?",
          [updatedPermissions.join(","), todoId, userId]
        );
      }

      res.status(200).json({ message: "Permissions removed successfully" });
    } catch (error) {
      console.error("Error removing permissions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}
