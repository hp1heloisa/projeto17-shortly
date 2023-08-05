import { db } from "../database/database.connection.js";

export async function freeEmail(req, res, next) {
    const { email } = req.body
    try {
        const register = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (register.rows.length > 0) return res.sendStatus(409);
    } catch (error) {
        res.status(500).send(error.message);
    }
    next();
}

export async function validateToken(req, res, next) {
    let tokenOk;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);
    try {
        tokenOk = await db.query(`SELECT * FROM tokens WHERE token=$1`, [token]);
        if (tokenOk.rows.length <= 0) return res.sendStatus(401);
    } catch (error) {
        res.status(500).send(error.message);
    }
    res.locals.userId = tokenOk.rows[0].userId;
    next();
}

export async function validateOwner(req, res, next) {
    const { userId } = res.locals;
    const { id } = req.params;
    try {
        const userOk = await db.query(`SELECT * FROM links WHERE id=$1;`, [id]);
        if (userOk.rows.length <= 0) return res.sendStatus(404);
        if (userOk.rows[0].ownerId != userId) return res.sendStatus(401);
    } catch (error) {
        res.status(500).send(error.message);
    }
    next();
}
