"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Project, type Document } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  History,
  Info,
  MessageSquare,
  Phone,
  PieChart,
  Send,
  ThumbsUp,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MediatorProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true)

        const projectId = Number.parseInt(params.id)
        const projectResponse = await mockApiService.getProjectDetails(projectId)

        if (projectResponse.success) {
          setProject(projectResponse.project)

          // Fetch project documents
          const documentsResponse = await mockApiService.getProjectDocuments(projectId)
          if (documentsResponse.success) {
            setDocuments(documentsResponse.documents)
          }
        } else {
          setError(projectResponse.message || "Failed to load project details")
        }
      } catch (err) {
        setError("An error occurred while fetching project details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [params.id])

  const handleApproveProject = () => {
    if (!project) return

    toast({
      title: "Project approved",
      description: "The project has been approved for matching.",
    })
  }

  const handleRequestMoreInfo = () => {
    if (!project) return

    toast({
      title: "Information requested",
      description: "Request for additional information has been sent to the borrower.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project details...</p>
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
        <Link href="/mediator" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.project_address.split(",")[0]}</h1>
            <p className="text-muted-foreground">
              {project.asset_type} • {project.deal_type} • {project.capital_type}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />

            {project.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1" onClick={handleRequestMoreInfo}>
                  <Info className="h-4 w-4" />
                  Request Info
                </Button>
                <Button className="flex items-center gap-1" onClick={handleApproveProject}>
                  <CheckCircle className="h-4 w-4" />
                  Approve Project
                </Button>
              </div>
            )}

            <Link href={`/mediator/projects/${project.project_id}/matches`}>
              <Button variant="default" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Manage Matches
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Created on {new Date(project.created_at).toLocaleDateString()} • Last updated{" "}
                {new Date(project.updated_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Project Progress</span>
                  <span className="text-muted-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Project Address</h3>
                  <p className="font-medium">{project.project_address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Asset Type</h3>
                  <p className="font-medium">{project.asset_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Deal Type</h3>
                  <p className="font-medium">{project.deal_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Capital Type</h3>
                  <p className="font-medium">{project.capital_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Debt Request</h3>
                  <p className="font-medium">${(project.debt_request / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Cost</h3>
                  <p className="font-medium">${(project.total_cost / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Completed Value</h3>
                  <p className="font-medium">${(project.completed_value / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">LTV Ratio</h3>
                  <p className="font-medium">{((project.debt_request / project.completed_value) * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">LTC Ratio</h3>
                  <p className="font-medium">{((project.debt_request / project.total_cost) * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Description</h3>
                <p>
                  {project.project_description ||
                    `A ${project.asset_type.toLowerCase()} property located in ${project.project_address.split(",")[1]?.trim() || "a prime location"}. 
                    This ${project.deal_type.toLowerCase()} deal is seeking ${project.capital_type.toLowerCase()} financing of $${(project.debt_request / 1000000).toFixed(1)}M.`}
                </p>
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <History className="h-4 w-4" />
                  Project Timeline
                </h3>
                <div className="space-y-3">
                  <TimelineItem
                    date={new Date(project.created_at)}
                    title="Project Created"
                    description="Borrower submitted project details"
                  />
                  <TimelineItem
                    date={new Date(new Date(project.created_at).getTime() + 86400000)} // +1 day
                    title="Documents Uploaded"
                    description="Borrower uploaded initial project documents"
                  />
                  <TimelineItem
                    date={new Date(new Date(project.created_at).getTime() + 172800000)} // +2 days
                    title="Mediator Review"
                    description="Project under review by platform mediator"
                    current={project.status === "pending"}
                  />
                  {project.status !== "pending" && (
                    <TimelineItem
                      date={new Date(new Date(project.created_at).getTime() + 259200000)} // +3 days
                      title="Project Approved"
                      description="Project approved for lender matching"
                      current={project.status === "matched"}
                    />
                  )}
                  {project.status === "matched" && (
                    <TimelineItem
                      date={new Date(new Date(project.created_at).getTime() + 345600000)} // +4 days
                      title="Lender Matched"
                      description="Project matched with potential lenders"
                      current={true}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="documents">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="borrower" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Borrower
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Documents</CardTitle>
                  <CardDescription>Documents uploaded by the borrower</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((document) => (
                        <DocumentItem
                          key={document.document_id}
                          name={document.file_name}
                          type={document.file_type.split("/")[1].toUpperCase()}
                          description={document.description || ""}
                          date={new Date(document.uploaded_at)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        The borrower has not uploaded any documents for this project.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Request Additional Documents
                  </Button>
                </CardFooter>
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

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Borrower History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Active Projects</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Completed Projects</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold">85%</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Contact Borrower
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Analytics</CardTitle>
                  <CardDescription>Matching potential and market analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Lender Match Potential</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Match Potential</span>
                          <span className="font-medium">High</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          This project has high potential to match with lenders on our platform.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Estimated Match Time</span>
                          <span className="font-medium">3-5 days</span>
                        </div>
                        <Progress value={70} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Based on similar projects and current lender activity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Market Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-3">
                        <p className="text-lg font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Active Lenders</p>
                        <p className="text-xs text-muted-foreground mt-1">Lenders currently funding this asset type</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-lg font-bold">$250M</p>
                        <p className="text-sm text-muted-foreground">Available Capital</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estimated capital available for similar projects
                        </p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-lg font-bold">7.2%</p>
                        <p className="text-sm text-muted-foreground">Avg. Interest Rate</p>
                        <p className="text-xs text-muted-foreground mt-1">Current average for this asset class</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Recommended Lenders</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>GC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Global Capital Partners</p>
                            <p className="text-xs text-muted-foreground">95% match compatibility</p>
                          </div>
                        </div>
                        <Button size="sm">Suggest Match</Button>
                      </div>

                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>UI</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Urban Investment Group</p>
                            <p className="text-xs text-muted-foreground">87% match compatibility</p>
                          </div>
                        </div>
                        <Button size="sm">Suggest Match</Button>
                      </div>

                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>HR</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Horizon Real Estate Capital</p>
                            <p className="text-xs text-muted-foreground">82% match compatibility</p>
                          </div>
                        </div>
                        <Button size="sm">Suggest Match</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/mediator/projects/${project.project_id}/matches`} className="w-full">
                    <Button className="w-full">View All Potential Matches</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mediator Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/mediator/projects/${project.project_id}/matches`}>
                <Button variant="default" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Manage Matches
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Borrower
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              {project.status === "pending" && (
                <>
                  <Button variant="outline" className="w-full justify-start" onClick={handleRequestMoreInfo}>
                    <Info className="h-4 w-4 mr-2" />
                    Request More Information
                  </Button>
                  <Button className="w-full justify-start" onClick={handleApproveProject}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve Project
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full min-h-[120px] p-3 border rounded-md"
                placeholder="Add notes about this project..."
              ></textarea>
              <Button className="w-full">Save Notes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md h-[200px] overflow-y-auto p-3 bg-muted/30">
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">B</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">Borrower</span>
                      </div>
                      <p className="text-sm">I've uploaded all the requested documents for the project.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(project.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                      <p className="text-sm">Thank you. I'll review the documents and get back to you shortly.</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(new Date(project.created_at).getTime() + 3600000).toLocaleTimeString([], {
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

          {project.status === "pending" && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Project Pending Review</AlertTitle>
              <AlertDescription>
                This project is awaiting your review before it can be matched with lenders.
              </AlertDescription>
            </Alert>
          )}
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

function TimelineItem({
  date,
  title,
  description,
  current = false,
}: {
  date: Date
  title: string
  description: string
  current?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="relative flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full ${current ? "bg-primary" : "bg-muted-foreground"}`}></div>
        <div className="h-full w-px bg-border"></div>
      </div>
      <div className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <p className={`font-medium text-sm ${current ? "text-primary" : ""}`}>{title}</p>
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
  description,
  date,
}: {
  name: string
  type: string
  description: string
  date: Date
}) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {type} • Uploaded {date.toLocaleDateString()}
          </p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}

