"use client"

import { useState } from "react"
import Image from "next/image"
import WithdrawalMethodModal from "./withdrawal-method-modal"

interface ProfileScreenProps {
  user: {
    name: string
    worldId: string
    email: string
    phone: string
  }
  withdrawalMethods: {
    type: "bank" | "upi" | "wallet"
    details: {
      name: string
      value: string
      icon?: string
    }[]
    primary: boolean
  }[]
  documents: {
    type: string
    number: string
    verified: boolean
  }[]
  onLogout: () => void
}

export default function ProfileScreen({ user, withdrawalMethods, documents, onLogout }: ProfileScreenProps) {
  const [copied, setCopied] = useState(false)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)

  const copyWorldId = () => {
    navigator.clipboard.writeText(user.worldId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const primaryMethod = withdrawalMethods.find((method) => method.primary) || withdrawalMethods[0]

  return (
    <div>
      <div className="flex flex-col items-center py-5 border-b border-border mb-5">
        <Image src="/images/user.jpeg" alt="Profile" width={80} height={80} className="rounded-full mb-4" />
        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
        <div className="flex items-center bg-[#F0F0F8] px-3 py-2 rounded-lg text-sm">
          <span>WorldID: </span>
          <span className="mx-2 font-medium">{user.worldId}</span>
          <button
            onClick={copyWorldId}
            className="bg-transparent border-none text-primary cursor-pointer flex items-center justify-center p-1"
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
        {copied && <div className="text-xs text-success mt-2">Copied to clipboard!</div>}
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold mb-4">Account Details</h3>
        <div className="flex justify-between py-3 border-b border-border">
          <div className="text-text-tertiary">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>
        <div className="flex justify-between py-3">
          <div className="text-text-tertiary">Phone</div>
          <div className="font-medium">{user.phone}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold mb-4">Withdrawal Method</h3>
        {primaryMethod && (
          <div className="flex items-center bg-white rounded-xl p-4 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="mr-4">
              {primaryMethod.type === "bank" ? (
                <Image src="/images/bank.jpg" alt="Bank Logo" width={40} height={40} className="rounded-lg" />
              ) : primaryMethod.type === "upi" ? (
                <div className="w-10 h-10 bg-[#6A4DE3] rounded-lg flex items-center justify-center text-white">
                  <i className="fas fa-qrcode"></i>
                </div>
              ) : (
                <div className="w-10 h-10 bg-[#00B8A9] rounded-lg flex items-center justify-center text-white">
                  <i className="fas fa-wallet"></i>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-1">
                {primaryMethod.type === "bank"
                  ? "Bank Account"
                  : primaryMethod.type === "upi"
                    ? "UPI ID"
                    : primaryMethod.details[0].name}
              </div>
              {primaryMethod.details.map((detail, idx) => (
                <div key={idx} className="text-sm text-text-secondary">
                  {detail.value}
                </div>
              ))}
            </div>
            <div>
              <button
                onClick={() => setShowWithdrawalModal(true)}
                className="w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center text-text-tertiary cursor-pointer"
              >
                <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
        )}
        <button onClick={() => setShowWithdrawalModal(true)} className="secondary-button w-full">
          {withdrawalMethods.length > 0 ? "Manage Withdrawal Methods" : "Add Withdrawal Method"}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold mb-4">KYC Documents</h3>
        <div className="flex items-center bg-success/10 text-success rounded-lg p-3 mb-4">
          <i className="fas fa-check-circle mr-2"></i>
          <span>Verification Complete</span>
        </div>

        <div className="flex flex-col gap-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="w-10 h-10 bg-[#F0F0F8] rounded-lg flex items-center justify-center mr-3 text-text-tertiary">
                <i className={`fas ${doc.type === "Aadhaar Card" ? "fa-id-card" : "fa-file-alt"}`}></i>
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">{doc.type}</div>
                <div className="text-sm text-text-secondary">{doc.number}</div>
              </div>
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white">
                <i className="fas fa-check"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button onClick={onLogout} className="danger-button w-full max-w-[200px]">
          Log Out
        </button>
      </div>

      {showWithdrawalModal && (
        <WithdrawalMethodModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          withdrawalMethods={withdrawalMethods}
        />
      )}
    </div>
  )
}

