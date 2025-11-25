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
      include: { university: true } 
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
  const { q, semester } = req.query; // Get semester from query
  const { universityId } = req.user;

  try {
   
    const whereClause = {
      universityId: universityId,
    };

   
    if (q && q.trim() !== '') {
      whereClause.book = {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { author: { contains: q, mode: 'insensitive' } },
          { isbn: { contains: q, mode: 'insensitive' } },
        ]
      };
    }

    // If semester filter exists, add it
    if (semester && semester !== 'All') {
      whereClause.semester = parseInt(semester);
    }

    const results = await prisma.libraryEntry.findMany({
      where: whereClause,
      include: {
        book: true 
      }
    });

    const formattedResults = results.map(entry => ({
      libraryEntryId: entry.id,
      title: entry.book.title,
      author: entry.book.author,
      isbn: entry.book.isbn,
      thumbnail: entry.book.metadata?.imageLinks?.thumbnail,
      status: entry.availableCopies > 0 ? 'Available' : 'Out of Stock',
      semester: entry.semester,
      year: entry.year,
      metadata: entry.book.metadata
    }));

    res.json(formattedResults);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getMyBorrowedBooks = async (req, res) => {
  const { studentId } = req.user; // From student token

  try {
    const records = await prisma.borrowedRecord.findMany({
      where: { 
        studentId: studentId,
        returnedAt: null // Only show active loans
      },
      include: {
        libraryEntry: {
          include: { book: true } // Get the Book Title/Image
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Clean up data for frontend
    const formattedRecords = records.map(r => ({
      recordId: r.id,
      title: r.libraryEntry.book.title,
      author: r.libraryEntry.book.author,
      thumbnail: r.libraryEntry.book.metadata?.imageLinks?.thumbnail,
      dueDate: r.dueDate,
      borrowedAt: r.borrowedAt
    }));

    res.json(formattedRecords);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch borrowed books' });
  }
};

export const searchExternalBooks = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });

  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=4&key=${API_KEY}`;

  try {
    const { data } = await axios.get(URL);

    if (!data.items) return res.json([]);

    // Map to a clean format
    const externalBooks = data.items.map(book => ({
      googleId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
      description: book.volumeInfo.description,
      // This is the link to the E-Book/Preview
      link: book.volumeInfo.previewLink || book.volumeInfo.infoLink
    }));

    res.json(externalBooks);

  } catch (error) {
    console.error("External Search Error:", error);
    res.status(500).json({ error: "Failed to fetch external books" });
  }
};