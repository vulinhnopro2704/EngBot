"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, MoreHorizontal, UserPlus, Trash, Edit, Download, CheckCircle, XCircle } from 'lucide-react'
import { motion } from "framer-motion"
import PageTransition from "../../components/PageTransition"

const AdminUsers = () => {
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [sortBy, setSortBy] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    // Mock user data
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active", lastLogin: "2 hours ago", progress: 78 },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Student", status: "Active", lastLogin: "1 day ago", progress: 92 },
        { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Teacher", status: "Active", lastLogin: "3 days ago", progress: 45 },
        { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Student", status: "Inactive", lastLogin: "2 weeks ago", progress: 63 },
        { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "Admin", status: "Active", lastLogin: "5 hours ago", progress: 87 },
        { id: 6, name: "Sarah Brown", email: "sarah@example.com", role: "Student", status: "Active", lastLogin: "1 hour ago", progress: 54 },
        { id: 7, name: "David Miller", email: "david@example.com", role: "Student", status: "Pending", lastLogin: "Never", progress: 0 },
        { id: 8, name: "Jennifer Garcia", email: "jennifer@example.com", role: "Teacher", status: "Active", lastLogin: "4 days ago", progress: 72 },
        { id: 9, name: "James Rodriguez", email: "james@example.com", role: "Student", status: "Inactive", lastLogin: "1 month ago", progress: 31 },
        { id: 10, name: "Lisa Martinez", email: "lisa@example.com", role: "Student", status: "Active", lastLogin: "12 hours ago", progress: 89 },
        { id: 11, name: "Thomas Anderson", email: "thomas@example.com", role: "Student", status: "Active", lastLogin: "2 days ago", progress: 67 },
        { id: 12, name: "Patricia White", email: "patricia@example.com", role: "Teacher", status: "Active", lastLogin: "1 day ago", progress: 91 },
    ]

    // Pagination settings
    const usersPerPage = 8
    const totalPages = Math.ceil(users.length / usersPerPage)

    // Filter and sort users
    const filteredUsers = users
        .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRole = filterRole === "all" || user.role === filterRole
            const matchesStatus = filterStatus === "all" || user.status === filterStatus

            return matchesSearch && matchesRole && matchesStatus
        })
        .sort((a, b) => {
            if (sortBy === "name") {
                return sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            } else if (sortBy === "email") {
                return sortOrder === "asc"
                    ? a.email.localeCompare(b.email)
                    : b.email.localeCompare(a.email)
            } else if (sortBy === "progress") {
                return sortOrder === "asc"
                    ? a.progress - b.progress
                    : b.progress - a.progress
            }
            return 0
        })

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId))
        } else {
            setSelectedUsers([...selectedUsers, userId])
        }
    }

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(currentUsers.map(user => user.id))
        }
    }

    const handleDeleteUser = (user) => {
        setUserToDelete(user)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        // In a real app, you would delete the user from the database here
        console.log(`Deleting user: ${userToDelete.name}`)
        setShowDeleteModal(false)
        setUserToDelete(null)
    }

    const handleBulkDelete = () => {
        // In a real app, you would delete the selected users from the database here
        console.log(`Deleting users with IDs: ${selectedUsers.join(", ")}`)
        setSelectedUsers([])
    }

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortOrder("asc")
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
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">User Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">Manage your platform users</p>
                    </div>

                    <motion.button
                        className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 flex items-center transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddUserModal(true)}
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add User
                    </motion.button>
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
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="relative">
                                <select
                                    className="appearance-none block pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    className="appearance-none block pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Pending">Pending</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center transition-colors duration-200">
                                <Filter className="h-4 w-4 mr-2" />
                                More Filters
                            </button>

                            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center transition-colors duration-200">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                    variants={itemVariants}
                >
                    {selectedUsers.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex items-center justify-between transition-colors duration-200">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {selectedUsers.length} users selected
                            </span>
                            <button
                                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 text-sm flex items-center transition-colors duration-200"
                                onClick={handleBulkDelete}
                            >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete Selected
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                                checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("name")}
                                    >
                                        <div className="flex items-center">
                                            <span>Name</span>
                                            {sortBy === "name" && (
                                                <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("email")}
                                    >
                                        <div className="flex items-center">
                                            <span>Email</span>
                                            {sortBy === "email" && (
                                                <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("progress")}
                                    >
                                        <div className="flex items-center">
                                            <span>Progress</span>
                                            {sortBy === "progress" && (
                                                <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium transition-colors duration-200">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                                                    user.role === 'Teacher' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'} 
                        transition-colors duration-200`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                                    user.status === 'Inactive' ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' :
                                                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'} 
                        transition-colors duration-200`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 transition-colors duration-200">
                                                    <div
                                                        className={`h-full rounded-full ${user.progress < 30 ? 'bg-red-500 dark:bg-red-600' :
                                                            user.progress < 70 ? 'bg-yellow-500 dark:bg-yellow-600' :
                                                                'bg-green-500 dark:bg-green-600'
                                                            }`}
                                                        style={{ width: `${user.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">{user.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                            {user.lastLogin}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors duration-200">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
                                                    <Trash className="h-5 w-5" />
                                                </button>
                                                <div className="relative">
                                                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${currentPage === 1
                                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    } transition-colors duration-200`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${currentPage === totalPages
                                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    } transition-colors duration-200`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
                                    <span className="font-medium">{filteredUsers.length}</span> results
                                </p>
                            </div>
                            <div>
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
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Delete User Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full transition-colors duration-200">
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 transition-colors duration-200">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10 transition-colors duration-200">
                                            <Trash className="h-6 w-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">Delete User</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                                    Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse transition-colors duration-200">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {showAddUserModal && (
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
                                            <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">Add New User</h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Role
                                                    </label>
                                                    <select
                                                        id="role"
                                                        name="role"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                    >
                                                        <option>Student</option>
                                                        <option>Teacher</option>
                                                        <option>Admin</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        Status
                                                    </label>
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors duration-200"
                                                    >
                                                        <option>Active</option>
                                                        <option>Inactive</option>
                                                        <option>Pending</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse transition-colors duration-200">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                        onClick={() => setShowAddUserModal(false)}
                                    >
                                        Add User
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                        onClick={() => setShowAddUserModal(false)}
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

export default AdminUsers
