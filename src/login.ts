import express from "express";
import { Database } from "sqlite3";
import { reqCheck } from "./limitChecks";

export function login(
  db: Database,
  req: express.Request,
  res: express.Response,
  mail: string,
  pwd: string
):
  | {
      sessionId: string;
      sessionToken: string;
    }
  | boolean {
  if (!reqCheck(req, res, true)) return false;

  return {
    sessionId: "foo",
    sessionToken: "foo",
  };
}
