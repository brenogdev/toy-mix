"use client";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Header() {
  const { user, logout, token } = useAuth();
  return (
    <header className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md py-4 px-6 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Toy Mix
        </Link>
        <span className="text-sm font-light">Loja de Brinquedos</span>
        {token && (
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">{user}</span>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded transition font-semibold"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
