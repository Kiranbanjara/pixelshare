"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import MediaCard from "../components/MediaCard"

const Profile = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const profileRes = await axios.get(`/api/users/profile/${username}`, { withCredentials: true })
        setProfile(profileRes.data)

        const mediaRes = await axios.get(`/api/media/user/${profileRes.data._id}`, { withCredentials: true })
        setMedia(mediaRes.data)
      } catch (err) {
        setError("Failed to load profile")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  const handleRatingChange = async () => {
    if (profile) {
      try {
        const mediaRes = await axios.get(`/api/media/user/${profile._id}`, { withCredentials: true })
        setMedia(mediaRes.data)
      } catch (err) {
        console.error("Failed to refresh media", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-64 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-red-500 text-white p-4 rounded mb-6 inline-block">{error || "Profile not found"}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
        <p className="text-gray-400 mb-2">{profile.email}</p>
        <div className="inline-block bg-gray-700 px-3 py-1 rounded-full text-sm text-purple-400 mb-4">
          {profile.role === "creator" ? "Creator" : "Viewer"}
        </div>

        {profile.role === "creator" && (
          <p className="text-gray-300">
            {media.length} {media.length === 1 ? "post" : "posts"}
          </p>
        )}
      </div>

      {profile.role === "creator" && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-purple-400">{profile.name}'s Media</h2>

          {media.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {media.map((item) => (
                <MediaCard key={item._id} media={item} onRatingChange={handleRatingChange} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No media uploads yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Profile
