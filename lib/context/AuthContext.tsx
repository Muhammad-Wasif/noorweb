'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  email: string
  name: string
  isGuest: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isGuest: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  loginAsGuest: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('noorweb-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('noorweb-user')
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, this would call an API
    const savedUsers = localStorage.getItem('noorweb-users')
    const users = savedUsers ? JSON.parse(savedUsers) : []
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password)
    
    if (foundUser) {
      const loggedInUser: User = {
        email: foundUser.email,
        name: foundUser.name,
        isGuest: false,
      }
      setUser(loggedInUser)
      localStorage.setItem('noorweb-user', JSON.stringify(loggedInUser))
      return true
    }
    
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration - in production, this would call an API
    const savedUsers = localStorage.getItem('noorweb-users')
    const users = savedUsers ? JSON.parse(savedUsers) : []
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false
    }
    
    // Save new user
    users.push({ name, email, password })
    localStorage.setItem('noorweb-users', JSON.stringify(users))
    
    // Auto login
    const newUser: User = { email, name, isGuest: false }
    setUser(newUser)
    localStorage.setItem('noorweb-user', JSON.stringify(newUser))
    
    return true
  }

  const loginAsGuest = () => {
    const guestUser: User = {
      email: '',
      name: 'مہمان',
      isGuest: true,
    }
    setUser(guestUser)
    localStorage.setItem('noorweb-user', JSON.stringify(guestUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('noorweb-user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: user?.isGuest || false,
        login,
        register,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
