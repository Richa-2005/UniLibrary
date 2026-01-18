# UniLibrary 📚

> **Bridging the Stacks to the Screen.**

UniLibrary is a full-stack Library Management System designed to modernize university resource tracking. It replaces manual registers with a real-time digital dashboard, featuring a dual-interface for Administrators (Inventory & Financials) and Students (Discovery & Access).

Built with the **PostgreSQL,Prisma**  and designed with a custom **Glassmorphism UI**.

## 🚀 Key Features

### 🏛️ For University Admins
* **Smart Inventory Acquisition:** Integrated **Google Books API** allows admins to add books instantly without manual data entry.
* **Circulation Control:** Streamlined **Issue/Return workflows** with conflict detection (prevents deleting issued books).
* **Automated Financials:** The system automatically calculates **Overdue Fines**, tracks **Damage Charges**, and manages **Lost Book Fees** during the return process.
* **Role-Based Dashboard:** Real-time visualization of library composition (Academic vs. Novels) and active loan statistics.
* **Secure Student Registry:** Admin-controlled student registration and directory management.

### 🎓 For Students
* **Hybrid Search Engine:** Prioritizes local physical inventory but automatically falls back to **External E-Book Resources** if a book is unavailable physically.
* **Real-Time Availability:** Instantly see stock levels ("Available" vs "Out of Stock") before visiting the library.
* **Semester Filtering:** Dedicated filters to find curriculum-specific academic books quickly.
* **Profile & Tracking:** A slide-out sidebar to track active loans and upcoming due dates.

---

## 🛠️ Tech Stack & Engineering Decisions

### **Frontend**
* **React.js (Vite):** Fast, component-based UI.
* **CSS Modules:** Utilized for a custom "Modern Academia" design system, ensuring scoped styling and preventing class conflicts.
* **Recharts:** For data visualization in the Admin Dashboard.
* **Axios Interceptors:** Handles secure JWT token transmission automatically.

### **Backend**
* **Node.js & Express:** RESTful API architecture.
* **PostgreSQL (via Prisma ORM):** chosen for relational data integrity (ensuring books/students are linked correctly).
* **Security:**
    * **Bcrypt:** Industry-standard password hashing.
    * **JWT:** Stateless authentication for secure session management.
    * **Admin Keys:** Secret-key protection for university registration endpoints.

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
![Admin Dashboard](./screenshots/admin-dash.png)

### 3. API-Driven Book Acquisition
Admins can instantly populate the library catalog by searching the **Google Books API**. This fetches high-quality metadata (covers, descriptions, authors) automatically.
![Add Book Interface](./screenshots/admin-add-book.png)

### 4. Student Registry Management
A dedicated section for Admins to register new students and view the complete directory of users linked to their university, ensuring secure access control.
![Manage Students](./screenshots/add-student.png)

### 5. Granular Inventory Control
Admins can edit specific details for any book in their collection, including updating total stock counts, semesters, and academic years, price to keep data accurate.
![Admin Manage Inventory](./screenshots/admin-inventory.png)
![Edit Book Details](./screenshots/edit-book.png)

### 6. Streamlined Book Issuing
The "Issue" workflow allows Admins to quickly assign a book to a student using their Roll Number and a custom Due Date, automatically reducing available stock.
![Issue Book Modal](./screenshots/issue-book.png)

### 7. Smart Return & Financials
The return modal automatically calculates fines based on overdue days. It handles complex scenarios like "Book Damaged" or "Book Lost" with dynamic fee adjustments.
![Return Modal](./screenshots/return-book.png)
![Liabrary Financials](./screenshots/financial.png)

### 8. Student Discovery Interface
Students can browse the university's catalog, filter by semester, and check **real-time availability** of physical copies.
![Student Search](./screenshots/student-search.png)

### 9. Smart E-Book Fallback
If a book is not available in the university's physical collection, the system intelligently suggests **External E-Book Resources** via Google Books, ensuring students always find what they need.
![E-Book Fallback](./screenshots/student-fallback.png)

### 10. User Profile & Loan Tracking
A slide-out sidebar provides quick access to user details and a dynamic list of **currently borrowed books** with their respective due dates.
![Profile Sidebar](./screenshots/profile-sidebar.png)

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
