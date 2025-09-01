"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  className?: string
  duration?: number
  prefix?: string
  suffix?: string
}

export function NumberTicker({ 
  value, 
  className, 
  duration = 1000,
  prefix = "",
  suffix = ""
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startValue = displayValue
    const endValue = value
    const startTime = Date.now()

    const animateValue = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOut
      
      setDisplayValue(Math.floor(currentValue))
      
      if (progress < 1) {
        requestAnimationFrame(animateValue)
      }
    }

    animateValue()
  }, [value, duration, isVisible])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <span ref={ref} className={cn("font-mono", className)}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  )
}