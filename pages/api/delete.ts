import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";
import { AuthenticatedRequest } from "../../helperFunctions/interfaceHelper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return authenticateToken(req, res, async () => {
    const { id } = req.body;
    // const userId = req.user.id;
    const userId = (req as AuthenticatedRequest).user.id;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    try {
      // Check if the user has permissions in shared_todos table
      const [sharedRows] = await pool.query(
        "SELECT permissions FROM shared_todos WHERE todo_id = ? AND user_id = ?",
        [id, userId]
      );

      let hasPermission = false;

      if (sharedRows.length > 0) {
        const userPermissions = sharedRows[0].permissions.split(",");
        console.log("userPermissions", userPermissions);

        // Check if the user has delete permission
        if (userPermissions.includes("Delete")) {
          hasPermission = true;
        }
      }

      // If no permission found in shared_todos, check if the user is the creator
      if (!hasPermission) {
        const [creatorRows] = await pool.query("SELECT user_id FROM todo WHERE id = ?", [id]);

        if (creatorRows.length > 0 && creatorRows[0].user_id === userId) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        return res.status(403).json({
          message: "Permission denied: No access to delete this todo",
        });
      }

      const [result] = await pool.query("DELETE FROM todo WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "TODO item not found" });
      }

      res.status(200).json({ message: "TODO item deleted successfully" });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  });
}
