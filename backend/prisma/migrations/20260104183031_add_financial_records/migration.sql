-- DropForeignKey
ALTER TABLE "BorrowedRecord" DROP CONSTRAINT "BorrowedRecord_libraryEntryId_fkey";

-- AlterTable
ALTER TABLE "BorrowedRecord" ADD COLUMN     "damageAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "lostAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'returned';

-- AddForeignKey
ALTER TABLE "BorrowedRecord" ADD CONSTRAINT "BorrowedRecord_libraryEntryId_fkey" FOREIGN KEY ("libraryEntryId") REFERENCES "LibraryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
