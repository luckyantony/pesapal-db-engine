"use client"

import { useEffect, useState } from "react"
import { getItems, getSales, getTodaysSalesTotal, getLowStockItems, type Item, type Sale } from "@/lib/supabase-storage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const DashboardContent = () => {
  const [items, setItems] = useState<Item[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [todaysTotal, setTodaysTotal] = useState(0)
  const [lowStock, setLowStock] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("week")
  const [allTimeSalesTotal, setAllTimeSalesTotal] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, salesData, todaysTotal, lowStockData] = await Promise.all([
          getItems(),
          getSales(),
          getTodaysSalesTotal(),
          getLowStockItems(),
        ])

        setItems(itemsData)
        setSales(salesData)
        setTodaysTotal(todaysTotal)
        setLowStock(lowStockData)

        // Calculate all-time sales total
        const allTimeTotal = salesData.reduce((sum, sale) => sum + sale.total_amount, 0)
        setAllTimeSalesTotal(allTimeTotal)
      } catch (err) {
        console.error("Error loading dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getFilteredSales = () => {
    const now = new Date()
    let startDate = new Date()

    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "all":
        startDate = new Date(0)
        break
    }

    return sales.filter((sale) => new Date(sale.date) >= startDate)
  }

  const filteredSales = getFilteredSales()

  // Stock levels chart data
  const chartData = items.map((item) => ({
    name: item.name.length > 15 ? item.name.slice(0, 12) + "..." : item.name,
    stock: item.stock_level,
    threshold: item.low_threshold,
    isLow: item.stock_level <= item.low_threshold,
  }))

  // Sales trend data (last 7 days)
  const salesByDay = filteredSales
    .reduce((acc: any, sale) => {
      const day = new Date(sale.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const existing = acc.find((s: any) => s.day === day)
      if (existing) {
        existing.total += sale.total_amount
      } else {
        acc.push({ day, total: sale.total_amount })
      }
      return acc
    }, [])
    .sort((a, b) => new Date(`${a.day} 2025`).getTime() - new Date(`${b.day} 2025`).getTime())

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-green-700 mb-2">Dashboard</h2>
        <p className="text-foreground/60">Welcome to AgriSupply Hub - Your agricultural business overview</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-green-700">
          <p className="text-sm text-foreground/60 mb-2">Today's Sales</p>
          <p className="text-2xl md:text-3xl font-bold text-green-700">KSh {todaysTotal.toLocaleString()}</p>
        </Card>
        <Card className="p-6 border-l-4 border-blue-600">
          <p className="text-sm text-foreground/60 mb-2">Total Items</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{items.length}</p>
        </Card>
        <Card className="p-6 border-l-4 border-red-600">
          <p className="text-sm text-foreground/60 mb-2">Low Stock Items</p>
          <p className="text-2xl md:text-3xl font-bold text-red-600">{lowStock.length}</p>
        </Card>
        <Card className="p-6 border-l-4 border-purple-600">
          <p className="text-sm text-foreground/60 mb-2">Total Sales All Time</p>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">KSh {allTimeSalesTotal.toLocaleString()}</p>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Alert className="border-l-4 border-red-600 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Low Stock Alert</AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            <div className="space-y-1">
              {lowStock.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">
                    Stock: {item.stock_level} / Threshold: {item.low_threshold}
                  </span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels Bar Chart */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 text-foreground">Stock Levels</h3>
          {items.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-foreground/50">
              No items yet. Add inventory to see the chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="stock" fill="#16a34a" radius={[8, 8, 0, 0]} label={{ position: "top" }} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Sales Trend Line Chart with Date Filter */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-foreground">Sales Trend</h3>
            <div className="flex gap-2">
              {["today", "week", "month", "all"].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={dateRange === range ? "default" : "outline"}
                  onClick={() => setDateRange(range as any)}
                  className={dateRange === range ? "bg-green-700 text-white" : ""}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {filteredSales.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-foreground/50">
              No sales in this period. Start recording sales to see trends.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ fill: "#16a34a", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Sales Table */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 text-foreground">Recent Sales</h3>
        {sales.length === 0 ? (
          <p className="text-foreground/60 text-center py-8">
            No sales recorded yet. Start recording sales to see them here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Item</th>
                  <th className="text-center py-3 px-4 font-semibold">Qty</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-right py-3 px-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...sales]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((sale) => (
                    <tr key={sale.id} className="border-b border-border/50 hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium">{sale.item_name}</td>
                      <td className="py-3 px-4 text-center">{sale.quantity}</td>
                      <td className="py-3 px-4">{sale.customer_name || "Walk-in"}</td>
                      <td className="py-3 px-4">{sale.payment_method}</td>
                      <td className="py-3 px-4 text-right font-bold text-green-700">
                        KSh {sale.total_amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default DashboardContent
