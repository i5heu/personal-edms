import express from "express";
import { Database } from "sqlite";
import { reqCheck } from "./limitChecks";

/**
 * sessionId is the key
 * sessionToken is the value
 */
const loginSessions: string[] = [];

export async function login(
  db: Database,
  req: express.Request,
  res: express.Response,
  email: string,
  pwd: string
): Promise<
  | {
      sessionId: string;
      sessionToken: string;
    }
  | boolean
> {
  if (!reqCheck(req, res, true)) return false;

  //check credentials from database
  const result = await db.get(
    "SELECT userId,pwd FROM users WHERE email = ?",
    email
  );

  if (result.pwd == undefined) {
    res.redirect("/register");
    return false;
  }

  if (result.pwd !== pwd) {
    res.redirect("/?state=wrong_pwd");
    return false;
  }

  const sessionId = makeId(50);
  loginSessions[sessionId] = makeId(200);

  const sessionInsert = await db.run(
    "INSERT INTO sessions (sessionId, token, userId) VALUES (?,?,?)",
    sessionId,
    loginSessions,
    result.userId
  );

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

  //TODO OPTIMIZE THIS

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

export async function getUserId(
  db: Database,
  req: express.Request
): Promise<number | false> {
  const result = await db.get(
    "SELECT userId FROM sessions WHERE sessionId = ?",
    req.cookies.session_id
  );

  console.log("resultresultresultresultresult", result);
  
  if (isNaN(result.userId)) return false;
  return result.userId;
}
