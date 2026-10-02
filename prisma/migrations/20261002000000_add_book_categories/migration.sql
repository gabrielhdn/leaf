CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_key_key" ON "Category"("key");

CREATE TABLE "BookCategory" (
    "bookId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("bookId", "categoryId")
);

CREATE INDEX "BookCategory_categoryId_idx" ON "BookCategory"("categoryId");

ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_bookId_fkey"
    FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
