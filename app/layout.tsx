import './globals.css'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
          <div className="mx-auto max-w-5xl h-14 flex items-center justify-between px-4">
            <Link href="/" className="font-semibold text-lg">
              GizmoOnBase
            </Link>
            <Button asChild>
              <Link href="/new">Create your Gizmo</Link>
            </Button>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}