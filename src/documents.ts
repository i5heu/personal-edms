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

export async function getDocumentAndFiles(
    db: Database,
    userId: number,
    docId: number
): Promise<{ doc: any; files: any; }> {

    const doc = await db.get(
        `SELECT docId, created, title, note, groupId FROM docs WHERE docId = ? AND userId = ?;`,
        docId,
        userId
    );

    const files = await db.all(
        `SELECT fileId, hash, created, ocrText, note, originalName, encoding, mimetype, filename, size FROM files WHERE docId = ?;`,
        doc.docId
    );

    return { doc, files };
}

