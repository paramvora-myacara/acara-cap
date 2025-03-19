"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  MessageSquare,
  User,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  ChevronLeft,
  Filter,
  PlusCircle,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for conversations
const mockConversations = [
  {
    id: "conv-1",
    contact: {
      id: "lender-1",
      name: "Capital Investments LLC",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Lender",
      online: true,
    },
    lastMessage: {
      content:
        "I've reviewed your proposal and I'm interested in discussing the terms further. Are you available for a call tomorrow?",
      timestamp: "2023-06-20T14:30:00Z",
      read: false,
      sender: "lender-1",
    },
    unreadCount: 2,
    projectId: "proj-1",
    projectName: "Downtown Mixed-Use Development",
  },
  {
    id: "conv-2",
    contact: {
      id: "lender-2",
      name: "Urban Finance Group",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Lender",
      online: false,
    },
    lastMessage: {
      content:
        "Thank you for sending the additional documents. Our team will review them and get back to you by Friday.",
      timestamp: "2023-06-19T11:15:00Z",
      read: true,
      sender: "lender-2",
    },
    unreadCount: 0,
    projectId: "proj-2",
    projectName: "Riverside Apartments",
  },
  {
    id: "conv-3",
    contact: {
      id: "mediator-1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mediator",
      online: true,
    },
    lastMessage: {
      content:
        "I've connected you with two potential lenders who specialize in commercial properties. Let me know if you'd like to proceed with either of them.",
      timestamp: "2023-06-18T09:45:00Z",
      read: true,
      sender: "mediator-1",
    },
    unreadCount: 0,
    projectId: "proj-1",
    projectName: "Downtown Mixed-Use Development",
  },
  {
    id: "conv-4",
    contact: {
      id: "lender-3",
      name: "Heritage Funding Partners",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Lender",
      online: false,
    },
    lastMessage: {
      content:
        "We're interested in your historic renovation project. Could you provide more details about the expected timeline?",
      timestamp: "2023-06-17T16:20:00Z",
      read: true,
      sender: "lender-3",
    },
    unreadCount: 0,
    projectId: "proj-3",
    projectName: "Historic Building Renovation",
  },
  {
    id: "conv-5",
    contact: {
      id: "mediator-2",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mediator",
      online: true,
    },
    lastMessage: {
      content: "I've reviewed your project requirements and have some suggestions for improving your loan application.",
      timestamp: "2023-06-16T13:10:00Z",
      read: true,
      sender: "mediator-2",
    },
    unreadCount: 0,
    projectId: "proj-2",
    projectName: "Riverside Apartments",
  },
]

// Mock data for messages in a conversation
const mockMessages = {
  "conv-1": [
    {
      id: "msg-1",
      content: "Hello, I'm interested in learning more about your Downtown Mixed-Use Development project.",
      timestamp: "2023-06-19T10:30:00Z",
      sender: {
        id: "lender-1",
        name: "Capital Investments LLC",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-2",
      content:
        "Hi Capital Investments, thank you for your interest! The project is a 5-story mixed-use development with retail on the ground floor and residential units above.",
      timestamp: "2023-06-19T10:45:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-3",
      content:
        "That sounds promising. What's the total loan amount you're seeking and what's your expected timeline for the project?",
      timestamp: "2023-06-19T11:00:00Z",
      sender: {
        id: "lender-1",
        name: "Capital Investments LLC",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-4",
      content:
        "We're looking for $5 million in financing. Construction is planned to start in Q3 this year and expected to be completed within 18 months.",
      timestamp: "2023-06-19T11:15:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-5",
      content:
        "Great, that aligns with our lending criteria. Could you share the project proposal and financial projections?",
      timestamp: "2023-06-19T14:00:00Z",
      sender: {
        id: "lender-1",
        name: "Capital Investments LLC",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-6",
      content: "Of course, I've uploaded the documents to the project page. You should have access to them now.",
      timestamp: "2023-06-19T14:30:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-7",
      content:
        "I've reviewed your proposal and I'm interested in discussing the terms further. Are you available for a call tomorrow?",
      timestamp: "2023-06-20T14:30:00Z",
      sender: {
        id: "lender-1",
        name: "Capital Investments LLC",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-1",
      content:
        "Hello, we're Urban Finance Group. We specialize in residential development financing and noticed your Riverside Apartments project.",
      timestamp: "2023-06-18T09:30:00Z",
      sender: {
        id: "lender-2",
        name: "Urban Finance Group",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-2",
      content:
        "Hi Urban Finance, thanks for reaching out! Yes, we're developing a 120-unit apartment complex by the riverside.",
      timestamp: "2023-06-18T10:15:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-3",
      content:
        "That sounds like a project we'd be interested in financing. Could you provide some additional documentation about the environmental assessments and zoning approvals?",
      timestamp: "2023-06-18T11:00:00Z",
      sender: {
        id: "lender-2",
        name: "Urban Finance Group",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-4",
      content:
        "I'll gather those documents and upload them to the project page. Is there anything else you'd like to see?",
      timestamp: "2023-06-18T11:30:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-5",
      content:
        "It would also be helpful to see the market analysis and projected rental rates if you have those available.",
      timestamp: "2023-06-18T13:45:00Z",
      sender: {
        id: "lender-2",
        name: "Urban Finance Group",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-6",
      content:
        "I've uploaded all the requested documents including the environmental assessments, zoning approvals, market analysis, and projected rental rates.",
      timestamp: "2023-06-19T10:30:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-7",
      content:
        "Thank you for sending the additional documents. Our team will review them and get back to you by Friday.",
      timestamp: "2023-06-19T11:15:00Z",
      sender: {
        id: "lender-2",
        name: "Urban Finance Group",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
  ],
  "conv-3": [
    {
      id: "msg-1",
      content: "Hello, I'm Sarah Johnson, your assigned mediator for the Downtown Mixed-Use Development project.",
      timestamp: "2023-06-17T09:00:00Z",
      sender: {
        id: "mediator-1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-2",
      content:
        "Hi Sarah, nice to meet you! I'm looking forward to working with you on finding financing for our project.",
      timestamp: "2023-06-17T09:15:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-3",
      content:
        "I've reviewed your project details and it looks promising. Based on your requirements, I've identified several potential lenders who might be a good fit.",
      timestamp: "2023-06-17T10:00:00Z",
      sender: {
        id: "mediator-1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-4",
      content: "That's great news! What are the next steps?",
      timestamp: "2023-06-17T10:30:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-5",
      content:
        "I'll be reaching out to these lenders to gauge their interest. In the meantime, could you ensure that all your project documentation is up to date? Particularly the financial projections and market analysis.",
      timestamp: "2023-06-17T11:15:00Z",
      sender: {
        id: "mediator-1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-6",
      content: "I'll review all the documentation and make sure everything is current. Thanks for your help!",
      timestamp: "2023-06-17T11:45:00Z",
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
    {
      id: "msg-7",
      content:
        "I've connected you with two potential lenders who specialize in commercial properties. Let me know if you'd like to proceed with either of them.",
      timestamp: "2023-06-18T09:45:00Z",
      sender: {
        id: "mediator-1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    },
  ],
}

export default function BorrowerMessagesPage() {
  const searchParams = useSearchParams()
  const contactParam = searchParams.get("contact")
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const messagesEndRef = useRef(null)
  const { toast } = useToast()
  const isMobile = useMobile()
  const [showConversations, setShowConversations] = useState(true)

  // Load conversations and select initial conversation based on query param
  useEffect(() => {
    // In a real app, this would fetch from an API
    setConversations(mockConversations)

    if (contactParam) {
      const conversation = mockConversations.find((conv) => conv.contact.id === contactParam)
      if (conversation) {
        handleSelectConversation(conversation)
      }
    }
  }, [contactParam])

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)

    // In a real app, this would fetch messages from an API
    const conversationMessages = mockMessages[conversation.id] || []
    setMessages(conversationMessages)

    // Mark messages as read
    if (conversation.unreadCount > 0) {
      // In a real app, this would call an API to mark messages as read
      const updatedConversations = conversations.map((conv) =>
        conv.id === conversation.id
          ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true } }
          : conv,
      )
      setConversations(updatedConversations)
    }

    // On mobile, hide the conversations list when a conversation is selected
    if (isMobile) {
      setShowConversations(false)
    }
  }

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    // In a real app, this would send the message to an API
    const newMsg = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: {
        id: "borrower",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      read: true,
    }

    setMessages([...messages, newMsg])

    // Update the conversation with the new last message
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: {
              content: newMessage,
              timestamp: new Date().toISOString(),
              read: true,
              sender: "borrower",
            },
          }
        : conv,
    )
    setConversations(updatedConversations)

    setNewMessage("")

    // Show toast notification
    toast({
      title: "Message Sent",
      description: `Your message to ${selectedConversation.contact.name} has been sent.`,
    })
  }

  // Filter conversations based on search query and role filter
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || conv.contact.role.toLowerCase() === filterRole.toLowerCase()
    return matchesSearch && matchesRole
  })

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Conversations List - Hidden on mobile when a conversation is selected */}
      {(!isMobile || showConversations) && (
        <div className="w-full md:w-80 lg:w-96 border-r flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Messages</h2>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={filterRole === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("all")}
              >
                All
              </Button>
              <Button
                variant={filterRole === "lender" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("lender")}
              >
                Lenders
              </Button>
              <Button
                variant={filterRole === "mediator" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole("mediator")}
              >
                Mediators
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRole("all")}>All Messages</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("lender")}>Lenders Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("mediator")}>Mediators Only</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Unread Only</DropdownMenuItem>
                  <DropdownMenuItem>With Attachments</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">No conversations found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.contact.avatar} />
                        <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.contact.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge variant="outline" className="text-xs font-normal py-0 h-5">
                          {conversation.contact.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">• {conversation.projectName}</span>
                      </div>
                      <p
                        className={`text-sm mt-1 truncate ${
                          !conversation.lastMessage.read && conversation.lastMessage.sender !== "borrower"
                            ? "font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {conversation.lastMessage.sender === "borrower" && "You: "}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Conversation Detail */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                {isMobile && !showConversations && (
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => setShowConversations(true)}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={selectedConversation.contact.avatar} />
                  <AvatarFallback>{selectedConversation.contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h2 className="font-medium">{selectedConversation.contact.name}</h2>
                    {selectedConversation.contact.online && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300 text-xs">
                        Online
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{selectedConversation.contact.role}</span>
                    <span className="mx-1">•</span>
                    <span>{selectedConversation.projectName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Contact Information</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src={selectedConversation.contact.avatar} />
                          <AvatarFallback>{selectedConversation.contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold">{selectedConversation.contact.name}</h3>
                        <p className="text-muted-foreground">{selectedConversation.contact.role}</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Project</h4>
                          <p className="text-sm">{selectedConversation.projectName}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <p>Email: contact@example.com</p>
                            <p>Phone: (555) 123-4567</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Actions</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Video className="mr-2 h-4 w-4" />
                              Video Call
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              View Match
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                    <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                    <DropdownMenuItem>View project details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Block contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">No messages yet</h3>
                  <p className="text-muted-foreground">Start the conversation by sending a message</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isUser = message.sender.id === "borrower"
                    const showDate =
                      index === 0 ||
                      new Date(message.timestamp).toDateString() !==
                        new Date(messages[index - 1].timestamp).toDateString()

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <Badge variant="outline" className="bg-background">
                              {new Date(message.timestamp).toLocaleDateString([], {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </Badge>
                          </div>
                        )}

                        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          <div className={`flex max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                            {!isUser && (
                              <Avatar className={`h-8 w-8 ${isUser ? "ml-2" : "mr-2"} self-end`}>
                                <AvatarImage src={message.sender.avatar} />
                                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`rounded-lg p-3 ${
                                  isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <div
                                className={`flex items-center mt-1 text-xs text-muted-foreground ${isUser ? "justify-end" : "justify-start"}`}
                              >
                                {formatTimestamp(message.timestamp)}
                                {isUser && (
                                  <span className="ml-1">
                                    {message.read ? (
                                      <CheckCheck className="h-3 w-3 text-blue-500" />
                                    ) : (
                                      <CheckCheck className="h-3 w-3" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="self-end">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Select a conversation from the list to view messages or start a new conversation with a lender or
              mediator.
            </p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Start New Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

