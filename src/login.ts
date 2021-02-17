import express from "express";
import { Database } from "sqlite3";
import { reqCheck } from "./limitChecks";

/**
 * sessionId is the key
 * sessionToken is the value
 */
const loginSessions: string[] = [];

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

  //TODO check credentials from database

  const sessionId = makeId(50);
  loginSessions[sessionId] = makeId(200);

  return {
    sessionId: sessionId,
    sessionToken: loginSessions[sessionId],
  };
}

/**
 * will check in an req. limiting way if the req. is authenticated
 */
export function isAuthenticated(
  req: express.Request,
  res: express.Response
): boolean {
  if (!reqCheck(req, res)) return false;

  if (
    req.cookies.session_id &&
    req.cookies.session_token &&
    loginSessions[req.cookies.session_id] === req.cookies.session_token
  )
    return true;

  res.redirect("/");
  return false;
}

function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+*#€@§%&?°";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
