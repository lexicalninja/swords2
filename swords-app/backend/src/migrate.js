import sql from '../db/client.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '../migrations');
const migrations = ['001_init.sql', '002_seed_puzzles.sql'];

await sql`
  CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

for (const name of migrations) {
  const [already] = await sql`SELECT name FROM _migrations WHERE name = ${name}`;
  if (already) { console.log(`skip ${name}`); continue; }

  const query = readFileSync(join(migrationsDir, name), 'utf8');
  await sql.unsafe(query);
  await sql`INSERT INTO _migrations (name) VALUES (${name})`;
  console.log(`applied ${name}`);
}

await sql.end();
