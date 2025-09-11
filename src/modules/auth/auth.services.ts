import { env } from "../../config/env";
import jwt from "jsonwebtoken";
import redis from "../../config/redis";
import db from "../../config/db";
import { sendEmail } from "../../email/email.service";


const MAGIC_SECRET = env.MAGIC_SECRET || "3+6ZVw46t/+EkUfiqlrcOKnCHKE=";

export async function sendMagicLink(email: string) {
    const token = jwt.sign({email}, MAGIC_SECRET, {expiresIn: "10m"});
    

    await redis.set(`magic:${token}`, email, {expiration: {type: "EX", value: 600}});

    await sendEmail(email, "Your login link", token); 


}


export async function verifyMagicLink(token: string) {
    try {
        const payload:any = jwt.verify(token, MAGIC_SECRET);


        const email = await redis.get(`magic:${token}`);
        if(!email) return null;

        let user = await db.user.findUnique({
            where: {
                email: payload.email
            }

        });
        if(!user){
            user = await db.user.create({
                data: {
                    email: payload.email,
                    balance: 10000
                }
            })
        }

        const session = jwt.sign({id: user.id, email: user.email}, MAGIC_SECRET, {expiresIn: "7d"});

        return {token: session, user}
    } catch (error) {
        return null
    }
}