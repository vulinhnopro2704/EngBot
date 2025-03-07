"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Image, Tag, Smile, Send } from 'lucide-react'
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageTransition from "../components/PageTransition"
import { useAuth } from "../contexts/AuthContext"

const CreatePostPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [formData, setFormData] = useState({
    content: "",
    category: "",
    images: []
  })

  const [previewImages, setPreviewImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Categories for the post
  const categories = [
    { value: "grammar-tips", label: "Grammar Tips" },
    { value: "vocabulary", label: "Vocabulary" },
    { value: "pronunciation", label: "Pronunciation" },
    { value: "ielts-preparation", label: "IELTS Preparation" },
    { value: "idioms-phrases", label: "Idioms & Phrases" },
    { value: "learning-experience", label: "Learning Experience" },
  ]

  const handleContentChange = (e) => {
    setFormData({ ...formData, content: e.target.value })
  }

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    // In a real app, you would upload these files to your server
    // For now, we'll just create local preview URLs
    const newPreviewImages = files.map(file => URL.createObjectURL(file))

    setPreviewImages([...previewImages, ...newPreviewImages])
    setFormData({ ...formData, images: [...formData.images, ...files] })
  }

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages]
    updatedPreviews.splice(index, 1)
    setPreviewImages(updatedPreviews)

    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)
    setFormData({ ...formData, images: updatedImages })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.content.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Submitting post:", formData)
      setIsSubmitting(false)
      navigate("/community")
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
              Create New Post
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                  {currentUser?.name ? currentUser.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  @{currentUser?.username || "username"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <Textarea
                placeholder="Share your thoughts, questions, or learning tips..."
                value={formData.content}
                onChange={handleContentChange}
                className="min-h-[200px] resize-none border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                Category
              </label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {previewImages.length > 0 && (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                      type="button"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center">
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="h-9 text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Add Image
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="h-9 text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                >
                  <Smile className="h-4 w-4 mr-1" />
                  Add Emoji
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => navigate("/community")}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  type="submit"
                  disabled={!formData.content.trim() || isSubmitting}
                  className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Publish Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}

export default CreatePostPage

