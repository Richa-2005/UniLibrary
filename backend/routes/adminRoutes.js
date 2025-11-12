import express from 'express';
import {adminRegister,checkIn,loginAdmin} from '../controllers/adminControllers.js';
import { searchBooks,addBookToLibrary,getMyLibraryBooks } from '../controllers/adminFeatures.js';
import { protect } from '../middleware/auth.js'
const getRoutesAdmin = express.Router()

getRoutesAdmin.post('/register', adminRegister);
getRoutesAdmin.get('/login',loginAdmin);
getRoutesAdmin.get('/me',protect, checkIn);

getRoutesAdmin.get('/search-books',protect,searchBooks);
getRoutesAdmin.post('/add-book', protect, addBookToLibrary);
getRoutesAdmin.get('/my-books', protect, getMyLibraryBooks);
export default getRoutesAdmin
