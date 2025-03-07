"use client"

import { useState } from "react"
import { ArrowLeft, Image, Save, X } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import PageTransition from "../components/PageTransition"
import { useAuth } from "../contexts/AuthContext"
import BlogRichTextEditor from "../components/blog/BlogRichTextEditor"

const CreateBlogPostPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    coverImage: null,
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Categories for the post
  const categories = [
    { value: "vocabulary", label: "Vocabulary" },
    { value: "grammar-tips", label: "Grammar Tips" },
    { value: "pronunciation", label: "Pronunciation" },
    { value: "ielts-preparation", label: "IELTS Preparation" },
    { value: "idioms-phrases", label: "Idioms & Phrases" },
    { value: "learning-experience", label: "Learning Experience" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value })
  }

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a local preview URL
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setFormData({ ...formData, coverImage: file })
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim().toLowerCase()],
      })
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Submitting post:", formData)
      setIsSubmitting(false)
      navigate("/blog")
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/blog")} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
              Create New Blog Post
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a descriptive title"
                className="mt-1 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <Label htmlFor="excerpt" className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Excerpt <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Write a brief summary of your post (1-2 sentences)"
                className="mt-1 min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
                required
              />
            </div>

            {/* Cover Image */}
            <div className="mb-6">
              <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-200">Cover Image</Label>
              <div className="mt-1 flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("cover-image").click()}
                  className="border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors duration-200"
                >
                  <Image className="h-4 w-4 mr-2" />
                  {previewImage ? "Change Image" : "Upload Image"}
                  <Input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Button>
              </div>

              {previewImage && (
                <div className="mt-3 relative">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => {
                      setPreviewImage(null)
                      setFormData({ ...formData, coverImage: null })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger className="mt-1 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <Label className="text-gray-700 dark:text-gray-300 transition-colors duration-200">Tags</Label>
              <div className="mt-1 flex">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  className="border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag(e)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                >
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-6">
              <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Content <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <BlogRichTextEditor value={formData.content} onChange={handleContentChange} />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/blog")} className="mr-2">
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}

export default CreateBlogPostPage

