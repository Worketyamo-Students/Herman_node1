import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { HttpCode } from '../core/constants';

const prisma = new PrismaClient();

const controllersBooks = {
	allBooks: async (req: Request, res: Response) => {
		try {
			const All = await prisma.livres.findMany();
			return res.json(All).status(HttpCode.OK);
		} catch (error) {
			console.error(error);
			return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' });
		}
	},
	postBooks: async (req: Request, res: Response) => {
		try {
			const { titre, auteur, description, anneePublication, ISBN } = req.body;

			if (!titre || !ISBN) {
				return res.status(HttpCode.BAD_REQUEST).json({ msg: 'Tous les champs sont requis' });
			}

			const book = await prisma.livres.create({
				data: {
					titre,
					auteur,
					description,
					anneePublication,
					ISBN
				}
			});
			return res.json(book).status(HttpCode.OK);
		} catch (error) {
			console.error(error);
			return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' });
		}
	},
	putBooks: async (req: Request, res: Response) => {
		try {
            const { id } = req.params;
		const { titre, auteur, description, anneePublication, ISBN } = req.body;

		const updateBooks = await prisma.livres.update({
			where: {
				livres_id: id
			},
			data: {
				titre,
				auteur,
				description,
				anneePublication,
				ISBN
			}
		});
        if (!updateBooks){
            return res.status(HttpCode.BAD_REQUEST).json({msg: "this book not exist"})
        }
        res.status(HttpCode.OK).json(updateBooks)
        } catch (error) {
            console.error(error);
			return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' }); 
        }
	},
    deleteBooks: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const user = await prisma.livres.delete({
                where: {
                    livres_id: id
                }
            })
            if(!user){
               res.json({msg: "this books not exist"}).status(HttpCode.BAD_REQUEST)
            }
            res.status(HttpCode.OK).json({msg: "book has been deleted"})
            
        } catch (error) {
            console.error(error);
			return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' });   
        }
    }
};

export default controllersBooks;
