import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let connectionString = `${process.env.DATABASE_URL}`;

// Fix for Node Postgres v9 SSL mode security warning
if (!connectionString.includes("uselibpqcompat=true")) {
  connectionString += connectionString.includes("?") ? "&uselibpqcompat=true" : "?uselibpqcompat=true";
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
