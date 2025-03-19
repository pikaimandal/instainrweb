"use client"

import { useState } from "react"
import Image from "next/image"

interface WithdrawalSetupProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: { withdrawalMethod: any }) => void
}

export default function WithdrawalSetup({ onNext, onBack, updateUserData }: WithdrawalSetupProps) {
  const [activeTab, setActiveTab] = useState<"bank" | "upi" | "wallet">("bank")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [accountHolderName, setAccountHolderName] = useState("")
  const [upiId, setUpiId] = useState("")
  const [selectedWallet, setSelectedWallet] = useState<"phonepe" | "paytm" | "gpay" | null>(null)
  const [mobileNumber, setMobileNumber] = useState("")
  const [isPrimary, setIsPrimary] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (activeTab === "bank") {
      if (!bankName.trim()) newErrors.bankName = "Bank name is required"
      if (!accountNumber.trim()) newErrors.accountNumber = "Account number is required"
      if (!ifscCode.trim()) newErrors.ifscCode = "IFSC code is required"
      if (!accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required"
    } else if (activeTab === "upi") {
      if (!upiId.trim()) newErrors.upiId = "UPI ID is required"
      else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
        newErrors.upiId = "Invalid UPI ID format"
      }
    } else if (activeTab === "wallet") {
      if (!selectedWallet) newErrors.selectedWallet = "Please select a wallet"
      if (!mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required"
      else if (!/^\d{10}$/.test(mobileNumber.replace(/\D/g, ""))) {
        newErrors.mobileNumber = "Mobile number must be 10 digits"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      let withdrawalMethod = null

      if (activeTab === "bank") {
        withdrawalMethod = {
          type: "bank",
          details: [
            { name: "Bank Name", value: bankName },
            { name: "Account Number", value: accountNumber },
            { name: "IFSC Code", value: ifscCode },
            { name: "Account Holder", value: accountHolderName },
          ],
          primary: isPrimary,
        }
      } else if (activeTab === "upi") {
        withdrawalMethod = {
          type: "upi",
          details: [{ name: "UPI ID", value: upiId }],
          primary: isPrimary,
        }
      } else if (activeTab === "wallet") {
        withdrawalMethod = {
          type: "wallet",
          details: [
            {
              name: selectedWallet === "phonepe" ? "PhonePe" : selectedWallet === "paytm" ? "Paytm" : "GPay",
              value: mobileNumber,
            },
          ],
          primary: isPrimary,
        }
      }

      updateUserData({ withdrawalMethod })
      onNext()
    }
  }

  return (
    <div className="p-5 max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-1 bg-border rounded mb-4 relative">
          <div className="h-1 bg-primary rounded absolute top-0 left-0" style={{ width: "83%" }}></div>
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
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mb-2">
              5
            </div>
            <div className="text-xs text-primary font-medium">Withdrawal</div>
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
        <h2 className="text-xl font-semibold mb-5">Withdrawal Method</h2>

        <div className="flex border border-border rounded-lg mb-5 overflow-hidden">
          <button
            className={`flex-1 py-3 text-center ${activeTab === "bank" ? "bg-primary text-white" : "bg-white"}`}
            onClick={() => setActiveTab("bank")}
          >
            Bank
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "upi" ? "bg-primary text-white" : "bg-white"}`}
            onClick={() => setActiveTab("upi")}
          >
            UPI
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "wallet" ? "bg-primary text-white" : "bg-white"}`}
            onClick={() => setActiveTab("wallet")}
          >
            Wallet
          </button>
        </div>

        <div className="mb-6">
          {activeTab === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                  className={`h-12 px-4 border ${errors.bankName ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
                />
                {errors.bankName && <p className="text-xs text-danger mt-1">{errors.bankName}</p>}
              </div>
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className={`h-12 px-4 border ${errors.accountNumber ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
                />
                {errors.accountNumber && <p className="text-xs text-danger mt-1">{errors.accountNumber}</p>}
              </div>
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="Enter IFSC code"
                  className={`h-12 px-4 border ${errors.ifscCode ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
                />
                {errors.ifscCode && <p className="text-xs text-danger mt-1">{errors.ifscCode}</p>}
              </div>
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">Account Holder Name</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Enter account holder name"
                  className={`h-12 px-4 border ${errors.accountHolderName ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
                />
                {errors.accountHolderName && <p className="text-xs text-danger mt-1">{errors.accountHolderName}</p>}
              </div>
            </div>
          )}

          {activeTab === "upi" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g., name@upi)"
                  className={`h-12 px-4 border ${errors.upiId ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
                />
                {errors.upiId && <p className="text-xs text-danger mt-1">{errors.upiId}</p>}
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">Select Wallet</label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`border ${selectedWallet === "phonepe" ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-primary`}
                    onClick={() => setSelectedWallet("phonepe")}
                  >
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="PhonePe"
                      width={40}
                      height={40}
                      className="mb-2"
                    />
                    <span className="text-sm">PhonePe</span>
                  </div>
                  <div
                    className={`border ${selectedWallet === "paytm" ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-primary`}
                    onClick={() => setSelectedWallet("paytm")}
                  >
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Paytm"
                      width={40}
                      height={40}
                      className="mb-2"
                    />
                    <span className="text-sm">Paytm</span>
                  </div>
                  <div
                    className={`border ${selectedWallet === "gpay" ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-primary`}
                    onClick={() => setSelectedWallet("gpay")}
                  >
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="GPay"
                      width={40}
                      height={40}
                      className="mb-2"
                    />
                    <span className="text-sm">GPay</span>
                  </div>
                </div>
                {errors.selectedWallet && <p className="text-xs text-danger mt-1">{errors.selectedWallet}</p>}
              </div>
              <div>
                <label className="text-sm text-text-tertiary mb-2 block">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter mobile number"
                  className={`h-12 px-4 border ${errors.mobileNumber ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
                />
                {errors.mobileNumber && <p className="text-xs text-danger mt-1">{errors.mobileNumber}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="set-primary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="set-primary" className="text-sm">
              Set as primary withdrawal method
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={onBack} className="secondary-button w-[48%]">
            Back
          </button>
          <button onClick={handleSubmit} className="primary-button w-[48%]">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

