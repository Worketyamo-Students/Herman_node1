import { Router } from "express";
import controllersBooks from "../controllers/books";

const books = Router()

//route books
books.get('/', controllersBooks.allBooks)



export default books