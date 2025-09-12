import express, { Request, Response, Router } from "express";
import { sendMagicLink, verifyMagicLink } from "./auth.services";

const router = Router();

router.post("/login", async(req:Request, res:Response) => {
    const {email} = req.body;
    await sendMagicLink(email);
    res.json({message: "Check your email for login link"})
})

router.post("/callback", async(req, res) => {
    const {token} = req.query;
    const session = await verifyMagicLink(token as string);

    if(!session) {
        return res.status(401).json({error: "Invalid or expired link"});
    };

    return res.status(200).json({message: "Login successful"});
})


export {router as authRouter};