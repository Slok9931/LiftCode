'use client'

import { useState, useEffect } from 'react'
import { Card, Button, LoadingSpinner, EmptyState, Input, Select, Modal } from '../../components/ui'
import { apiService } from '../../lib/api'
import { User, Exercise, Set, CreateSetDTO, SetWithExercises, SetType } from '../../lib/types'
import { formatWeight, calculateVolume, EXERCISE_CATEGORIES } from '../../lib/utils'

export default function WorkoutPage() {
    const [users, setUsers] = useState<User[]>([])
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [workoutSets, setWorkoutSets] = useState<SetWithExercises[]>([])
    const [isAddSetModalOpen, setIsAddSetModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [workoutStarted, setWorkoutStarted] = useState(false)

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [usersResponse, exercisesResponse] = await Promise.all([
                apiService.getAllUsers(),
                apiService.getAllExercises(),
            ])

            if (usersResponse.success && usersResponse.data) {
                const gymers = usersResponse.data.filter(user => user.role === 'gymmer')
                setUsers(gymers)
                if (gymers.length > 0) {
                    setCurrentUser(gymers[0])
                }
            }

            if (exercisesResponse.success && exercisesResponse.data) {
                setExercises(exercisesResponse.data)
            }
        } catch (error) {
            console.error('Error fetching initial data:', error)
        } finally {
            setLoading(false)
        }
    }

    const startWorkout = () => {
        setWorkoutStarted(true)
        setWorkoutSets([])
    }

    const endWorkout = () => {
        setWorkoutStarted(false)
        setWorkoutSets([])
    }

    const handleAddSet = async (setData: CreateSetDTO) => {
        if (!currentUser?.id) return

        setSubmitLoading(true)
        try {
            const setToCreate = {
                ...setData,
                user_id: currentUser.id,
                set_number: workoutSets.length + 1
            }

            const response = await apiService.createSet(setToCreate)
            if (response.success && response.data) {
                // Fetch the set with exercise details
                const setDetailResponse = await apiService.getSetById(response.data.id!)
                if (setDetailResponse.success && setDetailResponse.data) {
                    setWorkoutSets(prev => [...prev, setDetailResponse.data!])
                }
                setIsAddSetModalOpen(false)
            }
        } catch (error) {
            console.error('Error adding set:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDeleteSet = async (setId: number) => {
        if (!confirm('Are you sure you want to delete this set?')) return

        try {
            const response = await apiService.deleteSet(setId)
            if (response.success) {
                setWorkoutSets(prev => prev.filter(set => set.id !== setId))
            }
        } catch (error) {
            console.error('Error deleting set:', error)
        }
    }

    const getTotalVolume = () => {
        return workoutSets.reduce((total, set) => {
            const primaryVolume = calculateVolume(set.weight.primary, set.reps.primary)
            const secondaryVolume = set.weight.secondary && set.reps.secondary
                ? calculateVolume(set.weight.secondary, set.reps.secondary)
                : 0
            return total + primaryVolume + secondaryVolume
        }, 0)
    }

    const getExerciseStats = () => {
        const stats: Record<string, { sets: number; volume: number }> = {}

        workoutSets.forEach(set => {
            const exerciseName = set.exercise?.name || 'Unknown'
            if (!stats[exerciseName]) {
                stats[exerciseName] = { sets: 0, volume: 0 }
            }
            stats[exerciseName].sets += 1
            stats[exerciseName].volume += calculateVolume(set.weight.primary, set.reps.primary)
        })

        return Object.entries(stats).map(([name, data]) => ({ name, ...data }))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-secondary mt-4">Loading workout data...</p>
                </div>
            </div>
        )
    }

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title="No Active Gymers"
                    description="Create a gymmer account to start tracking workouts"
                    icon="🏋️"
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Workout Session 🏋️
                    </h1>
                    <p className="text-secondary">
                        Track your sets and monitor your progress
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    {users.length > 1 && (
                        <Select
                            value={currentUser.id?.toString() || ''}
                            onChange={(e) => {
                                const selectedUser = users.find(u => u.id?.toString() === e.target.value)
                                if (selectedUser) setCurrentUser(selectedUser)
                            }}
                            options={users.map(user => ({ value: user.id?.toString() || '', label: user.name }))}
                        />
                    )}

                    {!workoutStarted ? (
                        <Button onClick={startWorkout} size="large">
                            Start Workout
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={endWorkout} size="large">
                            End Workout
                        </Button>
                    )}
                </div>
            </div>

            {!workoutStarted ? (
                // Pre-workout view
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Current User">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-red rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-primary">{currentUser.name}</h3>
                                <p className="text-secondary">{currentUser.email}</p>
                                {currentUser.weight && (
                                    <p className="text-muted text-sm">Weight: {currentUser.weight} lbs</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Stats">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{exercises.length}</div>
                                <div className="text-secondary text-sm">Available Exercises</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{EXERCISE_CATEGORIES.length}</div>
                                <div className="text-secondary text-sm">Categories</div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                // Active workout view
                <div className="space-y-8">
                    {/* Workout Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <div className="text-3xl mb-2">🔢</div>
                            <h3 className="text-2xl font-bold text-primary">{workoutSets.length}</h3>
                            <p className="text-secondary">Total Sets</p>
                        </Card>

                        <Card className="text-center">
                            <div className="text-3xl mb-2">💪</div>
                            <h3 className="text-2xl font-bold text-primary">{getExerciseStats().length}</h3>
                            <p className="text-secondary">Exercises</p>
                        </Card>

                        <Card className="text-center">
                            <div className="text-3xl mb-2">📊</div>
                            <h3 className="text-2xl font-bold text-primary">{getTotalVolume()}</h3>
                            <p className="text-secondary">Volume (lbs)</p>
                        </Card>

                        <Card className="text-center">
                            <div className="text-3xl mb-2">⏱️</div>
                            <h3 className="text-2xl font-bold text-primary">Active</h3>
                            <p className="text-secondary">Status</p>
                        </Card>
                    </div>

                    {/* Add Set Button */}
                    <div className="text-center">
                        <Button
                            onClick={() => setIsAddSetModalOpen(true)}
                            size="large"
                            className="w-full md:w-auto"
                        >
                            + Add Set
                        </Button>
                    </div>

                    {/* Current Workout Sets */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card
                                title="Current Workout Sets"
                                actions={workoutSets.length > 0 && (
                                    <span className="text-secondary text-sm">
                                        {workoutSets.length} set(s)
                                    </span>
                                )}
                            >
                                {workoutSets.length > 0 ? (
                                    <div className="space-y-4">
                                        {workoutSets.map((set, index) => (
                                            <SetCard
                                                key={set.id}
                                                set={set}
                                                setNumber={index + 1}
                                                onDelete={() => set.id && handleDeleteSet(set.id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No sets yet"
                                        description="Add your first set to start the workout"
                                        icon="🏋️"
                                    />
                                )}
                            </Card>
                        </div>

                        {/* Exercise Summary */}
                        <div className="lg:col-span-1">
                            <Card title="Exercise Summary">
                                {getExerciseStats().length > 0 ? (
                                    <div className="space-y-3">
                                        {getExerciseStats().map((exercise) => (
                                            <div key={exercise.name} className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-primary">{exercise.name}</div>
                                                    <div className="text-secondary text-sm">{exercise.sets} sets</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-primary font-medium">{exercise.volume} lbs</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No exercises"
                                        description="Start adding sets to see exercise summary"
                                        icon="📊"
                                    />
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Set Modal */}
            <AddSetModal
                isOpen={isAddSetModalOpen}
                onClose={() => setIsAddSetModalOpen(false)}
                onSubmit={handleAddSet}
                exercises={exercises}
                loading={submitLoading}
            />
        </div>
    )
}

// Set Card Component
interface SetCardProps {
    set: SetWithExercises
    setNumber: number
    onDelete: () => void
}

const SetCard = ({ set, setNumber, onDelete }: SetCardProps) => {
    const getSetTypeIcon = (type: string) => {
        switch (type) {
            case 'normal': return '🏋️'
            case 'dropset': return '⬇️'
            case 'superset': return '🔄'
            default: return '🏋️'
        }
    }

    const getSetTypeColor = (type: string) => {
        switch (type) {
            case 'normal': return 'bg-secondary text-muted'
            case 'dropset': return 'bg-warning text-black'
            case 'superset': return 'bg-info text-white'
            default: return 'bg-secondary text-muted'
        }
    }

    return (
        <div className="p-4 bg-secondary rounded-lg border border-primary hover:bg-hover transition-fast">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {setNumber}
                    </div>
                    <div>
                        <h4 className="font-medium text-primary">{set.exercise?.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSetTypeColor(set.set_type)}`}>
                            {getSetTypeIcon(set.set_type)} {set.set_type}
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="small" onClick={onDelete}>
                    🗑️
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-muted">Weight:</span>
                    <span className="text-primary ml-2 font-medium">
                        {formatWeight(set.weight.primary)}
                    </span>
                </div>
                <div>
                    <span className="text-muted">Reps:</span>
                    <span className="text-primary ml-2 font-medium">
                        {set.reps.primary}
                    </span>
                </div>
            </div>

            {set.set_type === 'superset' && set.weight.secondary && set.reps.secondary && (
                <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-2 border-t border-secondary">
                    <div>
                        <span className="text-muted">Weight 2:</span>
                        <span className="text-primary ml-2 font-medium">
                            {formatWeight(set.weight.secondary)}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted">Reps 2:</span>
                        <span className="text-primary ml-2 font-medium">
                            {set.reps.secondary}
                        </span>
                    </div>
                </div>
            )}

            {set.note && (
                <div className="mt-3 pt-3 border-t border-secondary">
                    <span className="text-muted text-sm">Note: </span>
                    <span className="text-primary text-sm">{set.note}</span>
                </div>
            )}
        </div>
    )
}

// Add Set Modal Component
interface AddSetModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateSetDTO) => void
    exercises: Exercise[]
    loading: boolean
}

const AddSetModal = ({ isOpen, onClose, onSubmit, exercises, loading }: AddSetModalProps) => {
    const [formData, setFormData] = useState({
        exercise_id: '',
        set_type: 'normal' as SetType,
        weight_primary: '',
        weight_secondary: '',
        reps_primary: '',
        reps_secondary: '',
        drop_weight: '',
        drop_reps: '',
        note: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData: CreateSetDTO = {
            user_id: 0, // Will be set in parent component
            set_number: 1, // Will be set in parent component
            set_type: formData.set_type,
            exercise_id: parseInt(formData.exercise_id),
            weight: {
                primary: parseFloat(formData.weight_primary),
                secondary: formData.weight_secondary ? parseFloat(formData.weight_secondary) : undefined
            },
            reps: {
                primary: parseInt(formData.reps_primary),
                secondary: formData.reps_secondary ? parseInt(formData.reps_secondary) : undefined
            },
            drop_weight: formData.drop_weight ? parseFloat(formData.drop_weight) : undefined,
            drop_reps: formData.drop_reps ? parseInt(formData.drop_reps) : undefined,
            note: formData.note || undefined,
            completed: true
        }

        onSubmit(submitData)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Set" maxWidth="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Select
                    label="Exercise *"
                    value={formData.exercise_id}
                    onChange={(e) => handleInputChange('exercise_id', e.target.value)}
                    options={[
                        { value: '', label: 'Select an exercise' },
                        ...exercises.map(ex => ({ value: ex.id?.toString() || '', label: ex.name }))
                    ]}
                    required
                />

                <Select
                    label="Set Type *"
                    value={formData.set_type}
                    onChange={(e) => handleInputChange('set_type', e.target.value)}
                    options={[
                        { value: 'normal', label: '🏋️ Normal Set' },
                        { value: 'dropset', label: '⬇️ Drop Set' },
                        { value: 'superset', label: '🔄 Superset' }
                    ]}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Weight (lbs) *"
                        type="number"
                        value={formData.weight_primary}
                        onChange={(e) => handleInputChange('weight_primary', e.target.value)}
                        step="0.5"
                        min="0"
                        required
                    />
                    <Input
                        label="Reps *"
                        type="number"
                        value={formData.reps_primary}
                        onChange={(e) => handleInputChange('reps_primary', e.target.value)}
                        min="1"
                        required
                    />
                </div>

                {formData.set_type === 'superset' && (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Weight 2 (lbs)"
                            type="number"
                            value={formData.weight_secondary}
                            onChange={(e) => handleInputChange('weight_secondary', e.target.value)}
                            step="0.5"
                            min="0"
                        />
                        <Input
                            label="Reps 2"
                            type="number"
                            value={formData.reps_secondary}
                            onChange={(e) => handleInputChange('reps_secondary', e.target.value)}
                            min="1"
                        />
                    </div>
                )}

                {formData.set_type === 'dropset' && (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Drop Weight (lbs)"
                            type="number"
                            value={formData.drop_weight}
                            onChange={(e) => handleInputChange('drop_weight', e.target.value)}
                            step="0.5"
                            min="0"
                        />
                        <Input
                            label="Drop Reps"
                            type="number"
                            value={formData.drop_reps}
                            onChange={(e) => handleInputChange('drop_reps', e.target.value)}
                            min="1"
                        />
                    </div>
                )}

                <Input
                    label="Notes"
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    placeholder="Add any notes about this set..."
                />

                <div className="flex space-x-3 pt-4">
                    <Button type="submit" loading={loading} className="flex-1">
                        Add Set
                    </Button>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
