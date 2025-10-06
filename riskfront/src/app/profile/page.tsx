import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp, Calendar, Award, Zap, ArrowLeft, Star, CheckCircle2, XCircle } from "lucide-react"
import { ThemeToggle } from "@/Pages/theme-toggle"

export default function ProfilePage() {
  const userData = {
    name: "Alex Johnson",
    team: "Platform Engineering",
    totalQuizzes: 12,
    averageScore: 82,
    rank: 5,
    totalParticipants: 150,
    badges: [
      { name: "Quick Learner", icon: Zap, earned: true },
      { name: "Top Performer", icon: Trophy, earned: true },
      { name: "Consistency King", icon: Target, earned: true },
      { name: "Perfect Score", icon: Star, earned: false },
    ],
    recentQuizzes: [
      { date: "2025-01-15", score: 90, correct: 9, total: 10, maturity: "Elite" },
      { date: "2025-01-10", score: 80, correct: 8, total: 10, maturity: "High" },
      { date: "2025-01-05", score: 75, correct: 7, total: 10, maturity: "High" },
    ],
    stats: [
      { label: "Total Quizzes", value: "12", icon: Target },
      { label: "Average Score", value: "82%", icon: TrendingUp },
      { label: "Global Rank", value: "#5", icon: Trophy },
      { label: "Badges Earned", value: "3/4", icon: Award },
    ],
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
              <Link href="/leaderboard">
                <Button variant="ghost" className="font-bold hover:scale-105 transition-transform text-sm md:text-base">
                  <Trophy className="w-4 h-4 mr-2 animate-wiggle" />
                  <span className="hidden sm:inline">Leaderboard</span>
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
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl animate-scale-pulse">
                <span className="text-white font-black text-4xl">{userData.name.charAt(0)}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-foreground mb-2">{userData.name}</h1>
              <p className="text-xl text-muted-foreground font-bold">{userData.team}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary text-white font-black px-3 py-1 animate-shimmer">
                  Rank #{userData.rank}
                </Badge>
                <Badge variant="outline" className="border-2 border-primary font-black px-3 py-1">
                  {userData.totalQuizzes} Quizzes
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {userData.stats.map((stat, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 border-2 hover:border-primary transition-all hover:shadow-xl hover:scale-105 animate-bounce-in bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-primary animate-wiggle" />
                <span className="text-3xl font-black text-foreground">{stat.value}</span>
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8 border-2 hover:border-primary transition-all shadow-xl animate-fade-in-up bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg animate-scale-pulse">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-foreground">Recent Quizzes</h2>
              </div>
              <div className="space-y-4">
                {userData.recentQuizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="p-6 border-2 rounded-xl hover:border-primary transition-all hover:shadow-lg bg-gradient-to-r from-card to-primary/5 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-foreground text-lg">{quiz.date}</p>
                          <p className="text-sm text-muted-foreground font-bold">
                            {quiz.correct}/{quiz.total} Correct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-primary">{quiz.score}%</p>
                        <Badge className="bg-accent text-white font-black mt-1">{quiz.maturity}</Badge>
                      </div>
                    </div>
                    <Progress value={quiz.score} className="h-3 animate-shimmer" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 md:p-8 border-2 hover:border-primary transition-all shadow-xl animate-fade-in-up animate-delay-100 bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg animate-scale-pulse">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-foreground">Badges</h2>
              </div>
              <div className="space-y-4">
                {userData.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      badge.earned
                        ? "border-primary bg-gradient-to-r from-primary/10 to-accent/10 hover:shadow-lg"
                        : "border-muted bg-muted/20 opacity-50"
                    } animate-bounce-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                          badge.earned ? "bg-primary animate-scale-pulse" : "bg-muted"
                        }`}
                      >
                        <badge.icon className={`w-6 h-6 ${badge.earned ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-foreground">{badge.name}</p>
                        {badge.earned ? (
                          <div className="flex items-center gap-1 text-primary text-sm font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            Earned
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground text-sm font-bold">
                            <XCircle className="w-4 h-4" />
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
