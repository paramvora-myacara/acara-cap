"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Match } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Building, CheckCircle, Clock, FileText, LayoutGrid, LayoutList, MessageSquare, Search, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MediatorMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const { toast } = useToast()

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        // In a real app, we would fetch matches for the mediator
        // For demo purposes, we'll use the borrower's matches
        const response = await mockApiService.getBorrowerMatches(1)
        if (response.success) {
          setMatches(response.matches)
          setFilteredMatches(response.matches)
        } else {
          setError("Failed to load matches")
        }
      } catch (err) {
        setError("An error occurred while fetching matches")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  useEffect(() => {
    // Filter matches based on search query and status filter
    let filtered = matches

    if (filterStatus !== "all") {
      filtered = filtered.filter((match) => match.match_status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (match) =>
          match.project_details.project_address.toLowerCase().includes(query) ||
          match.lender_details.company_name.toLowerCase().includes(query),
      )
    }

    setFilteredMatches(filtered)
  }, [matches, searchQuery, filterStatus])

  const handleApproveMatch = async (matchId: number) => {
    try {
      // Optimistic update
      setMatches((prev) =>
        prev.map((match) => (match.match_id === matchId ? { ...match, match_status: "accepted" } : match)),
      )

      // In a real app, this would call an API endpoint
      // await mockApiService.updateMatchStatus(matchId, "accepted")

      toast({
        title: "Match approved",
        description: "The match has been approved successfully.",
      })
    } catch (error) {
      // Revert on error
      setMatches((prev) => [...prev])

      toast({
        title: "Error",
        description: "Failed to approve match. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectMatch = async (matchId: number) => {
    try {
      // Optimistic update
      setMatches((prev) =>
        prev.map((match) => (match.match_id === matchId ? { ...match, match_status: "rejected" } : match)),
      )

      // In a real app, this would call an API endpoint
      // await mockApiService.updateMatchStatus(matchId, "rejected")

      toast({
        title: "Match rejected",
        description: "The match has been rejected.",
      })
    } catch (error) {
      // Revert on error
      setMatches((prev) => [...prev])

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
          <p className="text-muted-foreground">Loading matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Matches</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
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
            <h1 className="text-3xl font-bold">Mediator Match Management</h1>
            <p className="text-muted-foreground mt-1">Manage and facilitate matches between borrowers and lenders</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="all" onValueChange={(value) => setFilterStatus(value)}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1">
              All
              <Badge variant="secondary" className="ml-1">
                {matches.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Pending
              <Badge variant="secondary" className="ml-1">
                {matches.filter((m) => m.match_status === "pending").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Accepted
              <Badge variant="secondary" className="ml-1">
                {matches.filter((m) => m.match_status === "accepted").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-1">
              <X className="h-3.5 w-3.5 mr-1" />
              Rejected
              <Badge variant="secondary" className="ml-1">
                {matches.filter((m) => m.match_status === "rejected").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search matches..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {viewMode === "grid" ? "list" : "grid"} view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {renderMatches(filteredMatches, viewMode, handleApproveMatch, handleRejectMatch)}
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          {renderMatches(filteredMatches, viewMode, handleApproveMatch, handleRejectMatch)}
        </TabsContent>

        <TabsContent value="accepted" className="mt-0">
          {renderMatches(filteredMatches, viewMode, handleApproveMatch, handleRejectMatch)}
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          {renderMatches(filteredMatches, viewMode, handleApproveMatch, handleRejectMatch)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderMatches(
  matches: Match[],
  viewMode: "list" | "grid",
  onApprove: (matchId: number) => void,
  onReject: (matchId: number) => void,
) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No matches found</p>
          <p className="text-sm text-center text-muted-foreground max-w-md">
            When borrowers and lenders are matched, they will appear here for you to manage.
          </p>
        </CardContent>
      </Card>
    )
  }

  return viewMode === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard key={match.match_id} match={match} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchListItem key={match.match_id} match={match} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  )
}

function MatchCard({
  match,
  onApprove,
  onReject,
}: {
  match: Match
  onApprove: (matchId: number) => void
  onReject: (matchId: number) => void
}) {
  // Calculate a mock compatibility score based on match ID (in a real app, this would come from the API)
  const compatibilityScore = (((match.match_id * 17) % 30) + 70) / 100

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{match.project_details.project_address.split(",")[0]}</CardTitle>
            <CardDescription>
              {match.project_details.asset_type} • {match.project_details.deal_type}
            </CardDescription>
          </div>
          <MatchStatusBadge status={match.match_status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Match Compatibility</span>
            <span className="text-muted-foreground">{Math.round(compatibilityScore * 100)}%</span>
          </div>
          <Progress
            value={compatibilityScore * 100}
            indicatorStyle={{
              backgroundColor: getCompatibilityColor(compatibilityScore),
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Borrower</h4>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-xs text-muted-foreground">Smith Real Estate</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Lender</h4>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{match.lender_details.company_name}</p>
                <p className="text-xs text-muted-foreground">{match.lender_details.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Capital Type</p>
            <p className="font-medium">{match.project_details.capital_type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Debt Request</p>
            <p className="font-medium">${(match.project_details.debt_request / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href={`/mediator/matches/${match.match_id}`} className="w-full">
          <Button variant="default" size="sm" className="w-full">
            View Match Details
          </Button>
        </Link>

        {match.match_status === "pending" && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => onReject(match.match_id)}
            >
              <X className="h-3 w-3" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1 text-green-600 border-green-600 hover:bg-green-600/10"
              onClick={() => onApprove(match.match_id)}
            >
              <CheckCircle className="h-3 w-3" />
              Approve
            </Button>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <Link href={`/mediator/projects/${match.project_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
              <FileText className="h-3 w-3" />
              Project
            </Button>
          </Link>
          <Link href={`/mediator/messages?match=${match.match_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Message
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

function MatchListItem({
  match,
  onApprove,
  onReject,
}: {
  match: Match
  onApprove: (matchId: number) => void
  onReject: (matchId: number) => void
}) {
  // Calculate a mock compatibility score based on match ID (in a real app, this would come from the API)
  const compatibilityScore = (((match.match_id * 17) % 30) + 70) / 100

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
          <div className="md:w-1/3">
            <h3 className="font-medium">{match.project_details.project_address.split(",")[0]}</h3>
            <p className="text-sm text-muted-foreground">
              {match.project_details.asset_type} • {match.project_details.deal_type} •{" "}
              {match.project_details.capital_type}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <MatchStatusBadge status={match.match_status} />
              <span className="text-xs text-muted-foreground">
                Created {new Date(match.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="md:w-1/3 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground">Borrower</h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <p className="text-sm">John Smith</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground">Lender</h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>L</AvatarFallback>
                </Avatar>
                <p className="text-sm">{match.lender_details.company_name}</p>
              </div>
            </div>

            <div className="col-span-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Compatibility</span>
                <span>{Math.round(compatibilityScore * 100)}%</span>
              </div>
              <Progress
                value={compatibilityScore * 100}
                className="h-2"
                indicatorStyle={{
                  backgroundColor: getCompatibilityColor(compatibilityScore),
                }}
              />
            </div>
          </div>

          <div className="md:w-1/3 flex flex-wrap gap-2 justify-end">
            <Link href={`/mediator/matches/${match.match_id}`}>
              <Button variant="default" size="sm">
                View Details
              </Button>
            </Link>

            {match.match_status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => onReject(match.match_id)}
                >
                  <X className="h-3 w-3" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-600/10"
                  onClick={() => onApprove(match.match_id)}
                >
                  <CheckCircle className="h-3 w-3" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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

function getCompatibilityColor(score: number): string {
  if (score >= 0.8) return "#22c55e" // green-500
  if (score >= 0.6) return "#84cc16" // lime-500
  if (score >= 0.4) return "#eab308" // yellow-500
  return "#ef4444" // red-500
}

