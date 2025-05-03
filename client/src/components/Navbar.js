"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout, isAuthenticated, isCreator } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-400">
            PixelShare
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/search" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              Search
            </Link>

            {isAuthenticated ? (
              <>
                {isCreator && (
                  <Link to="/upload" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Upload
                  </Link>
                )}
                <Link to={`/profile/${user?.name}`} className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/search" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">
              Search
            </Link>

            {isAuthenticated ? (
              <>
                {isCreator && (
                  <Link to="/upload" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">
                    Upload
                  </Link>
                )}
                <Link
                  to={`/profile/${user?.name}`}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
