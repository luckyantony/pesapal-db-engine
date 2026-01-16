import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customers - Agri Inputs Tracker",
  description: "Manage your customers",
}

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return children
}
