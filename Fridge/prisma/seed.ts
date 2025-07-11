import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const fridge1 = await prisma.fridge.create({
    data: {
      location: 101,
      capacity: 10,
    },
  })
  const fridge2 = await prisma.fridge.create({
    data: {
      location: 101,
      capacity: 15,
    },
  })
  const fridge3 = await prisma.fridge.create({
    data: {
      location: 201,
      capacity: 8,
    },
  })
  console.log({ fridge1, fridge2, fridge3 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    //process.exit(1)
  })