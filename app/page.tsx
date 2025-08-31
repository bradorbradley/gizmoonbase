import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Share your Gizmo on Base. Get tipped in USDC.
          </h1>
          <p className="text-xl text-muted-foreground">
            Spin up a Mini App page for your Gizmo and start earning—no contracts, no escrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/new">
              <Button size="lg" className="text-lg px-8 py-6">
                Create your Gizmo
              </Button>
            </Link>
            <Link href="/g/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                See a demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">1. Create wallet (SMS)</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  secure payout address
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">2. Paste your Gizmo link</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  we make it Mini App-ready
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">3. Share → get tipped → see your revenue & users</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  analytics dashboard included
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trust line */}
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground font-medium">
          Tips go directly to your wallet. We never hold funds.
        </p>
      </div>
    </div>
  )
}