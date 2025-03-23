"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface DocumentUploadProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: {
    aadhaarFront: string | null
    aadhaarBack: string | null
    panCard: string | null
  }) => void
}

export default function DocumentUpload({ onNext, onBack, updateUserData }: DocumentUploadProps) {
  const [aadhaarFront, setAadhaarFront] = useState<string | null>(null)
  const [aadhaarBack, setAadhaarBack] = useState<string | null>(null)
  const [panCard, setPanCard] = useState<string | null>(null)
  const [activeCameraType, setActiveCameraType] = useState<"aadhaarFront" | "aadhaarBack" | "panCard" | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<"aadhaarFront" | "aadhaarBack" | "panCard" | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRefs = {
    aadhaarFront: useRef<HTMLInputElement>(null),
    aadhaarBack: useRef<HTMLInputElement>(null),
    panCard: useRef<HTMLInputElement>(null),
  }
  const captureInputRefs = {
    aadhaarFront: useRef<HTMLInputElement>(null),
    aadhaarBack: useRef<HTMLInputElement>(null),
    panCard: useRef<HTMLInputElement>(null),
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "aadhaarFront" | "aadhaarBack" | "panCard",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit")
        return
      }

      setIsUploading(type)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string

        switch (type) {
          case "aadhaarFront":
            setAadhaarFront(result)
            break
          case "aadhaarBack":
            setAadhaarBack(result)
            break
          case "panCard":
            setPanCard(result)
            break
        }

        updateUserData({
          aadhaarFront: type === "aadhaarFront" ? result : aadhaarFront,
          aadhaarBack: type === "aadhaarBack" ? result : aadhaarBack,
          panCard: type === "panCard" ? result : panCard,
        })
        
        setIsUploading(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCaptureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "aadhaarFront" | "aadhaarBack" | "panCard",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit")
        return
      }

      setIsUploading(type)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string

        switch (type) {
          case "aadhaarFront":
            setAadhaarFront(result)
            break
          case "aadhaarBack":
            setAadhaarBack(result)
            break
          case "panCard":
            setPanCard(result)
            break
        }

        updateUserData({
          aadhaarFront: type === "aadhaarFront" ? result : aadhaarFront,
          aadhaarBack: type === "aadhaarBack" ? result : aadhaarBack,
          panCard: type === "panCard" ? result : panCard,
        })
        
        setIsUploading(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const openFilePicker = (type: "aadhaarFront" | "aadhaarBack" | "panCard") => {
    if (fileInputRefs[type].current) {
      fileInputRefs[type].current.click()
    }
  }

  const openCamera = (type: "aadhaarFront" | "aadhaarBack" | "panCard") => {
    if (captureInputRefs[type].current) {
      captureInputRefs[type].current.click()
    }
  }

  const retakePhoto = (type: "aadhaarFront" | "aadhaarBack" | "panCard") => {
    switch (type) {
      case "aadhaarFront":
        setAadhaarFront(null)
        break
      case "aadhaarBack":
        setAadhaarBack(null)
        break
      case "panCard":
        setPanCard(null)
        break
    }

    updateUserData({
      aadhaarFront: type === "aadhaarFront" ? null : aadhaarFront,
      aadhaarBack: type === "aadhaarBack" ? null : aadhaarBack,
      panCard: type === "panCard" ? null : panCard,
    })

    // Open the camera again for retaking
    openCamera(type)
  }

  const isComplete = aadhaarFront && aadhaarBack && panCard

  const getDocumentLabel = (type: "aadhaarFront" | "aadhaarBack" | "panCard") => {
    switch (type) {
      case "aadhaarFront":
        return "Aadhaar Card (Front)"
      case "aadhaarBack":
        return "Aadhaar Card (Back)"
      case "panCard":
        return "PAN Card"
    }
  }

  const renderDocumentSection = (type: "aadhaarFront" | "aadhaarBack" | "panCard") => {
    const documentImage = type === "aadhaarFront" ? aadhaarFront : type === "aadhaarBack" ? aadhaarBack : panCard
    const isUploadingThisDoc = isUploading === type

    return (
      <div>
        <label className="text-sm text-text-tertiary mb-2 block">{getDocumentLabel(type)}</label>
        
        {isUploadingThisDoc ? (
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-primary/30 rounded-full border-t-primary animate-spin mb-2"></div>
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          </div>
        ) : documentImage ? (
          <div className="relative">
            <img
              src={documentImage}
              alt={getDocumentLabel(type)}
              className="w-full h-40 object-cover rounded-lg border border-border"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => openCamera(type)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <i className="fas fa-camera text-primary"></i>
              </button>
              <button
                onClick={() => retakePhoto(type)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <i className="fas fa-trash text-danger"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <div
              className="flex-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
              onClick={() => openFilePicker(type)}
            >
              <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                <i className="fas fa-upload"></i>
              </div>
              <div className="text-sm">Upload</div>
              <input
                type="file"
                ref={fileInputRefs[type]}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, type)}
              />
            </div>

            <div
              className="flex-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
              onClick={() => openCamera(type)}
            >
              <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                <i className="fas fa-camera"></i>
              </div>
              <div className="text-sm">Camera</div>
              <input
                type="file"
                ref={captureInputRefs[type]}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleCaptureChange(e, type)}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-5 max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-1 bg-border rounded mb-4 relative">
          <div className="h-1 bg-primary rounded absolute top-0 left-0" style={{ width: "66.4%" }}></div>
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
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mb-2">
              4
            </div>
            <div className="text-xs text-primary font-medium">KYC</div>
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
        <h2 className="text-xl font-semibold mb-5">KYC Documents</h2>

        <div className="bg-[#F0F0F8] rounded-lg p-4 mb-5 text-sm text-text-secondary">
          <p>
            Please upload clear photos of your documents. Each file should not exceed 10MB.
          </p>
        </div>

        <div className="space-y-5 mb-6">
          {renderDocumentSection("aadhaarFront")}
          {renderDocumentSection("aadhaarBack")}
          {renderDocumentSection("panCard")}
        </div>

        <div className="flex justify-between">
          <button onClick={onBack} className="secondary-button w-[48%]">
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`primary-button w-[48%] ${!isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

