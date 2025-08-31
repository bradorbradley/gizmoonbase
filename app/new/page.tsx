'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Step = 'wallet' | 'gizmo' | 'creating'

export default function CreateGizmo() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('wallet')
  const [loading, setLoading] = useState(false)
  
  // Wallet step state
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [sessionId, setSessionId] = useState('')
  
  // Gizmo step state
  const [gizmoUrl, setGizmoUrl] = useState('')
  const [handle, setHandle] = useState('')

  const sendSMSCode = async () => {
    console.log('sendSMSCode called with phone:', phone)
    if (!phone) {
      console.log('No phone number provided')
      return
    }
    
    console.log('Setting loading to true')
    setLoading(true)
    
    try {
      console.log('Sending SMS request to:', '/api/wallet/send-sms')
      const response = await fetch('/api/wallet/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      console.log('SMS Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('SMS Response data:', data)
        setCodeSent(true)
        
        // Store sessionId for verification
        if (data.sessionId) {
          setSessionId(data.sessionId)
        }
        
        // Show appropriate message
        if (data.isDemoMode) {
          alert('Demo Mode: Use verification code 123456')
        } else {
          alert('SMS sent! Check your phone for the verification code.')
        }
      } else {
        console.error('SMS request failed with status:', response.status)
        alert('Failed to send code')
      }
    } catch (error) {
      console.error('SMS error:', error)
      alert('Failed to send code')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const verifyAndCreateWallet = async () => {
    console.log('verifyAndCreateWallet called with:', { phone, verificationCode })
    if (!phone || !verificationCode) {
      console.log('Missing phone or verification code')
      return
    }
    
    console.log('Starting wallet creation...')
    setLoading(true)
    
    try {
      console.log('Sending wallet create request to:', '/api/wallet/create')
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: verificationCode, sessionId })
      })
      
      console.log('Wallet create response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Wallet create response data:', data)
        setWalletAddress(data.address)
        setStep('gizmo')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Wallet create failed:', response.status, errorData)
        alert('Invalid code')
      }
    } catch (error) {
      console.error('Wallet create error:', error)
      alert('Failed to create wallet')
    } finally {
      console.log('Wallet creation finished')
      setLoading(false)
    }
  }

  const createGizmo = async () => {
    if (!gizmoUrl || !handle) return
    setStep('creating')
    setLoading(true)
    
    try {
      const response = await fetch('/api/gizmos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: gizmoUrl, 
          handle, 
          phone,
          payout_address: walletAddress 
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        router.push(`/created/${data.slug}`)
      } else {
        alert('Failed to create gizmo')
        setStep('gizmo')
        setLoading(false)
      }
    } catch (error) {
      alert('Failed to create gizmo')
      setStep('gizmo')
      setLoading(false)
    }
  }

  if (step === 'creating') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Creating your Gizmo...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === 'wallet' && (
          <>
            <CardHeader>
              <CardTitle>Step 1: Wallet</CardTitle>
              <CardDescription>
                We'll create a secure wallet for your USDC tips
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!walletAddress ? (
                <>
                  <div>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={codeSent || loading}
                    />
                  </div>
                  
                  {!codeSent ? (
                    <Button 
                      onClick={sendSMSCode}
                      disabled={!phone || loading}
                      className="w-full"
                    >
                      {loading ? 'Sending...' : 'Send code'}
                    </Button>
                  ) : (
                    <>
                      <div>
                        <Input
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          disabled={loading}
                          maxLength={6}
                        />
                      </div>
                      <Button 
                        onClick={verifyAndCreateWallet}
                        disabled={!verificationCode || loading}
                        className="w-full"
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-green-600 font-medium">✅ Wallet ready</div>
                  <div className="text-sm text-muted-foreground">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                  <Button onClick={() => setStep('gizmo')} className="w-full">
                    Continue
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        )}

        {step === 'gizmo' && (
          <>
            <CardHeader>
              <CardTitle>Step 2: Gizmo</CardTitle>
              <CardDescription>
                Add your Gizmo link and creator handle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="https://gizmo.party/p/..."
                  value={gizmoUrl}
                  onChange={(e) => setGizmoUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Gizmo URL (required)</p>
              </div>
              
              <div>
                <Input
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Creator handle (required, @ optional)</p>
              </div>
              
              <Button 
                onClick={createGizmo}
                disabled={!gizmoUrl || !handle || loading}
                className="w-full"
                size="lg"
              >
                Create
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}