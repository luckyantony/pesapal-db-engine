"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getItems, getCustomers, addSale, updateItem, type Item, type Customer } from "@/lib/supabase-storage"
import { Calendar } from "lucide-react"

interface SalesFormProps {
  onSaleAdded: () => void
}

const SalesForm = ({ onSaleAdded }: SalesFormProps) => {
  const [items, setItems] = useState<Item[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedItemId, setSelectedItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "M-Pesa" | "Card" | "Other">("Cash")
  const [notes, setNotes] = useState("")
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, customersData] = await Promise.all([getItems(), getCustomers()])
        setItems(itemsData)
        setCustomers(customersData)
      } catch (err) {
        console.error("Error loading data:", err)
      }
    }

    loadData()
  }, [])

  const selectedItem = items.find((i) => i.id === selectedItemId)
  const totalAmount = selectedItem && quantity ? Number.parseInt(quantity) * selectedItem.unit_price : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!selectedItemId || !quantity) {
      setError("Please select an item and enter quantity")
      return
    }

    const qty = Number.parseInt(quantity)
    if (!selectedItem || qty <= 0) {
      setError("Invalid quantity")
      return
    }

    if (selectedItem.stock_level < qty) {
      setError(`Not enough stock. Available: ${selectedItem.stock_level}`)
      return
    }

    setIsLoading(true)
    try {
      const saleDateTime = new Date(saleDate).toISOString()

      await addSale({
        item_id: selectedItemId,
        item_name: selectedItem.name,
        quantity: qty,
        total_amount: totalAmount,
        customer_id: selectedCustomerId || undefined,
        customer_name: customers.find((c) => c.id === selectedCustomerId)?.name,
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
        date: saleDateTime,
      })

      // Update stock
      await updateItem(selectedItemId, {
        stock_level: selectedItem.stock_level - qty,
      })

      setSuccess(`Sale recorded! Stock updated.`)
      setSelectedItemId("")
      setQuantity("")
      setSelectedCustomerId("")
      setNotes("")
      setPaymentMethod("Cash")
      setSaleDate(new Date().toISOString().split("T")[0])

      // Refresh items
      const updatedItems = await getItems()
      setItems(updatedItems)
      onSaleAdded()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 h-fit sticky top-24">
      <h3 className="text-lg font-bold mb-4">Record Sale</h3>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sale Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="input-field w-full pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Item *</label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="input-field w-full"
            disabled={isLoading}
          >
            <option value="">Choose an item...</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (Stock: {item.stock_level})
              </option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <div className="p-3 bg-card/50 rounded-lg border border-border/50">
            <p className="text-sm text-foreground/70">
              Price: <span className="font-medium">KSh {selectedItem.unit_price.toFixed(2)}</span>
            </p>
            <p className="text-sm text-foreground/70">
              Stock: <span className="font-medium">{selectedItem.stock_level}</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Quantity *</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field w-full"
            placeholder="0"
            min="1"
            disabled={isLoading}
          />
        </div>

        {selectedItem && quantity && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
            <p className="text-sm text-foreground">
              Total: <span className="font-bold text-primary">KSh {totalAmount.toLocaleString()}</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="input-field w-full"
            disabled={isLoading}
          >
            <option>Cash</option>
            <option>M-Pesa</option>
            <option>Card</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer (Optional)</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="input-field w-full"
            disabled={isLoading}
          >
            <option value="">Walk-in customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field w-full"
            placeholder="Add any notes..."
            rows={2}
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Recording..." : "Record Sale"}
        </button>
      </form>
    </div>
  )
}

export default SalesForm
