import express from "express";
import { Database } from "sqlite";
import { getUserId} from "./login";

export async function uploadNewFiles(
  db: Database,
  req: express.Request,
  res: express.Response
) {
  const userId = await getUserId(db, req);
  if (!userId) return;
  console.log(userId, req.files);

  res.redirect("/dashboard");
}