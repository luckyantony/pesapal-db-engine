"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import InventoryForm from "@/components/inventory-form"
import InventoryTable from "@/components/inventory-table"
import { getItems, type Item } from "@/lib/supabase-storage"
import { Spinner } from "@/components/ui/spinner"

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getItems()
        setItems(data)
      } catch (err) {
        console.error("Error loading items:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  const handleItemAdded = async () => {
    try {
      const data = await getItems()
      setItems(data)
    } catch (err) {
      console.error("Error refreshing items:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-0">
        <main className="p-4 md:p-6 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">Inventory Management</h2>
              <p className="text-foreground/60">Add, edit, and manage your farm supplies inventory.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <InventoryForm onItemAdded={handleItemAdded} />
                </div>
                <div className="lg:col-span-2">
                  <InventoryTable items={items} onUpdate={handleItemAdded} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
