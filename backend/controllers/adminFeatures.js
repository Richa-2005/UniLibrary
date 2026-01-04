import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Search for a book on Google Books
// @route   GET /api/admin/search-books
// @access  Private (Admin only)
export const searchBooks = async (req, res) => {
  // Get the search term from the query params (e.g., /search-books?q=algorithms)
  const { q, startIndex = 0 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required.' });
  }

  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=10&key=${API_KEY}`;
  try {
    const { data } = await axios.get(URL);

    if (!data.items) {
      // If it's the first page, means no books at all. 
      if (parseInt(startIndex) === 0) {
         return res.status(404).json({ message: 'No books found.' });
      } else { //number of books ended
         return res.status(200).json([]); // Return empty list for "end of results"
      }
    }

    // Clean up the data to send to the frontend
    const cleanedBooks = data.items.map((book) => ({
      googleBookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No authors listed',
      // Handle cases where there is no ISBN
      isbn: book.volumeInfo.industryIdentifiers 
        ? book.volumeInfo.industryIdentifiers[0].identifier // Just get the first one
        : 'No ISBN',
      // Handle no image
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
    }));

    res.status(200).json(cleanedBooks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Google Books API.' });
  }
};

// @desc    Add a book to the university's library
// @route   POST /api/admin/add-book
// @access  Private (Admin only)
export const addBookToLibrary = async (req, res) => {
  // 1. Get data from the admin's request
  // The admin's frontend will send this
  const { googleBookId, semester, year } = req.body;
  
  // Get the admin's university ID from our 'protect' middleware
  const { universityId } = req.user;

  if (!googleBookId) {
    return res.status(400).json({ error: 'Google Book ID is required.' });
  }

  try {
    // 2. Fetch *full* details for this specific book
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    const URL = `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${API_KEY}`;
    
    const { data: volumeData } = await axios.get(URL);
    const { volumeInfo } = volumeData;

    if (!volumeInfo) {
      return res.status(404).json({ error: 'Book details not found.' });
    }

    // 3. Find or create the book in our *global* `Book` table
    // We use the ISBN to see if we already have this book
    const isbn = volumeInfo.industryIdentifiers?.find(
      (i) => i.type === 'ISBN_13'
    )?.identifier || volumeInfo.industryIdentifiers?.[0]?.identifier;
    
    if (!isbn) {
      return res.status(400).json({ error: 'Book has no ISBN. Cannot add.' });
    }

    const book = await prisma.book.upsert({
      where: { isbn: isbn },
      //if not exisitng
      create: {
        title: volumeInfo.title,
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown',
        isbn: isbn,
        metadata: volumeInfo, //storing all the data
      },
      //if already existing
      update: {},
    });

    // 4. Check if the book is *already* in this university's library
    const existingEntry = await prisma.libraryEntry.findUnique({
      where: {
        universityId_bookId: { universityId, bookId: book.id },
      },
    });

    if (existingEntry) {
      return res.status(409).json({ error: 'This book is already in your library.' });
    }

    let fetchedPrice = 0;
    if (volumeData.saleInfo && volumeData.saleInfo.listPrice) {
      fetchedPrice = volumeData.saleInfo.listPrice.amount;
    } 
    else if (volumeData.saleInfo && volumeData.saleInfo.retailPrice) {
       fetchedPrice = volumeData.saleInfo.retailPrice.amount;
    }

    // 5. Add the book to the university's `LibraryEntry` table
    const newLibraryEntry = await prisma.libraryEntry.create({
      data: {
        universityId: universityId,
        bookId: book.id,
        semester: semester ? parseInt(semester) : null,
        year: year ? parseInt(year) : null,
        totalCopies: 1,
        availableCopies: 1,
        price: fetchedPrice, 
      },
    });

    res.status(201).json(newLibraryEntry);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while adding book.' });
  }
};

// @desc    Get all books currently in the admin's university library
// @route   GET /api/admin/my-books
// @access  Private (Admin only)
export const getMyLibraryBooks = async (req, res) => {
  
  const { universityId } = req.user;

  try {
    //Find all `LibraryEntry` records for university
    const libraryEntries = await prisma.libraryEntry.findMany({
      where: {
        universityId: universityId,
      },
      // "Joining" the `LibraryEntry` table with the `Book` table to book metadata
      include: {
        book: true, 
      },
    });

    // book data
    const books = libraryEntries.map((entry) => ({
      libraryEntryId: entry.id,
      title: entry.book.title,
      author: entry.book.author,
      isbn: entry.book.isbn,
      semester: entry.semester,
      year: entry.year,
      totalCopies: entry.totalCopies,
      availableCopies: entry.availableCopies,
      // We also send the metadata, which has the description, etc.
      metadata: entry.book.metadata, 
    }));

    res.status(200).json(books);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching library books.' });
  }
};

// @desc    Update a book's details in the admin's library
// @route   PUT /api/admin/my-books/:id
export const updateLibraryBook = async (req, res) => {
  try {
    const { id: libraryEntryId } = req.params;
    
    // 1. Extract 'price' from the request body
    const { semester, year, totalCopies, availableCopies, price } = req.body; 

    const { universityId } = req.user;

    const entry = await prisma.libraryEntry.findFirst({
      where: { id: libraryEntryId, universityId: universityId },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Book entry not found.' });
    }

    // 2. Prepare data for update
    const dataToUpdate = {};
    if (semester !== undefined) dataToUpdate.semester = parseInt(semester);
    if (year !== undefined) dataToUpdate.year = parseInt(year);
    if (totalCopies !== undefined) dataToUpdate.totalCopies = parseInt(totalCopies);
    if (availableCopies !== undefined) dataToUpdate.availableCopies = parseInt(availableCopies);
    
    // 3. Add Price Update Logic
    if (price !== undefined) dataToUpdate.price = parseFloat(price); 

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

// @desc    Delete a book entry from the admin's library
// @route   DELETE /api/admin/my-books/:id
// @access  Private (Admin only)
export const removeLibraryBook = async (req, res) => {
  try {
   
    const { id: libraryEntryId } = req.params;

    const { universityId } = req.user;

    const entry = await prisma.libraryEntry.findFirst({
      where: {
        id: libraryEntryId,
        universityId: universityId,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Book entry not found in your library.' });
    }
    
    //sql query to delete by id
    await prisma.libraryEntry.delete({
      where: {
        id: libraryEntryId,
      },
    });

    res.status(200).json({ message: 'Book removed from library successfully.' });

  } catch (error) {
    console.error(error);
    // if a book is still on loan, Foreign key constraint fail.
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
    // 1. Find the Student
    const student = await prisma.student.findFirst({
      where: { rollNumber, universityId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student with this Roll Number not found.' });
    }

    // 2. Check Book Availability
    const bookEntry = await prisma.libraryEntry.findUnique({
      where: { id: libraryEntryId }
    });

    if (bookEntry.availableCopies < 1) {
      return res.status(400).json({ error: 'Book is out of stock.' });
    }

    // 3. TRANSACTION: Create Record & Decrease Stock
    await prisma.$transaction([
      // Create the record
      prisma.borrowedRecord.create({
        data: {
          studentId: student.id,
          libraryEntryId: libraryEntryId,
          dueDate: new Date(dueDate), // Ensure it's a Date object
        }
      }),
      // Decrease available copies
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

// @desc    Return a book (or mark as lost)
// @route   POST /api/admin/return-book
export const returnBookFromStudent = async (req, res) => {
  // EXTRACT NEW FIELDS
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

    // DATABASE TRANSACTION
    await prisma.$transaction(async (tx) => {
      // 1. Close the record & SAVE FINANCIALS
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

      // 2. STOCK LOGIC
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

// GET ACTIVE BORROWERS FOR A BOOK

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