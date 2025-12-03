"use client";
import { useEffect, useState } from "react";

export default function VendorAddList() {
  const [formData, setFormData] = useState({
    Vendor_Name: "",
    Vendor_Place: "",
    Vendor_Contact_Number: "",
    Vendor_Product_Category: "",
    Vendor_Address: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<number | null>(null); // row index being edited
  const [editData, setEditData] = useState<any>({}); // temp state for edits

  // Fetch data from API
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vendor-details");
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      const rows = result.data || [];
      setData(rows);
      if (rows.length > 0) {
        setHeaders(Object.keys(rows[0]));
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

  // Add new vendor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/vendor-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add");
      const result = await res.json();
      setMessage(result.message);
      setFormData({
        Vendor_Name: "",
        Vendor_Place: "",
        Vendor_Contact_Number: "",
        Vendor_Product_Category: "",
        Vendor_Address: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // Edit row
  const handleEdit = (idx: number, row: any) => {
    setEditingRow(idx);
    setEditData({ ...row });
  };

  // Save row
  const handleSave = async (rowId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vendor-details/${rowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update");
      setMessage("Saved successfully!");
      setEditingRow(null);
      fetchData();

      // Auto hide message after 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // Delete row
  const handleDelete = async (rowId: number) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vendor-details/${rowId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setMessage("Deleted successfully!");
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add Vendor Details</h2>

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
        <input
          name="Vendor_Name"
          value={formData.Vendor_Name}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="p-2 border rounded w-full"
          required
        />
        <input
          name="Vendor_Place"
          value={formData.Vendor_Place}
          onChange={handleChange}
          placeholder="Vendor Place"
          className="p-2 border rounded w-full"
          required
        />
        <input
          name="Vendor_Contact_Number"
          type="number"
          value={formData.Vendor_Contact_Number}
          onChange={handleChange}
          placeholder="Contact Number"
          className="p-2 border rounded w-full"
          required
        />
        <input
          name="Vendor_Product_Category"
          value={formData.Vendor_Product_Category}
          onChange={handleChange}
          placeholder="Product Category"
          className="p-2 border rounded w-full"
          required
        />
        <textarea
          name="Vendor_Address"
          value={formData.Vendor_Address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Vendor
        </button>
      </form>

      {/* Table */}
      <h3 className="text-xl font-semibold mb-4">Vendor Details Table</h3>
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
                <tr key={idx} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="border p-3">
                      {editingRow === idx ? (
                        <input
                          value={editData[header]}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              [header]: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        row[header]
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
                  No vendor data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
