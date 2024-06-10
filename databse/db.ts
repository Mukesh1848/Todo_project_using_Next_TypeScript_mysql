const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  debug: true,
  user: "root",
  password: "Your Password",
  port: 3306,
  database: "Your Database Name",
});

// module.exports = pool;

// exports {pool}

export default pool;