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
        const res = await axios.get(`${API_URL}/itso/${email}`)
        setItsoData(res.data)
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
        <p className="text-lg font-bold text-muted-foreground animate-pulse">
          Loading ITSO profile...
        </p>
      </main>
    )
  }

  if (!itsoData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg font-bold text-muted-foreground">
          No ITSO profile found.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
      {/* Navbar */}
      <nav className="border-b-2 border-primary/20 bg-card/60 backdrop-blur-xl shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">H</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">HSBC</h1>
              <p className="text-xs font-bold text-primary uppercase">
                DevOps Hub
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" className="font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="font-bold">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-6 mb-12">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl overflow-hidden">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-black text-4xl">
                  {itsoData.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <UserCog className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-foreground mb-1">
              {itsoData.name}
            </h1>
            <p className="text-lg text-muted-foreground font-bold">
              {itsoData.team}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge className="bg-primary text-white font-black">
                PSID {itsoData.psid}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary text-primary font-black"
              >
                {itsoData.experience} Years Experience
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border border-primary/20 bg-card/70 backdrop-blur-md shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {itsoData.team}
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-2">
              Team
            </p>
          </Card>
          <Card className="p-6 border border-primary/20 bg-card/70 backdrop-blur-md shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <Award className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {itsoData.experience} yrs
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-2">
              Experience
            </p>
          </Card>
        </div>

        {/* Developers */}
        <Card className="p-6 border border-primary/20 bg-card/70 backdrop-blur-md shadow-lg mb-8">
          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Developers in{" "}
            {itsoData.team}
          </h2>
          {teamDevs.length > 0 ? (
            <div className="grid gap-4">
              {teamDevs.map((dev, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-card to-primary/10 hover:scale-[1.02] transition-all shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg text-foreground">
                        {dev.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-bold">
                        {dev.designation}
                      </p>
                    </div>
                    <Badge className="bg-primary text-white font-black">
                      High Score : {dev.highScore || 0}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-bold">
              No developers found
            </p>
          )}
        </Card>

        {/* Team Test History */}
        <Card className="p-6 border border-primary/20 bg-card/70 backdrop-blur-md shadow-lg">
          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" /> Team’s Test History
          </h2>
          {teamDevs.length > 0 ? (
            <div className="space-y-6">
              {teamDevs.map((dev, dIndex) => (
                <div
                  key={dIndex}
                  className="p-4 border rounded-xl bg-gradient-to-r from-card to-primary/5 hover:scale-[1.01] transition-all shadow-sm"
                >
                  <p className="font-black text-lg mb-3">
                    {dev.name} ({dev.designation})
                  </p>
                  {dev.testsTaken && dev.testsTaken.length > 0 ? (
                    <div className="space-y-3">
                      {dev.testsTaken.map((test: any, tIndex: number) => (
                        <div
                          key={tIndex}
                          className="p-3 border rounded-lg bg-card/80"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-sm text-foreground">
                              {test.quizTitle}
                            </p>
                            <span className="text-sm font-black text-primary">
                              {test.score}/40
                            </span>
                          </div>
                          <Progress
                            value={(test.score / 40) * 100}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tests taken yet
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-bold">
              No test data found
            </p>
          )}
        </Card>
      </div>
    </main>
  )
}