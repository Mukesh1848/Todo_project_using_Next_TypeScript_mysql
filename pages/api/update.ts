import { AuthenticatedRequest } from './../../helperFunctions/interfaceHelper';
import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 return authenticateToken(req, res, async () => {
    const { id, todo } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;
    

    if (!id || !todo?.title || !todo?.description) {
      return res
        .status(400)
        .json({ error: "ID, title, and description are required" });
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

        // Check if the user has update permission
        if (userPermissions.includes("Update")) {
          hasPermission = true;
        }
      }

      // If no permission found in shared_todos, check if the user is the creator
      if (!hasPermission) {
        const [creatorRows] = await pool.query(
          "SELECT user_id FROM todo WHERE id = ?",
          [id]
        );

        if (creatorRows.length > 0 && creatorRows[0].user_id === userId) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        return res.status(403).json({
          message:
            "Permission denied: You don't have permission to update this TODO",
        });
      }

      const [result] = await pool.query(
        "UPDATE todo SET title = ?, description = ? WHERE id = ?",
        [todo.title, todo.description, id]
      );

      res
        .status(200)
        .json({ id, title: todo.title, description: todo.description });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  });
}
