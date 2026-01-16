"use client"

import Sidebar from "@/components/sidebar"
import DashboardContent from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <main className="p-4 md:p-6 max-w-7xl">
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}
