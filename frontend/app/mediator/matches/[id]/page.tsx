"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Match } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Info,
  Phone,
  Send,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock compatibility metrics
  const compatibilityMetrics = {
    overall: 0.85,
    assetType: 0.95,
    dealType: 0.9,
    capitalType: 0.85,
    loanAmount: 0.75,
    location: 0.8,
  }

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true)

        // In a real app, we would fetch the specific match by ID
        // For demo purposes, we'll get all matches and find the one with the matching ID
        const response = await mockApiService.getBorrowerMatches(1)

        if (response.success) {
          const matchId = Number.parseInt(params.id)
          const matchData = response.matches.find((m) => m.match_id === matchId)

          if (matchData) {
            setMatch(matchData)
          } else {
            setError("Match not found")
          }
        } else {
          setError("Failed to load match details")
        }
      } catch (err) {
        setError("An error occurred while fetching match details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchDetails()
  }, [params.id])

  const handleApproveMatch = async () => {
    if (!match) return

    try {
      // Optimistic update
      setMatch({ ...match, match_status: "accepted" })

      // In a real app, this would call an API endpoint
      // await mockApiService.updateMatchStatus(match.match_id, "accepted")

      toast({
        title: "Match approved",
        description: "The match has been approved successfully.",
      })
    } catch (error) {
      // Revert on error
      setMatch({ ...match, match_status: match.match_status })

      toast({
        title: "Error",
        description: "Failed to approve match. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectMatch = async () => {
    if (!match) return

    try {
      // Optimistic update
      setMatch({ ...match, match_status: "rejected" })

      // In a real app, this would call an API endpoint
      // await mockApiService.updateMatchStatus(match.match_id,  this would call an API endpoint
      // await mockApiService.updateMatchStatus(match.match_id, "rejected")

      toast({
        title: "Match rejected",
        description: "The match has been rejected.",
      })
    } catch (error) {
      // Revert on error
      setMatch({ ...match, match_status: match.match_status })

      toast({
        title: "Error",
        description: "Failed to reject match. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading match details...</p>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Match</h3>
          <p className="text-muted-foreground mb-4">{error || "Match not found"}</p>
          <Link href="/mediator/matches">
            <Button>Back to Matches</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/mediator/matches" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Matches
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{match.project_details.project_address.split(",")[0]}</h1>
            <p className="text-muted-foreground">Match between borrower and {match.lender_details.company_name}</p>
          </div>

          <div className="flex items-center gap-2">
            <MatchStatusBadge status={match.match_status} />

            {match.match_status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleRejectMatch}
                >
                  <X className="h-4 w-4" />
                  Reject Match
                </Button>
                <Button className="flex items-center gap-1" onClick={handleApproveMatch}>
                  <CheckCircle className="h-4 w-4" />
                  Approve Match
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Match Overview</CardTitle>
              <CardDescription>Created on {new Date(match.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Compatibility</span>
                  <span className="text-muted-foreground">{Math.round(compatibilityMetrics.overall * 100)}%</span>
                </div>
                <Progress
                  value={compatibilityMetrics.overall * 100}
                  className="h-3"
                  indicatorStyle={{
                    backgroundColor: getCompatibilityColor(compatibilityMetrics.overall),
                  }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CompatibilityMetric
                  label="Asset Type"
                  value={compatibilityMetrics.assetType}
                  description="Multifamily matches lender criteria"
                />
                <CompatibilityMetric
                  label="Deal Type"
                  value={compatibilityMetrics.dealType}
                  description="Acquisition is preferred by lender"
                />
                <CompatibilityMetric
                  label="Capital Type"
                  value={compatibilityMetrics.capitalType}
                  description="Debt financing aligns with lender offerings"
                />
                <CompatibilityMetric
                  label="Loan Amount"
                  value={compatibilityMetrics.loanAmount}
                  description="Within lender's preferred range"
                />
                <CompatibilityMetric
                  label="Location"
                  value={compatibilityMetrics.location}
                  description="Property location matches lender's market"
                />
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Match Timeline
                </h3>
                <div className="space-y-3">
                  <TimelineItem
                    date={new Date(match.created_at)}
                    title="Match Created"
                    description="System identified potential match between borrower and lender"
                  />
                  <TimelineItem
                    date={new Date(new Date(match.created_at).getTime() + 86400000)} // +1 day
                    title="Mediator Review"
                    description="Match reviewed by platform mediator"
                  />
                  {match.match_status !== "pending" && (
                    <TimelineItem
                      date={new Date(new Date(match.created_at).getTime() + 172800000)} // +2 days
                      title={match.match_status === "accepted" ? "Match Accepted" : "Match Rejected"}
                      description={
                        match.match_status === "accepted"
                          ? "Lender accepted the match and is interested in the project"
                          : "Lender declined the match opportunity"
                      }
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="project">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="project" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Project Details
              </TabsTrigger>
              <TabsTrigger value="borrower" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Borrower
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="project" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Details about the real estate project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Project Address</h3>
                      <p className="font-medium">{match.project_details.project_address}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Asset Type</h3>
                      <p className="font-medium">{match.project_details.asset_type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Deal Type</h3>
                      <p className="font-medium">{match.project_details.deal_type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Capital Type</h3>
                      <p className="font-medium">{match.project_details.capital_type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Debt Request</h3>
                      <p className="font-medium">${(match.project_details.debt_request / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Description</h3>
                    <p>
                      A {match.project_details.asset_type.toLowerCase()} property located in{" "}
                      {match.project_details.project_address.split(",")[1]?.trim() || "a prime location"}. This{" "}
                      {match.project_details.deal_type.toLowerCase()} deal is seeking{" "}
                      {match.project_details.capital_type.toLowerCase()} financing of $
                      {(match.project_details.debt_request / 1000000).toFixed(1)}M.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="borrower" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Borrower Information</CardTitle>
                  <CardDescription>Details about the borrower and their company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">John Smith</h3>
                      <p className="text-muted-foreground">Smith Real Estate</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          555-123-4567
                        </span>
                        <span className="text-sm">borrower@example.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Company Information</h3>
                      <p className="text-sm">
                        Smith Real Estate is a real estate investment firm specializing in multifamily and commercial
                        properties. Founded in 2010, the company has successfully completed over 20 projects with a
                        total value exceeding $100M.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Previous Projects</h3>
                      <ul className="text-sm space-y-1">
                        <li>• 50-unit apartment complex in Chicago (2022)</li>
                        <li>• Mixed-use development in Boston (2021)</li>
                        <li>• Office building renovation in New York (2019)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Documents</CardTitle>
                  <CardDescription>Documents related to this project and match</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <DocumentItem
                      name="Financial Statements.pdf"
                      type="PDF"
                      size="2.4 MB"
                      date={new Date(match.created_at)}
                    />
                    <DocumentItem
                      name="Property Appraisal.pdf"
                      type="PDF"
                      size="5.1 MB"
                      date={new Date(match.created_at)}
                    />
                    <DocumentItem
                      name="Business Plan.docx"
                      type="DOCX"
                      size="1.8 MB"
                      date={new Date(match.created_at)}
                    />
                    <DocumentItem
                      name="Project Photos.zip"
                      type="ZIP"
                      size="12.5 MB"
                      date={new Date(match.created_at)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lender Information</CardTitle>
              <CardDescription>Details about the matched lender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{match.lender_details.company_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{match.lender_details.company_name}</h3>
                  <p className="text-sm text-muted-foreground">{match.lender_details.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Lending Criteria</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Asset Types</span>
                    <span>Multifamily, Office</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Deal Types</span>
                    <span>Acquisition, Refinance</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Capital Types</span>
                    <span>Debt, Equity</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Loan Range</span>
                    <span>$1M - $10M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Preferred Locations</span>
                    <span>NY, LA, Chicago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
              <CardDescription>Facilitate communication between parties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md h-[300px] overflow-y-auto p-3 bg-muted/30">
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">B</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">Borrower</span>
                      </div>
                      <p className="text-sm">I'm interested in discussing the terms for this project.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(match.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">M</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">You (Mediator)</span>
                      </div>
                      <p className="text-sm">
                        I've forwarded your interest to the lender. They are reviewing your project details.
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(new Date(match.created_at).getTime() + 3600000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">L</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">Lender</span>
                      </div>
                      <p className="text-sm">
                        We're interested in this project. Could we schedule a call to discuss further details?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(new Date(match.created_at).getTime() + 86400000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="flex items-center gap-1">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Match Report
              </Button>
              <Link href={`/mediator/projects/${match.project_id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  View Project Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MatchStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Accepted
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

function CompatibilityMetric({
  label,
  value,
  description,
}: {
  label: string
  value: number
  description: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <Progress
        value={value * 100}
        className="h-2"
        indicatorStyle={{
          backgroundColor: getCompatibilityColor(value),
        }}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
              <Info className="h-3 w-3" />
              {description}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-[200px]">
              This score represents how well the {label.toLowerCase()} matches between the borrower's project and the
              lender's criteria.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function TimelineItem({
  date,
  title,
  description,
}: {
  date: Date
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="relative flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-primary"></div>
        <div className="h-full w-px bg-border"></div>
      </div>
      <div className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">
            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function DocumentItem({
  name,
  type,
  size,
  date,
}: {
  name: string
  type: string
  size: string
  date: Date
}) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {type} • {size} • Uploaded {date.toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}

function getCompatibilityColor(score: number): string {
  if (score >= 0.8) return "#22c55e" // green-500
  if (score >= 0.6) return "#84cc16" // lime-500
  if (score >= 0.4) return "#eab308" // yellow-500
  return "#ef4444" // red-500
}

