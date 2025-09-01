import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spotlight } from '@/components/ui/spotlight'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import Link from 'next/link'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background">
      <Spotlight className="opacity-30" />
      
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Share your Gizmo. Get tipped in USDC.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Spin up a Mini App page and start earning—no contracts, no escrow.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <ShimmerButton asChild>
            <Link href="/new">Create your Gizmo</Link>
          </ShimmerButton>
          <Button variant="outline" size="lg" asChild>
            <Link href="/g/demo">See a demo</Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Create wallet (SMS)', desc: 'Secure payout address' },
            { title: 'Paste your Gizmo link', desc: 'We make it Mini App-ready' },
            { title: 'Share → get tipped', desc: 'Analytics dashboard included' }
          ].map((step, i) => (
            <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust line */}
      <section className="mx-auto max-w-5xl px-4 py-8 text-center">
        <Separator className="mb-6" />
        <p className="text-muted-foreground text-sm">
          Tips go directly to your wallet. We never hold funds.
        </p>
      </section>
    </div>
  )
}