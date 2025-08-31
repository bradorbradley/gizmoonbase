import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const { url, handle, phone, payout_address } = await request.json()

    if (!url || !handle || !payout_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Create unique slug
    const slug = nanoid(10)

    // Clean handle (remove @ if present)
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle

    // Try to extract title from URL (basic approach)
    let title: string | undefined
    try {
      const urlParts = url.split('/')
      const lastPart = urlParts[urlParts.length - 1]
      if (lastPart && lastPart !== '') {
        title = lastPart.split('?')[0] // Remove query params
      }
    } catch {
      // If title extraction fails, continue without title
    }

    // Create creator
    const creator = await prisma.creator.create({
      data: {
        handle: cleanHandle,
        phone,
        payout_address,
        wallet_provider: 'coinbase'
      }
    })

    // Create gizmo
    const gizmo = await prisma.gizmo.create({
      data: {
        slug,
        url,
        title: title || `${cleanHandle}'s Gizmo`,
        creator_id: creator.id
      }
    })

    return NextResponse.json({ 
      slug: gizmo.slug,
      message: 'Gizmo created successfully'
    })
  } catch (error) {
    console.error('Error creating gizmo:', error)
    
    // Handle unique constraint errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Handle already taken' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}