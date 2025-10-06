import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Target, Zap, Users, ArrowRight, LogInIcon, LogOutIcon } from "lucide-react"
import { ThemeToggle } from "@/Pages/theme-toggle"
import { SparklesCore } from "@/components/ui/sparkles";
import { SignedOut, SignedIn, SignUpButton ,SignOutButton } from '@clerk/nextjs'
import Image from "next/image";

export default function LandingPage() {
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
            </div>

            <nav className="bg-card relative z-10 shadow-lg animate-slide-in">
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
                            <SignedIn>
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
                                <Link href="/">
                                    <Button className="bg-primary hover:bg-primary/90 font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base">
                                        <span className="hidden sm:inline">Start Quiz</span>
                                        <span className="sm:hidden">Quiz</span>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Button className="ml-auto bg-primary hover:bg-primary/90 font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base">
                                    <SignOutButton />
                                    <LogOutIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </SignedIn>
                            <SignedOut>
                                <Button className="bg-primary hover:bg-primary/90 font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base">
                                    <SignUpButton />
                                    <LogInIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative w-full h-[65vh] flex flex-col items-center justify-center overflow-hidden">
                {/* Sparkles background */}
                <div className="absolute inset-0 w-full h-full">
                    <SparklesCore
                        id="tsparticlesfullpage"
                        background="transparent"
                        minSize={1.4}
                        maxSize={2.4}
                        particleDensity={100}
                        className="absolute inset-0 w-full h-screen"
                        particleColor="#FFFFFF"
                    />
                </div>

                {/* HSBC Logo overlay (watermark) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Image
                        src="/HSBC_Logo.png"
                        alt="HSBC Logo"
                        width={300}
                        height={300}
                        className="w-[100%] md:w-[65%] lg:w-[35%] object-contain"
                    />
                </div>

                {/* Heading */}
                <h1
                    className="relative z-20 text-3xl md:text-6xl lg:text-7xl 
             font-bold text-center tracking-tight 
             bg-gradient-to-r from-[#db0011] to-black 
             bg-clip-text text-transparent 
             font-sans 
             drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] 
             animate-fadeGlow"
                >
                    HSBC RISK HACK
                </h1>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                    {
                        icon: Target,
                        title: "10 Questions",
                        description: "Comprehensive assessment covering all DORA metrics",
                        color: "bg-primary",
                    },
                    {
                        icon: Zap,
                        title: "Instant Results",
                        description: "Get your DevOps maturity score immediately",
                        color: "bg-accent",
                    },
                    {
                        icon: Trophy,
                        title: "Leaderboard",
                        description: "Compete with teams across the organization",
                        color: "bg-primary",
                    },
                    {
                        icon: Users,
                        title: "Team Insights",
                        description: "Track progress and identify improvement areas",
                        color: "bg-accent",
                    },
                ].map((feature, index) => (
                    <Card
                        key={index}
                        className="p-6 border-2 hover:border-primary transition-all hover:shadow-xl hover:scale-105 animate-bounce-in bg-card"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div
                            className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-scale-pulse`}
                        >
                            <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-black mb-2 text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
                    </Card>
                ))}
            </div>

            <Card className="p-12 border-4 border-primary bg-gradient-to-br from-card to-primary/5 shadow-2xl animate-fade-in-up">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black mb-4 text-foreground">Ready to Get Started?</h2>
                    <p className="text-lg text-muted-foreground mb-8 font-medium leading-relaxed">
                        Join hundreds of teams already measuring their DevOps performance with HSBC's DORA metrics platform.
                    </p>
                    <Link href="/">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 font-black text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-glow-pulse"
                        >
                            Start Your Assessment
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Card>

        </main>
    )
}
