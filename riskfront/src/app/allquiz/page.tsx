"use client"

import { useEffect, useState } from "react"
import Reviews from "@/Pages/reviews"
import axios from "axios"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

type QuizResult = {
  _id: string
  title: string
  givenBy: string
  email: string
  score: number
  questions: { questionText: string; selectedAnswer: string }[]
  reviews: {
    reviewerName: string
    reviewerEmail: string
    content: string
    createdAt: string
  }[]
  createdAt: string
}

export default function PeerReviewPage() {
  const { user } = useUser()
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)

  const API_URL = "http://localhost:2413"

  // ✅ Fetch all quizzes
  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await axios.get(`${API_URL}/api/quizzes`)
        setResults(res.data)
      } catch (err) {
        console.error("Error fetching results:", err)
        toast.error("Failed to load peer review data ❌")
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [user])

  // ✅ Handle adding review
  const handleAddReview = async (quizId: string, content: string) => {
    try {
      const reviewerName = user?.fullName || "Anonymous"
      const reviewerEmail = user?.primaryEmailAddress?.emailAddress || "no-email@example.com"

      await axios.post(`${API_URL}/api/quizzes/${quizId}/review`, {
        reviewerName,
        reviewerEmail,
        content,
        remarks: [] // optional for per-question remarks
      })

      toast.success("Review added ✅")

      // Refresh data
      const res = await axios.get(`${API_URL}/api/quizzes`)
      setResults(res.data)
    } catch (err) {
      console.error("Error adding review:", err)
      toast.error("Failed to add review ❌")
    }
  }

  if (loading) {
    return (
      <p className="text-center mt-10 text-muted-foreground font-bold">
        Loading peer review data...
      </p>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-black mb-6 text-foreground">Peer Review Carousel</h1>
      {results.length > 0 ? (
        <Reviews results={results} onAddReview={handleAddReview} />
      ) : (
        <p className="text-muted-foreground font-bold">No peer results available.</p>
      )}
    </main>
  )
}
