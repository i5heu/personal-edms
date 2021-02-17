console.info("Server starting....");
import express from "express";
import cookieParser from "cookie-parser";
import {
  reqCheck,
  resetIpCache,
  loginLeft,
  resetLoginIpCache,
  reqLeft,
} from "./limitChecks";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { isAuthenticated, login } from "./login";
import { createTables } from "./createDatabase";
import { groupDashboard, createGroup } from "./groups";

let db;
sqlite3.verbose();

async function createDb() {
  db = await open({
    filename: ":memory:",
    driver: sqlite3.cached.Database,
  });

  await createTables(db);

  // test code
  db.run(`INSERT INTO users (email,pwd) VALUES (
    'test@test.test',
    'test'
  );`);
}
createDb();

const app = express();

resetIpCache();
resetLoginIpCache();

app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "pug");

app.get("/groups", (req, res) => {
  if (!isAuthenticated(req, res)) return;
  groupDashboard(db, req, res);
});
app.post("/rest/newGroup", (req, res) => {
  if (!isAuthenticated(req, res)) return;
  createGroup(db, req, res);
});

app.get("/dashboard", (req, res) => {
  if (!isAuthenticated(req, res)) return;
  res.render("dashboard", { reqLeft: reqLeft(req) });
});

app.get("/", (req, res) => {
  if (!reqCheck(req, res)) return;
  //todo if logged in -> redirect to dashboard
  res.render("login", { loginLeft: loginLeft(req) });
});
app.post("/rest/login", async (req, res) => {
  if (!req.body.mail || !req.body.pwd) {
    res.status(500).send("You have to insert an e-mail and password!");
    return;
  }

  if (!reqCheck(req, res)) return;

  const loginResult = await login(db, req, res, req.body.mail, req.body.pwd);
  if (!loginResult) return;
  if (loginResult === true) throw new Error("This should not happen");

  const cookieOptions = {
    // maxAge: 50 days
    maxAge: 4320000,
    httpOnly: true,
    // TODO !!!!!!!!IMPORTANT! COMMEND THIS LINE IN AGAIN!!!!!!!
    //secure: true,
  };

  //set cookie and redirect to dashboard or to
  res.cookie("session_id", loginResult.sessionId, cookieOptions);
  res.cookie("session_token", loginResult.sessionToken, cookieOptions);

  res.redirect("/dashboard");
});

app.listen(80, () => console.info("Server serving"));
