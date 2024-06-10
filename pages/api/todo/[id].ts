import { NextApiRequest, NextApiResponse } from 'next';
import pool from "../../../databse/db"
import { authenticateToken } from "../../../utils/auth";
import { AuthenticatedRequest } from '../../../helperFunctions/interfaceHelper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
   return authenticateToken(req, res, async () => {
      // const id = (req as AuthenticatedRequest).user.id;
      const { id } = req.query;
      //  console.log(userId);
      try {
        const [rows] = await pool.query(
          "SELECT todo.title, todo.description FROM Todo WHERE id = ?",
          [id]
        );
        console.log(rows);
      res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};