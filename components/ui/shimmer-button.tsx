"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

export function ShimmerButton({ 
  className, 
  children, 
  asChild = false,
  ...props 
}: ShimmerButtonProps) {
  if (asChild) {
    // For asChild, just return the child with group class
    return (
      <div className="group inline-block">
        {children}
      </div>
    )
  }

  return (
    <button className="group relative overflow-hidden" {...props}>
      <div className={cn(
        "relative z-10 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300",
        "bg-gradient-to-r from-blue-600 to-purple-600",
        "hover:from-blue-500 hover:to-purple-500",
        "active:scale-95",
        className
      )}>
        {children}
      </div>
      <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  )
}