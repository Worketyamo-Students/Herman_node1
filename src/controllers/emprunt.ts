
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { HttpCode } from '../core/constants';

const prisma = new PrismaClient();

const controllersEmprunt = {
    postLoans: async (req: Request, res:Response) =>{
        try {
            const {livreId, authorID }= req.body
            const book = await prisma.livres.findUnique({
                where: {
                    livres_id: livreId
                }
            })
            if(!book){
                res.json({msg: "le livre n'existe pas"}).status(HttpCode.BAD_REQUEST)
            }
            if (book?.disponibilite===false){
                res.status(HttpCode.BAD_REQUEST).json({msg : "le livre n'est pas disponible"})
            }
            const loan = await prisma.emprunts.create({
                data: {
                    livreId,
                    authorID: authorID,
                    dateEmprunt: new Date()
                }
            })
            // if(loan){
            //     res.status(HttpCode.BAD_REQUEST).json({msg: "ce livre a deja ete emprunter"})
            // }
            await prisma.livres.update({
                where: {
                    livres_id: livreId
                },
                data: {
                    disponibilite: false
                }
            })
            res.status(HttpCode.OK).json(loan)
            
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });            
        
        }
    },
    deleteLoans: async (req: Request, res:Response) =>{
        try {
            const {id}= req.params
            const loan = await prisma.emprunts.update({
                where : {
                    emprunts_id: id
                },
                data: {

                }
            })
            
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });            
          
        }
    }

}

export default controllersEmprunt