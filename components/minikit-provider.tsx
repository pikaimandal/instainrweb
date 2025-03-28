'use client'

import { ReactNode, useEffect } from 'react'

declare global {
  interface Window {
    MiniKit: any
  }
}

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Replace with your actual app ID from World ID Developer Portal
    window.MiniKit?.install('app_a694eef5223a11d38b4f737fad00e561')
  }, [])

  return <>{children}</>
} 