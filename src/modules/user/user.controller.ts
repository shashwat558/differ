import express, { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import db from "../../config/db";

const router = Router();

router.get("/me", authMiddleware, async(req: any, res: Response) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                email: true,
                balance: true,
                orders: true,
                created_at: true
            }
        })

        return res.status(200).json({user});
    } catch (error) {
        console.error("Error fetching user", error)
    }

})

export {router as userRouter};