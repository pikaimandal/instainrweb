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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase
    setName(e.target.value.toUpperCase())
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits and limit to 10 characters
    const phoneRegex = /^\d{0,10}$/
    if (phoneRegex.test(value)) {
      setPhone(value)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
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

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
        
        <div className="mb-4">
          <label className="block text-gray-500 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full p-3 bg-white text-gray-900 border border-gray-200 rounded-lg"
            placeholder="YOUR FULL NAME"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-500 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white text-gray-900 border border-gray-200 rounded-lg"
            placeholder="email@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-500 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">+91</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full p-3 pl-12 bg-white text-gray-900 border border-gray-200 rounded-lg"
              placeholder="9988776655"
              maxLength={10}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
  )
}

