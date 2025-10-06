import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, ArrowLeft, TrendingUp, Zap, Target } from "lucide-react"
import { ThemeToggle } from "@/Pages/theme-toggle"

export default function LeaderboardPage() {
  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      team: "Cloud Infrastructure",
      score: 95,
      quizzes: 15,
      trend: "up",
      badge: "Elite",
    },
    {
      rank: 2,
      name: "Michael Rodriguez",
      team: "DevOps Engineering",
      score: 92,
      quizzes: 18,
      trend: "up",
      badge: "Elite",
    },
    {
      rank: 3,
      name: "Emily Watson",
      team: "Platform Engineering",
      score: 90,
      quizzes: 14,
      trend: "same",
      badge: "Elite",
    },
    {
      rank: 4,
      name: "David Kim",
      team: "Site Reliability",
      score: 88,
      quizzes: 16,
      trend: "up",
      badge: "High",
    },
    {
      rank: 5,
      name: "Alex Johnson",
      team: "Platform Engineering",
      score: 82,
      quizzes: 12,
      trend: "down",
      badge: "High",
    },
    {
      rank: 6,
      name: "Jessica Lee",
      team: "Cloud Infrastructure",
      score: 80,
      quizzes: 11,
      trend: "up",
      badge: "High",
    },
    {
      rank: 7,
      name: "Ryan Patel",
      team: "DevOps Engineering",
      score: 78,
      quizzes: 13,
      trend: "same",
      badge: "Medium",
    },
    {
      rank: 8,
      name: "Sophie Turner",
      team: "Site Reliability",
      score: 75,
      quizzes: 10,
      trend: "up",
      badge: "Medium",
    },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="text-xl font-black text-muted-foreground">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500/20 to-yellow-600/20 border-yellow-500"
    if (rank === 2) return "from-gray-400/20 to-gray-500/20 border-gray-400"
    if (rank === 3) return "from-amber-600/20 to-amber-700/20 border-amber-600"
    return "from-card to-primary/5 border-border"
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-primary/10 rounded-full animate-rotate-slow" />
      </div>

      <nav className="border-b-4 border-primary bg-card relative z-10 shadow-lg animate-slide-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/landing" className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300 shadow-xl">
                  <span className="text-white font-black text-xl md:text-2xl -rotate-6">H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full animate-bounce" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-foreground">HSBC</h1>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">DevOps Hub</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <Link href="/landing">
                <Button variant="ghost" className="font-bold hover:scale-105 transition-transform text-sm md:text-base">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="font-bold hover:scale-105 transition-transform text-sm md:text-base">
                  Profile
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base">
                  <span className="hidden sm:inline">Take Quiz</span>
                  <span className="sm:hidden">Quiz</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow animate-bounce-in">
            <Trophy className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-black text-white uppercase tracking-widest">Global Rankings</span>
            <Trophy className="w-4 h-4 text-white animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-balance mb-6 text-foreground leading-none tracking-tight animate-fade-in-up animate-delay-100">
            Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium animate-fade-in-up animate-delay-200">
            Top performers across all HSBC DevOps teams
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            { label: "Total Participants", value: "150", icon: Target },
            { label: "Quizzes Completed", value: "1,247", icon: Zap },
            { label: "Average Score", value: "76%", icon: TrendingUp },
          ].map((stat, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 border-2 hover:border-primary transition-all hover:shadow-xl hover:scale-105 animate-bounce-in bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-4xl font-black text-foreground">{stat.value}</p>
                </div>
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-scale-pulse">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 border-2 hover:border-primary transition-all shadow-2xl animate-fade-in-up bg-card">
          <div className="space-y-4">
            {leaderboardData.map((entry, index) => (
              <div
                key={index}
                className={`p-6 border-2 rounded-2xl transition-all hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r ${getRankColor(
                  entry.rank,
                )} animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    {entry.rank <= 3 ? (
                      <div className="relative animate-scale-pulse">
                        {getRankIcon(entry.rank)}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-bounce" />
                      </div>
                    ) : (
                      getRankIcon(entry.rank)
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-foreground">{entry.name}</h3>
                      <Badge
                        className={`font-black ${
                          entry.badge === "Elite"
                            ? "bg-primary text-white"
                            : entry.badge === "High"
                              ? "bg-accent text-white"
                              : "bg-muted text-muted-foreground"
                        } animate-shimmer`}
                      >
                        {entry.badge}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">{entry.team}</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-3xl font-black text-primary">{entry.score}%</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-foreground">{entry.quizzes}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quizzes</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-card shadow-md">
                      {entry.trend === "up" ? (
                        <TrendingUp className="w-6 h-6 text-green-500 animate-bounce" />
                      ) : entry.trend === "down" ? (
                        <TrendingUp className="w-6 h-6 text-red-500 rotate-180 animate-bounce" />
                      ) : (
                        <div className="w-6 h-1 bg-muted-foreground rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-12 text-center animate-fade-in-up">
          <p className="text-xl text-muted-foreground mb-6 font-medium">Think you can make it to the top?</p>
          <Link href="/">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 font-black text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-glow-pulse"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Take the Quiz Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
