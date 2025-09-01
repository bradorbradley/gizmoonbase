"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return

    const updateMousePosition = (e: MouseEvent) => {
      if (!divRef.current) return
      const rect = divRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      divRef.current.style.setProperty("--mouse-x", `${x}px`)
      divRef.current.style.setProperty("--mouse-y", `${y}px`)
    }

    document.addEventListener("mousemove", updateMousePosition)
    return () => document.removeEventListener("mousemove", updateMousePosition)
  }, [])

  return (
    <div
      ref={divRef}
      className={cn(
        "fixed inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        "before:absolute before:inset-0 before:bg-gradient-radial before:from-white/10 before:via-white/5 before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-500 before:group-hover:opacity-100",
        className
      )}
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`,
      } as React.CSSProperties}
    />
  )
}