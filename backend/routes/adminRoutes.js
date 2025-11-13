import express from 'express';
import {adminRegister,checkIn,loginAdmin} from '../controllers/adminControllers.js';
import { searchBooks,addBookToLibrary,getMyLibraryBooks,updateLibraryBook,removeLibraryBook } from '../controllers/adminFeatures.js';
import { protect } from '../middleware/auth.js'
const getRoutesAdmin = express.Router()

getRoutesAdmin.post('/register', adminRegister);
getRoutesAdmin.get('/login',loginAdmin);
getRoutesAdmin.get('/me',protect, checkIn);

getRoutesAdmin.get('/search-books',protect,searchBooks);
getRoutesAdmin.post('/add-book', protect, addBookToLibrary);
getRoutesAdmin.get('/my-books', protect, getMyLibraryBooks);
getRoutesAdmin.put('/my-books/:id', protect, updateLibraryBook);
getRoutesAdmin.delete('/my-books/:id', protect, removeLibraryBook);
export default getRoutesAdmin
