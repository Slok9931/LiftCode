'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, LoadingSpinner, EmptyState } from '../../../components/ui'
import { apiService } from '../../../lib/api'
import { User, UserWorkoutStats, SetWithExercises } from '../../../lib/types'
import { formatDate, formatWeight, calculateVolume } from '../../../lib/utils'
import Link from 'next/link'

interface Props {
    params: {
        id: string
    }
}

export default function UserDetailPage({ params }: Props) {
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState<UserWorkoutStats | null>(null)
    const [recentSets, setRecentSets] = useState<SetWithExercises[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const userId = parseInt(params.id)

    useEffect(() => {
        if (userId) {
            fetchUserData()
        }
    }, [userId])

    const fetchUserData = async () => {
        setLoading(true)
        try {
            const [userResponse, statsResponse, setsResponse] = await Promise.all([
                apiService.getUserById(userId),
                apiService.getUserWorkoutStats(userId),
                apiService.getSetsByUserId(userId)
            ])

            if (userResponse.success && userResponse.data) {
                setUser(userResponse.data)
            } else {
                router.push('/users')
                return
            }

            if (statsResponse.success && statsResponse.data) {
                setStats(statsResponse.data)
            }

            if (setsResponse.success && setsResponse.data) {
                const sortedSets = setsResponse.data
                    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
                    .slice(0, 10)
                setRecentSets(sortedSets)
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
            router.push('/users')
        } finally {
            setLoading(false)
        }
    }

    const calculateAge = (dob: Date | string): number => {
        const birthDate = new Date(dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        return age
    }

    const calculateBMI = (weight: number, height: number): number => {
        // Convert height from inches to meters and weight from lbs to kg
        const heightInMeters = height * 0.0254
        const weightInKg = weight * 0.453592
        return Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(1))
    }

    const getBMICategory = (bmi: number): string => {
        if (bmi < 18.5) return 'Underweight'
        if (bmi < 25) return 'Normal weight'
        if (bmi < 30) return 'Overweight'
        return 'Obese'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-secondary mt-4">Loading user profile...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title="User Not Found"
                    description="The requested user could not be found"
                    icon="👤"
                    action={
                        <Link href="/users">
                            <Button>Back to Users</Button>
                        </Link>
                    }
                />
            </div>
        )
    }

    const bmi = user.weight && user.height ? calculateBMI(user.weight, user.height) : null

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/users">
                        <Button variant="ghost" size="small">
                            ← Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-primary">
                            {user.name}'s Profile
                        </h1>
                        <p className="text-secondary">
                            Detailed user information and workout statistics
                        </p>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button variant="secondary" size="small">
                        Edit Profile
                    </Button>
                    {user.role === 'gymmer' && (
                        <Link href="/stats" className="inline-block">
                            <Button size="small">
                                View Stats
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <div className="lg:col-span-1">
                    <Card title="Profile Information">
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-red rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-semibold text-primary">{user.name}</h2>
                                <p className="text-secondary">{user.email}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${user.role === 'gymmer' ? 'bg-red text-white' : 'bg-secondary text-muted'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {user.dob && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary">Age:</span>
                                        <span className="text-primary font-medium">
                                            {calculateAge(user.dob)} years
                                        </span>
                                    </div>
                                )}

                                {user.weight && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary">Weight:</span>
                                        <span className="text-primary font-medium">{user.weight} lbs</span>
                                    </div>
                                )}

                                {user.height && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary">Height:</span>
                                        <span className="text-primary font-medium">
                                            {Math.floor(user.height / 12)}'{user.height % 12}"
                                        </span>
                                    </div>
                                )}

                                {bmi && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary">BMI:</span>
                                        <div className="text-right">
                                            <span className="text-primary font-medium">{bmi}</span>
                                            <div className="text-xs text-secondary">{getBMICategory(bmi)}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-secondary">Member Since:</span>
                                    <span className="text-primary font-medium">
                                        {user.created_at ? formatDate(user.created_at) : 'N/A'}
                                    </span>
                                </div>

                                {user.updated_at && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary">Last Updated:</span>
                                        <span className="text-primary font-medium">
                                            {formatDate(user.updated_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Stats and Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {user.role === 'gymmer' ? (
                        <>
                            {/* Workout Statistics */}
                            {stats ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card className="text-center">
                                        <div className="text-3xl mb-2">🏋️</div>
                                        <h3 className="text-2xl font-bold text-primary">{stats.totalWorkouts}</h3>
                                        <p className="text-secondary">Workouts</p>
                                    </Card>

                                    <Card className="text-center">
                                        <div className="text-3xl mb-2">🔢</div>
                                        <h3 className="text-2xl font-bold text-primary">{stats.totalSets}</h3>
                                        <p className="text-secondary">Sets</p>
                                    </Card>

                                    <Card className="text-center">
                                        <div className="text-3xl mb-2">📊</div>
                                        <h3 className="text-2xl font-bold text-primary">{stats.totalVolumeLifted}</h3>
                                        <p className="text-secondary">Volume (lbs)</p>
                                    </Card>

                                    <Card className="text-center">
                                        <div className="text-3xl mb-2">⏱️</div>
                                        <h3 className="text-2xl font-bold text-primary">{stats.averageWorkoutDuration}</h3>
                                        <p className="text-secondary">Avg Duration</p>
                                    </Card>
                                </div>
                            ) : (
                                <Card>
                                    <EmptyState
                                        title="No Workout Statistics"
                                        description="This user hasn't completed any workouts yet"
                                        icon="📊"
                                    />
                                </Card>
                            )}

                            {/* Favorite Exercises */}
                            <Card title="Favorite Exercises">
                                {stats?.favoriteExercises && stats.favoriteExercises.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.favoriteExercises.slice(0, 5).map((exercise, index) => (
                                            <div key={exercise.exercise_id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-primary">{exercise.exercise_name}</div>
                                                        <div className="text-secondary text-sm">{exercise.total_sets} sets completed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No favorite exercises"
                                        description="Complete some workouts to see favorite exercises"
                                        icon="💪"
                                    />
                                )}
                            </Card>

                            {/* Recent Sets */}
                            <Card title="Recent Workout Sets">
                                {recentSets.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentSets.map((set) => (
                                            <div key={set.id} className="p-4 bg-secondary rounded-lg border border-primary">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {set.set_number}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">{set.exercise?.name || 'Unknown'}</h4>
                                                            <span className="px-2 py-1 rounded-full text-xs bg-tertiary text-muted capitalize">
                                                                {set.set_type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-primary font-medium">
                                                            {formatWeight(set.weight.primary)} × {set.reps.primary}
                                                        </div>
                                                        <div className="text-secondary text-sm">
                                                            {calculateVolume(set.weight.primary, set.reps.primary)} lbs volume
                                                        </div>
                                                    </div>
                                                </div>

                                                {set.note && (
                                                    <div className="mt-2 pt-2 border-t border-tertiary">
                                                        <span className="text-muted text-sm">Note: </span>
                                                        <span className="text-primary text-sm">{set.note}</span>
                                                    </div>
                                                )}

                                                <div className="mt-2 text-right">
                                                    <span className="text-muted text-xs">
                                                        {set.created_at ? formatDate(set.created_at) : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No recent sets"
                                        description="This user hasn't completed any sets yet"
                                        icon="🏋️"
                                    />
                                )}
                            </Card>
                        </>
                    ) : (
                        <Card>
                            <EmptyState
                                title="Viewer Account"
                                description="This user is a viewer and doesn't track workouts"
                                icon="👀"
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
