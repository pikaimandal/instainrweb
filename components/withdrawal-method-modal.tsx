"use client"

import { useState } from "react"
import Image from "next/image"

interface WithdrawalMethod {
  type: "bank" | "upi" | "wallet"
  details: {
    name: string
    value: string
    icon?: string
  }[]
  primary: boolean
}

interface WithdrawalMethodModalProps {
  isOpen: boolean
  onClose: () => void
  withdrawalMethods: WithdrawalMethod[]
}

export default function WithdrawalMethodModal({ isOpen, onClose, withdrawalMethods }: WithdrawalMethodModalProps) {
  const [activeTab, setActiveTab] = useState<"bank" | "upi" | "wallet">("bank")
  const [showAddForm, setShowAddForm] = useState(false)

  if (!isOpen) return null

  const handleAddNew = () => {
    setShowAddForm(true)
  }

  const handleBack = () => {
    setShowAddForm(false)
  }

  const renderMethodIcon = (type: "bank" | "upi" | "wallet", icon?: string) => {
    if (type === "bank") {
      return <Image src="/images/bank.jpg" alt="Bank" width={40} height={40} className="rounded-lg" />
    } else if (type === "upi") {
      return (
        <div className="w-10 h-10 bg-[#6A4DE3] rounded-lg flex items-center justify-center text-white">
          <i className="fas fa-qrcode"></i>
        </div>
      )
    } else {
      return (
        <div className="w-10 h-10 bg-[#00B8A9] rounded-lg flex items-center justify-center text-white">
          <i className="fas fa-wallet"></i>
        </div>
      )
    }
  }

  const renderAddForm = () => {
    return (
      <div className="animate-modalFadeIn">
        <div className="flex items-center mb-5">
          <button onClick={handleBack} className="bg-transparent border-none mr-3">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h3 className="text-lg font-semibold">
            Add {activeTab === "bank" ? "Bank Account" : activeTab === "upi" ? "UPI ID" : "Wallet"}
          </h3>
        </div>

        {activeTab === "bank" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Bank Name</label>
              <input
                type="text"
                placeholder="Enter bank name"
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
              />
            </div>
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Account Number</label>
              <input
                type="text"
                placeholder="Enter account number"
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
              />
            </div>
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">IFSC Code</label>
              <input
                type="text"
                placeholder="Enter IFSC code"
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
              />
            </div>
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Account Holder Name</label>
              <input
                type="text"
                placeholder="Enter account holder name"
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
              />
            </div>
          </div>
        )}

        {activeTab === "upi" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">UPI ID</label>
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., name@upi)"
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
              />
            </div>
            <div className="flex items-center mt-4">
              <input type="checkbox" id="verify-upi" className="mr-2" />
              <label htmlFor="verify-upi" className="text-sm">
                I confirm this UPI ID belongs to me
              </label>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-primary">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="PhonePe"
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-sm">PhonePe</span>
              </div>
              <div className="border border-border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-primary">
                <Image src="/placeholder.svg?height=40&width=40" alt="Paytm" width={40} height={40} className="mb-2" />
                <span className="text-sm">Paytm</span>
              </div>
              <div className="border border-border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-primary">
                <Image src="/placeholder.svg?height=40&width=40" alt="GPay" width={40} height={40} className="mb-2" />
                <span className="text-sm">GPay</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-text-tertiary mb-2 block">Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
              />
            </div>
          </div>
        )}

        <div className="flex items-center mt-4">
          <input type="checkbox" id="set-primary" className="mr-2" />
          <label htmlFor="set-primary" className="text-sm">
            Set as primary withdrawal method
          </label>
        </div>

        <button className="primary-button w-full mt-6">Save</button>
      </div>
    )
  }

  const renderMethodsList = () => {
    const filteredMethods = withdrawalMethods.filter((method) => method.type === activeTab)

    return (
      <div className="animate-modalFadeIn">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold">Withdrawal Methods</h3>
          <button onClick={onClose} className="bg-transparent border-none text-text-tertiary text-lg cursor-pointer">
            <i className="fas fa-times"></i>
          </button>
        </div>

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

        <div className="space-y-3 mb-5">
          {filteredMethods.length > 0 ? (
            filteredMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              >
                <div className="mr-4">{renderMethodIcon(method.type)}</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    {method.type === "bank"
                      ? "Bank Account"
                      : method.type === "upi"
                        ? "UPI ID"
                        : method.details[0].name}
                    {method.primary && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Primary</span>
                    )}
                  </div>
                  {method.details.map((detail, idx) => (
                    <div key={idx} className="text-sm text-text-secondary">
                      {detail.value}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {!method.primary && (
                    <button className="w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center text-primary cursor-pointer">
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button className="w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center text-danger cursor-pointer">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-tertiary">
              No {activeTab === "bank" ? "bank accounts" : activeTab === "upi" ? "UPI IDs" : "wallets"} added yet
            </div>
          )}
        </div>

        <button onClick={handleAddNew} className="primary-button w-full">
          Add {activeTab === "bank" ? "Bank Account" : activeTab === "upi" ? "UPI ID" : "Wallet"}
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (!showAddForm) onClose()
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto p-5">
        {showAddForm ? renderAddForm() : renderMethodsList()}
      </div>
    </div>
  )
}

