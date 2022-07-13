import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const dressCategory = await prisma.category.upsert({
        where: { id: 1, },
        update: {},
        create: {
            name: 'Dresses',
            image_url: 'https://www.forevernew.com.au/media/wysiwyg/AU-TrioTiles-890x1100-DT-02_5.jpg?auto=webp&width=2500',
            user_id: 'test',
        },
    })

    const redDressItem = await prisma.item.upsert({
        where: { id: 1, },
        update: {},
        create: {
            name: 'Red Dress',
            price: 40,
            image_url: 'https://www.forevernew.com.au/media/wysiwyg/AU-TrioTiles-890x1100-DT-02_5.jpg?auto=webp&width=2500',
            url: 'https://www.forevernew.com.au/zena-button-up-midi-dress-276218?colour=dark-linked-geo',
            user_id: 'test',
            category: {
                connect: {
                    id: 1,
                }
            }
        },
    })
    console.log({ dressCategory, redDressItem })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })