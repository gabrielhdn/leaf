import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  leafPrisma?: PrismaClient;
};

export function getDb(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database access");
  }

  if (!globalForPrisma.leafPrisma) {
    const adapter = new PrismaPg({ connectionString });
    globalForPrisma.leafPrisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.leafPrisma;
}
