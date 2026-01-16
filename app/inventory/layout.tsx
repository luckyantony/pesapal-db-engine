import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inventory - Agri Inputs Tracker",
  description: "Manage your agricultural supplies inventory",
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
