import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
    const {name, email, password} = req.body
    try {
        const hash = bcrypt.hashSync(password,10);
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1,$2,$3);`, [name,email,hash]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function signIn(req,res){
    const { email, password } = req.body;
    try {
        const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
        if (user.rows.length <= 0) return res.sendStatus(401);
        const passOk = bcrypt.compareSync(password, user.rows[0].password);
        if (!passOk) return res.sendStatus(401);
        const token = uuid();
        await db.query(`INSERT INTO tokens (token, "userId") VALUES ($1,$2);`, [token, user.rows[0].id]);
        res.status(200).send({token});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getMyUrls(req, res){
    const { userId } = res.locals;
    try {
        const userInfo = await db.query(`
            SELECT users.id, users.name, COALESCE(SUM(links."visitCount"),0) as "visitCount" FROM users 
            LEFT JOIN links ON users.id=links."ownerId" WHERE users.id=$1 GROUP BY users.id;
            `, [userId]);
        const urlsUser = await db.query(`SELECT id, "shortUrl", url, "visitCount" FROM links where "ownerId"=$1;`,[userId]);
        userInfo.rows[0].shortenedUrls = urlsUser.rows;
        res.send(userInfo.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function logOut(req, res) {
    const { userId } = res.locals;
    try {
        console.log(userId);
        await db.query(`DELETE FROM tokens WHERE "userId"=$1`, [userId]);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}