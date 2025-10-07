"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Users,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ClipboardList,
  UserCog,
  Target,
} from "lucide-react"
import { ThemeToggle } from "@/Pages/theme-toggle"
import { useUser } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"

export default function ItsoProfilePage() {
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(true)
  const [itsoData, setItsoData] = useState<any>(null)
  const [teamDevs, setTeamDevs] = useState<any[]>([])

  const API_URL = "http://localhost:2413"

  useEffect(() => {
    if (!isLoaded || !user) return
    const email = user.primaryEmailAddress?.emailAddress
    if (!email) return

    async function fetchItsoData() {
      try {
        // ITSO details
        const res = await axios.get(`${API_URL}/itso/${email}`)
        setItsoData(res.data)

        // Developers in ITSO team
        const devRes = await axios.get(`${API_URL}/itso/${email}/devs`)
        setTeamDevs(devRes.data.developers || [])
      } catch (err) {
        console.error("Error fetching ITSO data:", err)
        setItsoData(null)
        setTeamDevs([])
      } finally {
        setLoading(false)
      }
    }

    fetchItsoData()
  }, [isLoaded, user])

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg font-bold text-muted-foreground">Loading ITSO profile...</p>
      </main>
    )
  }

  if (!itsoData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg font-bold text-muted-foreground">No ITSO profile found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Navbar */}
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
            </div>
          </div>
        </div>
      </nav>

      {/* Profile */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl animate-scale-pulse">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full rounded-3xl object-cover" />
                ) : (
                  <span className="text-white font-black text-4xl">{itsoData.name.charAt(0)}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <UserCog className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-foreground mb-2">{itsoData.name}</h1>
              <p className="text-xl text-muted-foreground font-bold">{itsoData.team}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary text-white font-black px-3 py-1 animate-shimmer">PSID {itsoData.psid}</Badge>
                <Badge variant="outline" className="border-2 border-primary font-black px-3 py-1">
                  {itsoData.experience} Years Experience
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="p-6 border-2 hover:border-primary transition-all shadow-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-primary animate-wiggle" />
              <span className="text-3xl font-black text-foreground">{itsoData.team}</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Team</p>
          </Card>
          <Card className="p-6 border-2 hover:border-primary transition-all shadow-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-primary animate-wiggle" />
              <span className="text-3xl font-black text-foreground">{itsoData.experience} yrs</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Experience</p>
          </Card>
          <Card className="p-6 border-2 hover:border-primary transition-all shadow-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <ClipboardList className="w-8 h-8 text-primary animate-wiggle" />
              <span className="text-3xl font-black text-foreground">{itsoData.assignedEvaluation?.length || 0}</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Evaluations Assigned</p>
          </Card>
        </div>

        {/* Evaluations */}
        <Card className="p-6 md:p-8 border-2 hover:border-primary transition-all shadow-xl animate-fade-in-up bg-card">
          {/* <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg animate-scale-pulse">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-foreground">Assigned Evaluations</h2>
          </div> */}
          <div className="space-y-4">
            {itsoData.assignedEvaluation && itsoData.assignedEvaluation.length > 0 ? (
              itsoData.assignedEvaluation.map((evalItem: string, index: number) => (
                <div
                  key={index}
                  className="p-4 border-2 rounded-xl hover:border-primary transition-all hover:shadow-lg bg-gradient-to-r from-card to-primary/5 animate-bounce-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-black text-foreground">{evalItem}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 border-2 rounded-xl bg-muted/20 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-muted-foreground" />
                <p className="font-bold text-muted-foreground">No evaluations assigned</p>
              </div>
            )}
          </div>
        </Card>

        {/* Developers in Team */}
        <Card className="p-6 md:p-8 border-2 hover:border-primary transition-all shadow-xl animate-fade-in-up bg-card mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg animate-scale-pulse">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-foreground">Developers in {itsoData.team}</h2>
          </div>
          {teamDevs.length > 0 ? (
            <div className="grid gap-4">
              {teamDevs.map((dev, index) => (
                <div
                  key={index}
                  className="p-4 border-2 rounded-xl hover:border-primary transition-all hover:shadow-lg bg-gradient-to-r from-card to-primary/5"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-black text-lg text-foreground">{dev.name}</p>
                      <p className="text-sm text-muted-foreground font-bold">{dev.designation}</p>
                    </div>
                    <Badge className="bg-primary text-white font-black">{dev.highScore || 0}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-bold">No developers found in this team</p>
          )}
        </Card>

        {/* Team Test History */}
        <Card className="p-6 md:p-8 border-2 hover:border-primary transition-all shadow-xl animate-fade-in-up bg-card mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg animate-scale-pulse">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-foreground">Team’s Test History</h2>
          </div>

          {teamDevs.length > 0 ? (
            <div className="space-y-6">
              {teamDevs.map((dev, dIndex) => (
                <div key={dIndex} className="p-4 border-2 rounded-xl bg-card hover:border-primary transition-all">
                  <p className="font-black text-lg mb-3">
                    {dev.name} ({dev.designation})
                  </p>
                  {dev.testsTaken && dev.testsTaken.length > 0 ? (
                    <div className="space-y-3">
                      {dev.testsTaken.map((test: any, tIndex: number) => (
                        <div
                          key={tIndex}
                          className="p-3 border rounded-lg bg-gradient-to-r from-card to-primary/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-bold text-foreground text-sm">{test.date}</p>
                              <p className="text-xs text-muted-foreground">
                                {test.correct}/{test.total} Correct
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black text-primary">{test.score}%</span>
                              <p className="text-xs font-bold text-muted-foreground">{test.maturity}</p>
                            </div>
                          </div>
                          <Progress value={test.score} className="h-2 animate-shimmer" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tests taken yet</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-bold">No developers found in this team</p>
          )}
        </Card>
      </div>
    </main>
  )
}