const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDemo() {
  try {
    // Create demo gizmo
    const demoGizmo = await prisma.gizmo.upsert({
      where: { slug: 'demo' },
      update: {},
      create: {
        slug: 'demo',
        url: 'https://gizmo.party/p/demo',
        title: 'Demo Airplane Game',
        creator: {
          create: {
            handle: 'democreator',
            phone: '+1-555-DEMO',
            payout_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
          }
        }
      },
      include: {
        creator: true
      }
    })

    console.log('✅ Demo gizmo created:', demoGizmo)
    console.log('🔗 View at: http://localhost:3000/g/demo')
    
  } catch (error) {
    console.error('Error seeding demo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDemo()