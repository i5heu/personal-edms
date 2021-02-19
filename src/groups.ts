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
  console.log("resultresultresult", result);

  res.render("groups", { groups: result });
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
