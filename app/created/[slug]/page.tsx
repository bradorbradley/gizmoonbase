'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, ExternalLink, BarChart3 } from 'lucide-react'

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

export default function GizmoCreated() {
  const params = useParams()
  const slug = params.slug as string
  const [gizmo, setGizmo] = useState<GizmoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchGizmo()
    }
  }, [slug])

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

  const copyUrl = async () => {
    if (!gizmo) return
    
    const url = `${window.location.origin}/g/${gizmo.slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openInBase = () => {
    if (!gizmo) return
    // Open the gizmo viewer page in Base ecosystem
    window.open(`/g/${gizmo.slug}`, '_blank')
  }

  const viewDashboard = () => {
    if (!gizmo) return
    // Navigate to creator dashboard
    window.open(`/c/${gizmo.slug}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading your gizmo...</p>
      </div>
    )
  }

  if (!gizmo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Gizmo Not Found</CardTitle>
            <CardDescription>There was an error creating your gizmo.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const gizmoUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/g/${gizmo.slug}`

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800">🎉 Gizmo Created!</CardTitle>
            <CardDescription className="text-green-600">
              Your gizmo is now live on Base and ready to earn USDC tips
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Gizmo Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{gizmo.title || 'Your Gizmo'}</CardTitle>
            <CardDescription>by @{gizmo.creator.handle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview iframe */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src={gizmo.url + (gizmo.url.includes('?') ? '&' : '?') + '_internal=1'}
                className="w-full h-full border-0"
                title={`Preview of ${gizmo.title}`}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
            
            {/* Shareable URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Shareable URL:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gizmoUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono"
                />
                <Button onClick={copyUrl} size="sm" variant="outline">
                  {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={openInBase} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Base
              </Button>
              <Button onClick={viewDashboard} variant="outline" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Share your URL on social media to get tips</li>
                <li>• Tips go directly to your wallet: {gizmo.creator.payout_address.slice(0, 8)}...</li>
                <li>• Check your dashboard for analytics and earnings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">$0.00</div>
              <div className="text-sm text-muted-foreground">Total Tips</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Tips</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}