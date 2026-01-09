import * as dotenv from "dotenv";
dotenv.config();

/**
 * Validates that all required environment variables are present.
 * Throws an error if any required variable is missing.
 */
function validateEnv(): void {
  const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`,
    );
    console.error("   Please create a .env file based on .env.example");
    process.exit(1);
  }
}

validateEnv();

export const config = {
  db: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: parseInt(process.env.DB_PORT || "3306", 10),
  },
  version: "1",
  tables: [
    { table: "users", global: true },
    { table: "projects", global: false },
    // Add your tables here or load from database
  ].sort((a, b) => a.table.localeCompare(b.table)),
  generate: {
    // Backend generation
    entity: true,
    auditEntity: true,
    dto: true,
    module: true,
    subscriber: true,
    controller: true,
    service: true,
    // Tests generation (new)
    serviceSpec: true,
    controllerSpec: true,
    // SQL generation
    sqlAuditTables: true,
    // App files
    main: true,
    appModule: true,
    // Frontend generation
    model: true,
    func: true,
    vue: true,
    tableColumn: true,
  },
  paths: {
    backend: process.env.BACKEND_PATH || "./template-backend/src",
    frontend: process.env.FRONTEND_PATH || "./template-frontend/src/func",
    sql: process.env.SQL_PATH || "./database/scripts",
  },
};
