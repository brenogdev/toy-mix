import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toy Mix - Loja de Brinquedos",
  description: "Gestão de clientes e vendas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <Header />
          <Toaster position="top-center" />
          <main className="max-w-4xl mx-auto py-8 px-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
