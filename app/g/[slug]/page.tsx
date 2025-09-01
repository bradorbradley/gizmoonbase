'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TipButton } from '@/components/tip-button'

interface GizmoData {
  id: string
  slug: string
  url: string
  title?: string
  creator: {
    handle: string
    pfp_url?: string
    payout_address: string
  }
}

export default function GizmoViewer() {
  const { slug } = useParams<{ slug: string }>()
  const [gizmo, setGizmo] = useState<GizmoData | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/gizmos/${slug}`)
      if (res.ok) setGizmo(await res.json())
    }
    load()
    
    // Log play event
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'play', gizmoSlug: slug })
    }).catch(() => {})
  }, [slug])

  if (!gizmo) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  const iframeSrc = gizmo.url + (gizmo.url.includes('?') ? '&' : '?') + '_internal=1'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-end">
          <Link href="/new">
            <Button className="rounded-full px-4">Create your own Gizmo</Button>
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-3xl px-4 py-4 space-y-3">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted">
              <iframe
                src={iframeSrc}
                className="w-full h-full border-0"
                title={gizmo.title ?? 'Gizmo'}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </CardContent>
        </Card>

        {/* Creator row with Tip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
              {gizmo.creator.pfp_url ? (
                <Image
                  src={gizmo.creator.pfp_url}
                  alt={gizmo.creator.handle}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
              )}
            </div>
            <div className="leading-tight">
              <div className="font-medium">{gizmo.creator.handle}</div>
              <div className="text-sm text-muted-foreground">
                {gizmo.title ?? 'Gizmo'}
              </div>
            </div>
          </div>

          {/* Oval Tip button (Base blue) */}
          <TipButton
            amount={1} // default $1
            recipientAddress={gizmo.creator.payout_address}
            gizmoSlug={gizmo.slug}
            className="rounded-full px-5 h-9 bg-blue-600 hover:bg-blue-700 text-white"
            label="Tip"
          />
        </div>
      </div>
    </div>
  )
}