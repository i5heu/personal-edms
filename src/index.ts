// NOTE TO MYSELF - refactor this thing - it needs a proper router
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
import { getUserId, isAuthenticated, login } from "./login";
import { createTables } from "./createDatabase";
import { groupDashboard, createGroup } from "./groups";
import { uploadNewFiles } from "./files";
import multer from "multer";
import { getDocumentAndFiles, getDocumentsOfUser } from "./documents";

const dataPath = require("os").homedir() + "/personal-edms-files/";
const filesPath = dataPath + "files/";

const upload = multer({ dest: filesPath });

let db;
sqlite3.verbose();

async function createDb() {
    db = await open({
        filename: dataPath + "db.sql",
        driver: sqlite3.cached.Database,
    });

    await createTables(db);

    // test code
    db.run(`INSERT INTO users (email,pwd) VALUES (
        'test@test.test',
        'test'
    );`);

    db.run(`INSERT INTO docs (userId,title) VALUES (
        1,
        'TMP'
    );`);
}
createDb();

const app = express();

resetIpCache();
resetLoginIpCache();

app.use(cookieParser());
app.use(express.static('public'));
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

app.get("/doc", async (req, res) => {
    if (!isAuthenticated(req, res)) return;
    const userId = await getUserId(db, req);
    const id = req.query.id as string;
    if (!userId || !req.query.id || isNaN(parseInt(id))) {
        res.status(400).send("user or ?=id missing");
        return;
    }

    const { doc, files } = await getDocumentAndFiles(db, userId, parseInt(id));

    res.render("document", {
        doc,
        files,
    });
});

app.get("/rest/file", async (req, res) => {
    if (!isAuthenticated(req, res)) return;
    const userId = await getUserId(db, req);
    const fileId = req.query.id as string;
    if (!userId || !req.query.id || isNaN(parseInt(fileId))) {
        res.status(400).send("400 user or ?=id missing");
        return;
    }

    const result = await db.get(
        "SELECT d.userId, f.mimetype, f.filename from files f INNER JOIN docs d ON f.docId = d.docId WHERE f.fileId = ?",
        fileId
    );
    if (result.userId != userId) {
        res.status(403).send("403 not your file");
        return;
    }

    res.sendFile(filesPath + result.filename);
});

app.get("/dashboard", async (req, res) => {
    if (!isAuthenticated(req, res)) return;
    const userId = await getUserId(db, req);
    if (!userId) return;

    const documents = await getDocumentsOfUser(db, userId);

    res.render("dashboard", {
        reqLeft: reqLeft(req),
        documents,
    });
});
app.post("/rest/newFiles", upload.array("files"), (req, res) => {
    if (!isAuthenticated(req, res)) return;
    uploadNewFiles(db, req, res);
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

app.listen(8080, () =>
    setTimeout( //debug test
        () => console.log("Server is running on http://127.0.0.1:8080"),
        2000
    )
);
