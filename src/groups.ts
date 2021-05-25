import express from "express";
import { Database } from "sqlite";
import { getUserId, isAuthenticated } from "./login";

export async function groupDashboard(
  db,
  req: express.Request,
  res: express.Response
) {
  const userId = await getUserId(db, req);
  if (!userId) return;

  // get current groups:
  const result = await db.all(
    `SELECT groupId, name, created FROM docGroups WHERE userId = ?;`,
    userId
  );

  res.render("groups", { groups: result, pagestatus: req.query.pagestatus });
}

export async function createGroup(
  db: Database,
  req: express.Request,
  res: express.Response
) {
  if (!req.body.newGroupName) {
    res.status(500).send("500: You have to insert a Group Name!");
    return;
  }
  const userId = await getUserId(db, req);
  if (!userId) return;

  const result = await db.run(
    "INSERT INTO docGroups (name, userId) VALUES (?,?)",
    req.body.newGroupName,
    userId
  );

  res.redirect("/groups");
}

export async function check_getGroup(
  db: Database,
  req: express.Request,
  res: express.Response
) {
  if (!req.body.newGroupName) {
    res.status(500).send("500: You have to insert a Group Name!");
    return;
  }
  const userId = await getUserId(db, req);
  if (!userId) return;

  const result = await db.all(
    "SELECT groupId, name, created FROM docGroups WHERE userId = ? AND name = ?",
    userId,
    req.body.newGroupName
  );

  return result.length == 0 ? true : false;
}
