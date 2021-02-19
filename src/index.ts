console.info("Server starting....");
import express from "express";
import { reqCheck, resetIpCache, loginLeft } from "./limitChecks";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
const app = express();

resetIpCache();

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
    res.status(500).send("You have to insert e-mail and password!");
    return;
  }

  if (!reqCheck(req, res, true)) return;

  res.redirect("/");
});

app.listen(80, () => console.info("Server serving."));
