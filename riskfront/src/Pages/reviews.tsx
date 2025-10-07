"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

type Review = {
  reviewerName: string
  reviewerEmail: string
  content: string
  createdAt: string
}

type QuizResult = {
  _id: string
  title: string
  givenBy: string
  email: string
  score: number
  questions: { questionText: string; selectedAnswer: string }[]
  reviews: Review[]
  createdAt: string
}

type Props = {
  results: QuizResult[]
  onAddReview: (quizId: string, content: string) => void
}

export default function QuizCarousel({ results, onAddReview }: Props) {
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const quiz = results[currentQuiz]

  // Horizontal slider for questions
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: "snap",
    loop: false,
  })

  if (results.length === 0) {
    return <p className="text-muted-foreground font-bold">No quizzes available.</p>
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quiz Info */}
      <Card className="p-6 border-2 hover:border-primary transition-all shadow-xl bg-card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-black text-foreground">{quiz.title}</h2>
            <p className="text-sm text-muted-foreground font-bold">
              By {quiz.givenBy} ({quiz.email})
            </p>
          </div>
          <Badge className="bg-primary text-white font-black">
            Score&nbsp;:&nbsp;{quiz.score}
          </Badge>
        </div>

        {/* Horizontal Questions Carousel */}
        <div ref={sliderRef} className="keen-slider">
          {quiz.questions.map((q, idx) => (
            <div
              key={idx}
              className="keen-slider__slide p-6 border-2 rounded-xl bg-gradient-to-r from-card to-primary/5 mx-2"
            >
              <p className="font-bold text-foreground mb-4">
                Q{idx + 1}: {q.questionText}
              </p>
              <p className="px-4 py-2 rounded-xl bg-primary text-white font-medium inline-block">
                {q.selectedAnswer}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reviews Section */}
      <Card className="p-6 border-2 hover:border-primary transition-all shadow-lg bg-card mb-6">
        <h3 className="text-xl font-black text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Reviews
        </h3>
        {quiz.reviews?.length > 0 ? (
          <div className="space-y-3">
            {quiz.reviews.map((r, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg bg-gradient-to-r from-card to-primary/5"
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold text-foreground">{r.reviewerName}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{r.reviewerEmail}</p>
                <p className="mt-2 text-sm text-foreground">{r.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground font-bold">No reviews yet.</p>
        )}

        {/* Add Review */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Add your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button
            onClick={() => {
              if (reviewText.trim() !== "") {
                onAddReview(quiz._id, reviewText)
                setReviewText("")
              }
            }}
            className="bg-primary text-white font-bold"
          >
            Submit
          </Button>
        </div>
      </Card>

      {/* Carousel Controls for Quiz Results */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() =>
            setCurrentQuiz((c) => (c > 0 ? c - 1 : results.length - 1))
          }
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Prev Quiz
        </Button>
        <span className="text-sm font-bold text-muted-foreground">
          {currentQuiz + 1} / {results.length}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentQuiz((c) => (c + 1) % results.length)
          }
        >
          Next Quiz <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
