import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getAllUniversities = async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      select: {
        id: true,
        name: true
      }
    });
    res.json(universities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

export const loginStudent = async (req, res) => {
  const { rollNumber, password, universityId } = req.body;

  try {
  
    const student = await prisma.student.findFirst({
      where: { 
        rollNumber,
        universityId
      },
      include: { university: true } // Get uni name for the frontend
    });

    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate Token
    const token = jwt.sign(
      { 
        studentId: student.id, 
        universityId: student.universityId, 
        role: 'student' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        name: student.name,
        rollNumber: student.rollNumber,
        universityName: student.university.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const searchLibrary = async (req, res) => {
  const { q } = req.query;
  const { universityId } = req.user; // Got from 'protect' middleware

  try {
   
    const results = await prisma.libraryEntry.findMany({
      where: {
        universityId: universityId, // 🔒 SECURITY: Scopes search to their uni
        book: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { author: { contains: q, mode: 'insensitive' } },
            { isbn: { contains: q, mode: 'insensitive' } },
          ]
        }
      },
      include: {
        book: true // Include the book details (title, image, etc.)
      }
    });

    // Format for frontend
    const formattedResults = results.map(entry => ({
      libraryEntryId: entry.id,
      title: entry.book.title,
      author: entry.book.author,
      thumbnail: entry.book.metadata?.imageLinks?.thumbnail,
      status: entry.availableCopies > 0 ? 'Available' : 'Out of Stock',
      semester: entry.semester,
      year: entry.year
    }));

    res.json(formattedResults);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Search failed' });
  }
};