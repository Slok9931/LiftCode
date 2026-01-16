'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dumbbell, LogOut, Plus, Minus, Save, Users, TrendingUp, User as UserIcon, Check, X, Zap, ArrowDown, Target, Activity, Repeat, Shield, Flame, Circle, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'

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
    set_number: number
    set_type: 'normal' | 'dropset' | 'superset'
    exercise_id: number
    superset_exercise_id?: number
    weight: number
    reps: number
    superset_weight?: number
    superset_reps?: number
    drop_weight?: number
    drop_reps?: number
    note?: string
    completed?: boolean
}

interface WorkoutSet {
    exercise: Exercise
    supersetExercise?: Exercise
    sets: Set[]
}

interface UserWorkoutData {
    user: User
    workoutSets: WorkoutSet[]
}

// Profile picture generator based on user name
const generateProfilePicture = (name: string) => {
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500'
    ]
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[nameHash % colors.length]
}

const workoutTypes = [
    {
        value: 'back',
        label: 'Back',
        categories: ['back'],
        icon: 'Target',
        description: 'Strengthen your back muscles'
    },
    {
        value: 'biceps',
        label: 'Biceps',
        categories: ['biceps'],
        icon: 'Zap',
        description: 'Build arm strength'
    },
    {
        value: 'legs',
        label: 'Legs',
        categories: ['legs'],
        icon: 'Activity',
        description: 'Lower body power'
    },
    {
        value: 'shoulders',
        label: 'Shoulders',
        categories: ['shoulders'],
        icon: 'Repeat',
        description: 'Shoulder stability'
    },
    {
        value: 'chest',
        label: 'Chest',
        categories: ['chest'],
        icon: 'Shield',
        description: 'Upper body strength'
    },
    {
        value: 'triceps',
        label: 'Triceps',
        categories: ['triceps'],
        icon: 'Flame',
        description: 'Arm definition'
    }
]

const exerciseTypes = [
    {
        value: 'normal',
        label: 'Normal Set',
        icon: 'Circle',
        description: 'Standard exercise sets'
    },
    {
        value: 'dropset',
        label: 'Drop Set',
        icon: 'TrendingDown',
        description: 'Reduce weight and continue'
    },
    {
        value: 'superset',
        label: 'Super Set',
        icon: 'Zap',
        description: 'Two exercises back-to-back'
    }
]

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [userType, setUserType] = useState<'gymmer' | 'viewer' | null>(null)
    const [selectedMuscle, setSelectedMuscle] = useState<string>('')
    const [selectedExerciseType, setSelectedExerciseType] = useState<string>('')
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [selectedSupersetExercise, setSelectedSupersetExercise] = useState<Exercise | null>(null)
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
                    setSelectedExercise(null)
                    setSelectedSupersetExercise(null)
                    setUserWorkouts([])
                } else {
                    console.error('Invalid exercises response:', result)
                    setExercises([])
                    setSelectedExercise(null)
                    setSelectedSupersetExercise(null)
                    setUserWorkouts([])
                }
            }
        } catch (error) {
            console.error('Error fetching exercises:', error)
            setExercises([])
            setSelectedExercise(null)
            setSelectedSupersetExercise(null)
            setUserWorkouts([])
        } finally {
            setLoading(false)
        }
    }

    const handleMuscleChange = (muscle: string) => {
        setSelectedMuscle(muscle)
        setSelectedExerciseType('')
        setSelectedExercise(null)
        setSelectedSupersetExercise(null)
        setUserWorkouts([])

        const muscleType = workoutTypes.find(w => w.value === muscle)
        if (muscleType) {
            fetchExercises(muscleType.categories[0])
        }
    }

    const handleExerciseTypeChange = (type: string) => {
        setSelectedExerciseType(type)
        setSelectedExercise(null)
        setSelectedSupersetExercise(null)
        setUserWorkouts([])
    }

    const selectExercise = (exercise: Exercise) => {
        setSelectedExercise(exercise)
    }

    const selectSupersetExercise = (exercise: Exercise) => {
        setSelectedSupersetExercise(exercise)
    }

    const startWorkout = () => {
        if (!selectedExercise) {
            toast.error('Please select an exercise first')
            return
        }

        if (selectedExerciseType === 'superset' && !selectedSupersetExercise) {
            toast.error('Please select a superset exercise')
            return
        }

        // Initialize workout data for both users
        let workoutSets: WorkoutSet[] = []

        if (selectedExerciseType === 'superset') {
            workoutSets = [{
                exercise: selectedExercise,
                supersetExercise: selectedSupersetExercise,
                sets: [{
                    set_number: 1,
                    set_type: 'superset',
                    exercise_id: selectedExercise.id,
                    superset_exercise_id: selectedSupersetExercise!.id,
                    weight: 0,
                    reps: 0,
                    superset_weight: 0,
                    superset_reps: 0,
                    completed: false
                }]
            }]
        } else {
            workoutSets = [{
                exercise: selectedExercise,
                sets: [{
                    set_number: 1,
                    set_type: selectedExerciseType as 'normal' | 'dropset',
                    exercise_id: selectedExercise.id,
                    weight: 0,
                    reps: 0,
                    drop_weight: selectedExerciseType === 'dropset' ? 0 : undefined,
                    drop_reps: selectedExerciseType === 'dropset' ? 0 : undefined,
                    completed: false
                }]
            }]
        }

        const initialWorkouts = users.map(user => ({
            user,
            workoutSets: JSON.parse(JSON.stringify(workoutSets)) // Deep copy
        }))

        setUserWorkouts(initialWorkouts)
    }

    const addSet = (userIndex: number, exerciseIndex: number) => {
        const newUserWorkouts = [...userWorkouts]
        const currentSets = newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets
        const newSetNumber = currentSets.length + 1
        const workoutSet = newUserWorkouts[userIndex].workoutSets[exerciseIndex]

        const newSet: Set = {
            set_number: newSetNumber,
            set_type: selectedExerciseType as 'normal' | 'dropset' | 'superset',
            exercise_id: workoutSet.exercise.id,
            superset_exercise_id: workoutSet.supersetExercise?.id,
            weight: 0,
            reps: 0,
            superset_weight: selectedExerciseType === 'superset' ? 0 : undefined,
            superset_reps: selectedExerciseType === 'superset' ? 0 : undefined,
            drop_weight: selectedExerciseType === 'dropset' ? 0 : undefined,
            drop_reps: selectedExerciseType === 'dropset' ? 0 : undefined,
            completed: false
        }

        newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets.push(newSet)
        setUserWorkouts(newUserWorkouts)
    }

    const removeSet = (userIndex: number, exerciseIndex: number, setIndex: number) => {
        const newUserWorkouts = [...userWorkouts]
        newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets =
            newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets.filter((_, index) => index !== setIndex)

        // Update set numbers
        newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets.forEach((set, index) => {
            set.set_number = index + 1
        })

        setUserWorkouts(newUserWorkouts)
    }

    const updateSet = (userIndex: number, exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
        const newUserWorkouts = [...userWorkouts]
            ; (newUserWorkouts[userIndex].workoutSets[exerciseIndex].sets[setIndex] as any)[field] = value
        setUserWorkouts(newUserWorkouts)
    }

    const saveWorkout = async (userIndex: number) => {
        const userData = userWorkouts[userIndex]
        const setsToSave = userData.workoutSets.flatMap(workoutSet =>
            workoutSet.sets
                .filter(set => {
                    // For normal and dropset: check primary weight and reps
                    if (selectedExerciseType !== 'superset') {
                        return set.reps > 0 && set.weight > 0
                    }
                    // For superset: check both primary and secondary weight/reps
                    return set.reps > 0 && set.weight > 0 &&
                        (set.superset_reps || 0) > 0 && (set.superset_weight || 0) > 0
                })
                .map(set => ({
                    user_id: userData.user.id,
                    set_number: set.set_number,
                    set_type: set.set_type,
                    exercise_id: set.exercise_id,
                    superset_exercise_id: set.superset_exercise_id,
                    weight: {
                        primary: set.weight,
                        secondary: selectedExerciseType === 'superset' ? set.superset_weight : undefined
                    },
                    reps: {
                        primary: set.reps,
                        secondary: selectedExerciseType === 'superset' ? set.superset_reps : undefined
                    },
                    drop_weight: set.drop_weight,
                    drop_reps: set.drop_reps,
                    note: set.note && set.note.trim() ? set.note.trim() : undefined,
                    completed: true
                }))
        )

        if (setsToSave.length === 0) {
            if (selectedExerciseType === 'superset') {
                toast.error('Please add at least one complete set with weight and reps for both exercises')
            } else {
                toast.error('Please add at least one set with weight and reps')
            }
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sets/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sets: setsToSave })
            })

            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    toast.success(`Workout saved for ${userData.user.name}! 🎉`, {
                        description: 'Your workout data has been successfully recorded.'
                    })
                    // Reset the workout for this user
                    const newUserWorkouts = [...userWorkouts]
                    newUserWorkouts[userIndex].workoutSets = [{
                        exercise: selectedExercise!,
                        supersetExercise: selectedSupersetExercise,
                        sets: [{
                            set_number: 1,
                            set_type: selectedExerciseType as 'normal' | 'dropset' | 'superset',
                            exercise_id: selectedExercise!.id,
                            superset_exercise_id: selectedSupersetExercise?.id,
                            weight: 0,
                            reps: 0,
                            superset_weight: selectedExerciseType === 'superset' ? 0 : undefined,
                            superset_reps: selectedExerciseType === 'superset' ? 0 : undefined,
                            drop_weight: selectedExerciseType === 'dropset' ? 0 : undefined,
                            drop_reps: selectedExerciseType === 'dropset' ? 0 : undefined,
                            completed: false
                        }]
                    }]
                    setUserWorkouts(newUserWorkouts)
                } else {
                    toast.error('Error saving workout', {
                        description: result.message || 'Failed to save workout data'
                    })
                }
            } else {
                const errorResult = await response.json()
                toast.error('Error saving workout', {
                    description: errorResult.message || 'Failed to save workout data'
                })
            }
        } catch (error) {
            console.error('Error saving workout:', error)
            toast.error('Network error', {
                description: 'Unable to save workout. Please check your connection.'
            })
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
                        selectedExerciseType={selectedExerciseType}
                        exercises={exercises}
                        selectedExercise={selectedExercise}
                        selectedSupersetExercise={selectedSupersetExercise}
                        users={users}
                        userWorkouts={userWorkouts}
                        loading={loading}
                        onMuscleChange={handleMuscleChange}
                        onExerciseTypeChange={handleExerciseTypeChange}
                        onSelectExercise={selectExercise}
                        onSelectSupersetExercise={selectSupersetExercise}
                        onStartWorkout={startWorkout}
                        onAddSet={addSet}
                        onRemoveSet={removeSet}
                        onUpdateSet={updateSet}
                        onSaveWorkout={saveWorkout}
                    />
                ) : (
                    <ViewerDashboard
                        users={users}
                    />
                )}
            </main>
        </div>
    )
}

interface GymmerDashboardProps {
    selectedMuscle: string
    selectedExerciseType: string
    exercises: Exercise[]
    selectedExercise: Exercise | null
    selectedSupersetExercise: Exercise | null
    users: User[]
    userWorkouts: UserWorkoutData[]
    loading: boolean
    onMuscleChange: (muscle: string) => void
    onExerciseTypeChange: (type: string) => void
    onSelectExercise: (exercise: Exercise) => void
    onSelectSupersetExercise: (exercise: Exercise) => void
    onStartWorkout: () => void
    onAddSet: (userIndex: number, exerciseIndex: number) => void
    onRemoveSet: (userIndex: number, exerciseIndex: number, setIndex: number) => void
    onUpdateSet: (userIndex: number, exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => void
    onSaveWorkout: (userIndex: number) => void
}

function GymmerDashboard({
    selectedMuscle,
    selectedExerciseType,
    exercises,
    selectedExercise,
    selectedSupersetExercise,
    users,
    userWorkouts,
    loading,
    onMuscleChange,
    onExerciseTypeChange,
    onSelectExercise,
    onSelectSupersetExercise,
    onStartWorkout,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    onSaveWorkout
}: GymmerDashboardProps) {
    const getIconComponent = (iconName: string) => {
        const icons: { [key: string]: any } = {
            Target,
            Zap,
            Activity,
            Repeat,
            Shield,
            Flame,
            Circle,
            TrendingDown
        }
        return icons[iconName] || Circle
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gray-900 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-red-400" />
                        Gymmer Comparison Dashboard
                    </CardTitle>
                    <p className="text-gray-400">Select muscle group → exercise type → specific exercises → start workout</p>
                </CardHeader>
            </Card>

            {/* Step 1: Muscle Selection */}
            <Card className="bg-gray-900 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Badge className="bg-red-600">1</Badge>
                        Select Muscle Group
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {workoutTypes.map((muscle) => {
                            const IconComponent = getIconComponent(muscle.icon)
                            return (
                                <Button
                                    key={muscle.value}
                                    variant={selectedMuscle === muscle.value ? "default" : "outline"}
                                    onClick={() => onMuscleChange(muscle.value)}
                                    className={`
                                        p-6 h-auto flex flex-col items-center gap-3 border-2 transition-all
                                        ${selectedMuscle === muscle.value
                                            ? 'bg-red-600 hover:bg-red-700 text-white border-red-500'
                                            : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <IconComponent className="h-8 w-8" />
                                    <span className="font-medium text-lg">{muscle.label}</span>
                                    <span className="text-sm opacity-75 text-center leading-tight">{muscle.description}</span>
                                </Button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Step 2: Exercise Type Selection */}
            {selectedMuscle && (
                <Card className="bg-gray-900 border-red-600/30">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Badge className="bg-red-600">2</Badge>
                            Select Exercise Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {exerciseTypes.map((type) => {
                                const IconComponent = getIconComponent(type.icon)
                                return (
                                    <Button
                                        key={type.value}
                                        variant={selectedExerciseType === type.value ? "default" : "outline"}
                                        onClick={() => onExerciseTypeChange(type.value)}
                                        className={`
                                            p-6 h-auto flex flex-col items-center gap-3 border-2 transition-all
                                            ${selectedExerciseType === type.value
                                                ? 'bg-red-600 hover:bg-red-700 text-white border-red-500'
                                                : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                                            }
                                        `}
                                    >
                                        <IconComponent className="h-8 w-8" />
                                        <span className="font-medium text-lg">{type.label}</span>
                                        <span className="text-sm opacity-75 text-center leading-tight">{type.description}</span>
                                    </Button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <Card className="bg-gray-900 border-red-600/30">
                    <CardContent className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading exercises...</p>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Exercise Selection */}
            {selectedExerciseType && exercises.length > 0 && !loading && (
                <Card className="bg-gray-900 border-red-600/30">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Badge className="bg-red-600">3</Badge>
                                Choose Primary Exercise for {selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)}
                            </CardTitle>
                            {selectedExercise && (
                                <Badge variant="outline" className="border-green-500/50 text-green-400">
                                    Selected: {selectedExercise.name}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {exercises.map((exercise) => {
                                const isSelected = selectedExercise?.id === exercise.id
                                return (
                                    <Card
                                        key={exercise.id}
                                        className={`
                                            cursor-pointer transition-all border-2
                                            ${isSelected
                                                ? 'bg-green-600/20 border-green-500 shadow-lg shadow-green-500/20'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                                            }
                                        `}
                                        onClick={() => onSelectExercise(exercise)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-white text-lg mb-1">{exercise.name}</h4>
                                                    <p className="text-sm text-gray-400 mb-2">{exercise.equipment}</p>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-700 text-gray-300 text-xs"
                                                    >
                                                        {exercise.difficulty_level}
                                                    </Badge>
                                                </div>
                                                <div className="ml-3">
                                                    {isSelected ? (
                                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                                            <Check className="h-5 w-5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-gray-400">
                                                            <Plus className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3.5: Superset Exercise Selection */}
            {selectedExerciseType === 'superset' && selectedExercise && (
                <Card className="bg-gray-900 border-orange-600/30">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="h-5 w-5 text-orange-400" />
                                Choose Second Exercise for Superset
                            </CardTitle>
                            {selectedSupersetExercise && (
                                <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                                    Selected: {selectedSupersetExercise.name}
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm">This will be paired with {selectedExercise.name}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {exercises.map((exercise) => {
                                const isSelected = selectedSupersetExercise?.id === exercise.id
                                const isPrimarySelected = selectedExercise?.id === exercise.id

                                return (
                                    <Card
                                        key={exercise.id}
                                        className={`
                                            cursor-pointer transition-all border-2
                                            ${isPrimarySelected
                                                ? 'opacity-50 cursor-not-allowed bg-gray-800/30 border-gray-600'
                                                : isSelected
                                                    ? 'bg-orange-600/20 border-orange-500 shadow-lg shadow-orange-500/20'
                                                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                                            }
                                        `}
                                        onClick={() => !isPrimarySelected && onSelectSupersetExercise(exercise)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-white text-lg mb-1">{exercise.name}</h4>
                                                    <p className="text-sm text-gray-400 mb-2">{exercise.equipment}</p>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-700 text-gray-300 text-xs"
                                                    >
                                                        {exercise.difficulty_level}
                                                    </Badge>
                                                </div>
                                                <div className="ml-3">
                                                    {isPrimarySelected ? (
                                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                                            <X className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    ) : isSelected ? (
                                                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                                                            <Check className="h-5 w-5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-gray-400">
                                                            <Plus className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Start Workout Button */}
            {selectedExercise &&
                (selectedExerciseType !== 'superset' || selectedSupersetExercise) && (
                    <Card className="bg-gray-900 border-green-600/30">
                        <CardContent className="p-8 text-center">
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <Badge className="bg-green-600 text-white px-4 py-2 text-base">
                                        Ready to Start Workout
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white text-lg font-medium">
                                        Selected Exercise: {selectedExercise.name}
                                    </p>
                                    {selectedSupersetExercise && (
                                        <p className="text-orange-400 text-lg font-medium">
                                            Superset with: {selectedSupersetExercise.name}
                                        </p>
                                    )}
                                    <p className="text-gray-400">
                                        Type: {selectedExerciseType.charAt(0).toUpperCase() + selectedExerciseType.slice(1)} Set
                                    </p>
                                </div>
                                <Button
                                    onClick={onStartWorkout}
                                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-12 py-6 h-auto font-semibold"
                                    size="lg"
                                >
                                    <UserIcon className="h-6 w-6 mr-3" />
                                    Start Workout Session
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

            {/* Active Workout Session */}
            {userWorkouts.length > 0 && (
                <div className="space-y-6">
                    <div className="text-center space-y-3">
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-xl px-6 py-3 font-semibold">
                            <Dumbbell className="h-5 w-5 mr-2" />
                            Active Workout Session
                        </Badge>
                        <div className="flex justify-center space-x-4">
                            <Badge className="bg-red-600 text-white px-3 py-1">
                                {selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)}
                            </Badge>
                            <Badge className="bg-blue-600 text-white px-3 py-1">
                                {selectedExerciseType.charAt(0).toUpperCase() + selectedExerciseType.slice(1)} Set
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {userWorkouts.map((userData, userIndex) => (
                            <Card key={userData.user.id} className="bg-gray-900 border-red-600/30">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${generateProfilePicture(userData.user.name)}`}>
                                                {userData.user.name.split(' ').map(n => n.charAt(0)).join('')}
                                            </div>
                                            <div>
                                                <CardTitle className="text-white text-xl mb-1">
                                                    {userData.user.name}
                                                </CardTitle>
                                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                    <span>{userData.user.weight}kg</span>
                                                    <span>|</span>
                                                    <span>{userData.user.height}cm</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="border-green-500/50 text-green-400 px-3 py-1">
                                            Tracking Sets
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {userData.workoutSets.map((workoutSet, exerciseIndex) => (
                                        <div key={workoutSet.exercise.id} className="space-y-4">
                                            {/* Exercise Header */}
                                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-white font-semibold text-lg">{workoutSet.exercise.name}</h3>
                                                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                                        {workoutSet.exercise.difficulty_level}
                                                    </Badge>
                                                </div>
                                                {workoutSet.supersetExercise && (
                                                    <div className="flex items-center gap-2 text-orange-400">
                                                        <ArrowDown className="h-4 w-4" />
                                                        <span className="font-medium">{workoutSet.supersetExercise.name}</span>
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-400 mt-1">Equipment: {workoutSet.exercise.equipment}</p>
                                            </div>

                                            {/* Sets Tracking */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-white font-medium">Set Tracking</h4>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onAddSet(userIndex, exerciseIndex)}
                                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Set
                                                    </Button>
                                                </div>

                                                {workoutSet.sets.map((set, setIndex) => (
                                                    <Card key={setIndex} className="bg-gray-800/50 border border-gray-700">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <Badge className="bg-red-600 text-white px-3 py-1">
                                                                    Set {set.set_number}
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => onRemoveSet(userIndex, exerciseIndex, setIndex)}
                                                                    className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                                                                    disabled={workoutSet.sets.length <= 1}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            {/* Primary Exercise Input */}
                                                            <div className="space-y-3">
                                                                <div className="text-sm font-medium text-blue-400 mb-2">
                                                                    {workoutSet.exercise.name}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-300 mb-2 block">
                                                                            Weight (lbs)
                                                                        </Label>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0"
                                                                            value={set.weight || ''}
                                                                            onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                                                            className="bg-gray-800 border-gray-600 text-white h-10"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-300 mb-2 block">
                                                                            Reps
                                                                        </Label>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0"
                                                                            value={set.reps || ''}
                                                                            onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                                            className="bg-gray-800 border-gray-600 text-white h-10"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Superset Exercise Input */}
                                                                {selectedExerciseType === 'superset' && workoutSet.supersetExercise && (
                                                                    <div className="pt-3 border-t border-gray-700">
                                                                        <div className="text-sm font-medium text-orange-400 mb-2">
                                                                            {workoutSet.supersetExercise.name}
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                                                                                    Weight (lbs)
                                                                                </Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                    value={set.superset_weight || ''}
                                                                                    onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'superset_weight', parseFloat(e.target.value) || 0)}
                                                                                    className="bg-gray-800 border-gray-600 text-white h-10"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                                                                                    Reps
                                                                                </Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                    value={set.superset_reps || ''}
                                                                                    onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'superset_reps', parseInt(e.target.value) || 0)}
                                                                                    className="bg-gray-800 border-gray-600 text-white h-10"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}                                                                {/* Drop Set Fields */}
                                                                {selectedExerciseType === 'dropset' && (
                                                                    <div className="pt-3 border-t border-gray-700">
                                                                        <Label className="text-sm font-medium text-orange-400 mb-2 block">
                                                                            Drop Set
                                                                        </Label>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label className="text-xs text-gray-400 mb-1 block">Drop Weight</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                    value={set.drop_weight || ''}
                                                                                    onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'drop_weight', parseFloat(e.target.value) || 0)}
                                                                                    className="bg-gray-800 border-gray-600 text-white h-9"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-xs text-gray-400 mb-1 block">Drop Reps</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                    value={set.drop_reps || ''}
                                                                                    onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'drop_reps', parseInt(e.target.value) || 0)}
                                                                                    className="bg-gray-800 border-gray-600 text-white h-9"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Notes */}
                                                                <div>
                                                                    <Label className="text-sm font-medium text-gray-300 mb-2 block">
                                                                        Notes (optional)
                                                                    </Label>
                                                                    <Input
                                                                        placeholder="Add notes about this set..."
                                                                        value={set.note || ''}
                                                                        onChange={(e) => onUpdateSet(userIndex, exerciseIndex, setIndex, 'note', e.target.value)}
                                                                        className="bg-gray-800 border-gray-600 text-white h-10"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        onClick={() => onSaveWorkout(userIndex)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
                                        size="lg"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Workout for {userData.user.name}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

interface ViewerDashboardProps {
    users: User[]
}

function ViewerDashboard({ users }: ViewerDashboardProps) {
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
                            <Card key={user.id} className="bg-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${generateProfilePicture(user.name)}`}>
                                            {user.name.split(' ').map(n => n.charAt(0)).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{user.name}</h3>
                                            <p className="text-gray-400 text-sm">{user.weight}kg | {user.height}cm</p>
                                            <p className="text-gray-500 text-xs">{user.email}</p>
                                        </div>
                                        <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                                            {user.role}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
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
