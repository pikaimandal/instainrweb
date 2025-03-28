"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MiniKit } from '@worldcoin/minikit-js'

interface WorldIDAuthProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: { worldId: string }) => void
}

export default function WorldIDAuth({ onNext, onBack, updateUserData }: WorldIDAuthProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorldApp, setIsWorldApp] = useState<boolean | null>(null)

  useEffect(() => {
    const checkWorldApp = () => {
      const isInstalled = MiniKit.isInstalled()
      setIsWorldApp(isInstalled)
    }

    const timer = setTimeout(checkWorldApp, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      setError('Please open this app in World App to continue')
      return
    }

    try {
      setIsVerifying(true)
      setError(null)

      // Use wallet authentication like the login page
      const res = await fetch('/api/nonce')
      const { nonce } = await res.json()

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Sign in to InstaINR with World ID to create your account',
      })

      if (finalPayload.status === 'error') {
        throw new Error('Authentication failed')
      }

      // Verify with backend
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      const verifyResult = await verifyResponse.json()
      
      if (verifyResult.status === 'success') {
        setIsVerified(true)
        // Use the wallet address as the World ID
        updateUserData({ worldId: finalPayload.address || MiniKit.walletAddress || "0x..." })
      } else {
        throw new Error('Verification failed')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify')
      console.error('Verification error:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        onNext()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isVerified, onNext])

  return (
    <div className="p-5 max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-1 bg-border rounded mb-4 relative">
          <div className="h-1 bg-primary rounded absolute top-0 left-0" style={{ width: "16.6%" }}></div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mb-2">
              1
            </div>
            <div className="text-xs text-primary font-medium">World ID</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-border text-text-tertiary flex items-center justify-center text-xs mb-2">
              2
            </div>
            <div className="text-xs text-text-tertiary">Personal</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-border text-text-tertiary flex items-center justify-center text-xs mb-2">
              3
            </div>
            <div className="text-xs text-text-tertiary">Selfie</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-border text-text-tertiary flex items-center justify-center text-xs mb-2">
              4
            </div>
            <div className="text-xs text-text-tertiary">KYC</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-border text-text-tertiary flex items-center justify-center text-xs mb-2">
              5
            </div>
            <div className="text-xs text-text-tertiary">Withdrawal</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-border text-text-tertiary flex items-center justify-center text-xs mb-2">
              6
            </div>
            <div className="text-xs text-text-tertiary">Done</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h2 className="text-xl font-semibold mb-5">Verify with World ID</h2>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-4">
            <Image src="/images/worldid-logo.png" alt="World ID" width={60} height={60} />
          </div>
          <p className="text-center text-text-secondary mb-6">
            We use World ID to verify your identity and ensure you're a real person. This helps us prevent fraud and
            keep your account secure.
          </p>

          {!isWorldApp && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm w-full">
              ⚠️ This app requires World App to function. Please open it in World App.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm w-full">
              ❌ {error}
            </div>
          )}

          {isVerified ? (
            <div className="flex items-center justify-center bg-success/10 text-success rounded-lg p-3 w-full">
              <i className="fas fa-check-circle mr-2"></i>
              <span>World ID Verified Successfully!</span>
            </div>
          ) : (
            <button
              onClick={handleVerify}
              disabled={isVerifying || !isWorldApp}
              className={`primary-button w-full flex items-center justify-center gap-2 ${
                !isWorldApp ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
              ) : (
                <>
                  <i className="fas fa-globe"></i>
                  <span>Verify with World ID</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex justify-between">
          <button onClick={onBack} className="secondary-button w-[48%]">
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!isVerified}
            className={`primary-button w-[48%] ${!isVerified ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

