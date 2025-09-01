'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
      <Card className="w-full max-w-lg">
        {step === 'wallet' && (
          <>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default">1</Badge>
                <span className="font-medium">Wallet</span>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary">2</Badge>
                <span className="text-muted-foreground">Gizmo</span>
              </div>
              <CardTitle>Create your wallet</CardTitle>
              <CardDescription>
                We'll create a secure wallet for your USDC tips
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!walletAddress ? (
                <>
                  <div className="space-y-3">
                    <Input
                      type="tel"
                      placeholder="+1 555…"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={codeSent || loading}
                      className="text-center"
                    />
                    
                    {!codeSent ? (
                      <Button 
                        onClick={sendSMSCode}
                        disabled={!phone || loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? 'Sending...' : 'Send code'}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          disabled={loading}
                          maxLength={6}
                          className="max-w-[140px] text-center"
                        />
                        <Button 
                          onClick={verifyAndCreateWallet}
                          disabled={!verificationCode || loading}
                          variant="outline"
                          className="flex-1"
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    )}
                  </div>
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
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">1</Badge>
                <span className="text-muted-foreground">Wallet</span>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="default">2</Badge>
                <span className="font-medium">Gizmo</span>
              </div>
              <CardTitle>Add your Gizmo</CardTitle>
              <CardDescription>
                Paste your Gizmo link and choose a handle
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