"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import ConfirmationModal from "./confirmation-modal"

interface ConversionCardProps {
  balances: {
    coin: string
    value: number
  }[]
  onConversionComplete: () => void
}

export default function ConversionCard({ balances, onConversionComplete }: ConversionCardProps) {
  const [fromCurrency, setFromCurrency] = useState("WLD")
  const [amount, setAmount] = useState("")
  const [receiveAmount, setReceiveAmount] = useState("0.00")
  const [showModal, setShowModal] = useState(false)

  // Exchange rates (would come from API in real app)
  const rates = {
    WLD: 425.32,
    ETH: 185290.45,
    USDT: 83.25,
  }

  // Network fee
  const networkFee = 10

  useEffect(() => {
    updateEstimatedAmount()
  }, [amount, fromCurrency])

  const updateEstimatedAmount = () => {
    const amountValue = Number.parseFloat(amount) || 0
    const rate = rates[fromCurrency as keyof typeof rates]
    const estimated = amountValue * rate
    setReceiveAmount(estimated.toFixed(2))
  }

  const handleMaxClick = () => {
    const selectedBalance = balances.find((b) => b.coin === fromCurrency)
    if (selectedBalance) {
      setAmount(selectedBalance.value.toString())
    }
  }

  const handleConvertClick = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      // Show error notification
      return
    }
    setShowModal(true)
  }

  const handleConfirmConversion = () => {
    setShowModal(false)
    // Reset form
    setAmount("")
    setReceiveAmount("0.00")
    // Navigate to history screen
    onConversionComplete()
  }

  return (
    <>
      <div className="bg-card rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <h2 className="text-lg font-semibold mb-5">Convert to INR</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col relative">
            <label className="text-sm text-text-tertiary mb-2">From</label>
            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full appearance-none"
              >
                <option value="WLD">WLD</option>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none"></i>
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm text-text-tertiary mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="h-12 px-4 border border-border rounded-lg text-base text-text-primary bg-white w-full"
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-2 top-8 bg-primary-light text-white border-none rounded px-2 py-1 text-xs font-semibold cursor-pointer"
            >
              MAX
            </button>
          </div>

          <div className="flex justify-center items-center my-2 text-text-tertiary">
            <i className="fas fa-arrow-down"></i>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-text-tertiary mb-2">To</label>
            <div className="h-12 border border-border rounded-lg flex items-center px-4 bg-[#F0F0F8]">
              <Image src="/images/inricon.png" alt="INR" width={24} height={24} className="mr-3" />
              <span>INR</span>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-text-tertiary mb-2">You will receive (estimated)</label>
            <div className="h-12 border border-border rounded-lg flex items-center px-4 text-lg font-semibold text-text-primary">
              ₹ {receiveAmount}
            </div>
          </div>

          <div className="bg-[#F0F0F8] rounded-lg p-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text-tertiary">Exchange Rate</span>
              <span className="font-medium">
                1 {fromCurrency} = ₹ {rates[fromCurrency as keyof typeof rates].toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text-tertiary">Network Fee</span>
              <span className="font-medium">₹ {networkFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Processing Time</span>
              <span className="font-medium">~60 minutes</span>
            </div>
          </div>

          <button onClick={handleConvertClick} className="primary-button">
            Convert Now
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmConversion}
        fromCurrency={fromCurrency}
        amount={Number.parseFloat(amount) || 0}
        rate={rates[fromCurrency as keyof typeof rates]}
        networkFee={networkFee}
      />
    </>
  )
}

