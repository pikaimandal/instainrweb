"use client"

import { useState } from "react"

interface PersonalInfoFormProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (
    data: Partial<{
      name: string
      email: string
      phone: string
    }>,
  ) => void
  userData: {
    name: string
    email: string
    phone: string
  }
}

export default function PersonalInfoForm({ onNext, onBack, updateUserData, userData }: PersonalInfoFormProps) {
  const [name, setName] = useState(userData.name || "")
  const [email, setEmail] = useState(userData.email || "")
  const [phone, setPhone] = useState(userData.phone || "")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    phone?: string
  }>({})

  const validate = () => {
    const newErrors: {
      name?: string
      email?: string
      phone?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      updateUserData({ name, email, phone })
      onNext()
    }
  }

  return (
    <div className="p-5 max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-1 bg-border rounded mb-4 relative">
          <div className="h-1 bg-primary rounded absolute top-0 left-0" style={{ width: "33.2%" }}></div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs mb-2">
              <i className="fas fa-check"></i>
            </div>
            <div className="text-xs text-success font-medium">World ID</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mb-2">
              2
            </div>
            <div className="text-xs text-primary font-medium">Personal</div>
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
            <div className="text-xs text-text-tertiary">Documents</div>
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
        <h2 className="text-xl font-semibold mb-5">Personal Information</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-text-tertiary mb-2 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={`h-12 px-4 border ${errors.name ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
            />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm text-text-tertiary mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`h-12 px-4 border ${errors.email ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm text-text-tertiary mb-2 block">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={`h-12 px-4 border ${errors.phone ? "border-danger" : "border-border"} rounded-lg text-base text-text-primary bg-white w-full`}
            />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
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

