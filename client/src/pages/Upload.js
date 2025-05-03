"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"

const Upload = () => {
  const { isCreator } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    people: "",
    location: "",
  })
  const [mediaFile, setMediaFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const { title, description, people, location } = formData

  if (!isCreator) {
    navigate("/")
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith("image/")
    const maxSize = isImage ? 10 * 1024 * 1024 : 25 * 1024 * 1024 

    if (file.size > maxSize) {
      setError(`File size exceeds the limit (${isImage ? "10MB" : "25MB"})`)
      return
    }

    setMediaFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!mediaFile) {
      setError("Please select a file to upload")
      return
    }

    try {
      setLoading(true)
      setProgress(0)

      const data = new FormData()
      data.append("title", title)
      data.append("description", description)
      data.append("people", people)
      data.append("location", location)
      data.append("media", mediaFile)

      const response = await axios.post("/api/media/upload", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percentCompleted)
        },
      })

      navigate(`/profile/${response.data.creator.name}`)
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Upload Media</h2>

        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="description">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500 min-h-[100px]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="people">
              People (comma separated)
            </label>
            <input
              type="text"
              id="people"
              name="people"
              value={people}
              onChange={handleChange}
              placeholder="e.g. John, Jane, Alex"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="e.g. New York, Central Park"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="media">
              Media File (Max: 10MB for images, 25MB for videos)
            </label>
            <input
              type="file"
              id="media"
              name="media"
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <label
              htmlFor="media"
              className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">Images or Videos</p>
              </div>
            </label>
          </div>

          {preview && (
            <div className="mb-6">
              <h3 className="text-gray-300 mb-2">Preview:</h3>
              <div className="border border-gray-600 rounded-lg overflow-hidden">
                {mediaFile?.type.startsWith("image/") ? (
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-[300px] mx-auto" />
                ) : (
                  <video src={preview} controls className="max-h-[300px] w-full" />
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-center text-gray-400 mt-2">{progress}% Uploaded</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            disabled={loading || !mediaFile}
          >
            {loading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload
