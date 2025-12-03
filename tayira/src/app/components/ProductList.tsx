"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched products:", data)
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center py-4">Loading products...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (products.length === 0)
    return <div className="text-center py-4">No products available.</div>;

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  }

  return (
    <div className="products grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4 mt-6">
      {products.map((product) => (
        <div key={product.ID} className=" flex flex-col" onClick={() => handleProductClick(product.ID)}>
          <Image
            src={
              product.Image_Url.startsWith("/")
                ? product.Image_Url
                : `/images/${product.Image_Url.split("\\").pop() || ""}`
            }
            alt={product.Product_Name}
            width={120}
            height={120}
            className="object-cover"
            onError={(e) =>
              console.log(`Image load failed for ${product.Image_Url}`, e)
            }
            layout="responsive"
          />
          <div className="info_section">
            <h2 className="font-semibold ">{product.Product_Name}</h2>
            <p className="text-gray-600 ">{product.Product_Code} Dress</p>
            <p className="text-gray-600 ">{product.Description}</p>
            <span className="mt-2 font-bold">${product.Product_List_Price_Per_Qty}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
