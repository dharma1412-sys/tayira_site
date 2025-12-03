"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const menuItems = [
    { href: "/admin", icon: "📊", label: "Dashboard" },
    { href: "/admin/vendor-details", icon: "👥", label: "Vendor Details" },
    { href: "/admin/vendor-order-details", icon: "📋", label: "Vendor Order Details" },
    { href: "/admin/product-details", icon: "📦", label: "Product Details" },
    { href: "/admin/customer-order-details", icon: "🛒", label: "Customer Order Details" },
    { href: "/admin/customer-details", icon: "👤", label: "Customer Details" },
    { href: "/admin/expense-details", icon: "💰", label: "Expense Details" },
    { href: "/admin/BarCodePage", icon: "💰", label: "BarCode Page" },
  ];

  const getActiveStyle = (href: string) =>
    pathname === href
      ? "bg-blue-600 text-white border-r-2 border-blue-400"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  // Sidebar classes
  const sidebarClasses = `
    fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 
    transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="p-4 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Admin Menu</h2>
          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-400 hover:text-white text-xl p-1 rounded hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 p-3 rounded-md w-full transition-all duration-200 relative
                ${getActiveStyle(item.href)}
              `}
              onClick={closeSidebar}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="truncate font-medium">{item.label}</span>
              {pathname === item.href && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-md"></div>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            {/* Menu button */}
            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Tayira Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {pathname === "/admin"
                ? "Dashboard"
                : pathname
                    .split("/")
                    .pop()
                    ?.replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || "Dashboard"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
