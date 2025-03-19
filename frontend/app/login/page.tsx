"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Lock, Mail, User } from "lucide-react"
import { mockApiService } from "@/lib/mock-api-service"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"borrower" | "lender" | "mediator">("borrower")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add useEffect to handle lender information from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)

      // Get lender data if available
      const lenderParam = params.get("lender")
      if (lenderParam) {
        try {
          const lenderData = JSON.parse(decodeURIComponent(lenderParam))
          // Store lender data in localStorage for use after login
          localStorage.setItem("selectedLender", JSON.stringify(lenderData))
        } catch (error) {
          console.error("Error parsing lender data:", error)
        }
      }

      // Get form data if available
      const formDataParam = params.get("formData")
      if (formDataParam) {
        try {
          const formData = JSON.parse(decodeURIComponent(formDataParam))
          localStorage.setItem("preliminaryFormData", JSON.stringify(formData))
        } catch (error) {
          console.error("Error parsing form data:", error)
        }
      }
    }
  }, [])

  // Fix the login flow to properly redirect to the new project page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setLoading(true)
      const response = await mockApiService.login(formData.email, formData.password)

      if (response.success) {
        // Check if there's a selected lender to include in the redirect
        const selectedLender = localStorage.getItem("selectedLender")
        const preliminaryFormData = localStorage.getItem("preliminaryFormData")

        // Redirect based on role
        if (response.role === "borrower") {
          if (selectedLender || preliminaryFormData) {
            console.log("Redirecting to new project with lender/form data")
            // Use window.location.href for a hard redirect to ensure proper page loading
            window.location.href = `/borrower/projects/new?prefill=true${selectedLender ? `&lender=${selectedLender}` : ""}`
          } else {
            router.push("/borrower")
          }
        } else if (response.role === "lender") {
          router.push("/lender")
        } else if (response.role === "mediator") {
          router.push("/mediator")
        }
      } else {
        setError(response.message || "Invalid credentials")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Sign in to your account to access your dashboard</CardDescription>

          <Tabs
            defaultValue={role}
            onValueChange={(value) => setRole(value as "borrower" | "lender" | "mediator")}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="borrower" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Borrower
              </TabsTrigger>
              <TabsTrigger value="lender" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Lender
              </TabsTrigger>
              <TabsTrigger value="mediator" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mediator
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <span>Don&apos;t have an account? </span>
              <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

