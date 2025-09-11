import nodemailer from "nodemailer";
import { env } from "../config/env";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PASSWORD
    }
})
export async function sendEmail(email: string, message: string, token: string) {
    const link = `http://localhost:5000/auth/callback?token=${token}`;

    const info = await transporter.sendMail({
        from: `Differ trading app ${env.SMTP_EMAIL}`,
        to: email,
        subject: message,
        html: `
         <p>Click below to log in:</p>
         <a href=${link}>Login</a>
        `

    });

    console.log("Message sent: %s", info.messageId);
    
}