import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, gizmoSlug, fid, amount_usdc, tx_hash } = body

    if (!type || !gizmoSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate event type
    if (!['play', 'tip', 'outbound'].includes(type)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    // Get gizmo
    const gizmo = await prisma.gizmo.findUnique({
      where: { slug: gizmoSlug }
    })

    if (!gizmo) {
      return NextResponse.json({ error: 'Gizmo not found' }, { status: 404 })
    }

    // Rate limiting for play events (60s per fid per gizmo)
    if (type === 'play' && fid) {
      const recentPlay = await prisma.event.findFirst({
        where: {
          gizmo_id: gizmo.id,
          type: 'play',
          fid: fid,
          ts: {
            gte: new Date(Date.now() - 60 * 1000) // Last 60 seconds
          }
        }
      })

      if (recentPlay) {
        return NextResponse.json({ message: 'Rate limited' }, { status: 429 })
      }
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        type,
        gizmo_id: gizmo.id,
        fid: fid || null,
        amount_usdc: amount_usdc || null,
        tx_hash: tx_hash || null
      }
    })

    // Update or create user if fid provided and not exists
    if (fid && (type === 'play' || type === 'tip')) {
      await prisma.user.upsert({
        where: { fid },
        update: { updated_at: new Date() },
        create: {
          fid,
          basename: `User ${fid}`, // In production, fetch from Neynar
          pfp_url: null
        }
      })
    }

    return NextResponse.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}