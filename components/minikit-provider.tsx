'use client'

import { ReactNode, useEffect, useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

declare global {
  interface Window {
    MiniKit: any
  }
}

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isWorldApp, setIsWorldApp] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if we're in World App environment
    const checkWorldApp = () => {
      const isInstalled = MiniKit.isInstalled()
      setIsWorldApp(isInstalled)
      
      if (isInstalled) {
        const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID || 'app_a694eef5223a11d38b4f737fad00e561'
        window.MiniKit?.install(appId)
      }
    }

    checkWorldApp()
  }, [])

  return <>{children}</>
} 