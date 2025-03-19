"use client"

import type { Project } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Import the missing RefreshCw icon
import { Building, Clock, DollarSign, FileText, Plus, Upload, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { mockApiService } from "@/lib/mock-api-service"

interface ProjectsListProps {
  projects: Project[]
}

// Add a refresh mechanism to ensure the projects list is up-to-date
export default function ProjectsList({ projects: initialProjects }: ProjectsListProps) {
  const [sortBy, setSortBy] = useState<string>("date")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [refreshKey, setRefreshKey] = useState(0)

  // Add a refresh effect to fetch the latest projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await mockApiService.getBorrowerProjects(1)
        if (response.success) {
          setProjects(response.projects)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [refreshKey])

  // Function to manually refresh the projects list
  const refreshProjects = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Filter projects based on status
  const filteredProjects = projects.filter((project) => {
    if (filterStatus === "all") return true
    return project.status === filterStatus
  })

  // Sort projects based on selected criteria
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    } else if (sortBy === "progress") {
      return b.progress - a.progress
    } else if (sortBy === "amount") {
      return b.debt_request - a.debt_request
    }
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-sm font-medium">
              Status:
            </label>
            <select
              id="filter"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="matched">Matched</option>
              <option value="funded">Funded</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Last Updated</option>
              <option value="progress">Progress</option>
              <option value="amount">Debt Amount</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={refreshProjects} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No projects found</p>
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
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
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
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Debt Request</p>
            <p className="font-medium">${(project.debt_request / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Cost</p>
            <p className="font-medium">${(project.total_cost / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed Value</p>
            <p className="font-medium">${(project.completed_value / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">{new Date(project.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href={`/borrower/projects/${project.project_id.toString()}`} className="w-full">
          <Button variant="default" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
        <div className="flex gap-2 w-full">
          <Link href={`/borrower/projects/${project.project_id.toString()}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </Link>
          <Link href={`/borrower/projects/${project.project_id.toString()}/documents`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
              <Upload className="h-3 w-3" />
              Documents
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
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
    case "closed":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-blue-600">
          Closed
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
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

