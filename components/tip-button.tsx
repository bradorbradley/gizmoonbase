'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TipButtonProps {
  amount: number
  recipientAddress: string
  gizmoSlug: string
  onSuccess?: (txHash: string) => void
}

export function TipButton({ amount, recipientAddress, gizmoSlug, onSuccess }: TipButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleTip = async () => {
    setLoading(true)
    
    try {
      // TODO: Replace with actual OnchainKit Checkout integration
      // For now, simulate the tip transaction
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock transaction hash
      const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      
      // Log the tip event
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tip',
          gizmoSlug,
          amount_usdc: amount,
          tx_hash: mockTxHash
        })
      })
      
      if (onSuccess) {
        onSuccess(mockTxHash)
      }
      
      alert(`Successfully tipped $${amount} USDC! 🎉`)
    } catch (error) {
      console.error('Error sending tip:', error)
      alert('Failed to send tip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleTip}
      disabled={loading}
      size="sm" 
      className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Sending...' : `Tip $${amount}`}
    </Button>
  )
}

// Real OnchainKit integration would look like this:
/*
import { 
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import { Checkout, CheckoutButton } from '@coinbase/onchainkit/checkout';

export function OnchainKitTipButton({ amount, recipientAddress, gizmoSlug }: TipButtonProps) {
  const productId = 'tip-usdc'; // Configure in Coinbase Commerce
  
  return (
    <Checkout productId={productId}>
      <CheckoutButton 
        coinbaseBranded={true}
        text={`Tip $${amount} USDC`}
        onSuccess={(result) => {
          // Log successful tip
          fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'tip',
              gizmoSlug,
              amount_usdc: amount,
              tx_hash: result.transactionHash
            })
          })
        }}
      />
    </Checkout>
  )
}
*/