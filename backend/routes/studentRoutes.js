import {getAllUniversities,loginStudent,searchLibrary} from '../controllers/studentController.js'
import express from 'express';
import { protect } from '../middleware/auth.js'

const getRouterStudent = express.Router();

getRouterStudent.get('/universities', getAllUniversities);
getRouterStudent.post('/login', loginStudent);
getRouterStudent.get('/search', protect, searchLibrary);
export default getRouterStudent;