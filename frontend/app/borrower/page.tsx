"use client"

import { useEffect, useState } from "react"
import { mockApiService, type Borrower, type Project, type Match } from "@/lib/mock-api-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, FileText, MessageSquare, PieChart, Plus, User, Inbox, AlertCircle } from "lucide-react"
import Link from "next/link"
import BorrowerDashboard from "@/components/borrower-dashboard"
import ProjectsList from "@/components/projects-list"
import LeadsList from "@/components/leads-list"
import MessagesInbox from "@/components/messages-inbox"

export default function BorrowerPage() {
  const [borrower, setBorrower] = useState<Borrower | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBorrowerData = async () => {
      try {
        setLoading(true)
        // In a real app, we would get the borrower ID from the authenticated user
        const borrowerId = 1

        // Fetch borrower profile
        const profileResponse = await mockApiService.getBorrowerProfile(borrowerId)
        if (profileResponse.success) {
          setBorrower(profileResponse.borrower)
        } else {
          setError("Failed to load borrower profile")
          return
        }

        // Fetch projects - force a fresh fetch to ensure we have the latest data
        const projectsResponse = await mockApiService.getBorrowerProjects(borrowerId)
        if (projectsResponse.success) {
          setProjects(projectsResponse.projects)
        }

        // Fetch matches
        const matchesResponse = await mockApiService.getBorrowerMatches(borrowerId)
        if (matchesResponse.success) {
          setMatches(matchesResponse.matches)
        }

        // Fetch unread message count
        const messagesResponse = await mockApiService.getUnreadMessageCount(borrowerId)
        if (messagesResponse.success) {
          setUnreadMessageCount(messagesResponse.count)
        }
      } catch (err) {
        setError("An error occurred while loading data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBorrowerData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading borrower dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
            <h1 className="text-3xl font-bold text-slate-800">Borrower Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {borrower?.first_name} {borrower?.last_name}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center gap-1 py-1.5">
              <Building className="h-4 w-4" />
              {borrower?.company_name}
            </Badge>
            <Link href="/borrower/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/borrower/projects/new">
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Project
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
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span className="hidden sm:inline">Leads</span>
            {matches.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {matches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
            {unreadMessageCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadMessageCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <BorrowerDashboard
            borrower={borrower}
            projects={projects}
            matches={matches}
            unreadMessageCount={unreadMessageCount}
          />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsList projects={projects} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsList matches={matches} />
        </TabsContent>

        <TabsContent value="messages">
          <MessagesInbox />
        </TabsContent>
      </Tabs>
    </div>
  )
}

