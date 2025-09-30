import { createClient } from '@supabase/supabase-js'
import { parseRSSToBooks } from '@/lib/rssParser'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { userId, rssUrl } = await request.json()

    console.log('Syncing books for user:', userId)
    console.log('RSS URL:', rssUrl)

    if (!userId || !rssUrl) {
      return Response.json({ error: 'Missing userId or rssUrl' }, { status: 400 })
    }

    // Fetch RSS
    console.log('Fetching RSS...')
    const response = await fetch(rssUrl)
    
    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`)
    }

    const xmlText = await response.text()
    console.log('RSS fetched, length:', xmlText.length)
    console.log('First 200 chars:', xmlText.substring(0, 200))

    // Parse RSS
    console.log('Parsing RSS...')
    const books = await parseRSSToBooks(xmlText)
    console.log('Parsed books:', books.length)

    if (books.length === 0) {
      console.log('Warning: No books parsed from RSS')
    }

    // Sort by read date (most recent first)
    books.sort((a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime())

    // Check if user already has cached books
    const { data: existing } = await supabaseAdmin
      .from('cached_books')
      .select('id')
      .eq('user_id', userId)
      .single()

    console.log('Existing cache:', existing ? 'yes' : 'no')

    if (existing) {
      // Update existing
      const { error: updateError } = await supabaseAdmin
        .from('cached_books')
        .update({
          book_data: books,
          last_synced: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) throw updateError
      console.log('Updated existing cache')
    } else {
      // Insert new
      const { error: insertError } = await supabaseAdmin
        .from('cached_books')
        .insert({
          user_id: userId,
          book_data: books,
          last_synced: new Date().toISOString()
        })

      if (insertError) throw insertError
      console.log('Inserted new cache')
    }

    return Response.json({ success: true, bookCount: books.length })
  } catch (error: any) {
    console.error('Sync error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}