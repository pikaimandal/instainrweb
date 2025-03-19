"use client"

import { useEffect } from "react"

interface VerificationCompleteProps {
  onComplete: () => void
  userData: {
    name: string
    worldId: string
  }
}

export default function VerificationComplete({ onComplete, userData }: VerificationCompleteProps) {
  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="p-5 max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-1 bg-border rounded mb-4 relative">
          <div className="h-1 bg-primary rounded absolute top-0 left-0" style={{ width: "100%" }}></div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">World ID</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">Personal</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">Selfie</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">Documents</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">Withdrawal</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">Complete</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col items-center">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-check-circle text-5xl text-success"></i>
        </div>

        <h2 className="text-xl font-semibold mb-2">Verification Complete!</h2>
        <p className="text-center text-text-secondary mb-6">
          Congratulations, {userData.name}! Your account has been successfully created and verified.
        </p>

        <div className="bg-[#F0F0F8] rounded-lg p-4 w-full mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-text-tertiary">World ID</span>
            <span className="font-medium">{userData.worldId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-tertiary">Status</span>
            <span className="text-success font-medium">Verified</span>
          </div>
        </div>

        <button onClick={onComplete} className="primary-button w-full">
          Continue to Dashboard
        </button>

        <p className="text-center text-sm text-text-tertiary mt-4">Redirecting to dashboard in 5 seconds...</p>
      </div>
    </div>
  )
}

