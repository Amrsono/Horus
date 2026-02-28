import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            <AdminSidebar />
            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen pt-20 md:pt-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
