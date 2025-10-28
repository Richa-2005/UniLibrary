# UniLibrary 📚

UniLibrary Search is a web platform designed to bridge the gap between students and their university's library resources. It provides a simple interface for university libraries to manage their digital catalog and a powerful search tool for students to find books, check availability, and discover external e-book resources.

## 🚀 The Problem

Many university library systems are clunky, slow, or don't provide good alternatives when a book isn't available. This project aims to create a modern, fast, and user-friendly solution where:
1.  **Universities** can easily build and manage their list of available books.
2.  **Students** can quickly find the books they need for their courses and get immediate access to e-book links if the physical copy isn't in their library.

---

## ✨ Features

### For University Admins
* **Secure Authentication:** Universities can create a secure administrative account.
* **Book Inventory Management:** Easily add books to the university's catalog.
* **External API Integration:** Search for books by title or author using an external API (like the Google Books API or OpenLibrary API) to fetch and populate book details (cover, description, ISBN, etc.).
* **Catalog Control:** Select the correct book from API search results to add to the library's official, available-book list.
* **Dynamic Updates:** Add new books or update the status of existing ones at any time.

### For Students
* **University-Specific Login:** Students log in using their roll number, which links them directly to their university's catalog.
* **Powerful Search:** Search for books by title, author, or keyword.
* **Filtered Browsing:** Filter the library's collection by semester or academic year to find relevant course materials.
* **Availability Check:** Instantly see if a book is part of the university's collection.
* **E-book Fallback:** If a book is not found in the university's catalog ("no data match"), the system will provide helpful external links (e.g., to Google Books, OpenLibrary, or other e-book repositories) where the student might find it.

---

## ⚙️ How It Works (User Flow)

1.  **Admin:** A university admin signs up and logs in.
2.  **Admin:** Goes to their "Manage" dashboard and clicks "Add Book."
3.  **Admin:** Searches for "Introduction to Algorithms by CLRS." The app fetches data from an external API.
4.  **Admin:** Selects the correct edition from the results and clicks "Add to Library." The book is now listed as available for their university.
5.  **Student:** A student from that same university logs in with their roll number.
6.  **Student:** They search for "Algorithms" and see the book listed as available.
7.  **Student:** They then search for "The Martian." The app finds no match in the *university's* database.
8.  **Result:** The app displays: "Not found in your library. Here are some places you might find it:" followed by links to the book's e-book page.

---

## 💻 Tech Stack

This project is envisioned as a full-stack MERN application.

* **Frontend:** **React.js** (or Next.js) for a dynamic, component-based UI.
* **Backend:** **Node.js** & **Express.js** for building the RESTful API.
* **Database:** **MongoDB** (with Mongoose) to store university data, student accounts, and the lists of books each university owns.
* **Authentication:** **JWT (JSON Web Tokens)** for securing admin and student routes.
* **External API:** **Google Books API** or **OpenLibrary API** for fetching comprehensive book data.

---

## 🔧 Getting Started (Local Development)

To get a local copy up and running:

### Prerequisites
* Node.js (v18 or later)
* npm
* MongoDB (local instance or a cloud URI from MongoDB Atlas)
* An API Key from [Google Books API](https://developers.google.com/books) (or use the open [OpenLibrary API](https://openlibrary.org/developers/api))

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Richa-2005/Uni_Library.git](https://github.com/Richa-2005/Uni_Library.git)
    cd Uni_Library
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../client
    npm install
    ```

---
