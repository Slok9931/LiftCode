'use client'

import { useState, useEffect } from 'react'
import { Card, LoadingSpinner, EmptyState, Select } from '../../components/ui'
import { apiService } from '../../lib/api'
import { User, UserWorkoutStats, SetWithExercises } from '../../lib/types'
import { formatDate, formatWeight, calculateVolume } from '../../lib/utils'

export default function StatsPage() {
    const [users, setUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [stats, setStats] = useState<UserWorkoutStats | null>(null)
    const [recentSets, setRecentSets] = useState<SetWithExercises[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (currentUser?.id) {
            fetchUserStats()
        }
    }, [currentUser])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await apiService.getAllUsers()
            if (response.success && response.data) {
                const gymers = response.data.filter(user => user.role === 'gymmer')
                setUsers(gymers)
                if (gymers.length > 0) {
                    setCurrentUser(gymers[0])
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserStats = async () => {
        if (!currentUser?.id) return

        setLoading(true)
        try {
            const [statsResponse, setsResponse] = await Promise.all([
                apiService.getUserWorkoutStats(currentUser.id),
                apiService.getSetsByUserId(currentUser.id)
            ])

            if (statsResponse.success && statsResponse.data) {
                setStats(statsResponse.data)
            }

            if (setsResponse.success && setsResponse.data) {
                // Get the most recent 10 sets
                const sortedSets = setsResponse.data
                    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
                    .slice(0, 10)
                setRecentSets(sortedSets)
            }
        } catch (error) {
            console.error('Error fetching user stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading && !currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-secondary mt-4">Loading statistics...</p>
                </div>
            </div>
        )
    }

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title="No Gymers Found"
                    description="Create a gymmer account to view workout statistics"
                    icon="📊"
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Workout Statistics 📈
                    </h1>
                    <p className="text-secondary">
                        Track your progress and analyze your performance
                    </p>
                </div>

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
            </div>

            {loading && currentUser ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* User Info Card */}
                    <Card title="User Profile">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-red rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-primary">{currentUser.name}</h3>
                                <p className="text-secondary">{currentUser.email}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {currentUser.weight && (
                                        <div>
                                            <span className="text-muted text-sm">Weight:</span>
                                            <div className="text-primary font-medium">{currentUser.weight} lbs</div>
                                        </div>
                                    )}
                                    {currentUser.height && (
                                        <div>
                                            <span className="text-muted text-sm">Height:</span>
                                            <div className="text-primary font-medium">{currentUser.height} inches</div>
                                        </div>
                                    )}
                                    {currentUser.dob && (
                                        <div>
                                            <span className="text-muted text-sm">Age:</span>
                                            <div className="text-primary font-medium">
                                                {new Date().getFullYear() - new Date(currentUser.dob).getFullYear()}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted text-sm">Member Since:</span>
                                        <div className="text-primary font-medium">
                                            {currentUser.created_at ? formatDate(currentUser.created_at) : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Stats Overview */}
                    {stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="text-center">
                                <div className="text-3xl mb-2">🏋️</div>
                                <h3 className="text-2xl font-bold text-primary">{stats.totalWorkouts}</h3>
                                <p className="text-secondary">Total Workouts</p>
                            </Card>

                            <Card className="text-center">
                                <div className="text-3xl mb-2">🔢</div>
                                <h3 className="text-2xl font-bold text-primary">{stats.totalSets}</h3>
                                <p className="text-secondary">Total Sets</p>
                            </Card>

                            <Card className="text-center">
                                <div className="text-3xl mb-2">📊</div>
                                <h3 className="text-2xl font-bold text-primary">{stats.totalVolumeLifted}</h3>
                                <p className="text-secondary">Volume Lifted (lbs)</p>
                            </Card>

                            <Card className="text-center">
                                <div className="text-3xl mb-2">⏱️</div>
                                <h3 className="text-2xl font-bold text-primary">{stats.averageWorkoutDuration}</h3>
                                <p className="text-secondary">Avg Duration (min)</p>
                            </Card>
                        </div>
                    ) : (
                        <EmptyState
                            title="No Statistics Available"
                            description="Start tracking workouts to see your statistics"
                            icon="📊"
                        />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                                    <div className="text-secondary text-sm">{exercise.total_sets} sets</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    title="No favorite exercises yet"
                                    description="Complete some workouts to see your favorite exercises"
                                    icon="💪"
                                />
                            )}
                        </Card>

                        {/* Recent Activity */}
                        <Card title="Recent Activity">
                            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentActivity.slice(0, 7).map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-primary">{formatDate(activity.date)}</div>
                                                <div className="text-secondary text-sm">{activity.sets_count} sets</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-primary font-medium">{activity.volume} lbs</div>
                                                <div className="text-secondary text-sm">volume</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    title="No recent activity"
                                    description="Start working out to see your recent activity"
                                    icon="📅"
                                />
                            )}
                        </Card>
                    </div>

                    {/* Recent Sets */}
                    <Card title="Recent Sets">
                        {recentSets.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-secondary">
                                            <th className="pb-2 text-secondary font-medium">Exercise</th>
                                            <th className="pb-2 text-secondary font-medium">Type</th>
                                            <th className="pb-2 text-secondary font-medium">Weight</th>
                                            <th className="pb-2 text-secondary font-medium">Reps</th>
                                            <th className="pb-2 text-secondary font-medium">Volume</th>
                                            <th className="pb-2 text-secondary font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentSets.map((set, index) => (
                                            <tr key={set.id} className="border-b border-secondary">
                                                <td className="py-3 text-primary font-medium">
                                                    {set.exercise?.name || 'Unknown'}
                                                </td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 rounded-full text-xs bg-secondary text-muted capitalize">
                                                        {set.set_type}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-primary">
                                                    {formatWeight(set.weight.primary)}
                                                </td>
                                                <td className="py-3 text-primary">
                                                    {set.reps.primary}
                                                </td>
                                                <td className="py-3 text-primary font-medium">
                                                    {calculateVolume(set.weight.primary, set.reps.primary)} lbs
                                                </td>
                                                <td className="py-3 text-secondary">
                                                    {set.created_at ? formatDate(set.created_at) : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="No recent sets"
                                description="Complete some workouts to see your recent sets"
                                icon="🏋️"
                            />
                        )}
                    </Card>
                </div>
            )}
        </div>
    )
}
