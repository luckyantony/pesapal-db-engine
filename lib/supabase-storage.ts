import { createClient } from "./supabase-client"

export interface Item {
  id: string
  name: string
  stock_level: number
  unit_price: number
  low_threshold: number
  created_at: string
}

export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  created_at: string
}

export interface Sale {
  id: string
  date: string
  item_id: string
  item_name?: string
  quantity: number
  total_amount: number
  customer_id?: string
  customer_name?: string
  payment_method: "M-Pesa" | "Cash" | "Card" | "Other"
  notes?: string
  created_at: string
}

const supabase = createClient()

// Items management
export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching items:", error)
    return []
  }

  return data || []
}

export async function addItem(item: Omit<Item, "id" | "created_at">) {
  const { data, error } = await supabase.from("items").insert([item]).select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

export async function updateItem(id: string, updates: Partial<Item>) {
  const { data, error } = await supabase.from("items").update(updates).eq("id", id).select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

export async function deleteItem(id: string) {
  const { error } = await supabase.from("items").delete().eq("id", id)

  if (error) throw new Error(error.message)
}

// Customers management
export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data || []
}

export async function addCustomer(customer: Omit<Customer, "id" | "created_at">) {
  const { data, error } = await supabase.from("customers").insert([customer]).select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const { data, error } = await supabase.from("customers").update(updates).eq("id", id).select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) throw new Error(error.message)
}

// Sales management
export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      items:item_id(name),
      customers:customer_id(name)
    `,
    )
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }

  return (data || []).map((sale: any) => ({
    ...sale,
    item_name: sale.items?.name,
    customer_name: sale.customers?.name,
  }))
}

export async function addSale(sale: Omit<Sale, "id" | "created_at">) {
  const { item_name, customer_name, ...saleData } = sale

  const { data, error } = await supabase.from("sales").insert([saleData]).select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

// Utility: Get today's sales total
export async function getTodaysSalesTotal(): Promise<number> {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase.from("sales").select("total_amount").eq("date", today)

  if (error) {
    console.error("Error fetching today's sales:", error)
    return 0
  }

  return (data || []).reduce((sum, sale) => sum + sale.total_amount, 0)
}

// Utility: Get low stock items
export async function getLowStockItems(): Promise<Item[]> {
  const { data, error } = await supabase.from("items").select("*").order("stock_level", { ascending: true })

  if (error) {
    console.error("Error fetching low stock items:", error)
    return []
  }

  // Filter on client side: items where stock_level <= low_threshold
  return (data || []).filter((item) => item.stock_level <= item.low_threshold)
}
