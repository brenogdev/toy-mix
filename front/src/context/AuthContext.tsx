"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";

interface AuthContextProps {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface LoginResponse {
  token: string;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      setUser(u);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      if (res.data.token) {
        setToken(res.data.token);
        setUser(username);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", username);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
