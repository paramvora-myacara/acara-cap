"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { mockApiService, type Match } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  Home,
  Info,
  MapPin,
  Send,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const { toast } = useToast()

  const matchId = Number.parseInt(params.id)

  // Fetch match data
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true)

        // In a real app, we would fetch the specific match by ID
        // For now, we'll use the borrower matches and find the one with the matching ID
        const response = await mockApiService.getBorrowerMatches(1)

        if (response.success) {
          const foundMatch = response.matches.find((m) => m.match_id === matchId)

          if (foundMatch) {
            setMatch(foundMatch)
          } else {
            setError("Match not found")
          }
        } else {
          setError("Failed to load match data")
        }
      } catch (err) {
        setError("An error occurred while loading match data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [matchId])

  const handleAcceptMatch = async () => {
    try {
      setProcessing(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update match status
      if (match) {
        setMatch({
          ...match,
          match_status: "accepted",
        })
      }

      toast({
        title: "Match Accepted",
        description: "You have successfully accepted this match. The borrower has been notified.",
      })
    } catch (error) {
      console.error("Error accepting match:", error)
      toast({
        title: "Error",
        description: "Failed to accept match. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleRejectMatch = async () => {
    try {
      setProcessing(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update match status
      if (match) {
        setMatch({
          ...match,
          match_status: "rejected",
        })
      }

      toast({
        title: "Match Rejected",
        description: "You have rejected this match. The borrower has been notified.",
      })
    } catch (error) {
      console.error("Error rejecting match:", error)
      toast({
        title: "Error",
        description: "Failed to reject match. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      setSendingMessage(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the borrower.",
      })

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading match details...</p>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Match</h3>
          <p className="text-slate-600 mb-4">{error || "Match not found"}</p>
          <Link href="/lender">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/lender">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/lender" className="text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Match Details</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{match.project_details.project_address.split(",")[0]}</h1>
            <p className="text-slate-600">
              {match.project_details.asset_type} • {match.project_details.deal_type} •{" "}
              {match.project_details.capital_type}
            </p>
          </div>
          <MatchStatusBadge status={match.match_status} large />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="project" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Project Details
              </TabsTrigger>
              <TabsTrigger value="borrower" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Borrower
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Match Overview</CardTitle>
                  <CardDescription>Match created on {new Date(match.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Match Compatibility</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Match</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Asset Type</span>
                            <span className="font-medium">100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Deal Type</span>
                            <span className="font-medium">90%</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Loan Size</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Location</span>
                            <span className="font-medium">70%</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Key Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Debt Request</p>
                            <p className="text-lg font-bold">${match.project_details.debt_request.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              ${(match.project_details.debt_request / 1000000).toFixed(1)}M
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Location</p>
                            <p>{match.project_details.project_address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Match Date</p>
                            <p>{new Date(match.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Borrower</p>
                            <p>John Smith</p>
                            <p className="text-sm text-muted-foreground">Smith Real Estate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Match Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mr-4 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Match Created</p>
                          <p className="text-sm text-muted-foreground">
                            This project was matched with your lending criteria
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {match.match_status === "accepted" && (
                        <div className="flex">
                          <div className="mr-4 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Match Accepted</p>
                            <p className="text-sm text-muted-foreground">
                              You accepted this match and the borrower was notified
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}

                      {match.match_status === "rejected" && (
                        <div className="flex">
                          <div className="mr-4 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                              <X className="h-4 w-4 text-red-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Match Rejected</p>
                            <p className="text-sm text-muted-foreground">
                              You declined this match and the borrower was notified
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {match.match_status === "pending" && (
                    <div className="flex justify-end gap-3 w-full">
                      <Button
                        variant="outline"
                        onClick={handleRejectMatch}
                        disabled={processing}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Decline Match
                      </Button>
                      <Button onClick={handleAcceptMatch} disabled={processing} className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        Accept Match
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="project">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Comprehensive information about the real estate project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Project Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Project Address</p>
                            <p className="font-medium">{match.project_details.project_address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Asset Type</p>
                            <p className="font-medium">{match.project_details.asset_type}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Deal Type</p>
                            <p className="font-medium">{match.project_details.deal_type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Capital Type</p>
                            <p className="font-medium">{match.project_details.capital_type}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Debt Request</p>
                          <p className="font-medium">${match.project_details.debt_request.toLocaleString()}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Project Description</p>
                          <p>
                            This {match.project_details.asset_type.toLowerCase()} project is located in a prime area of{" "}
                            {match.project_details.project_address.split(",")[1]}. The borrower is seeking{" "}
                            {match.project_details.capital_type.toLowerCase()} financing for this{" "}
                            {match.project_details.deal_type.toLowerCase()} deal.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Financial Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Debt Request</p>
                            <p className="font-medium">${match.project_details.debt_request.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Cost</p>
                            <p className="font-medium">$7,000,000</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">LTV</p>
                            <p className="font-medium">75%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Completed Value</p>
                            <p className="font-medium">$8,500,000</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Loan Term</p>
                            <p className="font-medium">5 years</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Interest Rate</p>
                            <p className="font-medium">6.5%</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Financial Notes</p>
                          <p>
                            The borrower has a strong track record with similar projects and has completed 5 successful
                            deals in the past 3 years.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Project Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mr-4 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Project Created</p>
                          <p className="text-sm text-muted-foreground">The borrower created this project</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="mr-4 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Match Created</p>
                          <p className="text-sm text-muted-foreground">
                            This project was matched with your lending criteria
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="borrower">
              <Card>
                <CardHeader>
                  <CardTitle>Borrower Information</CardTitle>
                  <CardDescription>Details about the borrower and their company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-medium">John Smith</h3>
                      <p className="text-muted-foreground">Smith Real Estate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p>borrower@example.com</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p>(555) 123-4567</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p>123 Business St, New York, NY</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Company Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Company Name</p>
                          <p className="font-medium">Smith Real Estate</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Years in Business</p>
                          <p className="font-medium">8 years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Projects Completed</p>
                          <p className="font-medium">12</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Borrower Experience</h3>
                    <p>
                      John Smith has over 10 years of experience in real estate development and investment. His company,
                      Smith Real Estate, specializes in multifamily and mixed-use developments in the New York
                      metropolitan area. They have successfully completed 12 projects with a total value of over $100
                      million.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Previous Projects</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">The Oakwood Apartments</h4>
                            <p className="text-sm text-muted-foreground">Multifamily • Acquisition</p>
                          </div>
                          <Badge className="bg-green-600">Completed</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Value</p>
                            <p className="font-medium">$12M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Units</p>
                            <p className="font-medium">48</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-medium">2023</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Riverside Mixed-Use</h4>
                            <p className="text-sm text-muted-foreground">Mixed-Use • Development</p>
                          </div>
                          <Badge className="bg-green-600">Completed</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Value</p>
                            <p className="font-medium">$18M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Size</p>
                            <p className="font-medium">25,000 sq ft</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-medium">2022</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Project Documents</CardTitle>
                  <CardDescription>Documents provided by the borrower for this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Financial Statement</p>
                          <p className="text-xs text-muted-foreground">Uploaded on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Property Appraisal</p>
                          <p className="text-xs text-muted-foreground">Uploaded on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Business Plan</p>
                          <p className="text-xs text-muted-foreground">Uploaded on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Project Photos</p>
                          <p className="text-xs text-muted-foreground">Uploaded on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Communication</CardTitle>
              <CardDescription>Message the borrower about this match</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Mediator</span>
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm">
                      Hello, I'm the mediator for this match. I've reviewed the project details and believe this could
                      be a good fit for your lending criteria. Please let me know if you have any questions.
                    </p>
                  </div>
                </div>

                {match.match_status === "accepted" && (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4" />
                        <span className="text-xs font-medium">You</span>
                        <span className="text-xs opacity-70">{new Date().toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm">
                        Thank you for the introduction. I've reviewed the project details and I'm interested in
                        proceeding. I'd like to schedule a call with the borrower to discuss next steps.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px]"
                  disabled={match.match_status === "rejected"}
                />
                <Button
                  className="self-end"
                  disabled={!message.trim() || sendingMessage || match.match_status === "rejected"}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {match.match_status === "pending" && (
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleRejectMatch}
            disabled={processing}
            className="flex items-center gap-1"
          >
            <ThumbsDown className="h-4 w-4" />
            Decline Match
          </Button>
          <Button onClick={handleAcceptMatch} disabled={processing} className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            Accept Match
          </Button>
        </div>
      )}
    </div>
  )
}

function MatchStatusBadge({ status, large = false }: { status: string; large?: boolean }) {
  const sizeClasses = large ? "text-sm py-1 px-3" : ""

  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className={`flex items-center gap-1 ${sizeClasses}`}>
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="default" className={`flex items-center gap-1 bg-green-600 ${sizeClasses}`}>
          <CheckCircle className="h-3 w-3" />
          Accepted
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className={`flex items-center gap-1 ${sizeClasses}`}>
          <X className="h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={`flex items-center gap-1 ${sizeClasses}`}>
          {status}
        </Badge>
      )
  }
}

function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

