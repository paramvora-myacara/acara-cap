"use client"

import { useEffect, useState } from "react"
import { mockApiService, type Project } from "@/lib/mock-api-service"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import ProjectsList from "@/components/projects-list"

export default function BorrowerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        // In a real app, we would get the borrower ID from the authenticated user
        const borrowerId = 1

        // Fetch projects
        const projectsResponse = await mockApiService.getBorrowerProjects(borrowerId)
        if (projectsResponse.success) {
          setProjects(projectsResponse.projects)
        } else {
          setError("Failed to load projects")
        }
      } catch (err) {
        setError("An error occurred while loading projects")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Projects</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Projects</h1>
        <p className="text-slate-600 mt-1">Manage and track all your real estate projects</p>
      </header>

      <ProjectsList projects={projects} />
    </div>
  )
}

