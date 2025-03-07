"use client"

import { Navigate, useLocation } from "react-router"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // You could render a loading spinner here
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!currentUser) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

