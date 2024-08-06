import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { HttpCode } from "../core/constants";

const prisma = new PrismaClient()

const controllersBooks = {
    allBooks: async (req:Request, res: Response) =>{
try {
  const All=  await prisma.livres.findMany()
  return res.json(All).status(HttpCode.OK)  
} catch (error) {
    console.error(error)
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
}        
    },
    postBooks: async (req:Request, res: Response) => {
        try {
            const {titre, auteur, description, anneePublication}= req.body
            const book = await prisma.livres.create({
                data : {
                    titre,
                    auteur,
                    description,
                    anneePublication
                }
            })
            return  res.json(book).status(HttpCode.OK)
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });          
        }
    }

}

export default controllersBooks