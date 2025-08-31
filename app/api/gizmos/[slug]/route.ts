import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params
  
  try {
    const gizmo = await prisma.gizmo.findUnique({
      where: { slug: params.slug },
      include: {
        creator: {
          select: {
            handle: true,
            payout_address: true
          }
        }
      }
    })

    if (!gizmo) {
      return NextResponse.json({ error: 'Gizmo not found' }, { status: 404 })
    }

    return NextResponse.json(gizmo)
  } catch (error) {
    console.error('Error fetching gizmo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}