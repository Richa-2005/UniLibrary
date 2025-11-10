import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Search for a book on Google Books
// @route   GET /api/admin/search-books
// @access  Private (Admin only)
export const searchBooks = async (req, res) => {
  // Get the search term from the query params (e.g., /search-books?q=algorithms)
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required.' });
  }

  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${API_KEY}`;

  try {
    const { data } = await axios.get(URL);

    // The API returns a lot of data. We only want the items.
    if (!data.items) {
      return res.status(404).json({ message: 'No books found.' });
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