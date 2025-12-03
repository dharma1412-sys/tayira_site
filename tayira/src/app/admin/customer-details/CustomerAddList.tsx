"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerAddList() {
  const [formData, setFormData] = useState({
    Order_ID: "",
    Customer_Name: "",
    Customer_Number: "",
    Cust_Alternate_Number: "",
    Customer_Billing_Address: "",
    Customer_Delivery_Address: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customer-details");
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/customer-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add");
      const result = await res.json();
      setMessage(result.message);
      setFormData({
        Order_ID: "",
        Customer_Name: "",
        Customer_Number: "",
        Cust_Alternate_Number: "",
        Customer_Billing_Address: "",
        Customer_Delivery_Address: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Add Customer Details</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border rounded">
        <div>
          <label className="block text-sm font-medium mb-1">Order ID</label>
          <input 
            name="Order_ID" 
            type="number" 
            value={formData.Order_ID} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input 
            name="Customer_Name" 
            value={formData.Customer_Name} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Number</label>
          <input 
            name="Customer_Number" 
            type="tel" 
            value={formData.Customer_Number} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alternate Number</label>
          <input 
            name="Cust_Alternate_Number" 
            type="tel" 
            value={formData.Cust_Alternate_Number} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Billing Address</label>
          <textarea 
            name="Customer_Billing_Address" 
            value={formData.Customer_Billing_Address} 
            onChange={handleChange} 
            className="p-2 border rounded w-full h-20" 
            placeholder="Enter billing address"
            required 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <textarea 
            name="Customer_Delivery_Address" 
            value={formData.Customer_Delivery_Address} 
            onChange={handleChange} 
            className="p-2 border rounded w-full h-20" 
            placeholder="Enter delivery address"
            required 
          />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Customer
          </button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-2">Customer Details Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Order ID</th>
              <th className="border p-2 text-left">Customer Name</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Alternate Phone</th>
              <th className="border p-2 text-left">Billing Address</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.ID} className="hover:bg-gray-50">
                <td className="border p-2">{row.ID}</td>
                <td className="border p-2">{row.Order_ID}</td>
                <td className="border p-2 font-medium">{row.Customer_Name}</td>
                <td className="border p-2">{row.Customer_Number}</td>
                <td className="border p-2">{row.Cust_Alternate_Number || "-"}</td>
                <td className="border p-2 max-w-xs truncate">{row.Customer_Billing_Address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center space-x-4 mb-6">
      <Link 
        href="/admin"
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <span className="mr-2 text-xl">←</span>
        Back to Dashboard
      </Link>
    </div>
    </div>
  );
}