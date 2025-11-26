# UniLibrary 📚

UniLibrary is a modern, full-stack library management system designed to bridge the gap between university resources and student needs. It features a dual-interface for Administrators to manage inventory and Students to discover resources.

## 🚀 Features

### 👨‍💼 For University Admins
* **Smart Inventory:** Add books instantly by searching the **Google Books API** (no manual typing required).
* **Stock Management:** Track total vs. available copies.
* **Issue & Return:** Manage book loans with student Roll Numbers; system automatically prevents deleting books that are currently issued.
* **Student Management:** Register students and assign credentials.
* **Dashboard:** Real-time statistics on total titles, copies, and active loans.

### 🎓 For Students
* **University-Specific Login:** Secure access linked to their specific university.
* **Live Availability:** Instantly see if a book is "Available" or "Out of Stock".
* **Smart Search:** Search by title, author, or ISBN with instant results.
* **Semester Filtering:** Filter the catalog to find relevant course materials.
* **E-Book Fallback:** If a book isn't in the library, the system automatically fetches and displays **Google Books preview links** so students are never left without resources.
* **Personal Profile:** Slide-out sidebar showing current borrowed books and due dates.

---

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* CSS Modules (Glassmorphism UI)
* Axios (API Consumption)
* React Router DOM

**Backend:**
* Node.js & Express
* **PostgreSQL** (Relational Database)
* **Prisma ORM** (Schema & Queries)
* JSON Web Tokens (JWT) for Authentication
* Bcrypt (Password Hashing)

---

## 🔧 Installation & Setup

### 1. Prerequisites
* Node.js installed
* PostgreSQL installed and running

### 2. Clone the Repository
```bash
git clone [https://github.com/Richa-2005/UniLibrary.git]
cd unilibrary
```
### 3.Backend Setup
```bash
cd backend
npm install

# Create a .env file in /backend with:
# DATABASE_URL="postgresql://user:password@localhost:5432/uniLibrary"
# JWT_SECRET="your_secret_key"
# GOOGLE_BOOKS_API_KEY="your_google_api_key"

# Run Database Migrations
npx prisma migrate dev --name init

# Start Server
npm run dev
```
### 4.Frontend Setup
```bash
cd frontend
npm install

# Start React App
npm run dev
```
## 📸 Project Tour

### 1. Dual-Role Authentication Portal
A secure, unified login interface featuring a glassmorphism UI. Supports distinct workflows for University Admins (with registration) and Students (with roll-number login).
![Login Page](./screenshots/login-page.png)

### 2. Admin Command Center
The central hub for librarians. Features real-time statistics on inventory and active loans, along with a comprehensive table for managing book stock and details.
![Admin Dashboard](./screenshots/admin-inventory.png)

### 3. API-Driven Book Acquisition
Admins can instantly populate the library catalog by searching the **Google Books API**. This fetches high-quality metadata (covers, descriptions, authors) automatically.
![Add Book Interface](./screenshots/admin-add-book.png)

### 4. Student Registry Management
A dedicated section for Admins to register new students and view the complete directory of users linked to their university, ensuring secure access control.
![Manage Students](./screenshots/add-student.png)

### 5. Granular Inventory Control
Admins can edit specific details for any book in their collection, including updating total stock counts, semesters, and academic years to keep data accurate.
![Edit Book Details](./screenshots/edit-book.png)

### 6. Streamlined Book Issuing
The "Issue" workflow allows Admins to quickly assign a book to a student using their Roll Number and a custom Due Date, automatically reducing available stock.
![Issue Book Modal](./screenshots/issue-book.png)

### 7. Efficient Return Processing
The "Return" workflow closes the loop by verifying the student's active loan and instantly restoring the book's availability status in the database.
![Return Book Modal](./screenshots/return-book.png)

### 8. Student Discovery & Availability
Students can browse the university's specific catalog, filter by semester, and check the **real-time availability** of physical copies before heading to the library.
![Student Search](./screenshots/student-search.png)

### 9. Smart E-Book Fallback
If a book is not available in the university's physical collection, the system intelligently suggests **External E-Book Resources** via Google Books, ensuring students always find what they need.
![E-Book Fallback](./screenshots/student-fallback.png)

### 10. User Profile & Loan Tracking
A slide-out sidebar provides quick access to user details and a dynamic list of **currently borrowed books** with their respective due dates.
![Profile Sidebar](./screenshots/profile-sidebar.png)

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
