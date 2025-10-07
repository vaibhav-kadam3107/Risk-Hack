"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Zap,
  Target,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"

// ------------------------------
// Assessments (static for now)
// ------------------------------
const assessments: Record<
  string,
  { id: number; question: string; options: string[] }[]
> = {
  "DevOps Assessment": [
    {
      id: 1,
      question: "How frequently does your team deploy code to production?",
      options: [
        "Multiple times per day",
        "Once per day to once per week",
        "Once per week to once per month",
        "Less than once per month",
      ],
    },
    {
      id: 2,
      question:
        "What is your average lead time from code commit to production deployment?",
      options: [
        "Less than one hour",
        "One day to one week",
        "One week to one month",
        "More than one month",
      ],
    },
  ],
  "Security Assessment": [
    {
      id: 1,
      question: "Do you conduct regular security audits?",
      options: ["Yes, quarterly", "Yes, yearly", "Occasionally", "Never"],
    },
    {
      id: 2,
      question: "Is penetration testing part of your release cycle?",
      options: ["Always", "Sometimes", "Rarely", "Never"],
    },
  ],
}

export default function QuizCarousel() {
  const { user } = useUser()
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
    null
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [showResults, setShowResults] = useState(false)

  const API_URL = "http://localhost:2413"

  const calculateScore = () =>
    selectedAnswers.reduce((total, answer) => {
      if (answer === null) return total
      const points = 4 - answer
      return total + points
    }, 0)

  const getMaturityLevel = (score: number, quizLength: number) => {
    const maxScore = quizLength * 4
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return { level: "Elite", color: "text-primary" }
    if (percentage >= 75) return { level: "High", color: "text-accent" }
    if (percentage >= 50) return { level: "Medium", color: "text-yellow-500" }
    return { level: "Low", color: "text-red-500" }
  }

  const resetQuiz = () => {
    if (selectedAssessment) {
      setSelectedAnswers(new Array(assessments[selectedAssessment].length).fill(null))
      setCurrentQuestion(0)
      setShowResults(false)
    }
  }

  const handleSubmitResults = async () => {
    if (!selectedAssessment) return

    const quizData = assessments[selectedAssessment]
    const score = calculateScore()

    const payload = {
      title: selectedAssessment,
      givenBy: user?.fullName || "Anonymous",
      email: user?.primaryEmailAddress?.emailAddress || "no-email@example.com",
      questions: quizData.map((q, index) => ({
        questionText: q.question,
        selectedAnswer:
          selectedAnswers[index] !== null
            ? q.options[selectedAnswers[index] as number]
            : "Not answered",
      })),
      score,
    }

    try {
      await axios.post(`${API_URL}/api/quizzes`, payload)
      await axios.post(`${API_URL}/update-after-quiz`, {
        email: payload.email,
        score,
        quizTitle: payload.title,
        questions: payload.questions,
      })
      toast.success(`Results saved ✅ (Score: ${score})`)
    } catch (err) {
      console.error("Error saving quiz:", err)
      toast.error("Failed to save quiz ❌")
    }
  }

  // Step 1: Assessment Selection
  if (!selectedAssessment) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <h2 className="text-5xl font-extrabold mb-12 text-center text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in-up">
          Choose Your Assessment
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          {Object.keys(assessments).map((assessment, index) => (
            <Card
              key={assessment}
              className="p-10 backdrop-blur-xl bg-card/60 border-2 border-transparent hover:border-primary/70 rounded-3xl shadow-2xl cursor-pointer transition-all hover:scale-105 hover:shadow-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => {
                setSelectedAssessment(assessment)
                setCurrentQuestion(0)
                setSelectedAnswers(
                  new Array(assessments[assessment].length).fill(null)
                )
              }}
            >
              <h3 className="text-3xl font-black text-foreground mb-4">
                {assessment}
              </h3>
              <p className="text-base text-muted-foreground font-semibold">
                {assessments[assessment].length} Tailored Questions
              </p>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const quizData = assessments[selectedAssessment]

  // Step 2: Results
  if (showResults) {
    const score = calculateScore()
    const maxScore = quizData.length * 4
    const percentage = Math.round((score / maxScore) * 100)
    const maturity = getMaturityLevel(score, quizData.length)

    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-14 shadow-2xl border-4 border-primary bg-gradient-to-br from-background/90 to-primary/5 backdrop-blur-xl rounded-3xl text-center animate-fade-in-up">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl animate-pulse">
              <BarChart3 className="w-20 h-20 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-extrabold text-foreground mb-3">
            Results Ready 🎉
          </h2>
          <p className="text-lg font-bold text-muted-foreground mb-10">
            {selectedAssessment} Completed
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl">
              <Target className="w-6 h-6 mb-2" />
              <p className="text-4xl font-extrabold">{score}</p>
              <p className="text-sm">out of {maxScore}</p>
            </div>
            <div className="p-8 rounded-2xl border-4 border-primary bg-background shadow-lg">
              <Award className="w-6 h-6 mb-2 text-primary" />
              <p className={cn("text-4xl font-extrabold", maturity.color)}>
                {maturity.level}
              </p>
              <p className="text-sm font-bold text-muted-foreground">
                {percentage}% Maturity
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-xl">
              <Zap className="w-6 h-6 mb-2" />
              <p className="text-4xl font-extrabold">{quizData.length}</p>
              <p className="text-sm">Questions Answered</p>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <Button
              onClick={resetQuiz}
              size="lg"
              className="gap-3 text-lg font-black px-10 py-6 rounded-xl shadow-lg hover:scale-105"
            >
              <TrendingUp className="w-6 h-6" /> Retake
            </Button>
            <Button
              onClick={handleSubmitResults}
              size="lg"
              className="gap-3 text-lg font-black px-10 py-6 rounded-xl shadow-lg hover:scale-105"
            >
              Save Results
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Step 3: Quiz Questions
  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          <span className="text-lg font-bold text-foreground">
            {selectedAssessment} • Q{currentQuestion + 1}/{quizData.length}
          </span>
          <span className="text-sm font-bold text-muted-foreground">
            {selectedAnswers.filter((a) => a !== null).length} answered
          </span>
        </div>
        <div className="h-3 bg-background rounded-full border-2 border-primary overflow-hidden shadow">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className="p-12 border-4 border-primary rounded-3xl bg-background/80 backdrop-blur-md shadow-xl mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-foreground">
          {question.question}
        </h2>

        {/* Options left-aligned */}
        <div className="space-y-4 text-left">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index
            return (
              <button
                key={index}
                onClick={() => {
                  const newAnswers = [...selectedAnswers]
                  newAnswers[currentQuestion] = index
                  setSelectedAnswers(newAnswers)
                }}
                className={cn(
                  "w-full p-5 rounded-xl border-2 font-semibold transition-all duration-300 text-left hover:scale-[1.01]",
                  isSelected
                    ? "border-primary bg-gradient-to-r from-primary/15 to-accent/15 shadow-md"
                    : "border-border hover:border-primary/70"
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() =>
            setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev))
          }
          disabled={currentQuestion === 0}
          variant="outline"
          className="font-bold"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Back
        </Button>
        <Button
          onClick={() => {
            if (currentQuestion === quizData.length - 1) {
              setShowResults(true)
              toast.success("Quiz completed! 🎉")
            } else {
              setCurrentQuestion(currentQuestion + 1)
            }
          }}
          disabled={selectedAnswers[currentQuestion] === null}
          className="font-bold"
        >
          {currentQuestion === quizData.length - 1 ? "See Results" : "Next"}{" "}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
