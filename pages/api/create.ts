import { NextApiRequest, NextApiResponse } from 'next';
import pool from "../../databse/db";
import { authenticateToken } from "../../utils/auth";
import { AuthenticatedRequest } from '../../helperFunctions/interfaceHelper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return authenticateToken(req, res, async () => {
    const { title, description } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;

    try {
      const [result] = await pool.query(
        'INSERT INTO Todo (user_id, title, description) VALUES (?, ?, ?)',
        [userId, title, description]
      );
      res.status(201).json({ id: (result as any).insertId, title, description, userId });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
