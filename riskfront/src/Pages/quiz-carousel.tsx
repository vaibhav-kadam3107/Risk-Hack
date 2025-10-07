"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { client } from "@/lib/graphqlClient"

type Question = {
  questionId: string
  text: string
  options: string[]
}

type Quiz = {
  id: string
  quizName: string
  description: string
  questions: Question[]
}

export default function QuizCarousel() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<Question[]>([])
  const [quizName, setQuizName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    async function fetchQuizzes() {
      const query = `
        query {
          getQuizzes {
            id
            quizName
            description
            questions {
              questionId
              text
              options
            }
          }
        }
      `
      try {
        const data = await client.request(query)
        setQuizzes(data.getQuizzes)
      } catch (error) {
        console.error("Failed to fetch quizzes:", error)
      }
    }
    fetchQuizzes()
  }, [])

  // When user selects a quiz, update quizData and other info
  useEffect(() => {
    if (selectedQuizId && quizzes.length > 0) {
      const quiz = quizzes.find(q => q.id === selectedQuizId)
      if (quiz) {
        setQuizName(quiz.quizName)
        setDescription(quiz.description)
        setQuizData(quiz.questions)
        setSelectedAnswers(new Array(quiz.questions.length).fill(null))
        setCurrentQuestion(0)
        setShowResults(false)
      }
    }
  }, [selectedQuizId, quizzes])

  const handleAnswerSelect = (optionIdx: number) => {
    const updatedAnswers = [...selectedAnswers]
    updatedAnswers[currentQuestion] = optionIdx
    setSelectedAnswers(updatedAnswers)
  }

  const handlePrev = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, quizData.length - 1))
  }

  const handleSubmit = () => {
    setShowResults(true)
    // You can add mutation to submit answers to backend here
  }

  // Quiz selection UI
  if (!selectedQuizId) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Select a Quiz</h2>
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <Card key={quiz.id} className="p-4 flex flex-col items-start">
              <div className="font-semibold text-lg">{quiz.quizName}</div>
              <div className="text-muted-foreground mb-2">{quiz.description}</div>
              <Button onClick={() => setSelectedQuizId(quiz.id)}>
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Loading state for questions
  if (quizData.length === 0) {
    return <div className="text-center py-20">Loading quiz...</div>
  }

  // Quiz UI
  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-2 text-center">{quizName}</h2>
      <p className="mb-6 text-center text-muted-foreground">{description}</p>
      <Card className="p-6 mb-4">
        <div className="mb-4 font-semibold">
          Question {currentQuestion + 1} of {quizData.length}
        </div>
        <div className="mb-6 text-lg">{quizData[currentQuestion].text}</div>
        <div className="space-y-2">
          {quizData[currentQuestion].options.map((option, idx) => (
            <Button
              key={idx}
              variant={selectedAnswers[currentQuestion] === idx ? "default" : "outline"}
              className={cn("w-full text-left", selectedAnswers[currentQuestion] === idx && "border-2 border-primary")}
              onClick={() => handleAnswerSelect(idx)}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>
      <div className="flex justify-between items-center">
        <Button onClick={handlePrev} disabled={currentQuestion === 0} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Prev
        </Button>
        {currentQuestion < quizData.length - 1 ? (
          <Button onClick={handleNext} variant="outline">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={selectedAnswers.includes(null)}>
            Submit
          </Button>
        )}
      </div>
      {showResults && (
        <div className="mt-8 p-4 border rounded bg-muted">
          <h3 className="font-bold mb-2">Your Answers:</h3>
          <ul className="list-disc ml-6">
            {quizData.map((q, idx) => (
              <li key={q.questionId}>
                <span className="font-semibold">{q.text}</span>
                <br />
                <span className="text-primary">
                  {selectedAnswers[idx] !== null ? q.options[selectedAnswers[idx]!] : "No answer selected"}
                </span>
              </li>
            ))}
          </ul>
          <Button className="mt-4" onClick={() => setSelectedQuizId(null)}>
            Back to Quiz Selection
          </Button>
        </div>
      )}
    </div>
  )
}