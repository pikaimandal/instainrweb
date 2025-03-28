'use client'

import { ReactNode, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

declare global {
  interface Window {
    MiniKit: any
  }
}

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Replace with your actual app ID from World ID Developer Portal
    const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID || 'app_a694eef5223a11d38b4f737fad00e561'
    window.MiniKit?.install(appId)
  }, [])

  return <>{children}</>
} 