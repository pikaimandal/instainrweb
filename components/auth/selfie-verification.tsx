"use client"

import { useState, useRef, useEffect } from "react"

interface SelfieVerificationProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: { selfieImage: string | null }) => void
}

export default function SelfieVerification({ onNext, onBack, updateUserData }: SelfieVerificationProps) {
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
        setCameraError(null)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Unable to access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/png")
        setCapturedImage(imageData)
        
        setTimeout(() => {
          updateUserData({ selfieImage: imageData })
        }, 0)
        
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    
    setTimeout(() => {
      updateUserData({ selfieImage: null })
    }, 0)
    
    startCamera()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="p-5 max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-1 bg-border rounded mb-4 relative">
          <div className="h-1 bg-primary rounded absolute top-0 left-0" style={{ width: "49.8%" }}></div>
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
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mb-2">
              3
            </div>
            <div className="text-xs text-primary font-medium">Selfie</div>
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
        <h2 className="text-xl font-semibold mb-5">Selfie Verification</h2>

        <div className="mb-6">
          <div className="bg-[#F0F0F8] rounded-lg p-4 mb-5 text-sm text-text-secondary">
            <p>
              Please take a clear selfie in good lighting. Make sure your face is clearly visible and centered in the
              frame.
            </p>
          </div>

          <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden mb-4">
            {capturedImage ? (
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured selfie"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
                ></video>

                {!cameraActive && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <i className="fas fa-camera text-4xl mb-3"></i>
                    <p className="text-center">Click the button below to start camera</p>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <i className="fas fa-exclamation-triangle text-4xl mb-3 text-danger"></i>
                    <p className="text-center">{cameraError}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden"></canvas>

          {capturedImage ? (
            <button onClick={retakePhoto} className="secondary-button w-full mb-4">
              <i className="fas fa-redo mr-2"></i>
              Retake Photo
            </button>
          ) : (
            <>
              {cameraActive ? (
                <button onClick={captureImage} className="primary-button w-full mb-4">
                  <i className="fas fa-camera mr-2"></i>
                  Capture Photo
                </button>
              ) : (
                <button onClick={startCamera} className="primary-button w-full mb-4">
                  <i className="fas fa-camera mr-2"></i>
                  Start Camera
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between">
          <button onClick={onBack} className="secondary-button w-[48%]">
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!capturedImage}
            className={`primary-button w-[48%] ${!capturedImage ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

