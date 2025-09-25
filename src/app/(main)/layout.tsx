import { Header } from "@/components/header"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <main className="p-8 bg-white">
                {children}
            </main>
        </>
    )
}

