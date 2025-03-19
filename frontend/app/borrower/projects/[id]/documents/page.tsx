"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { mockApiService, type Document } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileArchive,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileText,
  Filter,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react"

// Document type mapping for icons
const documentTypeIcons: Record<string, React.ReactNode> = {
  "application/pdf": <FilePdf className="h-10 w-10 text-red-500" />,
  "image/jpeg": <FileImage className="h-10 w-10 text-blue-500" />,
  "image/png": <FileImage className="h-10 w-10 text-blue-500" />,
  "application/vnd.ms-excel": <FileSpreadsheet className="h-10 w-10 text-green-500" />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
    <FileSpreadsheet className="h-10 w-10 text-green-500" />
  ),
  "application/zip": <FileArchive className="h-10 w-10 text-yellow-500" />,
  default: <FileText className="h-10 w-10 text-gray-500" />,
}

// Document categories
const documentCategories = ["All Documents", "Financial", "Legal", "Property", "Appraisals", "Insurance", "Other"]

export default function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id ? Number.parseInt(params.id, 10) : Number.NaN

  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("All Documents")
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [documentDescription, setDocumentDescription] = useState("")
  const [documentCategory, setDocumentCategory] = useState("Other")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch project documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)

        if (isNaN(projectId)) {
          setError("Invalid project ID")
          setLoading(false)
          return
        }

        const response = await mockApiService.getProjectDocuments(projectId)
        if (response.success) {
          // Add mock categories to documents for demonstration
          const docsWithCategories = response.documents.map((doc, index) => ({
            ...doc,
            category:
              index % 5 === 0
                ? "Financial"
                : index % 4 === 0
                  ? "Legal"
                  : index % 3 === 0
                    ? "Property"
                    : index % 2 === 0
                      ? "Appraisals"
                      : "Insurance",
          }))
          setDocuments(docsWithCategories)
          setFilteredDocuments(docsWithCategories)
        } else {
          setError("Failed to load documents")
        }
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("An error occurred while loading documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [projectId])

  // Filter documents based on search query and category
  useEffect(() => {
    let filtered = [...documents]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.file_name.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (selectedCategory !== "All Documents") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }, [searchQuery, selectedCategory, documents])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      setUploadError(null)
    }
  }

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload")
      return
    }

    try {
      setUploadingDocument(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 20
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 500)

      // Call mock API
      const response = await mockApiService.uploadDocument(projectId, selectedFile, documentDescription)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success) {
        // Create a new document object
        const newDocument: Document = {
          document_id: response.document_id,
          project_id: projectId,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          description: documentDescription,
          category: documentCategory,
          uploaded_at: new Date().toISOString(),
          file_url: URL.createObjectURL(selectedFile),
        }

        // Add to documents list
        setDocuments((prev) => [...prev, newDocument])

        // Reset form
        setSelectedFile(null)
        setDocumentDescription("")
        setDocumentCategory("Other")
        setShowUploadDialog(false)
      } else {
        setUploadError("Failed to upload document")
      }
    } catch (err) {
      console.error("Error uploading document:", err)
      setUploadError("An error occurred while uploading the document")
    } finally {
      setUploadingDocument(false)
    }
  }

  // Handle document deletion
  const handleDeleteDocument = async (documentId: number) => {
    try {
      // In a real app, call API to delete document
      // For now, just remove from state
      setDocuments((prev) => prev.filter((doc) => doc.document_id !== documentId))
    } catch (err) {
      console.error("Error deleting document:", err)
    }
  }

  // Get document icon based on file type
  const getDocumentIcon = (fileType: string) => {
    return documentTypeIcons[fileType] || documentTypeIcons.default
  }

  // Format file size (mock function)
  const formatFileSize = (documentId: number) => {
    // Mock file sizes based on document ID
    const sizes = ["256 KB", "1.2 MB", "3.5 MB", "768 KB", "4.7 MB"]
    return sizes[documentId % sizes.length]
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Skeleton className="h-10 w-full md:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
        </div>
      </div>
    )
  }

  if (error || isNaN(projectId)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Invalid project ID"}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Link href="/borrower/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Link href={`/borrower/projects/${projectId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Project Documents</h1>
        </div>
        <p className="text-muted-foreground">Manage all documents related to your project</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>Add a new document to your project</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Document File</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <input type="file" id="file" className="hidden" onChange={handleFileSelect} />
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, JPG, PNG up to 10MB</p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Document Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={documentCategory}
                    onChange={(e) => setDocumentCategory(e.target.value)}
                  >
                    {documentCategories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a description for this document"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                  />
                </div>

                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                {uploadingDocument && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadDocument} disabled={!selectedFile || uploadingDocument}>
                  {uploadingDocument ? "Uploading..." : "Upload Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {selectedCategory}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {documentCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-muted" : ""}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Documents */}
      {filteredDocuments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {documents.length === 0
                ? "You haven't uploaded any documents yet. Upload your first document to get started."
                : "No documents match your current search or filter criteria."}
            </p>
            {documents.length === 0 && <Button onClick={() => setShowUploadDialog(true)}>Upload First Document</Button>}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.document_id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(document.file_type)}
                    <div className="truncate">
                      <CardTitle className="text-base truncate">{document.file_name}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatFileSize(document.document_id)} • Uploaded{" "}
                        {new Date(document.uploaded_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={document.file_url} download={document.file_name}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteDocument(document.document_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {document.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{document.description}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Badge variant="outline">{document.category}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Approved
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocuments.map((document) => (
            <div
              key={document.document_id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getDocumentIcon(document.file_type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{document.file_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {document.description || "No description"} • {formatFileSize(document.document_id)} • Uploaded{" "}
                    {new Date(document.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Badge variant="outline">{document.category}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Approved
                </Badge>

                <div className="flex items-center">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={document.file_url} download={document.file_name}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.document_id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

