"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Briefcase, Code, Send } from "lucide-react"
import toast from "react-hot-toast"   

type Role = "Developer" | "ITso"

export default function RoleFormModal() {
  const { user, isLoaded } = useUser()
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>("Developer")
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<any>({
    team: "",
    pod: "",
    badges: 0,
    highScore: 0,
    testsTaken: "",
    itsoName: "",
    designation: "",
    psid: "",
    assignedEvaluation: "",
    experience: 0,
  })

  const API_URL = "http://localhost:2413"

  // ✅ Check if user already registered
  useEffect(() => {
    if (!isLoaded) return
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) {
      setOpen(true)
      setLoading(false)
      return
    }

    axios
      .get(`${API_URL}/account/${email}`)
      .then(() => {
        setOpen(false)
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setOpen(true)
        }
      })
      .finally(() => setLoading(false))
  }, [isLoaded, user])

  const roleConfig: Record<Role, { icon: any; fields: Array<any> }> = {
    Developer: {
      icon: Code,
      fields: [
        { name: "team", label: "Team", type: "text", placeholder: "AppDev" },
        { name: "pod", label: "Pod", type: "text", placeholder: "Pod-2" },
        { name: "psid", label: "PSID", type: "text", placeholder: "PS123" },
        { name: "designation", label: "Designation", type: "text", placeholder: "Frontend Developer" },
        { name: "experience", label: "Experience (years)", type: "number", placeholder: "5" },
      ],
    },
    ITso: {
      icon: Briefcase,
      fields: [
        { name: "team", label: "Team", type: "text", placeholder: "Infra" },
        { name: "psid", label: "PSID", type: "text", placeholder: "PS123" },
        { name: "experience", label: "Experience (years)", type: "number", placeholder: "5" },
      ],
    },
  }

  const currentConfig = roleConfig[selectedRole]
  const RoleIcon = currentConfig.icon

  // ✅ Submit registration with toast
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return

    const email = user.primaryEmailAddress?.emailAddress
    const name = user.fullName || user.username || "Unknown User"

    const payload = {
      ...formData,
      name,
      email,
    }

    payload.testsTaken = payload.testsTaken ? payload.testsTaken.split(",").map((t: string) => t.trim()) : []
    payload.assignedEvaluation = payload.assignedEvaluation
      ? payload.assignedEvaluation.split(",").map((t: string) => t.trim())
      : []

    try {
      await axios.post(`${API_URL}/register/account`, {
        name,
        email,
        role: selectedRole,
      })

      const endpoint = selectedRole === "Developer" ? "/register/dev" : "/register/itso"
      await axios.post(`${API_URL}${endpoint}`, payload)

      toast.success("✅ Registered successfully!")
      setOpen(false)
    } catch (err: any) {
      console.error("❌ Registration failed", err.response?.data || err.message)
      toast.error("❌ Registration failed, please try again")
    }
  }

  if (!isLoaded || loading) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-card">
        <div className="relative">
          <div className="h-2 w-full bg-gradient-to-r from-primary/70 via-primary to-primary/70 animate-[pulse_2.4s_ease-in-out_infinite]" />
          <DialogHeader className="px-6 pt-5 pb-2">
            <DialogTitle className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Select Profile
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-muted-foreground">
              Choose your role and fill in the details to get started
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-3 pb-4">
          {/* Role Selection */}
          <Card className="p-4 md:p-5 mb-5 border-2 hover:border-primary transition-all shadow-xl bg-card">
            <Label className="text-sm md:text-base font-black text-foreground mb-3 block">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(roleConfig) as Role[]).map((role) => {
                const cfg = roleConfig[role]
                const Icon = cfg.icon
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 border-2 rounded-2xl transition-all hover:scale-105 ${
                      selectedRole === role
                        ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg animate-scale-pulse"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2 mx-auto shadow">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-black text-foreground text-xs md:text-sm capitalize">{role}</p>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Dynamic Form */}
          <Card className="p-4 md:p-5 border-2 hover:border-primary transition-all shadow-xl bg-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow">
                <RoleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-foreground capitalize">{selectedRole} Details</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Fill in your information below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {currentConfig.fields.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name} className="text-sm md:text-base font-bold text-foreground mb-2 block">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="border-2 focus:border-primary transition-all font-medium"
                  />
                </div>
              ))}

              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="font-bold">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 font-black hover:scale-105 transition-all shadow-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}