import express from "express";
import { Database } from "sqlite";
import { getUserId } from "./login";

export async function uploadNewFiles(
    db: Database,
    req: express.Request,
    res: express.Response
) {
    const userId = await getUserId(db, req);
    if (!userId) return;


    for (const file of (req.files as any)) {
        const result = await db.run(
            "INSERT INTO files (hash, docId, originalName, encoding, mimetype, filename, size) VALUES (?,?,?,?,?,?,?)",
            "bla",
            1,
            file.originalName,
            file.encoding,
            file.mimetype,
            file.filename,
            file.size
        );
    }

    res.redirect("/dashboard");
}