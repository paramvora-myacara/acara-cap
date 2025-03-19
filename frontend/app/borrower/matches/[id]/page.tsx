"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  Building2,
  User,
  FileText,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Percent,
  DollarSign,
  MapPin,
  Send,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getMockMatchById } from "@/lib/mock-api-service"

export default function BorrowerMatchDetailPage() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        // In a real app, this would fetch from a real API
        const data = await getMockMatchById(id)
        setMatch(data)
      } catch (error) {
        console.error("Error fetching match:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [id])

  const handleAcceptMatch = () => {
    // In a real app, this would call an API to accept the match
    alert("Match accepted! This would update in a real application.")
  }

  const handleRejectMatch = () => {
    // In a real app, this would call an API to reject the match
    alert("Match rejected! This would update in a real application.")
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    // In a real app, this would send the message to the API
    alert(`Message sent: ${message}`)
    setMessage("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Match not found. Please check the URL and try again.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/borrower/matches">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Matches
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Mock data for the match
  const mockMatch = {
    id: id,
    status: "pending",
    compatibilityScore: 85,
    createdAt: "2023-06-15T10:30:00Z",
    project: {
      id: "proj-123",
      name: "Downtown Mixed-Use Development",
      address: "123 Main Street, New York, NY 10001",
      assetType: "Mixed-Use",
      dealType: "Construction",
      loanAmount: 5000000,
      loanTerm: 36,
      description: "A 5-story mixed-use development with retail on the ground floor and residential units above.",
      images: ["/placeholder.svg?height=300&width=500"],
    },
    lender: {
      id: "lender-456",
      name: "Capital Investments LLC",
      logo: "/placeholder.svg?height=100&width=100",
      minLoanAmount: 1000000,
      maxLoanAmount: 10000000,
      preferredAssetTypes: ["Mixed-Use", "Residential", "Commercial"],
      preferredDealTypes: ["Construction", "Refinance"],
      preferredLocations: ["NY", "NJ", "CT"],
      interestRateRange: "5.5% - 7.2%",
      description:
        "Capital Investments specializes in financing mixed-use and commercial properties in the Northeast region.",
    },
    documents: [
      { id: "doc-1", name: "Project Overview.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2023-06-10T14:20:00Z" },
      {
        id: "doc-2",
        name: "Financial Projections.xlsx",
        type: "xlsx",
        size: "1.8 MB",
        uploadedAt: "2023-06-12T09:15:00Z",
      },
      { id: "doc-3", name: "Site Plans.pdf", type: "pdf", size: "5.2 MB", uploadedAt: "2023-06-14T11:30:00Z" },
    ],
    messages: [
      {
        id: "msg-1",
        sender: { id: "lender-456", name: "Capital Investments", avatar: "/placeholder.svg?height=40&width=40" },
        content:
          "Hello, we're interested in your downtown development project. Could you provide more details about the expected ROI?",
        timestamp: "2023-06-16T09:30:00Z",
      },
      {
        id: "msg-2",
        sender: { id: "borrower-123", name: "You", avatar: "/placeholder.svg?height=40&width=40" },
        content:
          "Hi Capital Investments, thanks for your interest! The projected ROI is 12% over the first 5 years. I've attached our detailed financial projections in the documents section.",
        timestamp: "2023-06-16T10:15:00Z",
      },
      {
        id: "msg-3",
        sender: { id: "lender-456", name: "Capital Investments", avatar: "/placeholder.svg?height=40&width=40" },
        content:
          "That looks promising. We'd like to schedule a call to discuss the project further. Are you available next Tuesday?",
        timestamp: "2023-06-16T14:45:00Z",
      },
    ],
  }

  // Use mock data for now
  const matchData = mockMatch

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/borrower/matches">
          <Button variant="outline" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Match with {matchData.lender.name}</h1>
            <div className="flex items-center mt-2">
              <span className="mr-2">Status:</span>
              {getStatusBadge(matchData.status)}
              <span className="mx-4">|</span>
              <span className="flex items-center">
                <Percent className="h-4 w-4 mr-1" />
                <span className="font-medium">{matchData.compatibilityScore}% Compatible</span>
              </span>
              <span className="mx-4">|</span>
              <span className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Matched on {new Date(matchData.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
          {matchData.status === "pending" && (
            <div className="flex gap-2">
              <Button onClick={handleAcceptMatch} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Accept Match
              </Button>
              <Button
                onClick={handleRejectMatch}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>

      {matchData.status === "accepted" && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Match Accepted</AlertTitle>
          <AlertDescription>
            You've accepted this match. The lender has been notified and you can now proceed with the next steps.
          </AlertDescription>
        </Alert>
      )}

      {matchData.status === "rejected" && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Match Declined</AlertTitle>
          <AlertDescription>You've declined this match. The lender has been notified.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lender">Lender</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Project Overview
                  </CardTitle>
                  <CardDescription>Details about your project and compatibility with this lender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Project Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Project Name</p>
                          <p className="font-medium">{matchData.project.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            {matchData.project.address}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Asset Type</p>
                          <p className="font-medium">{matchData.project.assetType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Deal Type</p>
                          <p className="font-medium">{matchData.project.dealType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />$
                            {matchData.project.loanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Term</p>
                          <p className="font-medium">{matchData.project.loanTerm} months</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Compatibility</h3>
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Overall Match</span>
                          <span className="text-sm font-medium">{matchData.compatibilityScore}%</span>
                        </div>
                        <Progress value={matchData.compatibilityScore} className="h-2" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Loan Amount</span>
                            <span className="text-sm font-medium">90%</span>
                          </div>
                          <Progress value={90} className="h-1.5" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Your requested amount is within the lender's range of $
                            {matchData.lender.minLoanAmount.toLocaleString()} - $
                            {matchData.lender.maxLoanAmount.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Asset Type</span>
                            <span className="text-sm font-medium">100%</span>
                          </div>
                          <Progress value={100} className="h-1.5" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {matchData.project.assetType} is one of the lender's preferred asset types
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Deal Type</span>
                            <span className="text-sm font-medium">100%</span>
                          </div>
                          <Progress value={100} className="h-1.5" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {matchData.project.dealType} is one of the lender's preferred deal types
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Location</span>
                            <span className="text-sm font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-1.5" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Your project location is in the lender's preferred region
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Project Description</h3>
                    <p className="text-sm">{matchData.project.description}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Project Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {matchData.project.images.map((image, index) => (
                        <div key={index} className="rounded-md overflow-hidden border">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lender">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Lender Information
                  </CardTitle>
                  <CardDescription>Details about the lender and their lending criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center p-6 border rounded-lg">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border">
                          <img
                            src={matchData.lender.logo || "/placeholder.svg"}
                            alt={`${matchData.lender.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-center">{matchData.lender.name}</h3>
                        <p className="text-sm text-center text-muted-foreground mt-1">Commercial Real Estate Lender</p>
                        <div className="mt-4 w-full">
                          <Button className="w-full">View Full Profile</Button>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <h3 className="text-lg font-medium mb-4">Lending Criteria</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount Range</p>
                          <p className="font-medium">
                            ${matchData.lender.minLoanAmount.toLocaleString()} - $
                            {matchData.lender.maxLoanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate Range</p>
                          <p className="font-medium">{matchData.lender.interestRateRange}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Asset Types</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.lender.preferredAssetTypes.map((type, index) => (
                              <Badge key={index} variant="secondary">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Deal Types</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.lender.preferredDealTypes.map((type, index) => (
                              <Badge key={index} variant="secondary">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Locations</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.lender.preferredLocations.map((location, index) => (
                              <Badge key={index} variant="secondary">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">About</h3>
                        <p className="text-sm">{matchData.lender.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Project Documents
                  </CardTitle>
                  <CardDescription>Documents shared with this lender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button>
                      <FileText className="mr-2 h-4 w-4" />
                      Upload New Document
                    </Button>
                  </div>

                  <div className="border rounded-md divide-y">
                    {matchData.documents.map((doc) => (
                      <div key={doc.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Need to share more documents? Upload them here or go to the project documents page for more
                      options.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/borrower/projects/${matchData.project.id}/documents`}>
                    <Button variant="outline">Manage All Project Documents</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="communication">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Communication with {matchData.lender.name}
                  </CardTitle>
                  <CardDescription>Message history and communication with the lender</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto">
                  <div className="space-y-4">
                    {matchData.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender.id === "borrower-123" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex max-w-[80%] ${
                            msg.sender.id === "borrower-123" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <Avatar className={`h-8 w-8 ${msg.sender.id === "borrower-123" ? "ml-2" : "mr-2"}`}>
                            <AvatarImage src={msg.sender.avatar} />
                            <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                msg.sender.id === "borrower-123" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              {" • "}
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message here..."
                      className="min-h-[60px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={handleSendMessage} className="self-end">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Match Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-medium">Match Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(matchData.createdAt).toLocaleDateString()} at{" "}
                      {new Date(matchData.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-sm mt-1">
                      Your project was matched with {matchData.lender.name} based on your criteria.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-medium">First Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(matchData.messages[0].timestamp).toLocaleDateString()} at{" "}
                      {new Date(matchData.messages[0].timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm mt-1">{matchData.lender.name} initiated contact about your project.</p>
                  </div>
                </div>

                {matchData.status === "pending" && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Awaiting Decision</p>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <p className="text-sm mt-1">You can accept or decline this match based on your evaluation.</p>
                    </div>
                  </div>
                )}

                {matchData.status === "accepted" && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Match Accepted</p>
                      <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                      <p className="text-sm mt-1">You accepted the match with {matchData.lender.name}.</p>
                    </div>
                  </div>
                )}

                {matchData.status === "rejected" && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <XCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Match Declined</p>
                      <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                      <p className="text-sm mt-1">You declined the match with {matchData.lender.name}.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchData.status === "pending" && (
                  <>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Review Match Details</p>
                        <p className="text-sm text-muted-foreground">
                          Carefully review the lender's criteria and compatibility with your project.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Communicate with Lender</p>
                        <p className="text-sm text-muted-foreground">
                          Ask any questions you have before making a decision.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Accept or Decline</p>
                        <p className="text-sm text-muted-foreground">Make your decision based on your evaluation.</p>
                      </div>
                    </div>
                  </>
                )}

                {matchData.status === "accepted" && (
                  <>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Schedule Initial Meeting</p>
                        <p className="text-sm text-muted-foreground">
                          Set up a call or meeting with the lender to discuss next steps.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Share Additional Documents</p>
                        <p className="text-sm text-muted-foreground">
                          Provide any additional documentation requested by the lender.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Begin Due Diligence Process</p>
                        <p className="text-sm text-muted-foreground">
                          Work with the lender through their due diligence process.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {matchData.status === "rejected" && (
                  <>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Explore Other Matches</p>
                        <p className="text-sm text-muted-foreground">
                          Review other potential lender matches for your project.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Update Project Details</p>
                        <p className="text-sm text-muted-foreground">
                          Consider updating your project details to improve future matches.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Contact Support</p>
                        <p className="text-sm text-muted-foreground">
                          Reach out to our team if you need help finding better matches.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

