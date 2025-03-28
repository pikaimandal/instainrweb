"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LoginScreenProps {
  onLogin: () => void
  onCreateAccount: () => void
}

export default function LoginScreen({ onLogin, onCreateAccount }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorldApp, setIsWorldApp] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if we're in World App on component mount
    const isInstalled = window.MiniKit?.isInstalled()
    setIsWorldApp(isInstalled)
  }, [])

  const handleWorldIDLogin = async () => {
    setError(null)
    
    if (!window.MiniKit?.isInstalled()) {
      setError('Please open this app in World App to continue')
      return
    }

    try {
      setIsLoading(true)
      
      const res = await fetch('/api/nonce')
      const { nonce } = await res.json()

      const { commandPayload, finalPayload } = await window.MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Sign in to InstaINR with World ID',
      })

      if (finalPayload.status === 'error') {
        throw new Error('Authentication failed')
      }

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
        onLogin()
      } else {
        throw new Error('Verification failed')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to authenticate')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <div className="w-[120px] h-[120px] bg-white rounded-[24px] flex justify-center items-center mb-5 shadow-lg">
        <Image src="/images/Instainrlogosplash.png" alt="InstaINR Logo" width={100} height={100} />
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center">Welcome to InstaINR</h1>
      <p className="text-base text-text-secondary mb-10 text-center">Convert your crypto to INR instantly</p>

      <div className="w-full max-w-sm">
        {!isWorldApp && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            ⚠️ This app requires World App to function. Please open it in World App.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          onClick={handleWorldIDLogin}
          disabled={isLoading || !isWorldApp}
          className={`primary-button w-full flex items-center justify-center gap-3 mb-4 ${
            !isWorldApp ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
          ) : (
            <>
              <Image src="/images/worldid-logo.png" alt="World ID" width={24} height={24} />
              <span>Continue with World ID</span>
            </>
          )}
        </button>

        <button onClick={onCreateAccount} className="secondary-button w-full">
          Create New Account
        </button>

        <div className="mt-8 text-center text-sm text-text-tertiary">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}

