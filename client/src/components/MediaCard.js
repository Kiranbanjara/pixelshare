"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

const MediaCard = ({ media, onRatingChange }) => {
  const { user } = useContext(AuthContext)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [userRating, setUserRating] = useState(media.userRating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [averageRating, setAverageRating] = useState(media.averageRating || 0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    setUserRating(media.userRating || 0)
    setAverageRating(media.averageRating || 0)
  }, [media.userRating, media.averageRating])

  const handleCommentToggle = async () => {
    if (!commentsLoaded && !showComments) {
      try {
        setLoading(true)
        const res = await axios.get(`/api/media/${media._id}/comments`, { withCredentials: true })
        setComments(res.data)
        setCommentsLoaded(true)
      } catch (err) {
        console.error("Error loading comments", err)
      } finally {
        setLoading(false)
      }
    }
    setShowComments(!showComments)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await axios.post(
        `/api/media/${media._id}/comments`,
        { content: newComment },
        { withCredentials: true },
      )
      setComments([...comments, res.data])
      setNewComment("")
    } catch (err) {
      console.error("Error posting comment", err)
    }
  }

  const handleRating = async (value) => {
    try {
      const res = await axios.post(`/api/media/${media._id}/rate`, { rating: value }, { withCredentials: true })
      setUserRating(value)
      setAverageRating(res.data.averageRating)
      if (onRatingChange) onRatingChange()
    } catch (err) {
      console.error("Error rating media", err)
    }
  }

  const handleDeleteMedia = async () => {
    try {
      setDeleteLoading(true)
      await axios.delete(`/api/media/${media._id}`, { withCredentials: true })
      if (onRatingChange) onRatingChange()
    } catch (err) {
      console.error("Error deleting media", err)
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const isCreator = user && media.creator._id === user._id

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 mb-8 transition-all duration-300 hover:shadow-purple-500/20">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Link to={`/profile/${media.creator.name}`} className="font-medium text-purple-400 hover:text-purple-300">
              {media.creator.name}
            </Link>
            <span className="text-gray-500 text-sm ml-2">• {formatDate(media.createdAt)}</span>
          </div>

          {isCreator && (
            <div className="relative">
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              {showDeleteConfirm && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10 p-2">
                  <p className="text-sm text-white mb-2">Delete this post?</p>
                  <div className="flex justify-between">
                    <button
                      onClick={handleDeleteMedia}
                      disabled={deleteLoading}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      {deleteLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">{media.title}</h3>
        {media.description && <p className="text-gray-400 mb-4">{media.description}</p>}

        {media.location && (
          <div className="flex items-center mb-2 text-gray-400">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span>{media.location}</span>
          </div>
        )}

        {media.people && media.people.length > 0 && (
          <div className="flex items-center mb-2 text-gray-400">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span>{Array.isArray(media.people) ? media.people.join(", ") : media.people}</span>
          </div>
        )}
      </div>

      <div className="relative">
        {media.mediaType === "image" ? (
          <img
            src={media.mediaUrl || "/placeholder.svg"}
            alt={media.title}
            className="w-full object-cover max-h-[600px]"
            loading="lazy"
          />
        ) : (
          <video src={media.mediaUrl} controls className="w-full max-h-[600px]" preload="metadata" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                className="focus:outline-none"
                onClick={() => handleRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <svg
                  className={`w-5 h-5 ${
                    hoverRating > 0
                      ? hoverRating > i
                        ? "text-yellow-400"
                        : "text-gray-600"
                      : averageRating > i
                        ? "text-yellow-400"
                        : "text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <span className="ml-2 text-gray-400">
            {averageRating > 0 ? `${averageRating.toFixed(1)} / 10` : "No ratings yet"}
          </span>
          {userRating > 0 && <span className="ml-2 text-sm text-purple-400">(Your rating: {userRating}/10)</span>}
        </div>

        <button onClick={handleCommentToggle} className="text-gray-400 hover:text-white transition-colors">
          {showComments ? "Hide comments" : `Show comments (${media.commentsCount})`}
        </button>

        {showComments && (
          <div className="mt-4">
            {loading ? (
              <p className="text-gray-500">Loading comments...</p>
            ) : comments.length > 0 ? (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-700 p-3 rounded">
                    <div className="flex items-center mb-1">
                      <Link to={`/profile/${comment.user.name}`} className="font-medium text-purple-400">
                        {comment.user.name}
                      </Link>
                      <span className="text-gray-500 text-xs ml-2">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 my-3">No comments yet. Be the first to comment!</p>
            )}

            <form onSubmit={handleCommentSubmit} className="mt-3">
              <div className="flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow px-4 py-2 rounded-l bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r focus:outline-none transition duration-300"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaCard
