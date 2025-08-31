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
  
  // Gizmo step state
  const [gizmoUrl, setGizmoUrl] = useState('')
  const [handle, setHandle] = useState('')

  const sendSMSCode = async () => {
    if (!phone) return
    setLoading(true)
    
    try {
      const response = await fetch('/api/wallet/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      if (response.ok) {
        setCodeSent(true)
      } else {
        alert('Failed to send code')
      }
    } catch (error) {
      alert('Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const verifyAndCreateWallet = async () => {
    if (!phone || !verificationCode) return
    setLoading(true)
    
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: verificationCode })
      })
      
      if (response.ok) {
        const data = await response.json()
        setWalletAddress(data.address)
        setStep('gizmo')
      } else {
        alert('Invalid code')
      }
    } catch (error) {
      alert('Failed to create wallet')
    } finally {
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