"use client"

import { useState } from "react"
import WorldIDAuth from "./world-id-auth"
import PersonalInfoForm from "./personal-info-form"
import SelfieVerification from "./selfie-verification"
import DocumentUpload from "./document-upload"
import WithdrawalSetup from "./withdrawal-setup"
import VerificationComplete from "./verification-complete"

interface OnboardingFlowProps {
  onComplete: () => void
  onCancel: () => void
}

export default function OnboardingFlow({ onComplete, onCancel }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    worldId: "",
    name: "",
    email: "",
    phone: "",
    selfieImage: null as string | null,
    aadhaarFront: null as string | null,
    aadhaarBack: null as string | null,
    panCard: null as string | null,
    withdrawalMethod: null as any,
  })

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (currentStep === 1) {
      onCancel()
    } else {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WorldIDAuth onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} />
      case 2:
        return (
          <PersonalInfoForm
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 3:
        return <SelfieVerification onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} />
      case 4:
        return <DocumentUpload onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} />
      case 5:
        return <WithdrawalSetup onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} />
      case 6:
        return <VerificationComplete onComplete={handleComplete} userData={userData} />
      default:
        return null
    }
  }

  return <div className="min-h-screen bg-background">{renderStep()}</div>
}

