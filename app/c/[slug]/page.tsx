'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Copy, ExternalLink, TrendingUp, Users, DollarSign, Eye } from 'lucide-react'

interface GizmoData {
  id: string
  slug: string
  url: string
  title: string
  creator: {
    handle: string
    payout_address: string
    pfp_url?: string
  }
}

interface Analytics {
  revenue: number
  tips: number
  plays: number
  outbound: number
}

interface TipperData {
  address: string
  amount: number
  count: number
  lastTip: string
}

export default function Dashboard() {
  const params = useParams()
  const slug = params.slug as string
  const [gizmo, setGizmo] = useState<GizmoData | null>(null)
  const [analytics, setAnalytics] = useState<Analytics>({ revenue: 0, tips: 0, plays: 0, outbound: 0 })
  const [tippers, setTippers] = useState<TipperData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug, timeRange])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch gizmo data
      const gizmoRes = await fetch(`/api/gizmos/${slug}`)
      if (gizmoRes.ok) {
        setGizmo(await gizmoRes.json())
      }

      // Fetch analytics (mock data for now)
      const analyticsRes = await fetch(`/api/gizmos/${slug}/analytics?range=${timeRange}`)
      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setAnalytics(data)
      } else {
        // Mock data fallback
        setAnalytics({
          revenue: Math.random() * 150,
          tips: Math.floor(Math.random() * 25),
          plays: Math.floor(Math.random() * 500),
          outbound: Math.floor(Math.random() * 50)
        })
      }

      // Mock tippers data
      setTippers([
        { address: '0xa1b2...c3d4', amount: 15.50, count: 3, lastTip: '2 hours ago' },
        { address: '0xe5f6...g7h8', amount: 8.25, count: 2, lastTip: '1 day ago' },
        { address: '0xi9j0...k1l2', amount: 5.00, count: 1, lastTip: '3 days ago' },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyShareLink = async () => {
    if (!gizmo) return
    
    const url = `${window.location.origin}/g/${gizmo.slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!gizmo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dashboard Not Found</CardTitle>
            <CardDescription>Could not load dashboard for this gizmo.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{gizmo.title || 'Your Gizmo'}</h1>
            <p className="text-muted-foreground">@{gizmo.creator.handle}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyShareLink} variant="outline">
              {copied ? 'Copied!' : <><Copy className="w-4 h-4 mr-2" />Copy Link</>}
            </Button>
            <Button asChild>
              <a href={`/g/${gizmo.slug}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </a>
            </Button>
          </div>
        </div>

        {/* Time Range Filter */}
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="7d">7 days</TabsTrigger>
            <TabsTrigger value="30d">30 days</TabsTrigger>
            <TabsTrigger value="all">All time</TabsTrigger>
          </TabsList>

          <TabsContent value={timeRange} className="mt-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    <NumberTicker value={analytics.revenue} prefix="$" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+12.5%</span> from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tips Received</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <NumberTicker value={analytics.tips} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+5</span> from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plays</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <NumberTicker value={analytics.plays} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+23%</span> from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outbound Clicks</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <NumberTicker value={analytics.outbound} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">+8.2%</span> from last period
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Top Tippers</CardTitle>
                <CardDescription>
                  Your most generous supporters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tippers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No tips yet. Share your gizmo to start earning!
                    </div>
                  ) : (
                    tippers.map((tipper, index) => (
                      <div key={tipper.address} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <Badge variant={index === 0 ? 'default' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {tipper.address.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{tipper.address}</div>
                              <div className="text-xs text-muted-foreground">
                                {tipper.count} tip{tipper.count !== 1 ? 's' : ''} • {tipper.lastTip}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            ${tipper.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}