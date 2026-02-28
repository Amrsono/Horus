import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import SaleSection from "@/components/SaleSection";
import ProductsSection from "@/components/ProductsSection";
import DashboardSection from "@/components/DashboardSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] overflow-x-hidden">
      <Navbar />
      <Hero3D />
      <SaleSection />
      <ProductsSection />
      <DashboardSection />
      <Footer />
    </main>
  );
}
