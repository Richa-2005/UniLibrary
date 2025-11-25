import {getAllUniversities,loginStudent,searchLibrary,getMyBorrowedBooks,searchExternalBooks} from '../controllers/studentController.js'
import express from 'express';
import { protect } from '../middleware/auth.js'

const getRouterStudent = express.Router();

getRouterStudent.get('/universities', getAllUniversities);
getRouterStudent.post('/login', loginStudent);
getRouterStudent.get('/search', protect, searchLibrary);
getRouterStudent.get('/my-books', protect, getMyBorrowedBooks);
getRouterStudent.get('/external-search', protect, searchExternalBooks);
export default getRouterStudent;