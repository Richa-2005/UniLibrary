import express from 'express';
import {adminRegister} from '../controllers/adminControllers.js';
const getRoutes = express.Router()

getRoutes.post('/register-admin', adminRegister);


export default getRoutes
