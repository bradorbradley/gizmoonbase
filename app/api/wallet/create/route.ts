import { NextRequest, NextResponse } from 'next/server'
import { verifySMSCode, createEmbeddedWallet } from '@/lib/coinbase'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()
    
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
    }

    // Verify SMS code
    const verification = await verifySMSCode(phone, code)
    if (!verification.success) {
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
    console.error('Error creating wallet:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}