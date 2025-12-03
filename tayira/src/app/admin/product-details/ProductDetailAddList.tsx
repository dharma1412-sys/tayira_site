"use client";
import { useEffect, useState } from "react";

export default function ProductDetailAddList() {
  const [formData, setFormData] = useState({
    Vendor_order_Id: "",
    Category: "",
    Product_Name: "",
    Product_Quantity: "",
    Total_Purchase_Price: "",
    Purchase_Price_Per_Qty: "",
    Product_Gst_Per_Qty: "",
    Product_List_Price_Per_Qty: "",
    Product_Sell_Price_Per_Qty: "",
    percent_of_discount: "",
    Total_Product_List_Price: "",
    Total_Product_Sell_Price: "",
    Gender: "",
    Size: "",
    Length: "",
    Width: "",
    Description: "",
  });
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product-details");
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
      const res = await fetch("http://localhost:5000/api/product-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add");
      const result = await res.json();
      setMessage(result.message);
      setFormData({
        Vendor_order_Id: "",
        Category: "",
        Product_Name: "",
        Product_Quantity: "",
        Total_Purchase_Price: "",
        Purchase_Price_Per_Qty: "",
        Product_Gst_Per_Qty: "",
        Product_List_Price_Per_Qty: "",
        Product_Sell_Price_Per_Qty: "",
        percent_of_discount: "",
        Total_Product_List_Price: "",
        Total_Product_Sell_Price: "",
        Gender: "",
        Size: "",
        Length: "",
        Width: "",
        Description: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Add Product Details</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border rounded">
        <div>
          <label className="block text-sm font-medium mb-1">Vendor Order ID</label>
          <input 
            name="Vendor_order_Id" 
            type="number" 
            value={formData.Vendor_order_Id} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input 
            name="Category" 
            value={formData.Category} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input 
            name="Product_Name" 
            value={formData.Product_Name} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product Quantity</label>
          <input 
            name="Product_Quantity" 
            type="number" 
            value={formData.Product_Quantity} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Purchase Price</label>
          <input 
            name="Total_Purchase_Price" 
            type="number" 
            step="0.01" 
            value={formData.Total_Purchase_Price} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Purchase Price Per Qty</label>
          <input 
            name="Purchase_Price_Per_Qty" 
            type="number" 
            step="0.01" 
            value={formData.Purchase_Price_Per_Qty} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GST Per Qty (%)</label>
          <input 
            name="Product_Gst_Per_Qty" 
            type="number" 
            step="0.01" 
            value={formData.Product_Gst_Per_Qty} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">List Price Per Qty</label>
          <input 
            name="Product_List_Price_Per_Qty" 
            type="number" 
            step="0.01" 
            value={formData.Product_List_Price_Per_Qty} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sell Price Per Qty</label>
          <input 
            name="Product_Sell_Price_Per_Qty" 
            type="number" 
            step="0.01" 
            value={formData.Product_Sell_Price_Per_Qty} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">% of Discount</label>
          <input 
            name="percent_of_discount" 
            type="number" 
            step="0.01" 
            value={formData.percent_of_discount} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total List Price</label>
          <input 
            name="Total_Product_List_Price" 
            type="number" 
            step="0.01" 
            value={formData.Total_Product_List_Price} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Sell Price</label>
          <input 
            name="Total_Product_Sell_Price" 
            type="number" 
            step="0.01" 
            value={formData.Total_Product_Sell_Price} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <input 
            name="Gender" 
            value={formData.Gender} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <input 
            name="Size" 
            type="number" 
            value={formData.Size} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Length</label>
          <input 
            name="Length" 
            type="number" 
            value={formData.Length} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Width</label>
          <input 
            name="Width" 
            type="number" 
            value={formData.Width} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
            required 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            name="Description" 
            value={formData.Description} 
            onChange={handleChange} 
            className="p-2 border rounded w-full h-20" 
            required 
          />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Product Detail
          </button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-2">Product Details Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Vendor Order ID</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Product Name</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Total Purchase</th>
              <th className="border p-2 text-left">Sell Price/Qty</th>
              <th className="border p-2 text-left">Discount %</th>
              <th className="border p-2 text-left">Gender</th>
              <th className="border p-2 text-left">Size</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.ID} className="hover:bg-gray-50">
                <td className="border p-2">{row.ID}</td>
                <td className="border p-2">{row.Vendor_order_Id}</td>
                <td className="border p-2">{row.Category}</td>
                <td className="border p-2">{row.Product_Name}</td>
                <td className="border p-2">{row.Product_Quantity}</td>
                <td className="border p-2">${row.Total_Purchase_Price}</td>
                <td className="border p-2">${row.Product_Sell_Price_Per_Qty}</td>
                <td className="border p-2">{row.percent_of_discount}%</td>
                <td className="border p-2">{row.Gender}</td>
                <td className="border p-2">{row.Size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}