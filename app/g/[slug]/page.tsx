'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TipButton } from '@/components/tip-button'

interface GizmoData {
  id: string
  slug: string
  url: string
  title: string
  creator: {
    handle: string
    payout_address: string
  }
}

export default function GizmoViewer() {
  const params = useParams()
  const slug = params.slug as string
  const [gizmo, setGizmo] = useState<GizmoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchGizmo()
      logPlayEvent()
    }
  }, [slug])

  useEffect(() => {
    // Set timeout to show fallback if iframe doesn't load in 3 seconds
    const timer = setTimeout(() => {
      if (!iframeLoaded && !iframeError) {
        setShowFallback(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [iframeLoaded, iframeError])

  const fetchGizmo = async () => {
    try {
      const response = await fetch(`/api/gizmos/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setGizmo(data)
      }
    } catch (error) {
      console.error('Error fetching gizmo:', error)
    } finally {
      setLoading(false)
    }
  }

  const logPlayEvent = async () => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'play',
          gizmoSlug: slug
        })
      })
    } catch (error) {
      console.error('Error logging play event:', error)
    }
  }


  const handleCreateYourOwn = () => {
    // Log outbound event
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'outbound',
        gizmoSlug: slug
      })
    })
    
    window.open(`https://t.co/jXVObaXDkl?utm_source=base_miniapp&g=${slug}`, '_blank')
  }

  const handleOpenGizmo = () => {
    // Log outbound event
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'outbound',
        gizmoSlug: slug
      })
    })

    if (gizmo) {
      window.open(`/go?g=${encodeURIComponent(gizmo.url)}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!gizmo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Gizmo Not Found</CardTitle>
            <CardDescription>This gizmo doesn't exist or has been removed.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Ensure _internal=1 is appended to the URL
  const gizmoUrlWithInternal = gizmo.url.includes('_internal=1') 
    ? gizmo.url 
    : gizmo.url + (gizmo.url.includes('?') ? '&' : '?') + '_internal=1'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold">{gizmo.title}</h1>
          <p className="text-muted-foreground">by @{gizmo.creator.handle}</p>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            {/* Tip presets */}
            <TipButton 
              amount={0.5} 
              recipientAddress={gizmo.creator.payout_address} 
              gizmoSlug={slug}
            />
            <TipButton 
              amount={1} 
              recipientAddress={gizmo.creator.payout_address} 
              gizmoSlug={slug}
            />
            <TipButton 
              amount={2} 
              recipientAddress={gizmo.creator.payout_address} 
              gizmoSlug={slug}
            />
            
            <Button 
              onClick={handleCreateYourOwn} 
              variant="outline" 
              size="sm"
            >
              Create your own Gizmo
            </Button>
          </div>
        </div>
      </div>

      {/* Gizmo Content */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 140px)' }}>
        {!showFallback && !iframeError ? (
          <iframe
            src={gizmoUrlWithInternal}
            className="w-full h-full border-0"
            allow="gyroscope; accelerometer; fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeError(true)}
            title={gizmo.title}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted/20">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Open in Base</CardTitle>
                <CardDescription>
                  This Gizmo works best when opened directly. Tap below to experience it!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleOpenGizmo} className="w-full" size="lg">
                  Open Gizmo
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {!iframeLoaded && !showFallback && !iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p>Loading Gizmo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}