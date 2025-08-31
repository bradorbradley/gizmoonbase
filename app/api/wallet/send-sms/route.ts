import { NextRequest, NextResponse } from 'next/server'
import { sendSMSVerification } from '@/lib/coinbase'

export async function POST(request: NextRequest) {
  try {
    console.log('SMS API called at:', new Date().toISOString())
    
    const body = await request.json()
    const { phone } = body
    
    console.log('SMS request body:', { phone, bodyKeys: Object.keys(body) })
    
    if (!phone) {
      console.log('No phone number provided')
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    console.log('Calling sendSMSVerification...')
    const result = await sendSMSVerification(phone)
    console.log('SMS verification result:', result)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: result.message,
        isDemoMode: result.isDemoMode || false
      })
    } else {
      console.error('SMS verification failed:', result)
      return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in SMS API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
    }, { status: 500 })
  }
}