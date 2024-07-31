import { Router } from "express";
import controllersuser from "../controllers/controllersuser";

const route = Router()

// routes user

route.get('/', controllersuser.getAll)
route.post('/', controllersuser.postUser)



export default route