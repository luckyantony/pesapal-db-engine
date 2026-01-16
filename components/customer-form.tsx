"use client"

import type React from "react"
import { useState } from "react"
import { addCustomer } from "@/lib/supabase-storage"

interface CustomerFormProps {
  onCustomerAdded: () => void
}

const CustomerForm = ({ onCustomerAdded }: CustomerFormProps) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Customer name is required")
      return
    }

    setIsLoading(true)
    try {
      await addCustomer({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      })

      setName("")
      setPhone("")
      setEmail("")
      onCustomerAdded()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 h-fit sticky top-24">
      <h3 className="text-lg font-bold mb-4">Add Customer</h3>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="e.g., John Kipchoge"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field w-full"
            placeholder="+254 712 345 678"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full"
            placeholder="john@example.com"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Customer"}
        </button>
      </form>

      <p className="text-xs text-foreground/50 mt-4">* Required field</p>
    </div>
  )
}

export default CustomerForm
