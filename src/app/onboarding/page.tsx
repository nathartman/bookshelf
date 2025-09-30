'use client'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth()
  const [username, setUsername] = useState('')
  const [rssUrl, setRssUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Check username availability as user types
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null)
        return
      }

      setCheckingUsername(true)
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      setUsernameAvailable(!data)
      setCheckingUsername(false)
    }

    const timer = setTimeout(checkUsername, 500)
    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) return

    // Validate username
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      setLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores')
      setLoading(false)
      return
    }

    try {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.toLowerCase(),
          rss_url: rssUrl
        })

      if (profileError) throw profileError

      // Sync books in background (we'll create this API route next)
      fetch('/api/sync-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, rssUrl })
      })

      router.push(`/${username.toLowerCase()}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-md shadow-xs border border-default">
        <div>
          <h2 className="text-3xl garamond-text text-left">Set Up Your Bookshelf</h2>
          <p className="mt-2 text-gray-600">
            Choose a username and add your Goodreads RSS feed
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="johndoe"
              required
              minLength={3}
            />
            {checkingUsername && (
              <p className="text-sm text-gray-500 mt-1">Checking...</p>
            )}
            {usernameAvailable === true && (
              <p className="text-sm text-green-600 mt-1">✓ Available</p>
            )}
            {usernameAvailable === false && (
              <p className="text-sm text-red-600 mt-1">Username taken</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Your bookshelf will be at: bookshelf.com/{username.toLowerCase() || 'username'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Goodreads RSS URL
            </label>
            <input
              type="text"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://www.goodreads.com/review/list_rss/..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              <a 
                href="https://www.goodreads.com/review/list" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                Find your RSS feed here
              </a>
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !usernameAvailable}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Create Bookshelf'}
          </button>
        </form>
      </div>
    </div>
  )
}