'use client'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    async function test() {
      // Replace with your actual RSS URL
      const rssUrl = 'YOUR_RSS_URL_HERE'
      
      const response = await fetch(rssUrl)
      const text = await response.text()
      
      console.log('RSS Response:', text.substring(0, 500))
      setResult(text.substring(0, 500))
    }
    test()
  }, [])

  return (
    <div className="p-8">
      <h1>RSS Test</h1>
      <pre className="bg-gray-100 p-4 overflow-auto">{result}</pre>
    </div>
  )
}