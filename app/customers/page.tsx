"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import CustomerForm from "@/components/customer-form"
import CustomerTable from "@/components/customer-table"
import { getCustomers, type Customer } from "@/lib/supabase-storage"
import { Spinner } from "@/components/ui/spinner"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (err) {
        console.error("Error loading customers:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const handleCustomerAdded = async () => {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error("Error refreshing customers:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-0">
        <main className="p-4 md:p-6 max-w-7xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">Customers</h2>
              <p className="text-foreground/60">Manage your customer information for quick reference during sales.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <CustomerForm onCustomerAdded={handleCustomerAdded} />
                </div>
                <div className="lg:col-span-2">
                  <CustomerTable customers={customers} onUpdate={handleCustomerAdded} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
