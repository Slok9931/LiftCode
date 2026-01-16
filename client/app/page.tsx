'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user')
    const userType = localStorage.getItem('userType')

    if (userData && userType) {
      router.push('/dashboard')
    } else {
      router.push('/restricted')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-sm text-red-400">Loading LiftCode...</p>
      </div>
    </div>
  )
}
