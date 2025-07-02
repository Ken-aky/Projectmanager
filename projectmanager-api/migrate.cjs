const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./projectmanager.db",
  },
  useNullAsDefault: true,
});

const migrate = async () => {
  // folders
  const hasFolders = await db.schema.hasTable("folders");
  if (!hasFolders) {
    await db.schema.createTable("folders", (t) => {
      t.increments("id").primary();
      t.string("title").notNullable();
      t.text("description");
    });
  }

  // projects
  const hasProjects = await db.schema.hasTable("projects");
  if (!hasProjects) {
    await db.schema.createTable("projects", (t) => {
      t.increments("id").primary();
      t.string("title").notNullable();
      t.text("description");
      t.integer("folderId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("folders")
        .onDelete("CASCADE");
    });
  }

  // todos
  const hasTodos = await db.schema.hasTable("todos");
  if (!hasTodos) {
    await db.schema.createTable("todos", (t) => {
      t.increments("id").primary();
      t.string("title").notNullable();
      t.string("priority");
      t.text("description");
      t.date("dueDate");
      t.boolean("done").defaultTo(false);
      t.integer("projectId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("projects")
        .onDelete("CASCADE");
    });
  }

  console.log("✅ Migration abgeschlossen.");
  process.exit();
};

migrate();
