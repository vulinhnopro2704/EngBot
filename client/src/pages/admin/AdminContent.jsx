"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, MoreHorizontal, Plus, Trash, Edit, Eye, FileText, CheckSquare, BookOpen, Headphones, Edit3 } from 'lucide-react'
import { motion } from "framer-motion"
import PageTransition from "../../components/PageTransition"

const AdminContent = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState("title")
    const [sortOrder, setSortOrder] = useState("asc")
    const [filterLevel, setFilterLevel] = useState("all")
    const [showAddContentModal, setShowAddContentModal] = useState(false)

    // Mock content data
    const contentItems = [
        {
            id: 1,
            title: "Business English Vocabulary",
            type: "Flashcard Set",
            level: "Intermediate",
            author: "John Smith",
            created: "2023-05-15",
            status: "Published",
            views: 1245,
            rating: 4.8
        },
        {
            id: 2,
            title: "TOEFL Preparation Quiz",
            type: "Quiz",
            level: "Advanced",
            author: "Emily Johnson",
            created: "2023-06-02",
            status: "Published",
            views: 982,
            rating: 4.6
        },
        {
            id: 3,
            title: "Phrasal Verbs Mastery",
            type: "Flashcard Set",
            level: "Intermediate",
            author: "Michael Brown",
            created: "2023-04-20",
            status: "Published",
            views: 876,
            rating: 4.7
        },
        {
            id: 4,
            title: "English Idioms and Expressions",
            type: "Reading",
            level: "Intermediate",
            author: "Sarah Wilson",
            created: "2023-07-10",
            status: "Published",
            views: 754,
            rating: 4.5
        },
        {
            id: 5,
            title: "Advanced Grammar Quiz",
            type: "Quiz",
            level: "Advanced",
            author: "David Miller",
            created: "2023-03-28",
            status: "Published",
            views: 698,
            rating: 4.4
        },
        {
            id: 6,
            title: "Everyday Conversations",
            type: "Listening",
            level: "Beginner",
            author: "Jennifer Garcia",
            created: "2023-08-05",
            status: "Draft",
            views: 0,
            rating: 0
        },
        {
            id: 7,
            title: "Job Interview Preparation",
            type: "Writing",
            level: "Intermediate",
            author: "Robert Johnson",
            created: "2023-07-22",
            status: "Published",
            views: 432,
            rating: 4.3
        },
        {
            id: 8,
            title: "Academic Writing Skills",
            type: "Writing",
            level: "Advanced",
            author: "Lisa Martinez",
            created: "2023-06-15",
            status: "Review",
            views: 0,
            rating: 0
        },
    ]

    // Content types
    const contentTypes = [
        { id: "all", name: "All Content" },
        { id: "flashcards", name: "Flashcards" },
        { id: "quizzes", name: "Quizzes" },
        { id: "reading", name: "Reading" },
        { id: "listening", name: "Listening" },
        { id: "writing", name: "Writing" },
    ]

    // Pagination settings
    const itemsPerPage = 6
    const totalPages = Math.ceil(contentItems.length / itemsPerPage)

    // Filter and sort content
    const filteredContent = contentItems
        .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.author.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = activeTab === "all" ||
                (activeTab === "flashcards" && item.type === "Flashcard Set") ||
                (activeTab === "quizzes" && item.type === "Quiz") ||
                (activeTab === "reading" && item.type === "Reading") ||
                (activeTab === "listening" && item.type === "Listening") ||
                (activeTab === "writing" && item.type === "Writing")
            const matchesLevel = filterLevel === "all" || item.level === filterLevel

            return matchesSearch && matchesType && matchesLevel
        })
        .sort((a, b) => {
            if (sortBy === "title") {
                return sortOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            } else if (sortBy === "created") {
                return sortOrder === "asc"
                    ? new Date(a.created) - new Date(b.created)
                    : new Date(b.created) - new Date(a.created)
            } else if (sortBy === "views") {
                return sortOrder === "asc"
                    ? a.views - b.views
                    : b.views - a.views
            } else if (sortBy === "rating") {
                return sortOrder === "asc"
                    ? a.rating - b.rating
                    : b.rating - a.rating
            }
            return 0
        })

    // Get current content items for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredContent.slice(indexOfFirstItem, indexOfLastItem)

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortOrder("asc")
        }
    }

    const getContentTypeIcon = (type) => {
        switch (type) {
            case "Flashcard Set":
                return <BookOpen className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            case "Quiz":
                return <CheckSquare className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            case "Reading":
                return <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            case "Listening":
                return <Headphones className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            case "Writing":
                return <Edit3 className="h-5 w-5 text-pink-500 dark:text-pink-400" />
            default:
                return <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        }
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    }

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto">
                <motion.div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" variants={itemVariants}>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">Content Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">Manage your learning materials</p>
                    </div>

                    <motion.button
                        className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 flex items-center transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddContentModal(true)}
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Content
                    </motion.button>
                </motion.div>

                {/* Content Types Tabs */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6 transition-colors duration-200"
                    variants={itemVariants}
                >
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {contentTypes.map((type) => (
                            <motion.button
                                key={type.id}
                                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors duration-200 ${activeTab === type.id
                                    ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                onClick={() => setActiveTab(type.id)}
                                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                            >
                                {type.name}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-colors duration-200"
                    variants={itemVariants}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                placeholder="Search content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="relative">
                                <select
                                    className="appearance-none block pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                >
                                    <option value="all">All Levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center transition-colors duration-200">
                                <Filter className="h-4 w-4 mr-2" />
                                More Filters
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    variants={containerVariants}
                >
                    {currentItems.map((item) => (
                        <motion.div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3 transition-colors duration-200">
                                            {getContentTypeIcon(item.type)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{item.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{item.type}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full 
                    ${item.level === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                            item.level === 'Intermediate' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                                'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'} 
                    transition-colors duration-200`}
                                    >
                                        {item.level}
                                    </span>

                                    <span className={`px-2 py-1 text-xs font-medium rounded-full 
                    ${item.status === 'Published' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' :
                                            item.status === 'Draft' ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' :
                                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'} 
                    transition-colors duration-200`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                                    <p>Created by {item.author}</p>
                                    <p>Date: {new Date(item.created).toLocaleDateString()}</p>
                                </div>

                                {item.status === 'Published' && (
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                        <div className="flex items-center">
                                            <Eye className="h-4 w-4 mr-1" />
                                            <span>{item.views.toLocaleString()} views</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-current' : 'stroke-current fill-none'}`}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="ml-1">{item.rating}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-sm flex items-center transition-colors duration-200">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>

                                    <button className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm flex items-center transition-colors duration-200">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Preview
                                    </button>

                                    <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 text-sm flex items-center transition-colors duration-200">
                                        <Trash className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        className="flex justify-center mt-8"
                        variants={itemVariants}
                    >
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${currentPage === 1
                                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                                    : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    } transition-colors duration-200`}
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronDown className="h-5 w-5 transform rotate-90" />
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${currentPage === index + 1
                                        ? 'z-10 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        } transition-colors duration-200`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${currentPage === totalPages
                                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                                    : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    } transition-colors duration-200`}
                            >
                                <span className="sr-only">Next</span>
                                <ChevronDown className="h-5 w-5 transform -rotate-90" />
                            </button>
                        </nav>
                    </motion.div>
                )}

                {/* Add Content Modal */}
                {showAddContentModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full transition-colors duration-200">
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 transition-colors duration-200">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 sm:mx-0 sm:h-10 sm:w-10 transition-colors duration-200">
                                            <Plus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">Add New Content</h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                        placeholder="Content title"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Content Type
                                                    </label>
                                                    <select
                                                        id="type"
                                                        name="type"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                    >
                                                        <option>Flashcard Set</option>
                                                        <option>Quiz</option>
                                                        <option>Reading</option>
                                                        <option>Listening</option>
                                                        <option>Writing</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Level
                                                    </label>
                                                    <select
                                                        id="level"
                                                        name="level"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                    >
                                                        <option>Beginner</option>
                                                        <option>Intermediate</option>
                                                        <option>Advanced</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows="3"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                        placeholder="Brief description of the content"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse transition-colors duration-200">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                        onClick={() => setShowAddContentModal(false)}
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                        onClick={() => setShowAddContentModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}

export default AdminContent
