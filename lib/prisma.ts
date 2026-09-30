import { PrismaClient } from "@prisma/client";

// Reutiliza a instância do Prisma Client em ambiente de desenvolvimento para
// evitar esgotamento de conexões causado pelo hot-reload do Next.js.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
