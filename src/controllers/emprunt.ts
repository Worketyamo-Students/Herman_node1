
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { HttpCode } from '../core/constants';
import emprunt from '../routes/emprunt';

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
                    authorID: authorID
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
            const loan = await prisma.emprunts.findUnique({
                where : {
                    emprunts_id: id
                },
                include: {
                    livre: true
                    
                    
                }
            })
            if(!loan) res.status(HttpCode.BAD_REQUEST).json({msg: "no loans"})

            await prisma.livres.update({
                where: {
                    livres_id: loan?.livreId,
                },
                data: {
                    disponibilite: true
                }
            })
            const remis= await prisma.emprunts.update({
                where: { emprunts_id: id },
                data: { dateRetour: new Date() },
            });
            res.json(remis).status(HttpCode.OK)
            
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });            
          
        }
    },
     getUserLoanHistory: async (req: Request, res: Response) => {
        try {
            const { userID } = req.params;
            const Historie = await prisma.emprunts.findMany({
                where: {
                    authorID: userID,
                },
                include: {
                    livre: true, 
                },
            });
            if (Historie.length === 0) {
                return res.status(HttpCode.NOT_FOUND).json({ msg: "Aucun emprunt trouvé pour cet utilisateur" });
            }
            return res.status(HttpCode.OK).json(Historie);
    
        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
        }
    }
    

}

export default controllersEmprunt