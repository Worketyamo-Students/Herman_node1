import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import bcrypt from 'bcrypt'
import sendMail from "../send mail/sendmail";
import token from "../token/token";
const prisma = new PrismaClient()


 const controllersuser = {

    getAll : async (req: Request, res: Response) => {
        try {
            const tous = await prisma.utilsateurs.findMany();
            res.json(tous).status(HttpCode.OK)
        } catch (error) {
            console.error(error)
        }
    },
    postUser : async (req: Request, res: Response) => {
        try {
            const {name, email, motDePasse} = req.body
            const crypt = await bcrypt.hash(motDePasse, 10)
            const user = await prisma.utilsateurs.create({
                data : {
                    name,
                    email,
                    motDePasse : crypt
                }
            })
            await sendMail(user.email, "This is a test email sent from Node.js using nodemailer. 📧💻")
            res.status(HttpCode.OK).json(user)
        } catch (error) {
            console.error(error)
        }
    },
    getUserMail: async (req: Request, res: Response) => {
        const {email, motDePasse} = req.params
        const user = await prisma.utilsateurs.findUnique({
            where: {
                email,
                motDePasse
            }
        })
        if (!email || !motDePasse){
            res.status(HttpCode.NOT_FOUND).json({msg: "verifier vos information"})
        } else {
            const logtoken = await bcrypt.compare(motDePasse, user.motDePasse)
            if (logtoken){
                const acceptoken = token.createToken(user)
                const refusetoken = token.refreshtoken(user)

                res.cookie("user_connect", refusetoken)
                console.log(acceptoken);
                res.status(HttpCode.ok).json({msg: "votre token"})
            }
        }
        res.status(HttpCode.OK).json(user)
    }
        
 }

 export default controllersuser