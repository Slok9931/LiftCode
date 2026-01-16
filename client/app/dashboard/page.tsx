'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    type: 'gymmer' | 'viewer'
    name: string
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [userType, setUserType] = useState<'gymmer' | 'viewer' | null>(null)
    const router = useRouter()

    useEffect(() => {
        const userData = localStorage.getItem('user')
        const userTypeData = localStorage.getItem('userType')

        if (!userData || !userTypeData) {
            router.push('/login')
        } else {
            setUser(JSON.parse(userData))
            setUserType(userTypeData as 'gymmer' | 'viewer')
        }
    }, [router])

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
            <nav className="bg-gray-900 shadow-lg border-b border-red-600/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-red-400">
                                🏋️ LiftCode
                            </h1>
                            <span className="ml-4 px-2 py-1 text-xs bg-red-600/20 text-red-300 rounded-full border border-red-600/50">
                                {userType.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300">Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {userType === 'gymmer' ? <GymmerDashboard /> : <ViewerDashboard />}
                </div>
            </main>
        </div>
    )
}

function GymmerDashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gray-900 border border-red-600/30 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-red-600/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💪</span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold text-white">Gymmer Dashboard</h2>
                        <p className="text-red-400">Full access to all workout features</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-red-600/30 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl">🏋️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">Total Workouts</p>
                            <p className="text-2xl font-bold text-red-400">24</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-red-600/30 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl">📈</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">This Month</p>
                            <p className="text-2xl font-bold text-red-400">8</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-red-600/30 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl">🔥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">Streak</p>
                            <p className="text-2xl font-bold text-red-400">5 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg text-left transition-colors">
                    <div className="flex items-center">
                        <span className="text-2xl mr-4">➕</span>
                        <div>
                            <h3 className="font-bold">Log New Workout</h3>
                            <p className="text-red-200 text-sm">Record your latest session</p>
                        </div>
                    </div>
                </button>

                <button className="bg-gray-800 hover:bg-gray-700 border border-red-600/30 text-white p-6 rounded-lg text-left transition-colors">
                    <div className="flex items-center">
                        <span className="text-2xl mr-4">📊</span>
                        <div>
                            <h3 className="font-bold">View Progress</h3>
                            <p className="text-gray-400 text-sm">Track your improvements</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}

function ViewerDashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gray-900 border border-red-600/30 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-red-600/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👁️</span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold text-white">Viewer Dashboard</h2>
                        <p className="text-red-400">Read-only access to workout data</p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-900 border border-red-600/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Workout Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-400">Recent Activity</p>
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Chest & Triceps</span>
                                <span className="text-red-400">2 days ago</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Back & Biceps</span>
                                <span className="text-red-400">4 days ago</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Legs & Shoulders</span>
                                <span className="text-red-400">6 days ago</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">Overview</p>
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Total Sessions</span>
                                <span className="text-white font-bold">24</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">This Month</span>
                                <span className="text-white font-bold">8</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Average/Week</span>
                                <span className="text-white font-bold">2.1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Read-only Notice */}
            <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
                <div className="flex items-center">
                    <span className="text-xl mr-3">ℹ️</span>
                    <div>
                        <p className="text-yellow-400 font-medium">Viewer Access</p>
                        <p className="text-yellow-200 text-sm">You have read-only access to view workout data and progress.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
