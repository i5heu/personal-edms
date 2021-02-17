import { Database } from "sqlite3";
import { open } from "sqlite";

export async function createTables(db: Database) {
  //create login credentials table
  console.log("DB: create login credentials table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'user' (
        'userId' INT PRIMARY KEY,
        'email' TEXT NOT NULL,
        'pwd' TEXT NOT NULL
    );`);

  //create session table
  console.log("DB: create session table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'sessions' (
        'sessionId' TEXT PRIMARY KEY,
        'token' TEXT NOT NULL,
        'userId' INT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES user(userId)
    );`);

  //create group table
  console.log("DB: create group table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'docGroups' (
    'groupId' TEXT PRIMARY KEY,
    'name' TEXT NOT NULL,
    'userId' INT NOT NULL,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES user(userId)
  );`);

  //create document table
  console.log("DB: create document table");
  await db.run(`CREATE TABLE IF NOT EXISTS 'docs' (
        'docId' INT PRIMARY KEY,
        'hash' TEXT NOT NULL,
        'userId' INT NOT NULL,
        'created' DATETIME DEFAULT CURRENT_TIMESTAMP,
        'title' TEXT NOT NULL,
        'OCRText' TEXT NOT NULL,
        'note' TEXT NOT NULL,
        'groupId' INT NOT NULL,
        FOREIGN KEY(userId) REFERENCES user(userId),
        FOREIGN KEY(groupId) REFERENCES docGroups(groupId)
    );`);
}
