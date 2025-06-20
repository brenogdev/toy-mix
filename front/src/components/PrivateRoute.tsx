"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [token, loading, router]);

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Carregando...</div>;
  }
  if (!token) {
    return null;
  }
  return <>{children}</>;
}
