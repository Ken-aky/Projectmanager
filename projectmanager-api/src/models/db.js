import knex from "knex";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./projectmanager.db", // Pfad zur SQLite-Datenbankdatei
  },
  useNullAsDefault: true,
});
