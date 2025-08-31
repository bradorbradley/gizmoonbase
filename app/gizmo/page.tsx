'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function GizmoIframe() {
  const searchParams = useSearchParams()
  const gizmoUrl = searchParams.get('g')
  
  if (!gizmoUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Missing gizmo URL. Please provide a ?g= parameter.</p>
      </div>
    )
  }

  let processedUrl = gizmoUrl
  if (!processedUrl.includes('_internal=1')) {
    const separator = processedUrl.includes('?') ? '&' : '?'
    processedUrl = `${processedUrl}${separator}_internal=1`
  }

  return (
    <iframe
      src={processedUrl}
      className="w-screen h-screen border-0"
      style={{ width: '100vw', height: '100vh' }}
      allow="gyroscope; accelerometer; fullscreen"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      title="Gizmo"
    />
  )
}

export default function GizmoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <GizmoIframe />
    </Suspense>
  )
}