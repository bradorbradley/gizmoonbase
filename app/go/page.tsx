'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function GoRedirect() {
  const sp = useSearchParams()
  useEffect(() => {
    const raw = sp.get('g')
    if (!raw) return
    try {
      const u = new URL(raw)
      if (!u.searchParams.has('_internal')) u.searchParams.set('_internal','1')
      window.location.replace(u.toString())
    } catch {
      // no-op
    }
  }, [sp])

  return <main style={{display:'grid',placeItems:'center',height:'100vh'}}>Opening…</main>
}

export default function Go() {
  return (
    <Suspense fallback={<main style={{display:'grid',placeItems:'center',height:'100vh'}}>Loading…</main>}>
      <GoRedirect />
    </Suspense>
  )
}