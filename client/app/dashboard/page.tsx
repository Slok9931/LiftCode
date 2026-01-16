'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, LogOut, Plus, Minus, Save, Users, TrendingUp } from 'lucide-react'

interface User {
    id: number
    name: string
    email: string
    weight: number
    height: number
    role: string
}

interface Exercise {
    id: number
    name: string
    category: string
    equipment: string
    difficulty_level: string
    primary_muscles: string[]
}

interface Set {
    id?: string
    exerciseId: number
    reps: number
    weight: number
    notes?: string
}

interface WorkoutSet {
    exercise: Exercise
    sets: Set[]
}

interface UserWorkoutData {
    user: User
    workoutSets: WorkoutSet[]
}

const workoutTypes = [
    { value: 'back', label: 'Back', categories: ['back'] },
    { value: 'biceps', label: 'Biceps', categories: ['biceps'] },
    { value: 'legs', label: 'Legs', categories: ['legs'] },
    { value: 'shoulders', label: 'Shoulders', categories: ['shoulders'] },
    { value: 'chest', label: 'Chest', categories: ['chest'] },
    { value: 'triceps', label: 'Triceps', categories: ['triceps'] }
]

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [userType, setUserType] = useState<'gymmer' | 'viewer' | null>(null)
    const [selectedMuscle, setSelectedMuscle] = useState<string>('')
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [userWorkouts, setUserWorkouts] = useState<UserWorkoutData[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const userData = localStorage.getItem('user')
        const userTypeData = localStorage.getItem('userType')

        if (!userData || !userTypeData) {
            router.push('/login')
        } else {
            setUser(JSON.parse(userData))
            setUserType(userTypeData as 'gymmer' | 'viewer')
            fetchUsers()
        }
    }, [router])

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`)
            if (response.ok) {
                const result = await response.json()
                if (result.success && Array.isArray(result.data)) {
                    const gymmerUsers = result.data.filter((u: User) => u.role === 'gymmer')
                    setUsers(gymmerUsers)
                } else {
                    console.error('Invalid users response:', result)
                    setUsers([])
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            setUsers([])
        }
    }

    const fetchExercises = async (category: string) => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exercises?category=${category}`)
            if (response.ok) {
                const result = await response.json()
                if (result.success && Array.isArray(result.data)) {
                    setExercises(result.data)

                    // Initialize workout data for both users
                    const initialWorkouts = users.map(user => ({
                        user,
                        workoutSets: result.data.map((exercise: Exercise) => ({
                            exercise,
                            sets: [{ exerciseId: exercise.id, reps: 0, weight: 0 }]
                        }))
                    }))
                    setUserWorkouts(initialWorkouts)
                } else {
                    console.error('Invalid exercises response:', result)
                    setExercises([])
                    setUserWorkouts([])
                }
            }
        } catch (error) {
            console.error('Error fetching exercises:', error)
            setExercises([])
            setUserWorkouts([])
        } finally {
            setLoading(false)
        }
    }

    const handleMuscleChange = (muscle: string) => {
        setSelectedMuscle(muscle)
        const muscleType = workoutTypes.find(w => w.value === muscle)
        if (muscleType) {
            fetchExercises(muscleType.categories[0])
        }
    }

    const addSet = (userIndex: number, exerciseIndex: number) => {
        const newUserWorkouts = [...userWorkouts]
        const newSet = {
            exerciseId: newUserWorkouts[userIndex].workoutSets[exerciseIndex].exercise.id,
            reps: 0,
            weight: 0
        }
        newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets.push(newSet)
        setUserWorkouts(newUserWorkouts)
    }

    const removeSet = (userIndex: number, exerciseIndex: number, setIndex: number) => {
        const newUserWorkouts = [...userWorkouts]
        newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets =
            newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets.filter((_, index) => index !== setIndex)
        setUserWorkouts(newUserWorkouts)
    }

    const updateSet = (userIndex: number, exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
        const newUserWorkouts = [...userWorkouts]
        newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets[setIndex][field] = value
        setUserWorkouts(newUserWorkouts)
    }

    const saveWorkout = async (userIndex: number) => {
        const userData = userWorkouts[userIndex]
        const setsToSave = userData.workoutSets.flatMap(workoutSet =>
            workoutSet.sets
                .filter(set => set.reps > 0 && set.weight > 0)
                .map(set => ({
                    user_id: userData.user.id,
                    exercise_id: set.exerciseId,
                    reps: set.reps,
                    weight: set.weight,
                    notes: set.notes || ''
                }))
        )

        if (setsToSave.length === 0) {
            alert('Please add at least one set with reps and weight')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sets: setsToSave })
            })

            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    alert(`Workout saved for ${userData.user.name}!`)
                    // Reset the workout for this user
                    const newUserWorkouts = [...userWorkouts]
                    newUserWorkouts[userIndex].workoutSets = exercises.map(exercise => ({
                        exercise,
                        sets: [{ exerciseId: exercise.id, reps: 0, weight: 0 }]
                    }))
                    setUserWorkouts(newUserWorkouts)
                } else {
                    alert(`Error saving workout: ${result.message}`)
                }
            } else {
                alert('Error saving workout')
            }
        } catch (error) {
            console.error('Error saving workout:', error)
            alert('Error saving workout')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('userType')
        router.push('/')
    }

    if (!user || !userType) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <nav className="bg-gray-900 shadow-lg border-b border-red-600/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Dumbbell className="h-6 w-6 text-red-400 mr-2" />
                            <h1 className="text-xl font-bold text-red-400">LiftCode</h1>
                            <Badge variant="outline" className="ml-4 border-red-600/50 text-red-300">
                                {userType.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300 hidden sm:block">
                                Welcome, {user.name}
                            </span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {userType === 'gymmer' ? (
                    <GymmerDashboard
                        selectedMuscle={selectedMuscle}
                        exercises={exercises}
                        users={users}
                        userWorkouts={userWorkouts}
                        loading={loading}
                        onMuscleChange={handleMuscleChange}
                        onAddSet={addSet}
                        onRemoveSet={removeSet}
                        onUpdateSet={updateSet}
                        onSaveWorkout={saveWorkout}
                    />
                ) : (
                    <ViewerDashboard
                        selectedMuscle={selectedMuscle}
                        users={users}
                        onMuscleChange={handleMuscleChange}
                    />
                )}
            </main>
        </div>
    )
}

interface GymmerDashboardProps {
    selectedMuscle: string
    exercises: Exercise[]
    users: User[]
    userWorkouts: UserWorkoutData[]
    loading: boolean
    onMuscleChange: (muscle: string) => void
    onAddSet: (userIndex: number, exerciseIndex: number) => void
    onRemoveSet: (userIndex: number, exerciseIndex: number, setIndex: number) => void
    onUpdateSet: (userIndex: number, exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => void
    onSaveWorkout: (userIndex: number) => void
}

function GymmerDashboard({
    selectedMuscle,
    exercises,
    users,
    userWorkouts,
    loading,
    onMuscleChange,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    onSaveWorkout
}: GymmerDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gray-900 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-red-400" />
                        Gymmer Comparison Dashboard
                    </CardTitle>
                    <p className="text-gray-400">Select a muscle group to compare workouts between users</p>
                </CardHeader>
            </Card>

            {/* Muscle Selection */}
            <Card className="bg-gray-900 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">Select Muscle Group</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {workoutTypes.map((muscle) => (
                            <Button
                                key={muscle.value}
                                variant={selectedMuscle === muscle.value ? "default" : "outline"}
                                onClick={() => onMuscleChange(muscle.value)}
                                className={`
                                    ${selectedMuscle === muscle.value
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    }
                                `}
                            >
                                {muscle.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <Card className="bg-gray-900 border-red-600/30">
                    <CardContent className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading exercises...</p>
                    </CardContent>
                </Card>
            )}

            {/* User Comparison */}
            {selectedMuscle && exercises.length > 0 && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userWorkouts.map((userData, userIndex) => (
                        <Card key={userData.user.id} className="bg-gray-900 border-red-600/30">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <div className="w-8 h-8 bg-red-600/20 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-red-400">
                                                    {userData.user.name.charAt(0)}
                                                </span>
                                            </div>
                                            {userData.user.name}
                                        </CardTitle>
                                        <p className="text-gray-400">
                                            {userData.user.weight}kg | {userData.user.height}cm
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                                        {selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {userData.workoutSets.map((workoutSet, exerciseIndex) => (
                                    <div key={workoutSet.exercise.id} className="border border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-white font-medium">{workoutSet.exercise.name}</h4>
                                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                                {workoutSet.exercise.difficulty_level}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            {workoutSet.sets.map((set, setIndex) => (
                                                <div key={setIndex} className="flex items-center gap-2">
                                                    <span className="text-gray-400 w-8 text-sm">#{setIndex + 1}</span>
                                                    <Input
                                                        type="number"
                                                        placeholder="Weight"
                                                        value={set.weight || ''}
                                                        onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                                        className="bg-gray-800 border-gray-600 text-white flex-1"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Reps"
                                                        value={set.reps || ''}
                                                        onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                        className="bg-gray-800 border-gray-600 text-white flex-1"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onRemoveSet(userIndex, exerciseIndex, setIndex)}
                                                        className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                                                        disabled={workoutSet.sets.length <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onAddSet(userIndex, exerciseIndex)}
                                            className="w-full mt-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Set
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    onClick={() => onSaveWorkout(userIndex)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Workout for {userData.user.name}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

interface ViewerDashboardProps {
    selectedMuscle: string
    users: User[]
    onMuscleChange: (muscle: string) => void
}

function ViewerDashboard({ selectedMuscle, users, onMuscleChange }: ViewerDashboardProps) {
    return (
        <div className="space-y-6">
            <Card className="bg-gray-900 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Viewer Dashboard
                    </CardTitle>
                    <p className="text-red-400">Read-only access to workout data</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.map((user) => (
                            <div key={user.id} className="p-4 bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-red-400">{user.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{user.name}</h3>
                                        <p className="text-gray-400 text-sm">{user.weight}kg | {user.height}cm</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-yellow-600/10 border-yellow-600/30">
                <CardContent className="p-4">
                    <div className="flex items-center">
                        <span className="text-xl mr-3">ℹ️</span>
                        <div>
                            <p className="text-yellow-400 font-medium">Viewer Access</p>
                            <p className="text-yellow-200 text-sm">You have read-only access to view workout data.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
