import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Quiet logging to prevent unhandled console noise when credentials are being set up
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
