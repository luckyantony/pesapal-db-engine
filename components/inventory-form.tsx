"use client"

import type React from "react"
import { useState } from "react"
import { addItem } from "@/lib/supabase-storage"

interface InventoryFormProps {
  onItemAdded: () => void
}

const InventoryForm = ({ onItemAdded }: InventoryFormProps) => {
  const [name, setName] = useState("")
  const [stock, setStock] = useState("")
  const [price, setPrice] = useState("")
  const [threshold, setThreshold] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !stock || !price || !threshold) {
      setError("All fields are required")
      return
    }

    setIsLoading(true)
    try {
      await addItem({
        name: name.trim(),
        stock_level: Number.parseInt(stock),
        unit_price: Number.parseFloat(price),
        low_threshold: Number.parseInt(threshold),
      })

      setName("")
      setStock("")
      setPrice("")
      setThreshold("")
      onItemAdded()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 h-fit sticky top-24">
      <h3 className="text-lg font-bold mb-4">Add New Item</h3>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="e.g., Nitrogen Fertilizer"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Current Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input-field w-full"
            placeholder="0"
            min="0"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unit Price (KSh)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field w-full"
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="input-field w-full"
            placeholder="10"
            min="0"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  )
}

export default InventoryForm
