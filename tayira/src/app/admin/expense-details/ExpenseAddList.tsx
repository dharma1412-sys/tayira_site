"use client";
import { useEffect, useState } from "react";

export default function ExpenseAddList() {
  const [formData, setFormData] = useState({
    Expense_Type: "",
    Expense_Amount: "",
    Expense_Date: "",
    Details: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expense-details");
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
      const res = await fetch("http://localhost:5000/api/expense-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add");
      const result = await res.json();
      setMessage(result.message);
      setFormData({
        Expense_Type: "",
        Expense_Amount: "",
        Expense_Date: "",
        Details: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Add Expense Details</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border rounded">
        <div>
          <label className="block text-sm font-medium mb-1">Expense Type</label>
          <select 
            name="Expense_Type" 
            value={formData.Expense_Type} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required
          >
            <option value="">Select Expense Type</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Utilities">Utilities</option>
            <option value="Travel">Travel</option>
            <option value="Marketing">Marketing</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expense Amount</label>
          <input 
            name="Expense_Amount" 
            type="number" 
            step="0.01" 
            value={formData.Expense_Amount} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            placeholder="0.00"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expense Date</label>
          <input 
            name="Expense_Date" 
            type="date" 
            value={formData.Expense_Date} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea 
            name="Details" 
            value={formData.Details} 
            onChange={handleChange} 
            className="p-2 border rounded w-full h-16" 
            placeholder="Additional details about the expense"
          />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Expense
          </button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-2">Expense Details Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Expense Type</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.ID} className="hover:bg-gray-50">
                <td className="border p-2">{row.ID}</td>
                <td className="border p-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {row.Expense_Type}
                  </span>
                </td>
                <td className="border p-2 font-semibold text-red-600">${row.Expense_Amount}</td>
                <td className="border p-2">{row.Expense_Date}</td>
                <td className="border p-2 max-w-xs truncate">{row.Details || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Expenses Summary */}
      {data.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border rounded">
          <h4 className="font-semibold mb-2">Total Expenses: ${data.reduce((sum, expense) => sum + parseFloat(expense.Expense_Amount || 0), 0).toFixed(2)}</h4>
        </div>
      )}
    </div>
  );
}