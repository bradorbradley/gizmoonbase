'use client'

import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { base } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'
import { coinbaseWallet } from 'wagmi/connectors'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

// Use Base mainnet for production-ready app
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'GizmoOnBase',
      preference: 'smartWalletOnly', // Prioritize Smart Wallets
      version: '4', // Use latest SDK version
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true, // Enable SSR support
})

interface OnchainKitProviderProps {
  children: ReactNode
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY
  const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID
  
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_ONCHAINKIT_API_KEY is not configured')
  }
  
  if (!projectId) {
    console.warn('NEXT_PUBLIC_COINBASE_PROJECT_ID is not configured')
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BaseOnchainKitProvider
          apiKey={apiKey}
          chain={base} // Default to Base mainnet
          projectId={projectId}
          config={{
            appearance: {
              mode: 'auto', // Support light/dark mode
              theme: 'base', // Use Base theme
            },
            wallet: {
              display: 'modal', // Use modal display for better UX
            },
          }}
        >
          {children}
        </BaseOnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}