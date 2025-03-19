"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Project, type PotentialMatch } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  Building,
  Check,
  CheckCircle,
  Clock,
  Filter,
  Grid,
  Info,
  List,
  MessageSquare,
  Plus,
  Search,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ProjectMatchesPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterScore, setFilterScore] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjectAndMatches = async () => {
      try {
        setLoading(true)

        const projectId = Number.parseInt(params.id)
        const projectResponse = await mockApiService.getProjectDetails(projectId)

        if (projectResponse.success) {
          setProject(projectResponse.project)

          // Fetch potential matches
          const matchesResponse = await mockApiService.getPotentialLenders(projectId)
          if (matchesResponse.success) {
            setPotentialMatches(matchesResponse.lenders)
          }
        } else {
          setError(projectResponse.message || "Failed to load project details")
        }
      } catch (err) {
        setError("An error occurred while fetching project data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectAndMatches()
  }, [params.id])

  const handleApproveMatch = (lenderId: number) => {
    toast({
      title: "Match approved",
      description: "The match has been approved and the lender has been notified.",
    })

    // Update the local state to reflect the change
    setPotentialMatches((prev) =>
      prev.map((match) => (match.lender_id === lenderId ? { ...match, is_formally_matched: true } : match)),
    )
  }

  const handleRejectMatch = (lenderId: number) => {
    toast({
      title: "Match rejected",
      description: "The match has been rejected.",
    })

    // Update the local state to reflect the change
    setPotentialMatches((prev) => prev.filter((match) => match.lender_id !== lenderId))
  }

  const handleCreateMatch = () => {
    toast({
      title: "Match creation initiated",
      description: "You can now select lenders to match with this project.",
    })
  }

  // Filter matches based on search query and minimum score
  const filteredMatches = potentialMatches.filter((match) => {
    const matchesSearch =
      match.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesScore = match.match_score * 100 >= filterScore

    return matchesSearch && matchesScore
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project matches...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Project</h3>
          <p className="text-muted-foreground mb-4">{error || "Project not found"}</p>
          <Link href="/mediator/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href={`/mediator/projects/${project.project_id}`}
          className="flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Project Matches</h1>
            <p className="text-muted-foreground">
              {project.project_address.split(",")[0]} • {project.asset_type} • $
              {(project.debt_request / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />

            <Button variant="default" className="flex items-center gap-1" onClick={handleCreateMatch}>
              <Plus className="h-4 w-4" />
              Create Match
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Potential Matches</CardTitle>
                <CardDescription>Lenders that match this project's criteria</CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search lenders..."
                    className="pl-8 h-9 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={filterScore}
                    onChange={(e) => setFilterScore(Number.parseInt(e.target.value))}
                  >
                    <option value="0">All Scores</option>
                    <option value="50">50%+ Match</option>
                    <option value="70">70%+ Match</option>
                    <option value="90">90%+ Match</option>
                  </select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-l-md rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-r-md rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredMatches.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMatches.map((match) => (
                    <MatchCard
                      key={match.lender_id}
                      match={match}
                      onApprove={() => handleApproveMatch(match.lender_id)}
                      onReject={() => handleRejectMatch(match.lender_id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMatches.map((match) => (
                    <MatchListItem
                      key={match.lender_id}
                      match={match}
                      onApprove={() => handleApproveMatch(match.lender_id)}
                      onReject={() => handleRejectMatch(match.lender_id)}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No matches found</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  {searchQuery || filterScore > 0
                    ? "Try adjusting your search or filters to see more results."
                    : "There are no potential lenders that match this project's criteria yet."}
                </p>
                <Button onClick={handleCreateMatch} className="flex items-center gap-1 mx-auto">
                  <Plus className="h-4 w-4" />
                  Create Match
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Match History</CardTitle>
                <CardDescription>Previous matches and their outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>GC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Global Capital Partners</p>
                        <p className="text-xs text-muted-foreground">Matched on {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      Accepted
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>UI</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Urban Investment Group</p>
                        <p className="text-xs text-muted-foreground">
                          Matched on {new Date(Date.now() - 86400000 * 3).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">Rejected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>HR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Horizon Real Estate Capital</p>
                        <p className="text-xs text-muted-foreground">
                          Matched on {new Date(Date.now() - 86400000 * 5).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Expired</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="default" className="w-full justify-start" onClick={handleCreateMatch}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Match
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Borrower
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Find Lenders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Match Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3 text-center">
                    <p className="text-2xl font-bold">{potentialMatches.length}</p>
                    <p className="text-sm text-muted-foreground">Potential Matches</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="text-2xl font-bold">{potentialMatches.filter((m) => m.is_formally_matched).length}</p>
                    <p className="text-sm text-muted-foreground">Formal Matches</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="text-2xl font-bold">
                      {potentialMatches.filter((m) => m.introduction_requested).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Intro Requests</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="text-2xl font-bold">
                      {potentialMatches.length > 0
                        ? Math.round(
                            (potentialMatches.reduce((acc, m) => acc + m.match_score, 0) / potentialMatches.length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Match Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Match Recommendations</AlertTitle>
              <AlertDescription>
                Based on this project's criteria, we recommend focusing on lenders specializing in {project.asset_type}{" "}
                properties with loan ranges that include ${(project.debt_request / 1000000).toFixed(1)}M.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
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

function MatchCard({
  match,
  onApprove,
  onReject,
}: {
  match: PotentialMatch
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{match.company_name}</CardTitle>
            <CardDescription>{match.email}</CardDescription>
          </div>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${getScoreColor(match.match_score)}`}>
              {Math.round(match.match_score * 100)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Match Score</span>
              <span>{Math.round(match.match_score * 100)}%</span>
            </div>
            <Progress
              value={match.match_score * 100}
              className="h-2"
              indicatorStyle={{
                backgroundColor: getScoreColorHex(match.match_score),
              }}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {match.introduction_requested && (
              <Badge variant="outline" className="text-xs">
                Intro Requested
              </Badge>
            )}
            {match.is_formally_matched && (
              <Badge variant="secondary" className="text-xs">
                Formally Matched
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
            onClick={onReject}
          >
            <X className="h-3 w-3" />
            Reject
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            onClick={onApprove}
          >
            <Check className="h-3 w-3" />
            Approve
          </Button>
        </div>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
          <MessageSquare className="h-3 w-3" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  )
}

function MatchListItem({
  match,
  onApprove,
  onReject,
}: {
  match: PotentialMatch
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{match.company_name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{match.company_name}</p>
          <p className="text-sm text-muted-foreground">{match.email}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {match.introduction_requested && (
              <Badge variant="outline" className="text-xs">
                Intro Requested
              </Badge>
            )}
            {match.is_formally_matched && (
              <Badge variant="secondary" className="text-xs">
                Formally Matched
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-24">
          <div className="flex justify-between text-sm mb-1">
            <span>Match</span>
            <span className={getScoreColor(match.match_score)}>{Math.round(match.match_score * 100)}%</span>
          </div>
          <Progress
            value={match.match_score * 100}
            className="h-2"
            indicatorStyle={{
              backgroundColor: getScoreColorHex(match.match_score),
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
            onClick={onReject}
          >
            <X className="h-3 w-3" />
            Reject
          </Button>
          <Button variant="default" size="sm" className="flex items-center gap-1" onClick={onApprove}>
            <Check className="h-3 w-3" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-green-600"
  if (score >= 0.6) return "text-lime-600"
  if (score >= 0.4) return "text-yellow-600"
  return "text-red-600"
}

function getScoreColorHex(score: number): string {
  if (score >= 0.8) return "#22c55e" // green-500
  if (score >= 0.6) return "#84cc16" // lime-500
  if (score >= 0.4) return "#eab308" // yellow-500
  return "#ef4444" // red-500
}

