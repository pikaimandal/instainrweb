"use client"

import { useState } from "react"
import Image from "next/image"

interface LoginScreenProps {
  onLogin: () => void
  onCreateAccount: () => void
}

export default function LoginScreen({ onLogin, onCreateAccount }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleWorldIDLogin = async () => {
    if (!window.MiniKit?.isInstalled()) {
      console.error('MiniKit is not installed')
      return
    }

    try {
      setIsLoading(true)
      
      // Get nonce from your backend
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

      // Verify the authentication with your backend
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
    } catch (error) {
      console.error('Login error:', error)
      // You might want to show an error notification here
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
        <button
          onClick={handleWorldIDLogin}
          disabled={isLoading}
          className="primary-button w-full flex items-center justify-center gap-3 mb-4"
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

