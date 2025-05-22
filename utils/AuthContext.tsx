axios.defaults.withCredentials = true;

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import axios from "axios"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import api from "@/utils/axiosConfig"

// Função utilitária para ler cookies
function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
  return null;
}

interface User {
  username: string
  tipo: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      // Só tenta buscar o usuário se houver access_token
      if (!getCookie("access_token")) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const res = await api.get("user/me/")
        setUser(res.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      await api.post("token/", { username, password })
      const res = await api.get("user/me/")
      setUser(res.data)
      if (res.data.tipo === "professor") {
        router.push("/painel/professor")
      } else {
        router.push("/painel/aluno")
      }
    } catch (error) {
      throw new Error("Usuário ou senha inválidos!")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    document.cookie =
      "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    document.cookie =
      "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
