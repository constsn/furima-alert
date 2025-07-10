import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['error'],
    // @ts-expect-error Prisma __internal option: disable statement cache
    __internal: {
      engine: {
        // Prepared statement キャッシュを無効化
        statement_cache_size: 0,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
