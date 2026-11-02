import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    const client = new PrismaClient({
      log: [],
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch (err) {
    console.warn("Prisma Client unavailable, using in-memory fallback:", err?.message || err);
    return null;
  }
}

// Quiet logging to prevent unhandled console noise when credentials are being set up
export const prisma = getPrismaClient();
