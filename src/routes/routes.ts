import { Router } from "express";
import controllersuser from "../controllers/controllersuser";

const route = Router()

// routes user

route.get('/', controllersuser.getAll)
route.post('/singnup', controllersuser.postUser)
route.get('/login', controllersuser.getUserMail)



export default route