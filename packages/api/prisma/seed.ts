import { PrismaClient } from '@prisma/client'
import { generateHash } from 'utils/security'

const prisma = new PrismaClient()
async function main() {
  const root = await prisma.user.upsert({
    where: { email: 'root@mailinator.com' },
    update: {},
    create: {
      email: 'root@mailinator.com',
      name: 'Root',
      password: await generateHash('P@ssw0rd', process.env.SECRET_KEY!),
      verified: true,
    },
  })

  console.log(`Migrated root user: ${root.email}`)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
