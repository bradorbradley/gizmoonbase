import { NextRequest, NextResponse } from 'next/server'
import { verifySMSCode, createEmbeddedWallet } from '@/lib/coinbase'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()
    
    console.log('Wallet create request received:', { phone, code, codeType: typeof code })
    
    if (!phone || !code) {
      console.log('Missing required fields')
      return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
    }

    // Verify SMS code
    console.log('Starting SMS verification...')
    const verification = await verifySMSCode(phone, code)
    console.log('SMS verification result:', verification)
    
    if (!verification.success) {
      console.log('SMS verification failed')
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // Create Embedded Wallet
    const wallet = await createEmbeddedWallet(phone)
    
    if (wallet.success) {
      return NextResponse.json({ 
        success: true, 
        address: wallet.address 
      })
    } else {
      return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in wallet create API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      envVarsPresent: {
        apiKey: !!process.env.COINBASE_API_KEY,
        privateKey: !!process.env.COINBASE_PRIVATE_KEY,
        projectId: !!process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID
      }
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
    }, { status: 500 })
  }
}