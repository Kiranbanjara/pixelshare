"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isCreator: false,
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true })
        if (res.data.user) {
          setUser(res.data.user)
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true })
      setUser(res.data.user)
    } catch (err) {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post("/api/auth/register", { name, email, password, role }, { withCredentials: true })
      setUser(res.data.user)
    } catch (err) {
      throw new Error("Registration failed")
    }
  }

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true })
      setUser(null)
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isCreator: user?.role === "creator",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
