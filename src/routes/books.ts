import { Router } from "express";
import controllersBooks from "../controllers/books";

const books = Router()

//route books
books.get('/', controllersBooks.allBooks)
books.post('/', controllersBooks.postBooks)
books.put('/:id', controllersBooks.putBooks)
books.delete('/:id', controllersBooks.deleteBooks)



export default books