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
    Userlogin: async (req: Request, res: Response) => {
        const {email, motDePasse} = req.body
        const user = await prisma.utilsateurs.findUnique({
            where: {
                email
            },
        })
        if (!user){
            res.json({msg: "l'utilisateur n'existe pas"}).status(HttpCode.BAD_REQUEST)
        }else {
        
        if (email){
            const logtoken = await bcrypt.compare(motDePasse, user.motDePasse)
            if (logtoken){
                const acceptoken = token.createToken(user)
                const refusetoken = token.refreshtoken(user)
                
                res.cookie("user_connect", refusetoken,{
                    httpOnly: true, 
                    secure: true,
                    maxAge : 30 * 24 * 60 * 1000
                })
                console.log(acceptoken);
                res.status(HttpCode.OK).json({msg: "votre token a ete generate"})
            }else{
                res.json({msg : "information invalide"})
            }

            res.status(HttpCode.NO_CONTENT).json({msg: "verifier vos information"})
        } else {
            res.json({msg: "l'utilisateur n'existe pas"}).status(HttpCode.NOT_FOUND)
        }
        res.status(HttpCode.OK).json(user)
        }
    },
    LogoutUser: async (req: Request, res: Response)=>{
        try {
         
            const { email, motDePasse } = req.body
            const user = await prisma.utilsateurs.findFirst({
                where: {
                    email,
                    motDePasse
                }
            })
           
            if (user) {
                const accessToken = req.headers.authorization?.replace('initiale','')
                const refreshToken = req.cookies[`${user.name}-cookie`]
                if (!accessToken || !refreshToken){
                    return res.status(HttpCode.BAD_REQUEST).json({ msg: "No token available or expired" });
                }
                const decodedUser = await token.verifyAccessToken(accessToken);
                
                if (decodedUser) {
                    res.clearCookie(`${user.name}-cookie`)
                    console.log("user deconnecter")
                    return res.status(HttpCode.OK).json({ msg: "User succesffully logout" })
                      
                } else {
                 res.status(HttpCode.NO_CONTENT).json({ msg: "Invalid or expired token" })
                }
            }
        } catch (error) {
            console.error(error)

        }
    },
    getUserId: async (req: Request, res: Response) => {

        try {
            const { email} = req.body
            const status = await prisma.utilsateurs.findUnique({
                where:{
                     email
                },
                select: {
                  utilisateur_id: true,
                  name: true,
                  email: true

                }
            })
            const accessToken = req.headers.authorization?.replace('initiale','')
            if(!accessToken){
                res.json({msg: 'l"utilisateur n"est pas connecter'})
            } else{
                res.json(status).status(HttpCode.OK)
            }
           
        } catch (error) {
            console.error(error)
        }
    },
    updateUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params 
            const { name, email, motDePasse } = req.body 

            const hash = await bcrypt.hash(motDePasse, 10)

            const updateUser = await prisma.utilsateurs.update({
                where: {
                    utilisateur_id: id
                },
                data: {
                    name,
                    email,
                    motDePasse: hash
                }
            })
            if (updateUser) res.status(HttpCode.OK).json({ msg: "User  updated" })
            else res.status(HttpCode.BAD_REQUEST).json({ msg: "enter correct infos" })
        } catch (error) {
            console.error(error)
        }
    },
    deleteAllUser: async (req: Request, res: Response) => {
        try {
            await prisma.utilsateurs.deleteMany()
            res.json({msg: "tout le monde est partie"})
        } catch (error) {
            console.error(error)
        }
    }
        
 }

 export default controllersuser