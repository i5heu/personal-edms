import { Database } from "sqlite3";
import { open } from "sqlite";

export async function createTables(db: Database) {
  //create login credentials table
  console.log("DB: create login users table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'users' (
        'userId' INTEGER PRIMARY KEY AUTOINCREMENT,
        'email' TEXT NOT NULL,
        'pwd' TEXT NOT NULL
    );`);

  //create session table
  console.log("DB: create sessions table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'sessions' (
        'sessionId' TEXT PRIMARY KEY NOT NULL,
        'token' TEXT NOT NULL,
        'userId' INT NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES user(userId)
    );`);

  //create group table
  console.log("DB: create docGroup table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'docGroups' (
    'groupId' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT NOT NULL,
    'userId' INT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES user(userId)
  );`);

  //create document table
  //TODO on user creation an TMP document must be created to hold unsorted files
  console.log("DB: create document table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'docs' (
        'docId' INTEGER PRIMARY KEY AUTOINCREMENT,
        'userId' INT NOT NULL,
        'created' DATETIME DEFAULT CURRENT_TIMESTAMP,
        'title' TEXT NOT NULL,
        'note' TEXT,
        'groupId' INT,
        FOREIGN KEY(userId) REFERENCES user(userId)
    );`);

  //create files table
  console.log("DB: create files table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'files' (
        'fileId' INTEGER PRIMARY KEY AUTOINCREMENT,
        'hash' TEXT NOT NULL,
        'docId' INT NOT NULL,
        'created' DATETIME DEFAULT CURRENT_TIMESTAMP,
        'ocrText' TEXT,
        'note' TEXT,
        'originalName' TEXT NOT NULL,
        'encoding' TEXT NOT NULL,
        'mimetype' TEXT NOT NULL,
        'filename' TEXT NOT NULL,
        'size' INT NOT NULL,
        FOREIGN KEY(docId) REFERENCES docs(docId)
    );`);
}
