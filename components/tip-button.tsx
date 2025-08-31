'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { 
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction'
import { parseUnits } from 'viem'
import { base } from 'viem/chains'

// USDC contract address on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

interface TipButtonProps {
  amount: number
  recipientAddress: string
  gizmoSlug: string
  onSuccess?: (txHash: string) => void
}

export function TipButton({ amount, recipientAddress, gizmoSlug, onSuccess }: TipButtonProps) {
  const [loading, setLoading] = useState(false)
  const { isConnected } = useAccount()

  // For users without connected wallets, use simplified checkout
  const handleSimpleTip = async () => {
    setLoading(true)
    
    try {
      // In production, integrate with Coinbase Commerce or OnRamp
      // For now, show connection prompt
      alert('Please connect your wallet to tip with USDC!')
    } catch (error) {
      console.error('Error sending tip:', error)
      alert('Failed to send tip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // For connected wallets, use OnchainKit Transaction
  const handleOnchainTip = async (txHash: string) => {
    try {
      // Log the successful tip event
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tip',
          gizmoSlug,
          amount_usdc: amount,
          tx_hash: txHash
        })
      })
      
      if (onSuccess) {
        onSuccess(txHash)
      }
    } catch (error) {
      console.error('Error logging tip event:', error)
    }
  }

  // USDC transfer contract call data
  const usdcTransferCall = {
    to: USDC_CONTRACT as `0x${string}`,
    data: `0xa9059cbb${recipientAddress.slice(2).padStart(64, '0')}${parseUnits(amount.toString(), 6).toString(16).padStart(64, '0')}` as `0x${string}`,
    value: BigInt(0),
  }

  if (!isConnected) {
    return (
      <Button 
        onClick={handleSimpleTip}
        disabled={loading}
        size="sm" 
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Connecting...' : `Tip $${amount}`}
      </Button>
    )
  }

  return (
    <Transaction
      calls={[usdcTransferCall]}
      chainId={base.id}
      onSuccess={(response) => {
        if (response.transactionReceipts?.[0]?.transactionHash) {
          handleOnchainTip(response.transactionReceipts[0].transactionHash)
        }
      }}
    >
      <TransactionButton
        text={`Tip $${amount} USDC`}
        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
      />
      <TransactionSponsor />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  )
}

// Alternative: Coinbase Commerce integration for fiat purchases
export function CommerceTipButton({ amount, recipientAddress, gizmoSlug, onSuccess }: TipButtonProps) {
  const handleCommerceTip = async () => {
    // This would integrate with Coinbase Commerce for fiat-to-crypto purchases
    // Users could tip with credit card, which gets converted to USDC
    window.open(`https://commerce.coinbase.com/checkout/your-checkout-id?amount=${amount}`, '_blank')
  }

  return (
    <Button 
      onClick={handleCommerceTip}
      size="sm" 
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Tip $${amount} (Card)
    </Button>
  )
}