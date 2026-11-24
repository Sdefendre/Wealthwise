import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const pool = new Pool({
  connectionString: databaseUrl,
})

const db = drizzle(pool)

async function main() {
  console.log("Running migrations...")
  
  await migrate(db, { migrationsFolder: "drizzle/migrations" })
  
  console.log("Migrations completed!")
  
  await pool.end()
}

main().catch((err) => {
  console.error("Migration failed!")
  console.error(err)
  process.exit(1)
}) 
