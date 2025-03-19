"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Lender, type Match } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, CheckCircle, FileText, MessageSquare, PieChart, User } from "lucide-react"
import Link from "next/link"

export default function LenderDashboard() {
  const [lender, setLender] = useState<Lender | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching lender data
    // In a real app, this would come from authentication and API calls
    const fetchLenderData = async () => {
      try {
        setLoading(true)
        // For demo purposes, we'll use the first lender from the mock API
        const response = await mockApiService.getPreliminaryMatches()
        if (response.success && response.lenders.length > 0) {
          const lenderData = response.lenders[0]
          setLender({
            user_id: lenderData.lender_id,
            email: lenderData.user.email,
            role: "lender",
            company_name: lenderData.user.company_name,
            lending_criteria: lenderData.lending_criteria,
          })

          // Simulate matches
          setMatches([
            {
              match_id: 1,
              project_id: 1,
              lender_id: lenderData.lender_id,
              borrower_id: 1,
              project_details: {
                project_address: "123 Main St, New York, NY",
                asset_type: "Multifamily",
                deal_type: "Acquisition",
                capital_type: "Debt",
                debt_request: 5000000,
              },
              lender_details: {
                company_name: lenderData.user.company_name,
                email: lenderData.user.email,
              },
              match_status: "pending",
              created_at: new Date().toISOString(),
            },
            {
              match_id: 2,
              project_id: 2,
              lender_id: lenderData.lender_id,
              borrower_id: 1,
              project_details: {
                project_address: "456 Oak Ave, Los Angeles, CA",
                asset_type: "Office",
                deal_type: "Refinance",
                capital_type: "Debt",
                debt_request: 10000000,
              },
              lender_details: {
                company_name: lenderData.user.company_name,
                email: lenderData.user.email,
              },
              match_status: "accepted",
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ])
        }
      } catch (err) {
        setError("Failed to load lender data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLenderData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lender dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !lender) {
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
            <h1 className="text-3xl font-bold text-slate-800">Lender Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome, {lender.company_name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center gap-1 py-1.5">
              <Building className="h-4 w-4" />
              Lender
            </Badge>
            <Link href="/lender/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/lender/criteria">
              <Button size="sm" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Lending Criteria
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Lending Criteria Summary */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Lending Criteria</CardTitle>
            <Link href="/lender/criteria">
              <Button variant="ghost" size="sm">
                Edit Criteria
              </Button>
            </Link>
          </div>
          <CardDescription>Your current lending preferences and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Asset Types</h3>
              <div className="flex flex-wrap gap-1">
                {lender.lending_criteria.asset_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Deal Types</h3>
              <div className="flex flex-wrap gap-1">
                {lender.lending_criteria.deal_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Capital Types</h3>
              <div className="flex flex-wrap gap-1">
                {lender.lending_criteria.capital_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Loan Amount Range</h3>
              <p className="font-medium">
                ${lender.lending_criteria.min_loan_amount.toLocaleString()} - $
                {lender.lending_criteria.max_loan_amount.toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Preferred Locations</h3>
              <div className="flex flex-wrap gap-1">
                {lender.lending_criteria.locations.map((location) => (
                  <Badge key={location} variant="secondary" className="text-xs">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Matches</span>
            {matches.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {matches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{matches.length}</div>
                    <Building className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {matches.filter((m) => m.match_status === "accepted").length} accepted
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Potential Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on your criteria</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Funded Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">3</div>
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">$24M total funded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">5</div>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">From mediators and borrowers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="matches">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-semibold">Your Matches</h2>
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
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {matches.length > 0 ? (
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
                          variant={match.match_status === "accepted" ? "default" : "outline"}
                          className="md:self-start"
                        >
                          {match.match_status === "accepted" ? "Accepted" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Details</h3>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Debt Request:</span>
                              <span className="text-sm font-medium">
                                ${(match.project_details.debt_request / 1000000).toFixed(1)}M
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Match Date:</span>
                              <span className="text-sm font-medium">
                                {new Date(match.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Compatibility</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Match Score</span>
                              <span className="text-muted-foreground">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                        </div>

                        <div className="flex flex-col justify-end">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/lender/matches/${match.match_id}`}>
                              <Button variant="outline">View Details</Button>
                            </Link>
                            {match.match_status === "pending" && <Button>Accept Match</Button>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No matches found</p>
                  <p className="text-sm text-center text-muted-foreground max-w-md">
                    When borrowers match with your lending criteria, they will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with borrowers and mediators about potential deals</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Message Center</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Your messages with borrowers and mediators will appear here. You currently have 5 unread messages.
                </p>
                <Button>View Messages</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

