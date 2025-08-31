import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test basic environment
    const env = {
      nodeEnv: process.env.NODE_ENV,
      apiKeyPresent: !!process.env.COINBASE_API_KEY,
      privateKeyPresent: !!process.env.COINBASE_PRIVATE_KEY,
      projectIdPresent: !!process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID,
      databasePresent: !!process.env.DATABASE_URL,
    }

    console.log('Health check environment:', env)

    // Test Coinbase SDK import
    try {
      const { Coinbase } = await import('@coinbase/coinbase-sdk')
      console.log('Coinbase SDK imported successfully')
      
      return NextResponse.json({
        status: 'healthy',
        environment: env,
        coinbaseSDK: 'imported successfully',
        timestamp: new Date().toISOString()
      })
    } catch (importError) {
      console.error('Failed to import Coinbase SDK:', importError)
      return NextResponse.json({
        status: 'unhealthy',
        environment: env,
        coinbaseSDK: 'import failed',
        error: importError instanceof Error ? importError.message : 'Unknown import error',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}