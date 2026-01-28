"use client"

import { useState } from "react"
import { updateItem, deleteItem, type Item } from "@/lib/supabase-storage"

interface InventoryTableProps {
  items: Item[]
  onUpdate: () => void
}

const InventoryTable = ({ items, onUpdate }: InventoryTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (item: Item) => {
    setEditingId(item.id)
    setEditStock(item.stock_level.toString())
    setEditPrice(item.unit_price.toString())
  }
  

  const handleSave = async (id: string) => {
    setIsLoading(true)
    try {
      await updateItem(id, {
        stock_level: Number.parseInt(editStock),
        unit_price: Number.parseFloat(editPrice),
      })
      setEditingId(null)
      onUpdate()
    } catch (err) {
      console.error("Error updating item:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setIsLoading(true)
      try {
        await deleteItem(id)
        onUpdate()
      } catch (err) {
        console.error("Error deleting item:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">Items ({items.length})</h3>

      {items.length === 0 ? (
        <p className="text-foreground/60">No items added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Unit Price</th>
                <th className="text-left py-3 px-4">Low Threshold</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-card/50">
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="input-field w-20"
                        disabled={isLoading}
                      />
                    ) : (
                      item.stock_level
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="input-field w-24"
                        step="0.01"
                        disabled={isLoading}
                      />
                    ) : (
                      `KSh ${item.unit_price.toFixed(2)}`
                    )}
                  </td>
                  <td className="py-3 px-4">{item.low_threshold}</td>
                  <td className="py-3 px-4">
                    {item.stock_level <= item.low_threshold ? (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-warning/20 text-warning">
                        Low
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/20 text-success">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {editingId === item.id ? (
                      <button
                        onClick={() => handleSave(item.id)}
                        className="text-primary hover:underline text-xs font-medium mr-2"
                        disabled={isLoading}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-primary hover:underline text-xs font-medium mr-2"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:underline text-xs font-medium"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default InventoryTable
