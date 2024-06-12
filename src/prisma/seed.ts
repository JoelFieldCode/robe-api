import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // TODO insert any DB cleanup tasks needed here
}

main()
    .catch(async (e) => {
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
