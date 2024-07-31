import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import bcrypt from 'bcrypt'

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
            res.status(HttpCode.OK).json(user)
        } catch (error) {
            console.error(error)
        }
    }
 }

 export default controllersuser