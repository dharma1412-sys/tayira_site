import Header from "./components/Header/Header";
import BannerCarousel from "./components/BannerCarousel";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div className="font-sans items-center justify-items-center">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center w-full wrapper-main">
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
        <ProductList />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
