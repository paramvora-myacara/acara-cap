"use client"

import { useState, useEffect } from "react"
import { mockApiService, type Communication, type Project } from "@/lib/mock-api-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Building, FileText, MessageSquare, Send } from "lucide-react"

export default function MessagesInbox() {
  const [projects, setProjects] = useState<Project[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // In a real app, we would get the borrower ID from the authenticated user
  const borrowerId = 1
  const mediatorId = 5 // Assuming mediator ID is 5 based on mock data

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch projects
        const projectsResponse = await mockApiService.getBorrowerProjects(borrowerId)
        if (projectsResponse.success) {
          setProjects(projectsResponse.projects)

          // Select the first project by default if none is selected
          if (!selectedProjectId && projectsResponse.projects.length > 0) {
            setSelectedProjectId(projectsResponse.projects[0].project_id)
          }
        }
      } catch (err) {
        setError("Failed to load projects")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [borrowerId, selectedProjectId])

  useEffect(() => {
    const fetchCommunications = async () => {
      if (selectedProjectId) {
        try {
          setLoading(true)
          const response = await mockApiService.getProjectCommunications(selectedProjectId)
          if (response.success) {
            setCommunications(response.messages)

            // Mark unread messages as read
            response.messages.forEach((msg) => {
              if (!msg.is_read && msg.recipient_id === borrowerId) {
                mockApiService.markMessageAsRead(msg.communication_id)
              }
            })
          }
        } catch (err) {
          setError("Failed to load messages")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCommunications()
  }, [selectedProjectId, borrowerId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProjectId) return

    try {
      const response = await mockApiService.sendMessage(selectedProjectId, mediatorId, newMessage)
      if (response.success) {
        // Add the new message to the list
        const newMsg: Communication = {
          communication_id: response.communication_id,
          project_id: selectedProjectId,
          sender_id: borrowerId,
          recipient_id: mediatorId,
          message: newMessage,
          is_read: false,
          created_at: new Date().toISOString(),
        }
        setCommunications([...communications, newMsg])
        setNewMessage("")
      }
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  if (loading && communications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Messages</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="flex border-b">
        <div className="w-1/4 border-r overflow-auto">
          <div className="p-3 border-b">
            <h3 className="font-medium">Projects</h3>
          </div>
          <div className="overflow-y-auto max-h-[calc(600px-3rem)]">
            {projects.map((project) => (
              <button
                key={project.project_id}
                className={`w-full text-left p-3 hover:bg-slate-100 flex items-center gap-2 ${
                  selectedProjectId === project.project_id ? "bg-slate-100" : ""
                }`}
                onClick={() => setSelectedProjectId(project.project_id)}
              >
                <FileText className="h-4 w-4 text-slate-500" />
                <div className="truncate">
                  <div className="font-medium truncate">{project.project_address.split(",")[0]}</div>
                  <div className="text-xs text-slate-500 truncate">{project.asset_type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedProjectId ? (
            <>
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-slate-500" />
                  <div>
                    <h3 className="font-medium">
                      {projects.find((p) => p.project_id === selectedProjectId)?.project_address.split(",")[0]}
                    </h3>
                    <p className="text-xs text-slate-500">Mediator Communication</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {communications.length > 0 ? (
                  communications.map((msg) => (
                    <div
                      key={msg.communication_id}
                      className={`flex ${msg.sender_id === borrowerId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_id === borrowerId ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{msg.sender_id === borrowerId ? "B" : "M"}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {msg.sender_id === borrowerId ? "You" : "Mediator"}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No messages yet</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Start a conversation with the mediator about this project.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Select a project to view messages</p>
              <p className="text-sm text-muted-foreground max-w-md">
                All communication is project-specific and goes through our mediators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

