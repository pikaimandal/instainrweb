'use client'

import { ReactNode, useEffect, useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

declare global {
  interface Window {
    MiniKit: any
  }
}

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeMiniKit = () => {
      try {
        // Initialize MiniKit first
        const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID || 'app_a694eef5223a11d38b4f737fad00e561'
        MiniKit.install(appId)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error)
      }
    }

    initializeMiniKit()
  }, [])

  return <>{children}</>
} 