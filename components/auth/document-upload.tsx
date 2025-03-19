"use client"

import type React from "react"

import { useState, useRef } from "react"

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
  const [activeCamera, setActiveCamera] = useState<"aadhaarFront" | "aadhaarBack" | "panCard" | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "aadhaarFront" | "aadhaarBack" | "panCard",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit")
        return
      }

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
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async (type: "aadhaarFront" | "aadhaarBack" | "panCard") => {
    try {
      if (streamRef.current) {
        stopCamera()
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setActiveCamera(type)
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
    setActiveCamera(null)
  }

  const captureImage = () => {
    if (!activeCamera || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = canvas.toDataURL("image/png")

      switch (activeCamera) {
        case "aadhaarFront":
          setAadhaarFront(imageData)
          break
        case "aadhaarBack":
          setAadhaarBack(imageData)
          break
        case "panCard":
          setPanCard(imageData)
          break
      }

      const currentActiveCamera = activeCamera;
      setTimeout(() => {
        updateUserData({
          aadhaarFront: currentActiveCamera === "aadhaarFront" ? imageData : aadhaarFront,
          aadhaarBack: currentActiveCamera === "aadhaarBack" ? imageData : aadhaarBack,
          panCard: currentActiveCamera === "panCard" ? imageData : panCard,
        });
      }, 0);

      stopCamera()
    }
  }

  const isComplete = aadhaarFront && aadhaarBack && panCard

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
            <div className="text-xs text-primary font-medium">Documents</div>
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
            <div className="text-xs text-text-tertiary">Complete</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h2 className="text-xl font-semibold mb-5">Document Verification</h2>

        {activeCamera && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-5">
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="text-lg font-medium">
                Capture{" "}
                {activeCamera === "aadhaarFront"
                  ? "Aadhaar Front"
                  : activeCamera === "aadhaarBack"
                    ? "Aadhaar Back"
                    : "PAN Card"}
              </h3>
              <button onClick={stopCamera} className="text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 relative bg-black rounded-lg overflow-hidden mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain"></video>

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <i className="fas fa-exclamation-triangle text-4xl mb-3 text-danger"></i>
                  <p className="text-center">{cameraError}</p>
                </div>
              )}
            </div>

            <button onClick={captureImage} className="primary-button">
              <i className="fas fa-camera mr-2"></i>
              Capture
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden"></canvas>

        <div className="space-y-5 mb-6">
          <div>
            <label className="text-sm text-text-tertiary mb-2 block">Aadhaar Card (Front)</label>
            {aadhaarFront ? (
              <div className="relative">
                <img
                  src={aadhaarFront || "/placeholder.svg"}
                  alt="Aadhaar Front"
                  className="w-full h-40 object-cover rounded-lg border border-border"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => startCamera("aadhaarFront")}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <i className="fas fa-camera text-primary"></i>
                  </button>
                  <button
                    onClick={() => {
                      setAadhaarFront(null)
                      updateUserData({
                        aadhaarFront: null,
                        aadhaarBack,
                        panCard,
                      })
                    }}
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
                  onClick={() => document.getElementById("upload-aadhaar-front")?.click()}
                >
                  <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                    <i className="fas fa-upload"></i>
                  </div>
                  <div className="text-sm">Upload</div>
                  <input
                    type="file"
                    id="upload-aadhaar-front"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "aadhaarFront")}
                  />
                </div>

                <div
                  className="flex-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
                  onClick={() => startCamera("aadhaarFront")}
                >
                  <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div className="text-sm">Camera</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-text-tertiary mb-2 block">Aadhaar Card (Back)</label>
            {aadhaarBack ? (
              <div className="relative">
                <img
                  src={aadhaarBack || "/placeholder.svg"}
                  alt="Aadhaar Back"
                  className="w-full h-40 object-cover rounded-lg border border-border"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => startCamera("aadhaarBack")}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <i className="fas fa-camera text-primary"></i>
                  </button>
                  <button
                    onClick={() => {
                      setAadhaarBack(null)
                      updateUserData({
                        aadhaarFront,
                        aadhaarBack: null,
                        panCard,
                      })
                    }}
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
                  onClick={() => document.getElementById("upload-aadhaar-back")?.click()}
                >
                  <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                    <i className="fas fa-upload"></i>
                  </div>
                  <div className="text-sm">Upload</div>
                  <input
                    type="file"
                    id="upload-aadhaar-back"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "aadhaarBack")}
                  />
                </div>

                <div
                  className="flex-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
                  onClick={() => startCamera("aadhaarBack")}
                >
                  <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div className="text-sm">Camera</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-text-tertiary mb-2 block">PAN Card</label>
            {panCard ? (
              <div className="relative">
                <img
                  src={panCard || "/placeholder.svg"}
                  alt="PAN Card"
                  className="w-full h-40 object-cover rounded-lg border border-border"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => startCamera("panCard")}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <i className="fas fa-camera text-primary"></i>
                  </button>
                  <button
                    onClick={() => {
                      setPanCard(null)
                      updateUserData({
                        aadhaarFront,
                        aadhaarBack,
                        panCard: null,
                      })
                    }}
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
                  onClick={() => document.getElementById("upload-pan")?.click()}
                >
                  <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                    <i className="fas fa-upload"></i>
                  </div>
                  <div className="text-sm">Upload</div>
                  <input
                    type="file"
                    id="upload-pan"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "panCard")}
                  />
                </div>

                <div
                  className="flex-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
                  onClick={() => startCamera("panCard")}
                >
                  <div className="w-10 h-10 bg-[#F0F0F8] rounded-full flex items-center justify-center mb-2 text-primary">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div className="text-sm">Camera</div>
                </div>
              </div>
            )}
          </div>
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

