'use client'

import { useState, useEffect } from 'react'
import { Card, Button, LoadingSpinner, EmptyState, Input, Select, Modal, Textarea, SearchInput } from '../../components/ui'
import { apiService } from '../../lib/api'
import { Exercise, CreateExerciseDTO, ExerciseFilters } from '../../lib/types'
import {
    EXERCISE_CATEGORIES,
    EQUIPMENT_TYPES,
    DIFFICULTY_LEVELS,
    MUSCLE_GROUPS,
    getCategoryIcon,
    getEquipmentIcon,
    getDifficultyColor,
    capitalizeFirst
} from '../../lib/utils'

export default function ExercisesPage() {
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<ExerciseFilters>({})
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        fetchExercises()
    }, [filters])

    const fetchExercises = async () => {
        setLoading(true)
        try {
            const response = await apiService.getAllExercises(filters)
            if (response.success && response.data) {
                setExercises(response.data)
            }
        } catch (error) {
            console.error('Error fetching exercises:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm || undefined }))
    }

    const handleFilterChange = (key: keyof ExerciseFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }))
    }

    const clearFilters = () => {
        setFilters({})
    }

    const handleCreateExercise = async (exerciseData: CreateExerciseDTO | Partial<CreateExerciseDTO>) => {
        setSubmitLoading(true)
        try {
            const response = await apiService.createExercise(exerciseData as CreateExerciseDTO)
            if (response.success) {
                setIsCreateModalOpen(false)
                fetchExercises()
            }
        } catch (error) {
            console.error('Error creating exercise:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleEditExercise = async (exerciseData: Partial<CreateExerciseDTO>) => {
        if (!selectedExercise?.id) return

        setSubmitLoading(true)
        try {
            const response = await apiService.updateExercise(selectedExercise.id, exerciseData)
            if (response.success) {
                setIsEditModalOpen(false)
                setSelectedExercise(null)
                fetchExercises()
            }
        } catch (error) {
            console.error('Error updating exercise:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDeleteExercise = async (id: number) => {
        if (!confirm('Are you sure you want to delete this exercise?')) return

        try {
            const response = await apiService.deleteExercise(id)
            if (response.success) {
                fetchExercises()
            }
        } catch (error) {
            console.error('Error deleting exercise:', error)
        }
    }

    const filteredExercisesCount = exercises.length
    const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Exercises 💪
                    </h1>
                    <p className="text-secondary">
                        Browse and manage your exercise library
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    Add Exercise
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <SearchInput
                        placeholder="Search exercises..."
                        onSearch={handleSearch}
                        label="Search"
                    />

                    <Select
                        label="Category"
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        options={[
                            { value: '', label: 'All Categories' },
                            ...EXERCISE_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))
                        ]}
                    />

                    <Select
                        label="Equipment"
                        value={filters.equipment || ''}
                        onChange={(e) => handleFilterChange('equipment', e.target.value)}
                        options={[
                            { value: '', label: 'All Equipment' },
                            ...EQUIPMENT_TYPES.map(eq => ({ value: eq.value, label: eq.label }))
                        ]}
                    />

                    <Select
                        label="Difficulty"
                        value={filters.difficulty || ''}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        options={[
                            { value: '', label: 'All Levels' },
                            ...DIFFICULTY_LEVELS.map(diff => ({ value: diff.value, label: diff.label }))
                        ]}
                    />
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center justify-between pt-4 border-t border-secondary">
                        <span className="text-secondary">
                            {filteredExercisesCount} exercise(s) found
                        </span>
                        <Button variant="ghost" size="small" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </Card>

            {/* Exercise Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : exercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map((exercise) => (
                        <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onEdit={(ex) => {
                                setSelectedExercise(ex)
                                setIsEditModalOpen(true)
                            }}
                            onDelete={(id) => handleDeleteExercise(id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={hasActiveFilters ? "No exercises found" : "No exercises yet"}
                    description={
                        hasActiveFilters
                            ? "Try adjusting your filters or create a new exercise"
                            : "Start building your exercise library"
                    }
                    action={
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            Add First Exercise
                        </Button>
                    }
                />
            )}

            {/* Create/Edit Modal */}
            <ExerciseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateExercise}
                loading={submitLoading}
                title="Add New Exercise"
            />

            <ExerciseModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedExercise(null)
                }}
                onSubmit={handleEditExercise}
                loading={submitLoading}
                title="Edit Exercise"
                initialData={selectedExercise}
            />
        </div>
    )
}

// Exercise Card Component
interface ExerciseCardProps {
    exercise: Exercise
    onEdit: (exercise: Exercise) => void
    onDelete: (id: number) => void
}

const ExerciseCard = ({ exercise, onEdit, onDelete }: ExerciseCardProps) => {
    return (
        <Card className="group hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
                    <div>
                        <h3 className="font-semibold text-primary group-hover:text-red transition-fast">
                            {exercise.name}
                        </h3>
                        <p className="text-secondary text-sm capitalize">
                            {exercise.category.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={() => onEdit(exercise)}
                    >
                        ✏️
                    </Button>
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={() => exercise.id && onDelete(exercise.id)}
                    >
                        🗑️
                    </Button>
                </div>
            </div>

            {exercise.description && (
                <p className="text-secondary text-sm mb-4 line-clamp-2">
                    {exercise.description}
                </p>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Equipment:</span>
                    <span className="text-primary flex items-center space-x-1">
                        <span>{getEquipmentIcon(exercise.equipment!)}</span>
                        <span className="capitalize">{exercise.equipment?.replace('_', ' ')}</span>
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Difficulty:</span>
                    <span className={`font-medium capitalize ${getDifficultyColor(exercise.difficulty_level)}`}>
                        {exercise.difficulty_level}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Primary Muscles:</span>
                    <span className="text-primary text-right">
                        {exercise.primary_muscles.slice(0, 2).map(muscle =>
                            capitalizeFirst(muscle.replace('_', ' '))
                        ).join(', ')}
                        {exercise.primary_muscles.length > 2 && ` +${exercise.primary_muscles.length - 2}`}
                    </span>
                </div>

                {exercise.instructions && exercise.instructions.length > 0 && (
                    <div className="pt-3 border-t border-secondary">
                        <span className="text-muted text-sm">Instructions available</span>
                    </div>
                )}
            </div>
        </Card>
    )
}

// Exercise Modal Component
interface ExerciseModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateExerciseDTO | Partial<CreateExerciseDTO>) => void
    loading: boolean
    title: string
    initialData?: Exercise | null
}

const ExerciseModal = ({ isOpen, onClose, onSubmit, loading, title, initialData }: ExerciseModalProps) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        category: 'chest',
        equipment: 'barbell',
        difficulty_level: 'beginner',
        primary_muscles: [],
        secondary_muscles: [],
        instructions: [],
        tips: [],
        is_active: true
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                category: initialData.category || 'chest',
                equipment: initialData.equipment || 'barbell',
                difficulty_level: initialData.difficulty_level || 'beginner',
                primary_muscles: initialData.primary_muscles || [],
                secondary_muscles: initialData.secondary_muscles || [],
                instructions: initialData.instructions || [],
                tips: initialData.tips || [],
                is_active: initialData.is_active ?? true
            })
        } else {
            setFormData({
                name: '',
                description: '',
                category: 'chest',
                equipment: 'barbell',
                difficulty_level: 'beginner',
                primary_muscles: [],
                secondary_muscles: [],
                instructions: [],
                tips: [],
                is_active: true
            })
        }
    }, [initialData, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            primary_muscles: Array.isArray(formData.primary_muscles)
                ? formData.primary_muscles
                : formData.primary_muscles.split(',').map((m: string) => m.trim()).filter(Boolean),
            secondary_muscles: Array.isArray(formData.secondary_muscles)
                ? formData.secondary_muscles
                : formData.secondary_muscles.split(',').map((m: string) => m.trim()).filter(Boolean),
            instructions: Array.isArray(formData.instructions)
                ? formData.instructions
                : formData.instructions.split('\n').filter(Boolean),
            tips: Array.isArray(formData.tips)
                ? formData.tips
                : formData.tips.split('\n').filter(Boolean),
        }

        onSubmit(submitData)
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Exercise Name *"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />

                    <Select
                        label="Category *"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        options={EXERCISE_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))}
                    />
                </div>

                <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the exercise..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Equipment *"
                        value={formData.equipment}
                        onChange={(e) => handleInputChange('equipment', e.target.value)}
                        options={EQUIPMENT_TYPES.map(eq => ({ value: eq.value, label: eq.label }))}
                    />

                    <Select
                        label="Difficulty Level *"
                        value={formData.difficulty_level}
                        onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                        options={DIFFICULTY_LEVELS.map(diff => ({ value: diff.value, label: diff.label }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Primary Muscles *"
                        value={Array.isArray(formData.primary_muscles) ? formData.primary_muscles.join(', ') : formData.primary_muscles}
                        onChange={(e) => handleInputChange('primary_muscles', e.target.value)}
                        placeholder="chest, triceps, shoulders"
                        required
                    />

                    <Input
                        label="Secondary Muscles"
                        value={Array.isArray(formData.secondary_muscles) ? formData.secondary_muscles.join(', ') : formData.secondary_muscles}
                        onChange={(e) => handleInputChange('secondary_muscles', e.target.value)}
                        placeholder="abs, forearms"
                    />
                </div>

                <Textarea
                    label="Instructions"
                    value={Array.isArray(formData.instructions) ? formData.instructions.join('\n') : formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Step 1: Setup&#10;Step 2: Execute&#10;Step 3: Return"
                />

                <Textarea
                    label="Tips"
                    value={Array.isArray(formData.tips) ? formData.tips.join('\n') : formData.tips}
                    onChange={(e) => handleInputChange('tips', e.target.value)}
                    placeholder="Keep your core tight&#10;Focus on form over weight"
                />

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm text-primary">
                        Exercise is active
                    </label>
                </div>

                <div className="flex space-x-3 pt-4">
                    <Button type="submit" loading={loading} className="flex-1">
                        {initialData ? 'Update' : 'Create'} Exercise
                    </Button>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
