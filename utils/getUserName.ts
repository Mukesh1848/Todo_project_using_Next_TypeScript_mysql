import pool from "../databse/db";

const getUserName = async (): Promise<string | undefined> => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (!token) return undefined;

  const [rows] = await pool.query("SELECT userName FROM users WHERE token = ?", [token]);
  console.log(rows);

  return rows[0]?.userName;
};

export default getUserName;
