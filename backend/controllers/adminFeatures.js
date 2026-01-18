import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchBooks = async (req, res) => {
  const { q, startIndex = 0 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required.' });
  }

  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=10&key=${API_KEY}`;
  try {
    const { data } = await axios.get(URL);

    if (!data.items) {
      if (parseInt(startIndex) === 0) {
         return res.status(404).json({ message: 'No books found.' });
      } else { 
         return res.status(200).json([]); 
      }
    }

    const cleanedBooks = data.items.map((book) => ({
      googleBookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No authors listed',
      isbn: book.volumeInfo.industryIdentifiers 
        ? book.volumeInfo.industryIdentifiers[0].identifier 
        : 'No ISBN',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
    }));

    res.status(200).json(cleanedBooks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Google Books API.' });
  }
};

export const addBookToLibrary = async (req, res) => {
  
  const { googleBookId, semester, year, category, price } = req.body; 
  const { universityId } = req.user;

  if (!googleBookId) {
    return res.status(400).json({ error: 'Google Book ID is required.' });
  }

  try {
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    const URL = `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${API_KEY}`;
    
    const { data: volumeData } = await axios.get(URL);
    const { volumeInfo } = volumeData;

    if (!volumeInfo) return res.status(404).json({ error: 'Book details not found.' });

    const isbn = volumeInfo.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier 
              || volumeInfo.industryIdentifiers?.[0]?.identifier;
    
    if (!isbn) return res.status(400).json({ error: 'Book has no ISBN. Cannot add.' });

    const book = await prisma.book.upsert({
      where: { isbn: isbn },
      create: {
        title: volumeInfo.title,
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown',
        isbn: isbn,
        metadata: volumeInfo, 
      },
      update: {},
    });

    const existingEntry = await prisma.libraryEntry.findUnique({
      where: { universityId_bookId: { universityId, bookId: book.id } },
    });

    if (existingEntry) return res.status(409).json({ error: 'Book already in library.' });

    // Calculate Price Logic: Manual > Sale Price > Retail Price > 0
    let finalPrice = 0;
    if (price) {
        finalPrice = parseFloat(price);
    } else {
        if (volumeData.saleInfo?.listPrice) finalPrice = volumeData.saleInfo.listPrice.amount;
        else if (volumeData.saleInfo?.retailPrice) finalPrice = volumeData.saleInfo.retailPrice.amount;
    }

    const bookCategory = category || "Academic"; 
    const isAcademic = bookCategory === "Academic";

    const newLibraryEntry = await prisma.libraryEntry.create({
      data: {
        universityId: universityId,
        bookId: book.id,
        category: bookCategory, 
        semester: isAcademic && semester ? parseInt(semester) : null,
        year: isAcademic && year ? parseInt(year) : null,
        totalCopies: 1,
        availableCopies: 1,
        price: finalPrice, 
      },
    });

    res.status(201).json(newLibraryEntry);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while adding book.' });
  }
};


export const getMyLibraryBooks = async (req, res) => {
  const { universityId } = req.user;

  try {
    const libraryEntries = await prisma.libraryEntry.findMany({
      where: {
        universityId: universityId,
      },
      include: {
        book: true, 
      },
      orderBy: { id: 'desc' } // Show newest books first
    });

    const books = libraryEntries.map((entry) => ({
      libraryEntryId: entry.id,
      title: entry.book.title,
      author: entry.book.author,
      isbn: entry.book.isbn,
      category: entry.category,
      semester: entry.semester,
      year: entry.year,
      totalCopies: entry.totalCopies,
      availableCopies: entry.availableCopies,
      price: entry.price, 
      metadata: entry.book.metadata, 
    }));

    res.status(200).json(books);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching library books.' });
  }
};

export const updateLibraryBook = async (req, res) => {
  try {
    const { id: libraryEntryId } = req.params;
    const { semester, year, totalCopies, availableCopies, price, category } = req.body; 

    const { universityId } = req.user;

    const entry = await prisma.libraryEntry.findFirst({
      where: { id: libraryEntryId, universityId: universityId },
    });

    if (!entry) return res.status(404).json({ error: 'Book entry not found.' });

    const dataToUpdate = {};
    if (semester !== undefined) dataToUpdate.semester = semester ? parseInt(semester) : null;
    if (year !== undefined) dataToUpdate.year = year ? parseInt(year) : null;
    if (totalCopies !== undefined) dataToUpdate.totalCopies = parseInt(totalCopies);
    if (availableCopies !== undefined) dataToUpdate.availableCopies = parseInt(availableCopies);
    
    // FIX 3: Safety check for price
    if (price !== undefined) {
        const parsedPrice = parseFloat(price);
        dataToUpdate.price = isNaN(parsedPrice) ? 0 : parsedPrice;
    }

    if (category !== undefined) dataToUpdate.category = category;

    const updatedEntry = await prisma.libraryEntry.update({
      where: { id: libraryEntryId },
      data: dataToUpdate,
    });

    res.status(200).json(updatedEntry);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating book.' });
  }
};

export const removeLibraryBook = async (req, res) => {
  try {
    const { id: libraryEntryId } = req.params;
    const { universityId } = req.user;

    const entry = await prisma.libraryEntry.findFirst({
      where: { id: libraryEntryId, universityId: universityId },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Book entry not found in your library.' });
    }
    
    await prisma.libraryEntry.delete({
      where: { id: libraryEntryId },
    });

    res.status(200).json({ message: 'Book removed from library successfully.' });

  } catch (error) {
    console.error(error);
    if (error.code === 'P2003') {
      return res.status(409).json({ error: 'Cannot delete this book. It may still be on loan by students.' });
    }
    res.status(500).json({ error: 'Server error while removing book.' });
  }
};

export const issueBookToStudent = async (req, res) => {
  const { libraryEntryId, rollNumber, dueDate } = req.body;
  const { universityId } = req.user;

  try {
    const student = await prisma.student.findFirst({
      where: { rollNumber, universityId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student with this Roll Number not found.' });
    }

    const bookEntry = await prisma.libraryEntry.findUnique({
      where: { id: libraryEntryId }
    });

    if (bookEntry.availableCopies < 1) {
      return res.status(400).json({ error: 'Book is out of stock.' });
    }

    await prisma.$transaction([
      prisma.borrowedRecord.create({
        data: {
          studentId: student.id,
          libraryEntryId: libraryEntryId,
          dueDate: new Date(dueDate), 
        }
      }),
      prisma.libraryEntry.update({
        where: { id: libraryEntryId },
        data: { availableCopies: { decrement: 1 } }
      })
    ]);

    res.status(200).json({ message: 'Book issued successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to issue book.' });
  }
};


export const returnBookFromStudent = async (req, res) => {
  const { libraryEntryId, rollNumber, status, fineAmount, damageAmount, lostAmount } = req.body; 
  const { universityId } = req.user;

  try {
    const student = await prisma.student.findFirst({
      where: { rollNumber, universityId }
    });

    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const activeRecord = await prisma.borrowedRecord.findFirst({
      where: {
        studentId: student.id,
        libraryEntryId: libraryEntryId,
        returnedAt: null 
      }
    });

    if (!activeRecord) return res.status(404).json({ error: 'No active record found.' });

    await prisma.$transaction(async (tx) => {
      await tx.borrowedRecord.update({
        where: { id: activeRecord.id },
        data: { 
          returnedAt: new Date(),
          status: status || 'returned',
          fineAmount: parseFloat(fineAmount || 0),
          damageAmount: parseFloat(damageAmount || 0),
          lostAmount: parseFloat(lostAmount || 0)
        } 
      });

      if (status !== 'lost') {
        await tx.libraryEntry.update({
          where: { id: libraryEntryId },
          data: { availableCopies: { increment: 1 } }
        });
      }
    });

    res.status(200).json({ message: 'Processed successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to return book.' });
  }
};


export const getBookBorrowers = async (req, res) => {
  const { libraryEntryId } = req.params;

  try {
    const activeLoans = await prisma.borrowedRecord.findMany({
      where: {
        libraryEntryId: libraryEntryId,
        returnedAt: null 
      },
      include: {
        student: true 
      },
      orderBy: { dueDate: 'asc' } 
    });

    res.json(activeLoans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch borrowers" });
  }
};