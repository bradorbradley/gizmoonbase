"use client"

import { cn } from "@/lib/utils"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  colSpan?: number
  rowSpan?: number
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid auto-rows-[22rem] grid-cols-3 gap-4",
      className
    )}>
      {children}
    </div>
  )
}

export function BentoCard({ 
  children, 
  className, 
  colSpan = 1, 
  rowSpan = 1 
}: BentoCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-background p-6 hover:shadow-lg transition-all duration-300",
        colSpan === 2 && "col-span-2",
        colSpan === 3 && "col-span-3",
        rowSpan === 2 && "row-span-2",
        className
      )}
    >
      {children}
    </div>
  )
}