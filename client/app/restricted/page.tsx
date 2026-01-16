import Link from 'next/link'

export default function RestrictedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-xl shadow-2xl border border-red-600/30 text-center">
                <div>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-600/20 border border-red-600/50">
                        <svg
                            className="h-8 w-8 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        🔐 Private Territory
                    </h2>
                    <p className="mt-2 text-sm text-red-400 font-medium">
                        This website is not for public access
                    </p>
                    <div className="mt-4 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                        <p className="text-sm text-red-300">
                            🏋️ <strong>LiftCode</strong> is a personal fitness tracking system
                        </p>
                        <p className="text-xs text-red-400 mt-1">
                            Restricted to authorized personnel only
                        </p>
                    </div>

                    <div className="mt-6 space-y-2">
                        <p className="text-xs text-gray-400">
                            👤 Authorized users have access codes
                        </p>
                        <p className="text-xs text-gray-500">
                            Contact system administrator for access
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/login"
                        className="group relative w-full flex justify-center py-3 px-4 border border-red-600/50 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        🚪 Authorized Entry
                    </Link>
                </div>

                <div className="text-center pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                        © 2026 LiftCode • Personal Fitness System
                    </p>
                </div>
            </div>
        </div>
    )
}
