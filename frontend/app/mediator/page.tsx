"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Project, type Match, type Communication } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building, CheckCircle, Clock, FileText, MessageSquare, PieChart, User, X } from "lucide-react"
import Link from "next/link"

export default function MediatorDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching mediator data
    const fetchMediatorData = async () => {
      try {
        setLoading(true)

        // For demo purposes, we'll use the borrower's projects
        const projectsResponse = await mockApiService.getBorrowerProjects(1)
        if (projectsResponse.success) {
          setProjects(projectsResponse.projects)
        }

        // Get matches
        const matchesResponse = await mockApiService.getBorrowerMatches(1)
        if (matchesResponse.success) {
          setMatches(matchesResponse.matches)
        }

        // Get communications
        const commsResponse = await mockApiService.getProjectCommunications(1)
        if (commsResponse.success) {
          setCommunications(commsResponse.messages)
        }
      } catch (err) {
        setError("Failed to load mediator data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMediatorData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading mediator dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mediator Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage borrower-lender relationships and facilitate deals</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center gap-1 py-1.5">
              <User className="h-4 w-4" />
              Mediator
            </Badge>
            <Link href="/mediator/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
            <Badge variant="secondary" className="ml-1">
              {projects.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Matches</span>
            <Badge variant="secondary" className="ml-1">
              {matches.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
            <Badge variant="secondary" className="ml-1">
              {communications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projects.filter((p) => p.status === "matched").length} matched with lenders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {matches.filter((m) => m.match_status === "pending").length}
                    </div>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Successful Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {matches.filter((m) => m.match_status === "accepted").length}
                    </div>
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Accepted by lenders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {communications.filter((c) => !c.is_read && c.recipient_id === 5).length}
                    </div>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">From borrowers and lenders</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-semibold">Active Projects</h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="filter" className="text-sm font-medium">
                  Status:
                </label>
                <select
                  id="filter"
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="matched">Matched</option>
                  <option value="funded">Funded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.project_id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.project_address.split(",")[0]}</CardTitle>
                        <CardDescription>
                          {project.asset_type} • {project.deal_type} • {project.capital_type}
                        </CardDescription>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="text-muted-foreground">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Debt Request</p>
                        <p className="font-medium">${(project.debt_request / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0 pb-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/mediator/projects/${project.project_id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/mediator/projects/${project.project_id}/matches`}>
                        <Button size="sm">Manage Matches</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="matches">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-semibold">Match Requests</h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="match-filter" className="text-sm font-medium">
                  Status:
                </label>
                <select
                  id="match-filter"
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {matches.map((match) => (
                <Card key={match.match_id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <CardTitle>{match.project_details.project_address}</CardTitle>
                        <CardDescription>
                          {match.project_details.asset_type} • {match.project_details.deal_type} •{" "}
                          {match.project_details.capital_type}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          match.match_status === "accepted"
                            ? "default"
                            : match.match_status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {match.match_status.charAt(0).toUpperCase() + match.match_status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Borrower</h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>B</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">John Smith</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Smith Real Estate</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Lender</h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>L</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{match.lender_details.company_name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{match.lender_details.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/mediator/matches/${match.match_id}`}>
                            <Button variant="outline">View Details</Button>
                          </Link>
                          {match.match_status === "pending" && (
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex items-center gap-1">
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Message Center</CardTitle>
              <CardDescription>Manage communications between borrowers and lenders</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <div className="border rounded-lg overflow-hidden h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                  <div className="border-r">
                    <div className="p-3 border-b">
                      <h3 className="font-medium">Conversations</h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(500px-3rem)]">
                      {projects.map((project) => (
                        <button
                          key={project.project_id}
                          className="w-full text-left p-3 hover:bg-slate-100 border-b flex items-center gap-2"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{project.project_address.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{project.project_address.split(",")[0]}</div>
                            <div className="text-xs text-slate-500">{project.asset_type}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col">
                    <div className="p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">John Smith</h3>
                          <p className="text-xs text-slate-500">123 Main St, New York, NY</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {communications.map((comm) => (
                        <div
                          key={comm.communication_id}
                          className={`flex ${comm.sender_id === 5 ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              comm.sender_id === 5 ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{comm.sender_id === 5 ? "M" : "B"}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">{comm.sender_id === 5 ? "You" : "Borrower"}</span>
                              <span className="text-xs opacity-70">
                                {new Date(comm.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p>{comm.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Button>Send</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "matched":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          Matched
        </Badge>
      )
    case "funded":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Funded
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-blue-600">
          Closed
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          {status}
        </Badge>
      )
  }
}

