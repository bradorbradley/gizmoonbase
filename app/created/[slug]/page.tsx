'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, ExternalLink, BarChart3 } from 'lucide-react'

interface GizmoData {
  slug: string
  url: string
  title: string
  creator: {
    handle: string
  }
}

export default function SuccessScreen() {
  const params = useParams()
  const slug = params.slug as string
  const [gizmo, setGizmo] = useState<GizmoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGizmo()
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

  const openInBase = () => {
    if (gizmo) {
      window.open(`/go?g=${encodeURIComponent(gizmo.url)}`, '_blank')
    }
  }

  const copyShareUrl = () => {
    const shareUrl = `${window.location.origin}/g/${slug}`
    navigator.clipboard.writeText(shareUrl)
    alert('Share URL copied!')
  }

  const viewDashboard = () => {
    window.open(`/c/${slug}`, '_blank')
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
            <CardDescription>This gizmo doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <CardTitle className="text-2xl">Your Gizmo is Live!</CardTitle>
          <CardDescription>
            {gizmo.title} by @{gizmo.creator.handle}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Big action buttons */}
          <div className="space-y-3">
            <Button onClick={openInBase} className="w-full h-14 text-lg" size="lg">
              <ExternalLink className="w-5 h-5 mr-2" />
              Open in Base
            </Button>
            
            <Button onClick={copyShareUrl} variant="outline" className="w-full h-14 text-lg" size="lg">
              <Copy className="w-5 h-5 mr-2" />
              Share Mini App
            </Button>
            
            <Button onClick={viewDashboard} variant="outline" className="w-full h-14 text-lg" size="lg">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </div>

          {/* Note */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>If your Gizmo doesn't render inside the app yet, tap 'Open in Base'.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}