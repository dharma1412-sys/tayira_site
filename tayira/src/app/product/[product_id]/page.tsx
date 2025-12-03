import Header from "@/app/components/Header/Header";
import BannerCarousel from "@/app/components/BannerCarousel";
// import ProductList from "@/app/components/ProductList";
import ProductDetails from "@/app/components/ProductDetails/ProductDetails";
import Footer from "@/app/components/Footer";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const { product_id } = await params;
  const productId = product_id || "";
  console.log("Product ID:", productId);
  return (
    <div className="font-sans items-center justify-items-center">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col w-full wrapper-main">
        <div className="w-full flex flex-col items-center banner relative">
          <BannerCarousel
            images={[
              "/Images/banner-4.webp",
              "/Images/banner-9.jpg",
              "/Images/banner-7.webp",
              "/Images/banner-8.jpg",
            ]}
          />
        </div>

        {/* Products */}
        {productId && <ProductDetails product_id={productId} />}
        
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
