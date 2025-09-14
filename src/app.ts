import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./modules/auth/auth.controller";
import { userRouter } from "./modules/user/user.controller";

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.use((err: any, req: Request, res: Response, next:NextFunction) => {
    console.error(err.stack);
    res.status(500).json({error: "Something went wrong"});
})


export default app;