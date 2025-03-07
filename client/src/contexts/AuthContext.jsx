"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in from localStorage
        const user = localStorage.getItem("user")
        if (user) {
            setCurrentUser(JSON.parse(user))
        }
        setLoading(false)
    }, [])

    // Login function
    const login = (email, password) => {
        // In a real app, this would make an API call to authenticate
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // Check if user exists in localStorage (for demo purposes)
                const users = JSON.parse(localStorage.getItem("users") || "[]")
                const user = users.find((u) => u.email === email && u.password === password)

                if (user) {
                    // Create a user object without the password
                    const authenticatedUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                    }

                    // Store user in localStorage and state
                    localStorage.setItem("user", JSON.stringify(authenticatedUser))
                    setCurrentUser(authenticatedUser)
                    resolve(authenticatedUser)
                } else {
                    reject(new Error("Invalid email or password"))
                }
            }, 1000) // Simulate network delay
        })
    }

    // Signup function
    const signup = (name, email, password) => {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // Check if user already exists
                const users = JSON.parse(localStorage.getItem("users") || "[]")
                const existingUser = users.find((u) => u.email === email)

                if (existingUser) {
                    reject(new Error("User with this email already exists"))
                    return
                }

                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password, // In a real app, this would be hashed
                    createdAt: new Date().toISOString(),
                }

                // Add to users array
                users.push(newUser)
                localStorage.setItem("users", JSON.stringify(users))

                // Create a user object without the password
                const authenticatedUser = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                }

                // Store user in localStorage and state
                localStorage.setItem("user", JSON.stringify(authenticatedUser))
                setCurrentUser(authenticatedUser)
                resolve(authenticatedUser)
            }, 1000) // Simulate network delay
        })
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem("user")
        setCurrentUser(null)
    }

    const value = {
        currentUser,
        login,
        signup,
        logout,
        loading,
    }

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

