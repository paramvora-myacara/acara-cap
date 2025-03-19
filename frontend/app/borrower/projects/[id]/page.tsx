"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockApiService, type Project, type Document, type PotentialMatch } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  FileText,
  MessageSquare,
  Send,
  Upload,
  User,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Special case: if the ID is "new", redirect to the dedicated new project page
  useEffect(() => {
    if (params.id === "new") {
      router.push("/borrower/projects/new")
      return
    }
  }, [params.id, router])

  const projectId = params.id ? Number.parseInt(params.id, 10) : Number.NaN

  const [project, setProject] = useState<Project | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [potentialLenders, setPotentialLenders] = useState<PotentialMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)

  // Mediator ID (in a real app, this would be fetched from the API)
  const mediatorId = 5

  useEffect(() => {
    // If we're redirecting to the new project page, don't fetch project data
    if (params.id === "new") {
      return
    }

    const fetchProjectData = async () => {
      try {
        setLoading(true)
        setError(null)

        // More robust validation for project ID
        if (isNaN(projectId)) {
          console.error("Invalid project ID format:", params.id)
          setError(`Invalid project ID format: ${params.id}`)
          setLoading(false)
          return
        }

        if (projectId <= 0) {
          console.error("Project ID must be positive:", projectId)
          setError("Project ID must be a positive number")
          setLoading(false)
          return
        }

        console.log("Fetching project with ID:", projectId)

        // Fetch project details
        const projectResponse = await mockApiService.getProjectDetails(projectId)

        if (!projectResponse.success) {
          console.error("Project fetch failed:", projectResponse.message)
          setError(projectResponse.message || "Failed to load project details")
          return
        }

        setProject(projectResponse.project)

        // Fetch project documents
        const documentsResponse = await mockApiService.getProjectDocuments(projectId)
        if (documentsResponse.success) {
          setDocuments(documentsResponse.documents)
        }

        // Fetch potential lenders
        const lendersResponse = await mockApiService.getPotentialLenders(projectId)
        if (lendersResponse.success) {
          console.log("Potential lenders fetched:", lendersResponse.lenders)
          setPotentialLenders(lendersResponse.lenders)
        } else {
          console.error("Failed to fetch potential lenders:", lendersResponse.message)
        }
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("An error occurred while loading project data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId, params.id, router])

  // If we're redirecting to the new project page, show a loading state
  if (params.id === "new") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to new project form...</p>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      setSendingMessage(true)
      const response = await mockApiService.sendMessage(projectId, mediatorId, message)
      if (response.success) {
        setMessage("")
        // In a real app, we would update the messages list
      }
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingDocument(true)
      const file = files[0]
      const response = await mockApiService.uploadDocument(projectId, file)
      if (response.success) {
        // In a real app, we would update the documents list
        // For now, let's just add a mock document
        const newDocument: Document = {
          document_id: response.document_id,
          project_id: projectId,
          file_name: file.name,
          file_type: file.type,
          description: "Uploaded document",
          uploaded_at: new Date().toISOString(),
          file_url: URL.createObjectURL(file),
        }
        setDocuments([...documents, newDocument])
      }
    } catch (err) {
      console.error("Error uploading document:", err)
    } finally {
      setUploadingDocument(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  const handleRequestIntroduction = async (lenderId: number) => {
    try {
      const response = await mockApiService.requestIntroduction(projectId, lenderId)
      if (response.success) {
        // Update the potential lenders list to show the request has been made
        setPotentialLenders(
          potentialLenders.map((lender) =>
            lender.lender_id === lenderId ? { ...lender, introduction_requested: true } : lender,
          ),
        )
      }
    } catch (err) {
      console.error("Error requesting introduction:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Project</h3>
          <p className="text-slate-600 mb-4">{error || "Project not found"}</p>
          <Link href="/borrower/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/borrower/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-slate-800">{project.project_address.split(",")[0]}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-slate-600">
              {project.asset_type} • {project.deal_type} • {project.capital_type}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link href={`/borrower/projects/${projectId}/edit`}>
              <Button variant="outline" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit Project
              </Button>
            </Link>
            <Button className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Contact Mediator
            </Button>
          </div>
        </div>
      </header>

      {/* Project Progress */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Track the progress of your project through the funding process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="text-muted-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ProgressStep
                title="Resume Complete"
                description="Basic project details"
                status="complete"
                icon={<FileText className="h-5 w-5" />}
              />
              <ProgressStep
                title="Packet Complete"
                description={`${documents.length} document(s) uploaded`}
                status={documents.length > 0 ? "complete" : "in-progress"}
                icon={<Upload className="h-5 w-5" />}
              />
              <ProgressStep
                title="Review Done"
                description="Mediator review"
                status={project.progress >= 50 ? "complete" : "pending"}
                icon={<User className="h-5 w-5" />}
              />
              <ProgressStep
                title="Sent to Lenders"
                description="Lender matching"
                status={project.status === "matched" || project.status === "funded" ? "complete" : "pending"}
                icon={<Building className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Project Details
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="lenders" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Potential Lenders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Detailed information about your real estate project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Address</h3>
                      <p className="font-medium">{project.project_address}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Asset Type</h3>
                      <p className="font-medium">{project.asset_type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Deal Type</h3>
                      <p className="font-medium">{project.deal_type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Capital Type</h3>
                      <p className="font-medium">{project.capital_type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Debt Request</h3>
                      <p className="font-medium">${project.debt_request.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Cost</h3>
                      <p className="font-medium">${project.total_cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Completed Value</h3>
                      <p className="font-medium">${project.completed_value.toLocaleString()}</p>
                    </div>
                  </div>

                  {project.project_description && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Description</h3>
                      <p className="text-sm">{project.project_description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                      <p className="text-sm">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                      <p className="text-sm">{new Date(project.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Project Documents</CardTitle>
                      <CardDescription>Upload and manage documents related to your project</CardDescription>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        className="relative flex items-center gap-1"
                        disabled={uploadingDocument}
                      >
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleUploadDocument}
                        />
                        <Upload className="h-4 w-4" />
                        {uploadingDocument ? "Uploading..." : "Upload Document"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div key={doc.document_id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.description} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={doc.file_url} download={doc.file_name} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Upload project documents such as financial statements, appraisals, and other relevant files to
                        share with potential lenders.
                      </p>
                      <Button
                        variant="outline"
                        className="relative flex items-center gap-1"
                        disabled={uploadingDocument}
                      >
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleUploadDocument}
                        />
                        <Upload className="h-4 w-4" />
                        {uploadingDocument ? "Uploading..." : "Upload First Document"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lenders">
              <Card>
                <CardHeader>
                  <CardTitle>Potential Lender Matches</CardTitle>
                  <CardDescription>Lenders that may be a good match for your project</CardDescription>
                </CardHeader>
                <CardContent>
                  {potentialLenders && potentialLenders.length > 0 ? (
                    <div className="space-y-4">
                      {potentialLenders.map((lender) => (
                        <div key={lender.lender_id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{lender.company_name}</h3>
                              <p className="text-sm text-muted-foreground">{lender.email}</p>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {Math.round(lender.match_score * 100)}% Match
                            </Badge>
                          </div>
                          <div className="mt-4 flex justify-end">
                            {lender.is_formally_matched ? (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Formally Matched
                              </Badge>
                            ) : lender.introduction_requested ? (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Introduction Requested
                              </Badge>
                            ) : (
                              <Button size="sm" onClick={() => handleRequestIntroduction(lender.lender_id)}>
                                Request Introduction
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Potential Matches Yet</h3>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Complete your project details and upload necessary documents to increase your chances of
                        matching with lenders.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Mediator Communication</CardTitle>
              <CardDescription>Communicate with your mediator about this project</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="flex max-w-[80%]">
                    <Avatar className="h-8 w-8 mr-2 self-end">
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="rounded-lg p-3 bg-muted">
                        <p className="text-sm">
                          Welcome to your new project! I'll be your mediator for this deal. Please upload any relevant
                          documents and let me know if you have any questions.
                        </p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}{" "}
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button className="self-end" disabled={!message.trim() || sendingMessage} onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
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

function ProgressStep({
  title,
  description,
  status,
  icon,
}: {
  title: string
  description: string
  status: "complete" | "in-progress" | "pending"
  icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
          status === "complete" ? "bg-green-100" : status === "in-progress" ? "bg-blue-100" : "bg-muted"
        }`}
      >
        <div
          className={`${
            status === "complete"
              ? "text-green-600"
              : status === "in-progress"
                ? "text-blue-600"
                : "text-muted-foreground"
          }`}
        >
          {icon}
        </div>
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="mt-2">
        {status === "complete" ? (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            Complete
          </Badge>
        ) : status === "in-progress" ? (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Pending
          </Badge>
        )}
      </div>
    </div>
  )
}

