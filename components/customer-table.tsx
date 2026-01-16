"use client"

import type { Customer } from "@/lib/supabase-storage"

interface CustomerTableProps {
  customers: Customer[]
  onUpdate: () => void
}

const CustomerTable = ({ customers, onUpdate }: CustomerTableProps) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">Customers ({customers.length})</h3>

      {customers.length === 0 ? (
        <p className="text-foreground/60">No customers added yet. Add a customer to get started.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Phone</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Added</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/50 hover:bg-card/50">
                  <td className="py-3 px-4 font-medium">{customer.name}</td>
                  <td className="py-3 px-4">{customer.phone || "—"}</td>
                  <td className="py-3 px-4">{customer.email || "—"}</td>
                  <td className="py-3 px-4 text-foreground/60 text-xs">
                    {new Date(customer.created_at).toLocaleDateString()}
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

export default CustomerTable
