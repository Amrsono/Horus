import Navbar from "@/components/Navbar";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-[var(--color-obsidian)] overflow-x-hidden">
            <Navbar />
            <div className="pt-20">
                <ProductsSection />
            </div>
            <Footer />
        </main>
    );
}
