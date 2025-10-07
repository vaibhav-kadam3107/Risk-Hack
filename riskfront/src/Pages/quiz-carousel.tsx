"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Zap, Target, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"


const quizData = [
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
    question: "What is your average lead time from code commit to production deployment?",
    options: ["Less than one hour", "One day to one week", "One week to one month", "More than one month"],
  },
  {
    id: 3,
    question: "How long does it typically take to restore service after an incident?",
    options: ["Less than one hour", "Less than one day", "One day to one week", "More than one week"],
  },
  {
    id: 4,
    question: "What percentage of changes to production result in degraded service or require remediation?",
    options: ["0-15%", "16-30%", "31-45%", "More than 45%"],
  },
  {
    id: 5,
    question: "Does your team use automated testing in the CI/CD pipeline?",
    options: [
      "Yes, comprehensive automated testing",
      "Yes, but limited coverage",
      "Partially implemented",
      "No automated testing",
    ],
  },
  {
    id: 6,
    question: "How does your team handle rollbacks and deployment failures?",
    options: [
      "Automated rollback with monitoring",
      "Manual rollback process documented",
      "Ad-hoc rollback procedures",
      "No formal rollback process",
    ],
  },
  {
    id: 7,
    question: "What level of monitoring and observability does your service have?",
    options: [
      "Comprehensive monitoring with alerts and dashboards",
      "Basic monitoring with some alerts",
      "Limited monitoring capabilities",
      "Minimal or no monitoring",
    ],
  },
  {
    id: 8,
    question: "How is infrastructure managed for your service?",
    options: [
      "Fully automated Infrastructure as Code",
      "Partially automated with IaC",
      "Mix of manual and automated",
      "Primarily manual configuration",
    ],
  },
  {
    id: 9,
    question: "What is your team's approach to incident management?",
    options: [
      "Formal process with post-mortems and continuous improvement",
      "Documented process with some follow-up",
      "Informal process",
      "No structured incident management",
    ],
  },
  {
    id: 10,
    question: "How does your team handle security in the development lifecycle?",
    options: [
      "Security integrated throughout (DevSecOps)",
      "Security checks at key stages",
      "Security review before production",
      "Security handled separately from development",
    ],
  },
]

// ------------------------------
// Component
// ------------------------------
export default function QuizCarousel() {
  const { user } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      toast.success("Quiz completed! 🎉")
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1)
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((total, answer) => {
      if (answer === null) return total
      const points = 4 - answer
      return total + points
    }, 0)
  }

  const getMaturityLevel = (score: number) => {
    const maxScore = quizData.length * 4
    const percentage = (score / maxScore) * 100

    if (percentage >= 90) return { level: "Elite", color: "text-primary" }
    if (percentage >= 75) return { level: "High", color: "text-accent" }
    if (percentage >= 50) return { level: "Medium", color: "text-muted-foreground" }
    return { level: "Low", color: "text-muted-foreground" }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(quizData.length).fill(null))
    setShowResults(false)
    toast("Quiz reset 🔄", { icon: "♻️" })
  }

  // ------------------------------
  // Submit Results to Backend
  // ------------------------------
  const API_URL = "http://localhost:2413"

  const handleSubmitResults = async () => {
    const score = calculateScore()
    const payload = {
      title: "Team DevOps Assessment",
      givenBy: user?.fullName || "Anonymous",
      email: user?.primaryEmailAddress?.emailAddress || "no-email@example.com",
      questions: quizData.map((q, index) => ({
        questionText: q.question,
        selectedAnswer: selectedAnswers[index] !== null ? q.options[selectedAnswers[index] as number] : "Not answered",
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

  // ------------------------------
  // Show Results
  // ------------------------------
  if (showResults) {
    const score = calculateScore()
    const maxScore = quizData.length * 4
    const percentage = Math.round((score / maxScore) * 100)
    const maturity = getMaturityLevel(score)

    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-10 md:p-16 shadow-2xl border-4 border-primary bg-background relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer" />

          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-accent mb-8 shadow-2xl">
              <BarChart3 className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-foreground tracking-tight">You Did It!</h2>
            <p className="text-xl font-bold text-primary uppercase tracking-widest">Assessment Complete</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 relative z-10">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" />
                <div className="text-sm font-black uppercase">Score</div>
              </div>
              <div className="text-6xl font-black mb-2">{score}</div>
              <div className="text-lg font-bold opacity-90">out of {maxScore} points</div>
            </div>
            <div className="p-8 rounded-2xl bg-background border-4 border-primary shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary" />
                <div className="text-sm font-black uppercase text-primary">Level</div>
              </div>
              <div className={cn("text-6xl font-black mb-2", maturity.color)}>{maturity.level}</div>
              <div className="text-lg font-bold text-muted-foreground">{percentage}% Maturity</div>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8" />
                <div className="text-sm font-black uppercase">Questions</div>
              </div>
              <div className="text-6xl font-black mb-2">{quizData.length}</div>
              <div className="text-lg font-bold opacity-90">Completed</div>
            </div>
          </div>

          <div className="flex justify-center gap-4 relative z-10">
            <Button onClick={resetQuiz} size="lg" className="gap-3 text-lg font-black px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl">
              <TrendingUp className="w-6 h-6" />
              Take Again
            </Button>
            <Button onClick={handleSubmitResults} size="lg" className="gap-3 text-lg font-black px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl">
              Save Results
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ------------------------------
  // Question UI
  // ------------------------------
  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100
  const answeredCount = selectedAnswers.filter((a) => a !== null).length

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-black text-foreground">
            Question {currentQuestion + 1} <span className="text-primary">/ {quizData.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-muted-foreground">{answeredCount} answered</span>
          </div>
        </div>
        <div className="h-4 bg-background rounded-full overflow-hidden border-4 border-primary shadow-lg">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className="p-10 md:p-12 shadow-2xl border-4 border-primary bg-background mb-8 relative overflow-hidden">
        <div className="mb-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-br from-primary to-accent rounded-full text-sm font-black text-white mb-8 uppercase tracking-widest shadow-lg">
            <Zap className="w-4 h-4" />
            Question {currentQuestion + 1}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight">{question.question}</h2>
        </div>

        <div className="space-y-4 relative z-10">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index
            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={cn(
                  "w-full p-6 text-left rounded-2xl border-4 transition-all duration-300",
                  isSelected
                    ? "border-primary bg-gradient-to-r from-primary/10 to-accent/10 shadow-xl"
                    : "border-border bg-background hover:border-primary/50 hover:shadow-lg"
                )}
              >
                <span className="text-lg font-bold text-foreground">{option}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-6">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="lg"
          className="gap-3 text-lg font-black px-8 py-6 rounded-xl border-4 hover:border-primary hover:bg-primary hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === null}
          size="lg"
          className="gap-3 text-lg font-black px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl"
        >
          {currentQuestion === quizData.length - 1 ? "See Results" : "Next"}
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}