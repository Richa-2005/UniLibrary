import express from 'express';
import {adminRegister,
    checkIn,loginAdmin,
    registerStudentByAdmin,
    getMyStudents, 
    deleteStudent,
    getUniversitySettings,
    updateUniversitySettings,
    getTransactionHistory
} from '../controllers/adminControllers.js';

import { searchBooks,
    addBookToLibrary,
    getMyLibraryBooks,
    updateLibraryBook,
    removeLibraryBook,
    issueBookToStudent,
    returnBookFromStudent,
    getBookBorrowers
} from '../controllers/adminFeatures.js';

import { protect } from '../middleware/auth.js'
const getRoutesAdmin = express.Router()

getRoutesAdmin.post('/register', adminRegister);
getRoutesAdmin.post('/login',loginAdmin);
getRoutesAdmin.get('/me',protect, checkIn);
getRoutesAdmin.post('/add-student', protect, registerStudentByAdmin);
getRoutesAdmin.get('/my-students', protect, getMyStudents);
getRoutesAdmin.delete('/student/:id', protect, deleteStudent);
getRoutesAdmin.get('/settings', protect, getUniversitySettings);
getRoutesAdmin.put('/settings', protect, updateUniversitySettings);
getRoutesAdmin.get('/transactions', protect, getTransactionHistory);

getRoutesAdmin.get('/search-books',protect,searchBooks);
getRoutesAdmin.post('/add-book', protect, addBookToLibrary);
getRoutesAdmin.get('/my-books', protect, getMyLibraryBooks);
getRoutesAdmin.put('/my-books/:id', protect, updateLibraryBook);
getRoutesAdmin.delete('/my-books/:id', protect, removeLibraryBook);
getRoutesAdmin.post('/issue-book', protect, issueBookToStudent);
getRoutesAdmin.post('/return-book', protect, returnBookFromStudent);
getRoutesAdmin.get('/book-borrowers/:libraryEntryId', protect, getBookBorrowers);

export default getRoutesAdmin
