import QuizCarousel from "@/Pages/quiz-carousel"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy } from "lucide-react"
import { ThemeToggle } from "@/Pages/theme-toggle"

export default function Quiz() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-primary/10 rounded-full animate-rotate-slow" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-primary/5 rounded-full animate-rotate-slow"
          style={{ animationDirection: "reverse" }}
        />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-primary/10 rounded-full animate-scale-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-4 border-accent/10 rounded-full animate-scale-pulse animate-delay-200" />
      </div>

      <div className="border-b-4 border-primary bg-card dark:bg-card relative z-10 shadow-lg animate-slide-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300 shadow-xl animate-glow-pulse">
                  <span className="text-white font-black text-2xl md:text-3xl -rotate-6">H</span>
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-accent rounded-full animate-bounce" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">HSBC</h1>
                <p className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest">DevOps Assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <Link href="/">
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
              <Link href="/profile">
                <Button variant="ghost" className="font-bold hover:scale-105 transition-transform text-sm md:text-base">
                  Profile
                </Button>
              </Link>
               
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10">
        <div className="mb-8 md:mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow animate-bounce-in">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-black text-white uppercase tracking-widest">DORA Metrics</span>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-balance mb-6 text-foreground leading-none tracking-tight animate-fade-in-up animate-delay-100">
            Level Up Your
            <span className="block text-primary mt-2 animate-fade-in-up animate-delay-200">DevOps Game</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium animate-fade-in-up animate-delay-300">
            Take the ultimate assessment to measure your team's DevOps maturity. Answer 10 questions and discover where
            you stand!
          </p>
        </div>
        <QuizCarousel />
      </div>
    </main>
  )
}
