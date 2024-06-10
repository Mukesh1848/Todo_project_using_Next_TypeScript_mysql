import { NextApiRequest, NextApiResponse } from 'next';
import pool from "../../../databse/db";
import { authenticateToken } from "../../../utils/auth";
import { AuthenticatedRequest } from '../../../helperFunctions/interfaceHelper';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return authenticateToken(req, res, async () => {
      const userId = (req as AuthenticatedRequest).user.id;
       
      // const {userId} = req.body;
      
      try {
        const [todos] = await pool.query(
          `
            SELECT DISTINCT t.id, t.title, t.description
            FROM todo t
            LEFT JOIN shared_todos st ON t.id = st.todo_id
            WHERE t.user_id = ? OR st.user_id = ?;
          `,
          [userId, userId]
        );
        res.status(200).json(todos);
        console.log(todos);
      } catch (error) {
        res.status(500).json({ message: "Error fetching todos", error });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
