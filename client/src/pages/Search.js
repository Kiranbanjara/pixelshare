"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) return

    try {
      setLoading(true)
      const res = await axios.get(`/api/users/search?q=${searchTerm}`, { withCredentials: true })
      setResults(res.data)
      setSearched(true)
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">Find Creators</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for creators..."
            className="flex-grow px-4 py-3 rounded-l-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-r-lg focus:outline-none transition duration-300"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-4">
            {results.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user.name}`}
                className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.role === "creator" ? "Creator" : "Viewer"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No users found matching "{searchTerm}"</p>
          </div>
        )
      ) : null}
    </div>
  )
}

export default Search
