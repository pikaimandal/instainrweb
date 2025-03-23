"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface WorldIDAuthProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: { worldId: string }) => void
}

export default function WorldIDAuth({ onNext, onBack, updateUserData }: WorldIDAuthProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleVerify = () => {
    setIsVerifying(true)

    // Simulate World ID verification process
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsVerified(true)
          setTimeout(() => {
            updateUserData({ worldId: "0x71C...8F3E" })
          }, 0)
          return 100
        }
        return newProgress
      })
    }, 300)
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

          {isVerifying && !isVerified && (
            <div className="w-full mb-4">
              <div className="h-2 bg-[#F0F0F8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-text-tertiary mt-2">Verifying your World ID...</p>
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
              disabled={isVerifying}
              className="primary-button w-full flex items-center justify-center gap-2"
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

