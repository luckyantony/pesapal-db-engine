// localStorage utility for managing app data
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

export interface User {
  id: string
  email: string
  password_hash: string
  created_at: string
}

// User management
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("agri_user")
  return data ? JSON.parse(data) : null
}

export const setUser = (user: User) => {
  if (typeof window === "undefined") return
  localStorage.setItem("agri_user", JSON.stringify(user))
}

export const clearUser = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("agri_user")
}

// Items management
export const getItems = (): Item[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("agri_items")
  return data ? JSON.parse(data) : []
}

export const addItem = (item: Omit<Item, "id" | "created_at">) => {
  const items = getItems()
  const newItem: Item = {
    ...item,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }
  localStorage.setItem("agri_items", JSON.stringify([...items, newItem]))
  return newItem
}

export const updateItem = (id: string, updates: Partial<Item>) => {
  const items = getItems()
  const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item))
  localStorage.setItem("agri_items", JSON.stringify(updated))
}

export const deleteItem = (id: string) => {
  const items = getItems()
  localStorage.setItem("agri_items", JSON.stringify(items.filter((i) => i.id !== id)))
}

// Customers management
export const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("agri_customers")
  return data ? JSON.parse(data) : []
}

export const addCustomer = (customer: Omit<Customer, "id" | "created_at">) => {
  const customers = getCustomers()
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }
  localStorage.setItem("agri_customers", JSON.stringify([...customers, newCustomer]))
  return newCustomer
}

// Sales management
export const getSales = (): Sale[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("agri_sales")
  return data ? JSON.parse(data) : []
}

export const addSale = (sale: Omit<Sale, "id" | "created_at">) => {
  const sales = getSales()
  const newSale: Sale = {
    ...sale,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }
  localStorage.setItem("agri_sales", JSON.stringify([...sales, newSale]))
  return newSale
}

// Utility: Get today's sales total
export const getTodaysSalesTotal = (): number => {
  const sales = getSales()
  const today = new Date().toDateString()
  return sales.filter((s) => new Date(s.date).toDateString() === today).reduce((sum, s) => sum + s.total_amount, 0)
}

// Utility: Get low stock items
export const getLowStockItems = (): Item[] => {
  const items = getItems()
  return items.filter((i) => i.stock_level <= i.low_threshold)
}
