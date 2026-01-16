'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { workoutSchedule } from '@/lib/workout'

interface GameifiedCalendarProps {
    completedDays: number[]
    currentStreak: number
}

export function GameifiedCalendar({ completedDays, currentStreak }: GameifiedCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev)
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const isToday = (day: number) => {
        const today = new Date()
        return today.getDate() === day &&
            today.getMonth() === currentMonth.getMonth() &&
            today.getFullYear() === currentMonth.getFullYear()
    }

    const getWorkoutForDay = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        const startDate = new Date('2026-01-13') // Adjust this to your actual start date
        const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const cycleDay = ((daysDiff % 8) + 8) % 8
        return workoutSchedule[cycleDay]
    }

    const isCompleted = (day: number) => {
        const dayKey = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime()
        return completedDays.includes(dayKey)
    }

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth)
        const firstDay = getFirstDayOfMonth(currentMonth)
        const days = []

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-16"></div>)
        }

        // Calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const workout = getWorkoutForDay(day)
            const completed = isCompleted(day)
            const today = isToday(day)

            days.push(
                <div
                    key={day}
                    className={`
            h-16 p-1 border border-gray-700 relative cursor-pointer transition-all hover:bg-gray-800/50
            ${today ? 'ring-2 ring-red-500' : ''}
            ${completed ? 'bg-green-600/20 border-green-500/50' : ''}
            ${workout?.isRestDay ? 'bg-blue-600/10 border-blue-500/30' : ''}
          `}
                >
                    <div className="text-xs text-gray-300 mb-1">{day}</div>
                    {workout && (
                        <div className="text-[10px] text-gray-400 leading-tight">
                            {workout.isRestDay ? '😴 Rest' : workout.name.split(' ')[0]}
                        </div>
                    )}
                    {completed && (
                        <div className="absolute top-0 right-0 text-green-400 text-xs">✓</div>
                    )}
                    {today && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>
                    )}
                </div>
            )
        }

        return days
    }

    return (
        <Card className="bg-gray-900 border-red-600/30">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-red-400" />
                        Workout Calendar
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-1 hover:bg-gray-800 rounded"
                        >
                            <ChevronLeft className="h-4 w-4 text-gray-400" />
                        </button>
                        <span className="text-white font-medium px-2">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-1 hover:bg-gray-800 rounded"
                        >
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                        🔥 {currentStreak} day streak
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                        {completedDays.length} completed
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-700 rounded">
                    {renderCalendarDays()}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-600/20 border border-green-500/50 rounded"></div>
                        <span className="text-gray-400">Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-600/10 border border-blue-500/30 rounded"></div>
                        <span className="text-gray-400">Rest Day</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-red-500 rounded"></div>
                        <span className="text-gray-400">Today</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
