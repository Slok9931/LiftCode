'use client'

import { useState } from 'react'
import { Plus, Minus, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface Set {
    id: string
    reps: number
    weight: number
    completed: boolean
}

interface Exercise {
    name: string
    sets: Set[]
}

interface SetLoggerProps {
    exercises: string[]
    onSaveWorkout: (exercises: Exercise[]) => void
}

export function SetLogger({ exercises, onSaveWorkout }: SetLoggerProps) {
    const [workoutData, setWorkoutData] = useState<Exercise[]>(
        exercises.map(name => ({
            name,
            sets: [{ id: '1', reps: 0, weight: 0, completed: false }]
        }))
    )

    const addSet = (exerciseIndex: number) => {
        const newWorkoutData = [...workoutData]
        const newSetId = (newWorkoutData[exerciseIndex].sets.length + 1).toString()
        newWorkoutData[exerciseIndex].sets.push({
            id: newSetId,
            reps: 0,
            weight: 0,
            completed: false
        })
        setWorkoutData(newWorkoutData)
    }

    const removeSet = (exerciseIndex: number, setIndex: number) => {
        const newWorkoutData = [...workoutData]
        newWorkoutData[exerciseIndex].sets = newWorkoutData[exerciseIndex].sets.filter(
            (_, index) => index !== setIndex
        )
        setWorkoutData(newWorkoutData)
    }

    const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
        const newWorkoutData = [...workoutData]
        newWorkoutData[exerciseIndex].sets[setIndex][field] = value
        setWorkoutData(newWorkoutData)
    }

    const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
        const newWorkoutData = [...workoutData]
        newWorkoutData[exerciseIndex].sets[setIndex].completed =
            !newWorkoutData[exerciseIndex].sets[setIndex].completed
        setWorkoutData(newWorkoutData)
    }

    const getCompletedSets = (exercise: Exercise) => {
        return exercise.sets.filter(set => set.completed).length
    }

    const getTotalSets = (exercise: Exercise) => {
        return exercise.sets.length
    }

    return (
        <div className="space-y-4">
            {workoutData.map((exercise, exerciseIndex) => (
                <Card key={exercise.name} className="bg-gray-900 border-red-600/30">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-lg">{exercise.name}</CardTitle>
                            <Badge
                                variant="outline"
                                className={`
                  ${getCompletedSets(exercise) === getTotalSets(exercise) && getTotalSets(exercise) > 0
                                        ? 'border-green-500/50 text-green-400'
                                        : 'border-gray-500/50 text-gray-400'
                                    }
                `}
                            >
                                {getCompletedSets(exercise)}/{getTotalSets(exercise)} sets
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {exercise.sets.map((set, setIndex) => (
                            <div
                                key={set.id}
                                className={`
                  p-3 rounded-lg border transition-all
                  ${set.completed
                                        ? 'bg-green-600/10 border-green-500/30'
                                        : 'bg-gray-800/50 border-gray-700'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400 w-8">#{setIndex + 1}</span>

                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Weight (lbs)</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={set.weight || ''}
                                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                                                className="bg-gray-800 border-gray-600 text-white h-8"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Reps</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={set.reps || ''}
                                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                className="bg-gray-800 border-gray-600 text-white h-8"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={set.completed ? "default" : "outline"}
                                        onClick={() => toggleSetCompleted(exerciseIndex, setIndex)}
                                        className={`
                      ${set.completed
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                            }
                    `}
                                    >
                                        ✓
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => removeSet(exerciseIndex, setIndex)}
                                        className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                                        disabled={exercise.sets.length <= 1}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            onClick={() => addSet(exerciseIndex)}
                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Set
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <div className="sticky bottom-4">
                <Button
                    onClick={() => onSaveWorkout(workoutData)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                    size="lg"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Complete Workout
                </Button>
            </div>
        </div>
    )
}
