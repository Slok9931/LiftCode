'use client'

import { useState, useEffect } from 'react'
import { Card, Button, LoadingSpinner, EmptyState, Input, Select, Modal, SearchInput } from '../../components/ui'
import { apiService } from '../../lib/api'
import { User, CreateUserDTO } from '../../lib/types'
import { formatDate, validateEmail } from '../../lib/utils'
import Link from 'next/link'

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [roleFilter, setRoleFilter] = useState<'all' | 'gymmer' | 'viewer'>('all')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, roleFilter])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await apiService.getAllUsers()
            if (response.success && response.data) {
                setUsers(response.data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter)
        }

        setFilteredUsers(filtered)
    }

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm) {
            filterUsers()
            return
        }

        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )

        setFilteredUsers(filtered)
    }

    const handleCreateUser = async (userData: CreateUserDTO | Partial<CreateUserDTO>) => {
        setSubmitLoading(true)
        try {
            const response = await apiService.createUser(userData as CreateUserDTO)
            if (response.success) {
                setIsCreateModalOpen(false)
                fetchUsers()
            }
        } catch (error) {
            console.error('Error creating user:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleEditUser = async (userData: Partial<CreateUserDTO>) => {
        if (!selectedUser?.id) return

        setSubmitLoading(true)
        try {
            const response = await apiService.updateUser(selectedUser.id, userData)
            if (response.success) {
                setIsEditModalOpen(false)
                setSelectedUser(null)
                fetchUsers()
            }
        } catch (error) {
            console.error('Error updating user:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return

        try {
            const response = await apiService.deleteUser(id)
            if (response.success) {
                fetchUsers()
            }
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    const totalGymers = users.filter(user => user.role === 'gymmer').length
    const totalViewers = users.filter(user => user.role === 'viewer').length

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Users 👥
                    </h1>
                    <p className="text-secondary">
                        Manage users and their roles
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    Add User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="text-2xl font-bold text-primary">{users.length}</h3>
                    <p className="text-secondary">Total Users</p>
                </Card>

                <Card className="text-center">
                    <div className="text-3xl mb-2">🏋️</div>
                    <h3 className="text-2xl font-bold text-primary">{totalGymers}</h3>
                    <p className="text-secondary">Gymers</p>
                </Card>

                <Card className="text-center">
                    <div className="text-3xl mb-2">👀</div>
                    <h3 className="text-2xl font-bold text-primary">{totalViewers}</h3>
                    <p className="text-secondary">Viewers</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchInput
                        placeholder="Search users by name or email..."
                        onSearch={handleSearch}
                        label="Search"
                    />

                    <Select
                        label="Role"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as 'all' | 'gymmer' | 'viewer')}
                        options={[
                            { value: 'all', label: 'All Roles' },
                            { value: 'gymmer', label: 'Gymers' },
                            { value: 'viewer', label: 'Viewers' }
                        ]}
                    />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary">
                    <span className="text-secondary">
                        {filteredUsers.length} user(s) found
                    </span>
                    {roleFilter !== 'all' && (
                        <Button variant="ghost" size="small" onClick={() => setRoleFilter('all')}>
                            Clear Filter
                        </Button>
                    )}
                </div>
            </Card>

            {/* Users Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={(usr) => {
                                setSelectedUser(usr)
                                setIsEditModalOpen(true)
                            }}
                            onDelete={(id) => handleDeleteUser(id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No users found"
                    description="Start by creating user accounts"
                    action={
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            Add First User
                        </Button>
                    }
                />
            )}

            {/* Create/Edit Modal */}
            <UserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateUser}
                loading={submitLoading}
                title="Add New User"
            />

            <UserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedUser(null)
                }}
                onSubmit={handleEditUser}
                loading={submitLoading}
                title="Edit User"
                initialData={selectedUser}
            />
        </div>
    )
}

// User Card Component
interface UserCardProps {
    user: User
    onEdit: (user: User) => void
    onDelete: (id: number) => void
}

const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
    const getRoleColor = (role: string) => {
        return role === 'gymmer' ? 'bg-red text-white' : 'bg-secondary text-muted'
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
    }

    return (
        <Card className="group hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary group-hover:text-red transition-fast">
                            {user.name}
                        </h3>
                        <p className="text-secondary text-sm">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={() => onEdit(user)}
                    >
                        ✏️
                    </Button>
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={() => user.id && onDelete(user.id)}
                    >
                        🗑️
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-muted text-sm">Role:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                    </span>
                </div>

                {user.weight && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Weight:</span>
                        <span className="text-primary">{user.weight} lbs</span>
                    </div>
                )}

                {user.height && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Height:</span>
                        <span className="text-primary">{user.height} inches</span>
                    </div>
                )}

                {user.dob && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Date of Birth:</span>
                        <span className="text-primary">{formatDate(user.dob)}</span>
                    </div>
                )}

                {user.created_at && (
                    <div className="pt-3 border-t border-secondary">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">Joined:</span>
                            <span className="text-primary">{formatDate(user.created_at)}</span>
                        </div>
                    </div>
                )}

                <div className="pt-3">
                    <Link href={`/users/${user.id}`}>
                        <Button size="small" className="w-full">
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}

// User Modal Component
interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateUserDTO | Partial<CreateUserDTO>) => void
    loading: boolean
    title: string
    initialData?: User | null
}

const UserModal = ({ isOpen, onClose, onSubmit, loading, title, initialData }: UserModalProps) => {
    const [formData, setFormData] = useState<CreateUserDTO>({
        name: '',
        email: '',
        role: 'gymmer',
        dob: '',
        weight: undefined,
        height: undefined
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                role: initialData.role || 'gymmer',
                dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
                weight: initialData.weight,
                height: initialData.height
            })
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'gymmer',
                dob: '',
                weight: undefined,
                height: undefined
            })
        }
        setErrors({})
    }, [initialData, isOpen])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (formData.weight && formData.weight <= 0) {
            newErrors.weight = 'Weight must be positive'
        }

        if (formData.height && formData.height <= 0) {
            newErrors.height = 'Height must be positive'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        const submitData = {
            ...formData,
            dob: formData.dob || undefined,
            weight: formData.weight || undefined,
            height: formData.height || undefined
        }

        onSubmit(submitData)
    }

    const handleInputChange = (field: keyof CreateUserDTO, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name *"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        required
                    />
                </div>

                <Select
                    label="Role *"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    options={[
                        { value: 'gymmer', label: 'Gymmer - Can track workouts' },
                        { value: 'viewer', label: 'Viewer - Read-only access' }
                    ]}
                />

                <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Weight (lbs)"
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        error={errors.weight}
                        min="1"
                        step="0.1"
                    />

                    <Input
                        label="Height (inches)"
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                        error={errors.height}
                        min="1"
                        step="0.1"
                    />
                </div>

                <div className="flex space-x-3 pt-4">
                    <Button type="submit" loading={loading} className="flex-1">
                        {initialData ? 'Update' : 'Create'} User
                    </Button>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
