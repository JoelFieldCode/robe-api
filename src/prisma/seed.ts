import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (tx) => {
        const categories = await tx.category.findMany();
        for (const category of categories) {
            await tx.category.update({
                where: { id: category.id },
                data: {
                    userId: category.user_id,
                },
            });
        }

        const items = await tx.item.findMany();
        for (const item of items) {
            await tx.item.update({
                where: { id: item.id },
                data: {
                    userId: item.user_id,
                },
            });
        }
    });
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
