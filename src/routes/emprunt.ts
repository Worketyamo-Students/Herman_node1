import { Router } from "express";
import controllersEmprunt from "../controllers/emprunt";


const emprunt = Router()

emprunt.post('/', controllersEmprunt.postLoans)

export default emprunt