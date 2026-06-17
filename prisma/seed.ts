import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data (careful in production!)
  // await prisma.post.deleteMany()
  // await prisma.user.deleteMany()

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      // Password: 'password123' (hashed)
      // password: await bcrypt.hash('password123', 10),
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      // password: await bcrypt.hash('password123', 10),
    },
  })

  console.log(`Created users: ${user1.email}, ${user2.email}`)

  // Create posts (uncomment if Post model exists)
  // const post1 = await prisma.post.create({
  //   data: {
  //     title: 'Hello World',
  //     content: 'This is the first post',
  //     published: true,
  //     authorId: user1.id,
  //   },
  // })

  // const post2 = await prisma.post.create({
  //   data: {
  //     title: 'My Second Post',
  //     content: 'Another great post',
  //     published: false,
  //     authorId: user2.id,
  //   },
  // })

  // console.log(`Created posts: ${post1.title}, ${post2.title}`)

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
