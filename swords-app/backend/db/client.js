import postgres from "postgres";

const sql = postgres({
  host:     process.env.PGHOST     ?? "localhost",
  port:     Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "swords",
  username: process.env.PGUSER     ?? "postgres",
  password: process.env.PGPASSWORD ?? "",
  max:      10,            // connection pool size
  idle_timeout: 30,        // seconds before idle connection is released
  connect_timeout: 10,
});

export default sql;
