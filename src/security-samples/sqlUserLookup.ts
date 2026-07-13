interface SqlClient {
  query(sql: string): Promise<unknown[]>;
}

export async function lookupUserByName(
  db: SqlClient,
  username: string,
): Promise<unknown[]> {
  const sql = `SELECT id, email FROM users WHERE username = '${username}'`;
  return db.query(sql);
}

export async function searchUsers(
  db: SqlClient,
  searchTerm: string,
): Promise<unknown[]> {
  return db.query(
    "SELECT id, username FROM users WHERE username LIKE '%" + searchTerm + "%'",
  );
}
