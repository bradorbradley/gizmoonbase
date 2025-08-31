'use client'

import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { base } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'
import { coinbaseWallet } from 'wagmi/connectors'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Gizmo Base',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})

export function OnchainKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BaseOnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          projectId={process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID}
        >
          {children}
        </BaseOnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}