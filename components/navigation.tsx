"use client"

import { usePathname } from "next/navigation"

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Customers", href: "/customers" },
    { label: "Sales", href: "/sales" },
  ]

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-primary">Agri Tracker</h1>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary/20"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
