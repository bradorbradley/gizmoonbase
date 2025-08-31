import { Coinbase, Wallet, WalletCreateOptions } from '@coinbase/coinbase-sdk'

// Initialize Coinbase SDK
const initializeCoinbase = () => {
  const apiKeyName = process.env.COINBASE_API_KEY
  const privateKey = process.env.COINBASE_PRIVATE_KEY
  
  if (!apiKeyName || !privateKey) {
    console.warn('Coinbase API credentials not configured')
    return null
  }
  
  try {
    return Coinbase.configure({
      apiKeyName,
      privateKey,
      useServerSigner: false, // Client-side signing for embedded wallets
    })
  } catch (error) {
    console.error('Failed to initialize Coinbase SDK:', error)
    return null
  }
}

// Create embedded wallet for phone number
export async function createEmbeddedWallet(phone: string) {
  const coinbase = initializeCoinbase()
  
  if (!coinbase) {
    // Fallback to mock for development
    console.warn('Using mock wallet - configure Coinbase credentials for production')
    const mockAddress = '0x' + phone.replace(/\D/g, '').padEnd(40, '0').slice(0, 40)
    return {
      address: mockAddress,
      success: true
    }
  }

  try {
    // Create a new embedded wallet
    const walletOptions: WalletCreateOptions = {
      networkId: 'base-mainnet', // Use Base network
    }
    
    const wallet = await Wallet.create(walletOptions)
    const address = await wallet.getDefaultAddress()
    
    // Store wallet data encrypted with phone as identifier
    // In production, you'd want to use proper user authentication
    const walletData = {
      walletId: wallet.getId(),
      address: address.getId(),
      networkId: 'base-mainnet',
      phone: phone // For demo purposes - use proper user ID in production
    }
    
    // TODO: Store wallet data securely in your database
    // For now, we'll return the address
    
    return {
      address: address.getId(),
      walletId: wallet.getId(),
      success: true
    }
  } catch (error) {
    console.error('Error creating embedded wallet:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKeyPresent: !!process.env.COINBASE_API_KEY,
      privateKeyPresent: !!process.env.COINBASE_PRIVATE_KEY
    })
    
    // Return error instead of mock for debugging
    throw new Error(`Wallet creation failed: ${error.message}`)
  }
}

// SMS verification for phone numbers
export async function sendSMSVerification(phone: string) {
  // DEMO MODE: In production, integrate with Twilio, AWS SNS, or similar
  console.log(`[DEMO] Would send SMS verification to ${phone}`)
  
  // Simulate network delay to make it feel real
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // For demo purposes, always return success
  // In production, this would integrate with your SMS provider
  return { 
    success: true,
    message: `Demo: SMS would be sent to ${phone}. Use code: 123456`,
    isDemoMode: true
  }
}

export async function verifySMSCode(phone: string, code: string) {
  // In production, verify against stored code from database/Redis
  // For demo, accept the fixed code
  if (code === '123456') {
    return { 
      success: true, 
      message: 'Phone verified successfully'
    }
  }
  
  return { 
    success: false, 
    message: 'Invalid verification code'
  }
}

// Get wallet for authenticated user
export async function getWalletForUser(phone: string) {
  const coinbase = initializeCoinbase()
  
  if (!coinbase) {
    return null
  }
  
  try {
    // In production, retrieve wallet data from your database using user ID
    // For now, we'll create a consistent wallet ID from phone
    const walletId = `wallet_${phone.replace(/\D/g, '')}`
    
    // Try to import existing wallet or create new one
    // This is a simplified approach - in production you'd store wallet data securely
    const wallet = await createEmbeddedWallet(phone)
    return wallet
  } catch (error) {
    console.error('Error retrieving wallet:', error)
    return null
  }
}