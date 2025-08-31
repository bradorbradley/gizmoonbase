import { NextRequest, NextResponse } from 'next/server'
import { sendSMSVerification } from '@/lib/coinbase'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    const result = await sendSMSVerification(phone)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: result.message,
        isDemoMode: result.isDemoMode || false
      })
    } else {
      return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}