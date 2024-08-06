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
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
   
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
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
   
        }
    },
    Userlogin: async (req: Request, res: Response) => {
        const { email, motDePasse } = req.body;
    
        try {
            const user = await prisma.utilsateurs.findUnique({
                where: {
                    email
                },
            });
    
            if (!user) {
                return res.status(HttpCode.BAD_REQUEST).json({ msg: "L'utilisateur n'existe pas" });
            }
    
            const logtoken = await bcrypt.compare(motDePasse, user.motDePasse);
    
            if (!logtoken) {
                return res.status(HttpCode.BAD_REQUEST).json({ msg: "Vérifiez vos informations" });
            }
    
            // Masquer le mot de passe de l'utilisateur avant de renvoyer l'objet au client pour plus de sécurité
            user.motDePasse = '';
    
            const acceptoken = token.createToken(user);
            const refreshtoken = token.refreshtoken(user);
    
            res.cookie("user_cookie", refreshtoken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 1000 // 30 jours
            });
    
            console.log(acceptoken);
            return res.status(HttpCode.OK).json({ msg: "Votre token a été généré", accessToken: acceptoken });
    
        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
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
           
            if (!user) {

                return res.json({msg: "user not exist"}).status(HttpCode.BAD_REQUEST)
            }
                const accessToken = req.headers.authorization?.replace('initiale','')
                const refreshToken = req.cookies[`${user.name}-cookie`]
                if (!accessToken || !refreshToken){
                    return res.status(HttpCode.BAD_REQUEST).json({ msg: "No token available or expired" });
                }
                const decodedUser =  token.verifyAccessToken(accessToken);

                if (!decodedUser){
                    return res.status(HttpCode.NO_CONTENT).json({msg: "invalide or expired token"})
                }
                    res.clearCookie(`${user.name}-cookie`)
                    console.log("user deconnecter")
                    return res.status(HttpCode.OK).json({ msg: "User succesffully logout" })
            
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
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
            const accessToken = req.headers.authorization?.replace('bearer','')
            if(!accessToken){
                res.json({msg: 'l"utilisateur n"est pas connecter'})
            } else{
                res.json(status).status(HttpCode.OK)
            }
           
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
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
    deleteUserAccount: async (req: Request, res: Response) =>{
        try {
            const {email} = req.body
            const accessToken = req.headers.authorization?.replace('bearer','')
            if(!accessToken){
               return res.json({msg: 'l"utilisateur n"est pas connecter'})
            }
            const user= await prisma.utilsateurs.delete({
                where:{
                     email
                }
            })
            return res.json(`${user.name}: a ete supprimer`)
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });            
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