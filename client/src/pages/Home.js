"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import MediaCard from "../components/MediaCard"

const Home = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchMedia = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/media?page=${pageNum}`, { withCredentials: true })

      if (pageNum === 1) {
        setMedia(res.data.media)
      } else {
        setMedia((prev) => [...prev, ...res.data.media])
      }

      setHasMore(res.data.hasMore)
      setPage(pageNum)
    } catch (err) {
      setError("Failed to load media")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMedia(page + 1)
    }
  }

  const handleRatingChange = () => {
    fetchMedia(1)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">Discover Amazing Content</h1>

      {error && <div className="bg-red-500 text-white p-4 rounded mb-6">{error}</div>}

      <div className="max-w-2xl mx-auto">
        {media.length > 0 ? (
          <>
            {media.map((item) => (
              <MediaCard key={item._id} media={item} onRatingChange={handleRatingChange} />
            ))}

            {hasMore && (
              <div className="text-center mb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No media found. Follow some creators to see their content!</p>
          </div>
        ) : null}

        {loading && page === 1 && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 mb-8 animate-pulse"
              >
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                </div>
                <div className="h-64 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
