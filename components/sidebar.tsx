"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, BarChart3, Package, Users, ShoppingCart, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setIsOpen(true)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      {/* Mobile toggle button */}
      <div className="fixed top-0 left-0 z-40 md:hidden bg-white border-b border-border p-4 flex justify-between items-center w-full">
        <h1 className="text-lg font-bold text-green-700">AgriSupply Hub</h1>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-border pt-20 md:pt-0 transition-all duration-300 z-30 md:z-10",
          isMobile && !isOpen && "-translate-x-full",
        )}
      >
        <div className="hidden md:flex p-6 items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-700" />
          <h1 className="text-lg font-bold text-green-700">AgriSupply Hub</h1>
        </div>

        <nav className="px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive ? "bg-green-700 text-white font-medium" : "text-foreground hover:bg-gray-100",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Main content wrapper */}
      <main className="md:ml-64 pt-20 md:pt-0">{/* This will contain page content */}</main>
    </>
  )
}
