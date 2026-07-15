import mysql from "mysql2/promise";

export interface UserRow {
  id: number;
  username: string;
  email: string;
}

const offlineUsers: UserRow[] = [
  { id: 1, username: "ada", email: "ada@example.com" },
  { id: 2, username: "grace", email: "grace@example.com" },
];

function useOfflineDb(): boolean {
  return process.env.USE_OFFLINE_DB !== "false";
}

export async function lookupUserByUsername(username: string): Promise<UserRow[]> {
  if (useOfflineDb()) {
    return offlineUsers.filter(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "app",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "app",
  });

  try {
    const [rows] = await connection.query(
      "SELECT id, username, email FROM users WHERE username = ?",
      [username],
    );
    return rows as UserRow[];
  } finally {
    await connection.end();
  }
}

export async function searchUsersByTerm(term: string): Promise<UserRow[]> {
  if (useOfflineDb()) {
    const needle = term.toLowerCase();
    return offlineUsers.filter((user) => user.username.toLowerCase().includes(needle));
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "app",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "app",
  });

  try {
    const [rows] = await connection.query(
      "SELECT id, username, email FROM users WHERE username LIKE ?",
      [`%${term}%`],
    );
    return rows as UserRow[];
  } finally {
    await connection.end();
  }
}
