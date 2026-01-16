import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sales - Agri Inputs Tracker",
  description: "Record sales transactions",
}

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return children
}
