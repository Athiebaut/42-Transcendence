import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		// Optionnel: ajouter un logger pour voir les requêtes SQL
		log: ['query', 'info', 'warn', 'error'],
	});

console.log("prisma cree\n\n\n\n");

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

// L'instance exportée 'prisma' est unique et sera réutilisée