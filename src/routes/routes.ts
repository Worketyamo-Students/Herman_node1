import { Router } from "express";
import controllersuser from "../controllers/controllersuser";

const route = Router()

// routes user

route.get('/', controllersuser.getAll)
route.post('/singnup', controllersuser.postUser)
route.post('/login', controllersuser.Userlogin)
route.post('/logout', controllersuser.LogoutUser)
route.get('/profile', controllersuser.getUserId)
route.put('/profile/:id', controllersuser.updateUser)
route.delete('/', controllersuser.deleteAllUser)



export default route