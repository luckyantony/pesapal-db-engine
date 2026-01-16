"use client"

import type { Sale } from "@/lib/storage"

interface SalesTableProps {
  sales: Sale[]
}

const SalesTable = ({ sales }: SalesTableProps) => {
  const todaysSales = sales.filter((s) => new Date(s.date).toDateString() === new Date().toDateString())
  const todaysTotal = todaysSales.reduce((sum, s) => sum + s.total_amount, 0)

  return (
    <div className="space-y-4">
      {todaysSales.length > 0 && (
        <div className="card p-6 border-l-4 border-success bg-success/5">
          <p className="text-sm text-foreground/60">Today's Sales Total</p>
          <p className="text-2xl font-bold text-success">KSh {todaysTotal.toLocaleString()}</p>
          <p className="text-xs text-foreground/50 mt-1">{todaysSales.length} transactions</p>
        </div>
      )}

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Sales History ({sales.length})</h3>

        {sales.length === 0 ? (
          <p className="text-foreground/60">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Date & Time</th>
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Qty</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Method</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales
                  .slice()
                  .reverse()
                  .map((sale) => (
                    <tr key={sale.id} className="border-b border-border/50 hover:bg-card/50">
                      <td className="py-3 px-4 text-xs">{new Date(sale.date).toLocaleString()}</td>
                      <td className="py-3 px-4">{sale.item_name}</td>
                      <td className="py-3 px-4 font-medium">{sale.quantity}</td>
                      <td className="py-3 px-4">{sale.customer_name || "—"}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-secondary/20">
                          {sale.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">KSh {sale.total_amount.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesTable
