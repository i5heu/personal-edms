console.info("Server starting....");
import express from "express";
import { reqCheck, resetIpCache, loginLeft, resetLoginIpCache } from "./limitChecks";
import sqlite3 from "sqlite3";
import { login } from "./login";
import { createTables } from "./createDatabase";

const db = new sqlite3.Database(":memory:");
const app = express();

createTables(db);
resetIpCache();
resetLoginIpCache();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "pug");

app.get("/", (req, res) => {
  if (!reqCheck(req, res)) return;
  res.render("login", { loginLeft: loginLeft(req) });
});

app.post("/rest/login", (req, res) => {
  if (!req.body.mail || !req.body.pwd) {
    res.status(500).send("You have to insert an e-mail and password!");
    return;
  }

  if (!reqCheck(req, res)) return;

  const loginResult = login(db, req, res, req.body.mail, req.body.pwd);
  if (!loginResult) return;

  //TODO set cookie and redirect to dashboard or to /

  res.redirect("/");
});

app.listen(80, () => console.info("Server serving"));
