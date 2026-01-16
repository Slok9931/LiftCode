'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ACCESS_CODES = {
    GYMMER: 'LIFT2026',
    VIEWER: 'VIEW2026'
}

export default function LoginPage() {
    const [accessCode, setAccessCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // Check access code
            if (accessCode === ACCESS_CODES.GYMMER) {
                localStorage.setItem('userType', 'gymmer')
                localStorage.setItem('user', JSON.stringify({ type: 'gymmer', name: 'Gymmer User' }))
                router.push('/dashboard')
            } else if (accessCode === ACCESS_CODES.VIEWER) {
                localStorage.setItem('userType', 'viewer')
                localStorage.setItem('user', JSON.stringify({ type: 'viewer', name: 'Viewer User' }))
                router.push('/dashboard')
            } else {
                setError('Invalid access code')
            }
        } catch (error) {
            setError('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-xl shadow-2xl border border-red-600/30">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        🏋️ LiftCode Access
                    </h2>
                    <p className="mt-2 text-sm text-red-400">
                        Private fitness tracking system - Enter access code
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="accessCode" className="sr-only">
                            Access Code
                        </label>
                        <input
                            id="accessCode"
                            name="accessCode"
                            type="password"
                            required
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                            placeholder="Enter access code"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-900/30 border border-red-600/50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Authenticating...' : 'Access System'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        🔐 Authorized personnel only
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                        <p>Gymmer Code: Full access</p>
                        <p>Viewer Code: Read-only access</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
