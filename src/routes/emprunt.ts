import { Router } from "express";
import controllersEmprunt from "../controllers/emprunt";


const emprunt = Router()

emprunt.post('/', controllersEmprunt.postLoans)
emprunt.put('/:id/return', controllersEmprunt.deleteLoans)
emprunt.get('/user/:userID', controllersEmprunt.getUserLoanHistory)

export default emprunt