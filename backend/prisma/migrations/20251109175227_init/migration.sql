-- Create Table
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "adminPasswordHash" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- Create Table
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- Create Table
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- Create Table
CREATE TABLE "LibraryEntry" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "semester" INTEGER,
    "year" INTEGER,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "LibraryEntry_pkey" PRIMARY KEY ("id")
);

-- Create Table
CREATE TABLE "BorrowedRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "libraryEntryId" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "BorrowedRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_adminEmail_key" ON "University"("adminEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Student_universityId_rollNumber_key" ON "Student"("universityId", "rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryEntry_universityId_bookId_key" ON "LibraryEntry"("universityId", "bookId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedRecord" ADD CONSTRAINT "BorrowedRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedRecord" ADD CONSTRAINT "BorrowedRecord_libraryEntryId_fkey" FOREIGN KEY ("libraryEntryId") REFERENCES "LibraryEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
