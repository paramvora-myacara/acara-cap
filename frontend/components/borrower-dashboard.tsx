import type { Borrower, Project, Match } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Clock, DollarSign, FileText, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"

interface BorrowerDashboardProps {
  borrower: Borrower | null
  projects: Project[]
  matches: Match[]
  unreadMessageCount: number
}

export default function BorrowerDashboard({ borrower, projects, matches, unreadMessageCount }: BorrowerDashboardProps) {
  // Calculate statistics
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status !== "closed" && p.status !== "rejected").length
  const fundedProjects = projects.filter((p) => p.status === "funded").length
  const totalDebtRequested = projects.reduce((sum, project) => sum + project.debt_request, 0)

  // Get projects in progress
  const projectsInProgress = projects
    .filter((p) => p.status !== "closed" && p.status !== "rejected")
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalProjects}</div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeProjects} active, {fundedProjects} funded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${(totalDebtRequested / 1000000).toFixed(1)}M</div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {totalProjects} projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lender Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{matches.length}</div>
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {matches.filter((m) => m.match_status === "accepted").length} accepted matches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{unreadMessageCount}</div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">From mediators and lenders</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects in Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Projects in Progress</h2>
          <Link href="/borrower/projects">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {projectsInProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectsInProgress.map((project) => (
              <Card key={project.project_id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{project.project_address.split(",")[0]}</CardTitle>
                      <CardDescription className="text-xs">
                        {project.asset_type} • {project.deal_type}
                      </CardDescription>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Debt Request:</span>
                      <span>${(project.debt_request / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span>${(project.total_cost / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/borrower/projects/${project.project_id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No active projects found</p>
              <Link href="/borrower/projects/new">
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
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
          <DollarSign className="h-3 w-3" />
          Funded
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

