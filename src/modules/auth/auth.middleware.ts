import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";


const MAGIC_SECRET = env.MAGIC_SECRET;

export async function authMddleware(req: Request, res:Response, next:NextFunction) {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({error: "Unauthorized request"});
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, MAGIC_SECRET ?? "");
        (req as any).user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({error:"Invalid or expired token"});
    }

}