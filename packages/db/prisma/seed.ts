import bcrypt from 'bcryptjs'
import { prisma } from '../src'

async function main() {
  const email = process.env.DEMO_USER_EMAIL || 'demo@example.com'
  const password = process.env.DEMO_USER_PASSWORD || 'password123'
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name: 'Demo User' },
    update: {}
  })
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
