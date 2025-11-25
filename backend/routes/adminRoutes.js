import express from 'express';
import {adminRegister,checkIn,loginAdmin,registerStudentByAdmin,getMyStudents, deleteStudent} from '../controllers/adminControllers.js';
import { searchBooks,addBookToLibrary,getMyLibraryBooks,updateLibraryBook,removeLibraryBook,issueBookToStudent,returnBookFromStudent} from '../controllers/adminFeatures.js';
import { protect } from '../middleware/auth.js'
const getRoutesAdmin = express.Router()

getRoutesAdmin.post('/register', adminRegister);
getRoutesAdmin.post('/login',loginAdmin);
getRoutesAdmin.get('/me',protect, checkIn);
getRoutesAdmin.post('/add-student', protect, registerStudentByAdmin);
getRoutesAdmin.get('/my-students', protect, getMyStudents);
getRoutesAdmin.delete('/student/:id', protect, deleteStudent);

getRoutesAdmin.get('/search-books',protect,searchBooks);
getRoutesAdmin.post('/add-book', protect, addBookToLibrary);
getRoutesAdmin.get('/my-books', protect, getMyLibraryBooks);
getRoutesAdmin.put('/my-books/:id', protect, updateLibraryBook);
getRoutesAdmin.delete('/my-books/:id', protect, removeLibraryBook);
getRoutesAdmin.post('/issue-book', protect, issueBookToStudent);
getRoutesAdmin.post('/return-book', protect, returnBookFromStudent);
export default getRoutesAdmin
