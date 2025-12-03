"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    vendors: 0,
    products: 0,
    orders: 0,
    customers: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [vendorsRes, productsRes, ordersRes, customersRes, expensesRes] = await Promise.all([
          fetch("http://localhost:5000/api/vendor-details"),
          fetch("http://localhost:5000/api/product-details"),
          fetch("http://localhost:5000/api/customer-order-details"),
          fetch("http://localhost:5000/api/customer-details"),
          fetch("http://localhost:5000/api/expense-details")
        ]);

        const vendors = await vendorsRes.json();
        const products = await productsRes.json();
        const orders = await ordersRes.json();
        const customers = await customersRes.json();
        const expenses = await expensesRes.json();

        setStats({
          vendors: vendors.data ? vendors.data.length : 0,
          products: products.data ? products.data.length : 0,
          orders: orders.data ? orders.data.length : 0,
          customers: customers.data ? customers.data.length : 0,
          expenses: expenses.data ? expenses.data.reduce((sum: number, exp: any) => sum + parseFloat(exp.Expense_Amount || 0), 0) : 0,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, color }: { icon: string; title: string; value: any; color: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                        color === 'green' ? 'bg-green-100 text-green-600' : 
                        color === 'purple' ? 'bg-purple-100 text-purple-600' : 
                        color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 
                        'bg-red-100 text-red-600'}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
            <p className="text-gray-600">
              Your overview of business operations.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon="👥" title="Vendors" value={stats.vendors} color="blue" />
        <StatCard icon="📦" title="Products" value={stats.products} color="green" />
        <StatCard icon="🛒" title="Orders" value={stats.orders} color="purple" />
        <StatCard icon="👤" title="Customers" value={stats.customers} color="indigo" />
        <StatCard icon="💰" title="Expenses" value={`$${stats.expenses.toFixed(2)}`} color="red" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/vendor-details" className="group">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-700">Manage Vendors</h4>
                  <p className="text-sm text-gray-600 mt-1">Add and manage vendors</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/product-details" className="group">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 text-xl">📦</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-green-700">Add Products</h4>
                  <p className="text-sm text-gray-600 mt-1">Manage inventory</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/expense-details" className="group">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <span className="text-red-600 text-xl">💰</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-red-700">Track Expenses</h4>
                  <p className="text-sm text-gray-600 mt-1">Record expenses</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}