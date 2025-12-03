"use client";
import { useEffect, useState } from "react";

export default function VendorOrderAddList() {
  const [formData, setFormData] = useState({
    Vendor_ID: "",
    Order_Number: "",
    Order_Date: "",
    Purchase_category: "",
    Purchase_Quantity: "",
    Purchase_Amount: "",
    Paid_Balance: "",
    Paid_Date: "",
    Non_Paid_Balance: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Helper function to format date for MySQL
  const formatDateForMySQL = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return null;
    }
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toISOString().split('T')[0]; // Returns yyyy-MM-dd format
    } catch (error) {
      console.error('Error formatting date for display:', dateString, error);
      return dateString;
    }
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vendor-order-details");
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      const rows = result.data || [];
      
      // Format dates for display
      const formattedRows = rows.map(row => ({
        ...row,
        Order_Date: formatDateForDisplay(row.Order_Date),
        Paid_Date: formatDateForDisplay(row.Paid_Date)
      }));
      
      setData(formattedRows);
      if (formattedRows.length > 0) {
        setHeaders(Object.keys(formattedRows[0]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new vendor order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      // Format dates before sending
      const submitData = {
        ...formData,
        Order_Date: formatDateForMySQL(formData.Order_Date),
        Paid_Date: formatDateForMySQL(formData.Paid_Date),
      };

      const res = await fetch("http://localhost:5000/api/vendor-order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) throw new Error("Failed to add");
      const result = await res.json();
      setMessage(result.message);
      setFormData({
        Vendor_ID: "",
        Order_Number: "",
        Order_Date: "",
        Purchase_category: "",
        Purchase_Quantity: "",
        Purchase_Amount: "",
        Paid_Balance: "",
        Paid_Date: "",
        Non_Paid_Balance: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // Edit row
  const handleEdit = (idx: number, row: any) => {
    setEditingRow(idx);
    // Format dates for editing
    const editRow = {
      ...row,
      Order_Date: formatDateForDisplay(row.Order_Date),
      Paid_Date: formatDateForDisplay(row.Paid_Date),
    };
    setEditData(editRow);
  };

  // Save row
  const handleSave = async (rowId: number) => {
    try {
      // Format dates before sending
      const saveData = {
        ...editData,
        Order_Date: formatDateForMySQL(editData.Order_Date),
        Paid_Date: formatDateForMySQL(editData.Paid_Date),
      };

      console.log('Saving data:', saveData); // Debug log

      const res = await fetch(`http://localhost:5000/api/vendor-order-details/${rowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Update failed:', res.status, errorText);
        throw new Error(`Failed to update: ${res.status} ${errorText}`);
      }
      
      const result = await res.json();
      setMessage("Saved successfully!");
      setEditingRow(null);
      fetchData();

      // Auto hide message after 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // Delete row
  const handleDelete = async (rowId: number) => {
    if (!confirm("Are you sure you want to delete this vendor order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vendor-order-details/${rowId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete: ${res.status} ${errorText}`);
      }
      setMessage("Deleted successfully!");
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // Handle edit input changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add Vendor Order Details</h2>

      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">{error}</div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 bg-white p-6 shadow rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="Vendor_ID"
            type="number"
            value={formData.Vendor_ID}
            onChange={handleChange}
            placeholder="Vendor ID"
            className="p-2 border rounded w-full"
            required
          />
          <input
            name="Order_Number"
            type="number"
            value={formData.Order_Number}
            onChange={handleChange}
            placeholder="Order Number"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="Order_Date"
            type="date"
            value={formData.Order_Date}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          <input
            name="Paid_Date"
            type="date"
            value={formData.Paid_Date}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <input
          name="Purchase_category"
          value={formData.Purchase_category}
          onChange={handleChange}
          placeholder="Purchase Category"
          className="p-2 border rounded w-full"
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="Purchase_Quantity"
            type="number"
            value={formData.Purchase_Quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="p-2 border rounded w-full"
            required
          />
          <input
            name="Purchase_Amount"
            type="number"
            step="0.01"
            value={formData.Purchase_Amount}
            onChange={handleChange}
            placeholder="Amount"
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="Paid_Balance"
            type="number"
            step="0.01"
            value={formData.Paid_Balance}
            onChange={handleChange}
            placeholder="Paid Balance"
            className="p-2 border rounded w-full"
            required
          />
          <input
            name="Non_Paid_Balance"
            type="number"
            step="0.01"
            value={formData.Non_Paid_Balance}
            onChange={handleChange}
            placeholder="Non-Paid Balance"
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Vendor Order
        </button>
      </form>

      {/* Table */}
      <h3 className="text-xl font-semibold mb-4">Vendor Order Details Table</h3>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header) => (
                <th key={header} className="border p-3 capitalize">
                  {header.replace(/_/g, " ")}
                </th>
              ))}
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={row.ID || idx} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="border p-3">
                      {editingRow === idx ? (
                        <input
                          type={
                            header === 'Order_Date' || header === 'Paid_Date' 
                              ? 'date' 
                              : header.includes('Quantity') || header.includes('Amount') || header.includes('Balance') 
                                ? 'number' 
                                : 'text'
                          }
                          step={
                            header.includes('Amount') || header.includes('Balance') 
                              ? '0.01' 
                              : undefined
                          }
                          name={header}
                          value={editData[header] || ''}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                          placeholder={header.replace(/_/g, " ")}
                        />
                      ) : (
                        <span className="break-words">
                          {row[header] || '-'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="border p-3 space-x-2">
                    {editingRow === idx ? (
                      <button
                        onClick={() => handleSave(row.ID)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(idx, row)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row.ID)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="text-center p-4 text-gray-500"
                >
                  No vendor order data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}