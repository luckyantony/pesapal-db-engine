"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import SalesForm from "@/components/sales-form"
import SalesTable from "@/components/sales-table"
import { getSales, type Sale } from "@/lib/supabase-storage"
import { Spinner } from "@/components/ui/spinner"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await getSales()
        setSales(data)
      } catch (err) {
        console.error("Error loading sales:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSales()
  }, [])

  const handleSaleAdded = async () => {
    try {
      const data = await getSales()
      setSales(data)
    } catch (err) {
      console.error("Error refreshing sales:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-0">
        <main className="p-4 md:p-6 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">Record Sales</h2>
              <p className="text-foreground/60">Record sales transactions and automatically update inventory stock.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <SalesForm onSaleAdded={handleSaleAdded} />
                </div>
                <div className="lg:col-span-2">
                  <SalesTable sales={sales} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
