"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Zap, Target, Award } from "lucide-react"
import { cn } from "@/lib/utils"

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
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "What is your average lead time from code commit to production deployment?",
    options: ["Less than one hour", "One day to one week", "One week to one month", "More than one month"],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "How long does it typically take to restore service after an incident?",
    options: ["Less than one hour", "Less than one day", "One day to one week", "More than one week"],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "What percentage of changes to production result in degraded service or require remediation?",
    options: ["0-15%", "16-30%", "31-45%", "More than 45%"],
    correctAnswer: 0,
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
    correctAnswer: 0,
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
    correctAnswer: 0,
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
    correctAnswer: 0,
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
    correctAnswer: 0,
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
    correctAnswer: 0,
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
    correctAnswer: 0,
  },
]

export default function QuizCarousel() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null))
  const [showResults, setShowResults] = useState(false)

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
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((total, answer, index) => {
      if (answer === null) return total
      const points = 4 - answer
      return total + points
    }, 0)
  }

  const getMaturityLevel = (score: number) => {
    const maxScore = quizData.length * 4
    const percentage = (score / maxScore) * 100

    if (percentage >= 90)
      return { level: "Elite", color: "text-primary", description: "Industry-leading DevOps practices" }
    if (percentage >= 75) return { level: "High", color: "text-accent", description: "Strong DevOps maturity" }
    if (percentage >= 50)
      return { level: "Medium", color: "text-muted-foreground", description: "Developing DevOps capabilities" }
    return { level: "Low", color: "text-muted-foreground", description: "Significant improvement opportunities" }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(quizData.length).fill(null))
    setShowResults(false)
  }

  if (showResults) {
    const score = calculateScore()
    const maxScore = quizData.length * 4
    const percentage = Math.round((score / maxScore) * 100)
    const maturity = getMaturityLevel(score)

    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-10 md:p-16 shadow-2xl border-4 border-primary bg-background relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-scale-pulse" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-scale-pulse animate-delay-200" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-primary/20 rounded-full animate-rotate-slow" />
          <div
            className="absolute bottom-1/4 left-1/4 w-24 h-24 border-4 border-accent/20 rounded-full animate-rotate-slow"
            style={{ animationDirection: "reverse" }}
          />

          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-accent mb-8 shadow-2xl transform hover:scale-110 transition-transform animate-bounce-in animate-glow-pulse">
              <BarChart3 className="w-16 h-16 text-white animate-wiggle" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-foreground tracking-tight animate-fade-in-up animate-delay-100">
              You Did It!
            </h2>
            <p className="text-xl font-bold text-primary uppercase tracking-widest animate-fade-in-up animate-delay-200">
              Assessment Complete
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 relative z-10">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl transform hover:scale-105 transition-transform animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 animate-wiggle" />
                <div className="text-sm font-black uppercase tracking-wider">Score</div>
              </div>
              <div className="text-6xl font-black mb-2 animate-bounce-in">{score}</div>
              <div className="text-lg font-bold opacity-90">out of {maxScore} points</div>
            </div>
            <div className="p-8 rounded-2xl bg-background border-4 border-primary shadow-xl transform hover:scale-105 transition-transform animate-slide-up animate-delay-100">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary animate-wiggle" />
                <div className="text-sm font-black uppercase tracking-wider text-primary">Level</div>
              </div>
              <div className={cn("text-6xl font-black mb-2 animate-bounce-in", maturity.color)}>{maturity.level}</div>
              <div className="text-lg font-bold text-muted-foreground">{percentage}% Maturity</div>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-xl transform hover:scale-105 transition-transform animate-slide-up animate-delay-200">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 animate-wiggle" />
                <div className="text-sm font-black uppercase tracking-wider">Questions</div>
              </div>
              <div className="text-6xl font-black mb-2 animate-bounce-in">{quizData.length}</div>
              <div className="text-lg font-bold opacity-90">Completed</div>
            </div>
          </div>

          <div className="mb-12 relative z-10">
            <h3 className="text-2xl font-black text-foreground mb-6 flex items-center gap-3 animate-fade-in-up">
              <div className="w-2 h-8 bg-primary rounded-full animate-scale-pulse" />
              Your Answers
            </h3>
            <div className="space-y-4">
              {quizData.map((question, index) => {
                const answer = selectedAnswers[index]
                const points = answer !== null ? 4 - answer : 0
                return (
                  <div
                    key={question.id}
                    className="p-6 rounded-xl border-2 border-border bg-gradient-to-r from-background to-secondary/30 hover:border-primary transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg transform hover:rotate-12 hover:scale-110 transition-all duration-300">
                        <span className="text-lg font-black text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-foreground mb-3 leading-relaxed">{question.question}</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {answer !== null ? question.options[answer] : "Not answered"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="px-4 py-2 bg-primary rounded-full animate-scale-pulse">
                          <span className="text-sm font-black text-white">{points} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4 relative z-10">
            <Button
              onClick={resetQuiz}
              size="lg"
              className="gap-3 text-lg font-black px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all animate-glow-pulse"
            >
              <TrendingUp className="w-6 h-6" />
              Take Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100
  const answeredCount = selectedAnswers.filter((a) => a !== null).length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-black text-foreground">
            Question {currentQuestion + 1} <span className="text-primary">/ {quizData.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse animate-glow-pulse" />
            <span className="text-sm font-bold text-muted-foreground">{answeredCount} answered</span>
          </div>
        </div>
        <div className="h-4 bg-background rounded-full overflow-hidden border-4 border-primary shadow-lg">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
      </div>

      <Card className="p-10 md:p-12 shadow-2xl border-4 border-primary bg-background mb-8 relative overflow-hidden transform hover:scale-[1.02] transition-transform animate-fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-scale-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-scale-pulse animate-delay-200" />

        <div className="mb-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-br from-primary to-accent rounded-full text-sm font-black text-white mb-8 uppercase tracking-widest shadow-lg animate-bounce-in">
            <Zap className="w-4 h-4 animate-wiggle" />
            Question {currentQuestion + 1}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight text-balance">
            {question.question}
          </h2>
        </div>

        <div className="space-y-4 relative z-10">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={cn(
                  "w-full p-6 text-left rounded-2xl border-4 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up",
                  isSelected
                    ? "border-primary bg-gradient-to-r from-primary/10 to-accent/10 shadow-xl scale-[1.02] animate-glow-pulse"
                    : "border-border bg-background hover:border-primary/50 hover:shadow-lg",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all flex-shrink-0 shadow-md",
                      isSelected
                        ? "border-primary bg-primary scale-110 animate-bounce-in"
                        : "border-muted-foreground/30 bg-background",
                    )}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-primary-foreground animate-scale-pulse" />}
                  </div>
                  <span className="text-lg font-bold text-foreground leading-relaxed">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-6 animate-slide-up">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="lg"
          className="gap-3 text-lg font-black px-8 py-6 rounded-xl border-4 hover:border-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50 bg-transparent hover:scale-105 transform"
        >
          <ChevronLeft className="w-6 h-6" />
          Back
        </Button>

        <div className="flex gap-3">
          {quizData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={cn(
                "h-3 rounded-full transition-all duration-300 hover:scale-125",
                index === currentQuestion
                  ? "bg-primary w-12 shadow-lg animate-glow-pulse"
                  : selectedAnswers[index] !== null
                    ? "bg-accent w-3 animate-scale-pulse"
                    : "bg-border w-3",
              )}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === null}
          size="lg"
          className="gap-3 text-lg font-black px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 animate-glow-pulse"
        >
          {currentQuestion === quizData.length - 1 ? "See Results" : "Next"}
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
