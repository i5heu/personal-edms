import express from "express";
import { Database } from "sqlite";
import { getUserId } from "./login";

export async function getDocumentsOfUser(
  db: Database,
  userId: number
): Promise<any> {
  const result = await db.all(
    `SELECT docId, created, title, note, groupId FROM docs WHERE userId = ?;`,
    userId
  );
    console.log("result", result);
  return result;
}
