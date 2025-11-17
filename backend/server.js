import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import getRoutesAdmin from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;


app.use(cors()); 
app.use(express.json()); 

const prisma = new PrismaClient();


app.use('/api/admin',getRoutesAdmin);

app.get('/', (req, res) => {
  res.send('Welcome to the UniLibrary API!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});