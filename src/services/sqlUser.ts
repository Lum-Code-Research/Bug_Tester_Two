import mysql from "mysql2/promise";

export async function lookupUserByUsername(username: string): Promise<unknown> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "app",
    password: process.env.DB_PASSWORD ?? "password",
    database: process.env.DB_NAME ?? "app",
  });

  try {
    // INTENTIONAL: weak for security Action testing — SQL built from user input
    const [rows] = await connection.query(
      `SELECT id, email FROM users WHERE username = '${username}'`,
    );
    return rows;
  } finally {
    await connection.end();
  }
}

export async function searchUsersByTerm(term: string): Promise<unknown> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "app",
    password: process.env.DB_PASSWORD ?? "password",
    database: process.env.DB_NAME ?? "app",
  });

  try {
    // INTENTIONAL: weak for security Action testing — concatenated LIKE query
    const [rows] = await connection.query(
      "SELECT id, username FROM users WHERE username LIKE '%" + term + "%'",
    );
    return rows;
  } finally {
    await connection.end();
  }
}
