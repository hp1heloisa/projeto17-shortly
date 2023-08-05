import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js";

export async function postUrl(req, res, next) {
    const { userId } = res.locals;
    const { url } = req.body; 
    try {
        const shortUrl = nanoid(7);
        await db.query(`INSERT INTO links (url, "shortUrl", "ownerId") VALUES ($1,$2,$3);`, [url, shortUrl, userId]);
        const urlAdded = await db.query(`SELECT id, "shortUrl" FROM links WHERE "shortUrl"=$1;`, [shortUrl]);
        res.status(201).send(urlAdded.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params;
    try {
        const urlInfo = await db.query(`SELECT id, "shortUrl", url FROM links WHERE id=$1`, [id]);
        if (urlInfo.rows.length <= 0) return res.sendStatus(404);
        res.status(200).send(urlInfo.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function redirectUrl(req, res) {
    const { shortUrl } = req.params;
    try {
        const urlInfo = await db.query(`SELECT * FROM links WHERE "shortUrl"=$1`, [shortUrl]);
        if (urlInfo.rows.length <= 0) return res.sendStatus(404);
        const contagem = urlInfo.rows[0].visitCount+1;
        await db.query(`UPDATE links SET "visitCount"=$1 WHERE id=$2;`, [contagem, urlInfo.rows[0].id]);
        res.redirect(urlInfo.rows[0].url);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteUrl(req, res){
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM links WHERE id=$1`, [id]);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}