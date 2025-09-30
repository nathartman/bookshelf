'use client'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [username, setUsername] = useState('')
  const [rssUrl, setRssUrl] = useState('')
  const [originalUsername, setOriginalUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadProfile()
    }
  }, [user, authLoading, router])

  const loadProfile = async () => {
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('username, rss_url')
      .eq('id', user.id)
      .single()

    if (data) {
      setUsername(data.username)
      setOriginalUsername(data.username)
      setRssUrl(data.rss_url)
    }
  }

  // Check username availability when it changes
  useEffect(() => {
    const checkUsername = async () => {
      // If username hasn't changed, it's available (it's theirs)
      if (username === originalUsername) {
        setUsernameAvailable(true)
        return
      }

      if (username.length < 3) {
        setUsernameAvailable(null)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      setUsernameAvailable(!data)
    }

    const timer = setTimeout(checkUsername, 500)
    return () => clearTimeout(timer)
  }, [username, originalUsername])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!user) return

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: username.toLowerCase(),
          rss_url: rssUrl
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setOriginalUsername(username.toLowerCase())
      setSuccess('Settings saved!')
      
      // If username changed, redirect to new URL
      if (username.toLowerCase() !== originalUsername) {
        setTimeout(() => {
          router.push(`/${username.toLowerCase()}`)
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setError('')
    setSuccess('')
  
    try {
      // Get the current RSS URL from database instead of form
      const { data: profile } = await supabase
        .from('profiles')
        .select('rss_url')
        .eq('id', user?.id)
        .single()
  
      const response = await fetch('/api/sync-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          rssUrl: profile?.rss_url || rssUrl 
        })
      })
  
      const data = await response.json()
  
      if (!response.ok) throw new Error(data.error)
  
      setSuccess(`Synced ${data.bookCount} books!`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSyncing(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-stone-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-md shadow-xs border border-default p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl garamond-text">Settings</h1>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-default rounded-md"
                required
                minLength={3}
              />
              {username !== originalUsername && usernameAvailable === true && (
                <p className="text-sm text-green-600 mt-1">✓ Available</p>
              )}
              {username !== originalUsername && usernameAvailable === false && (
                <p className="text-sm text-red-600 mt-1">Username taken</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your bookshelf: <a href={`/${username.toLowerCase()}`} target="_blank" className="text-blue-600 hover:underline">/{username.toLowerCase()}</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Goodreads RSS URL</label>
              <input
                type="text"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                className="w-full px-3 py-2 border border-default rounded-md"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || (username !== originalUsername && !usernameAvailable)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={handleSync}
                disabled={syncing}
                className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {syncing ? 'Syncing...' : 'Sync Books'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}