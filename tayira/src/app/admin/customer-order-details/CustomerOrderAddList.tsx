"use client";
import { useEffect, useState } from "react";

export default function CustomerOrderAddList() {
  const [formData, setFormData] = useState({
    Ordered_Product_ID: "",
    Ordered_Price: "",
    Received_Payment_Amount: "",
    Customer_Paid_Amount: "",
    Mode_of_Payment: "",
    Payment_Transaction_ID: "",
    Ordered_Date: "",
    Payment_Date: "",
    Order_Type: "",
    Period_of_EMI: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customer-order-details");
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

  // Fixed: Handle all input types (input, textarea, select)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/customer-order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add");
      const result = await res.json();
      setMessage(result.message);
      setFormData({
        Ordered_Product_ID: "",
        Ordered_Price: "",
        Received_Payment_Amount: "",
        Customer_Paid_Amount: "",
        Mode_of_Payment: "",
        Payment_Transaction_ID: "",
        Ordered_Date: "",
        Payment_Date: "",
        Order_Type: "",
        Period_of_EMI: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Add Customer Order Details</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border rounded">
        <div>
          <label className="block text-sm font-medium mb-1">Ordered Product ID</label>
          <input 
            name="Ordered_Product_ID" 
            type="number" 
            value={formData.Ordered_Product_ID} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ordered Price</label>
          <input 
            name="Ordered_Price" 
            type="number" 
            step="0.01" 
            value={formData.Ordered_Price} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Received Payment Amount</label>
          <input 
            name="Received_Payment_Amount" 
            type="number" 
            step="0.01" 
            value={formData.Received_Payment_Amount} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Paid Amount</label>
          <input 
            name="Customer_Paid_Amount" 
            type="number" 
            step="0.01" 
            value={formData.Customer_Paid_Amount} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mode of Payment</label>
          <textarea 
            name="Mode_of_Payment" 
            value={formData.Mode_of_Payment} 
            onChange={handleChange} 
            className="p-2 border rounded w-full h-16" 
            placeholder="Cash, Card, UPI, etc."
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Transaction ID</label>
          <input 
            name="Payment_Transaction_ID" 
            type="number" 
            value={formData.Payment_Transaction_ID} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ordered Date</label>
          <input 
            name="Ordered_Date" 
            type="date" 
            value={formData.Ordered_Date} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Date</label>
          <input 
            name="Payment_Date" 
            type="date" 
            value={formData.Payment_Date} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order Type</label>
          <select 
            name="Order_Type" 
            value={formData.Order_Type} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required
          >
            <option value="">Select Order Type</option>
            <option value="Standard">Standard</option>
            <option value="EMI">EMI</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">EMI Period (Months)</label>
          <input 
            name="Period_of_EMI" 
            type="number" 
            value={formData.Period_of_EMI} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            placeholder="0 for Standard orders"
          />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Customer Order
          </button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-2">Customer Order Details Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Product ID</th>
              <th className="border p-2 text-left">Ordered Price</th>
              <th className="border p-2 text-left">Paid Amount</th>
              <th className="border p-2 text-left">Payment Mode</th>
              <th className="border p-2 text-left">Order Date</th>
              <th className="border p-2 text-left">Order Type</th>
              <th className="border p-2 text-left">EMI Months</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.ID} className="hover:bg-gray-50">
                <td className="border p-2">{row.ID}</td>
                <td className="border p-2">{row.Ordered_Product_ID}</td>
                <td className="border p-2">${row.Ordered_Price}</td>
                <td className="border p-2">${row.Customer_Paid_Amount}</td>
                <td className="border p-2">{row.Mode_of_Payment}</td>
                <td className="border p-2">{row.Ordered_Date}</td>
                <td className="border p-2">
                  <span className={row.Order_Type === "EMI" ? "text-red-600 font-semibold" : ""}>
                    {row.Order_Type}
                  </span>
                </td>
                <td className="border p-2">{row.Period_of_EMI || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}