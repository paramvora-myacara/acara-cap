"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockApiService } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ChevronRight, DollarSign, FileText, MapPin } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectAddress: "",
    assetType: "",
    dealType: "",
    capitalType: "",
    debtRequest: "",
    totalCost: "",
    completedValue: "",
    projectDescription: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // Add state for the selected lender
  const [selectedLender, setSelectedLender] = useState<any>(null)
  const [introductionRequested, setIntroductionRequested] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Update the useEffect to fix the redirect issue
  useEffect(() => {
    // Only run this once
    if (isInitialized) return

    // Reset loading state since we're creating a new project
    setLoading(false)
    setIsInitialized(true)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const prefill = params.get("prefill")
      const lenderParam = params.get("lender")

      // Handle prefill data
      if (prefill === "true") {
        // Check if we have form data in localStorage
        const storedFormData = localStorage.getItem("preliminaryFormData")
        if (storedFormData) {
          try {
            const parsedFormData = JSON.parse(storedFormData)
            setFormData({
              ...formData,
              assetType: parsedFormData.asset_type || "",
              dealType: parsedFormData.deal_type || "",
              capitalType: parsedFormData.capital_type || "",
              debtRequest: parsedFormData.debt_request || "",
              projectAddress: parsedFormData.location ? `${parsedFormData.location} Address` : "",
            })
            // Clear the stored form data
            localStorage.removeItem("preliminaryFormData")
          } catch (error) {
            console.error("Error parsing stored form data:", error)
          }
        } else {
          // In a real app, we would get this data from the registration flow
          // For now, we'll just prefill with some example data
          setFormData({
            ...formData,
            assetType: "Multifamily",
            dealType: "Acquisition",
            capitalType: "Debt",
            debtRequest: "5000000",
          })
        }
      }

      // Handle lender data
      if (lenderParam) {
        try {
          const lenderData = JSON.parse(decodeURIComponent(lenderParam))
          setSelectedLender(lenderData)
          setIntroductionRequested(true)
          // Clear the stored lender data
          localStorage.removeItem("selectedLender")
        } catch (error) {
          console.error("Error parsing lender data:", error)
        }
      } else {
        // Check if we have lender data in localStorage
        const storedLender = localStorage.getItem("selectedLender")
        if (storedLender) {
          try {
            const lenderData = JSON.parse(storedLender)
            setSelectedLender(lenderData)
            setIntroductionRequested(true)
            // Clear the stored lender data
            localStorage.removeItem("selectedLender")
          } catch (error) {
            console.error("Error parsing stored lender data:", error)
          }
        }
      }
    }
  }, [formData, isInitialized])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    return formData.projectAddress && formData.assetType && formData.dealType && formData.capitalType
  }

  const validateStep2 = () => {
    return formData.debtRequest && formData.totalCost && formData.completedValue
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Update the handleSubmit function to include the selected lender
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (validateStep1() && validateStep2()) {
      setLoading(true)

      try {
        // Prepare project data
        const projectData = {
          project_address: formData.projectAddress,
          asset_type: formData.assetType,
          deal_type: formData.dealType,
          capital_type: formData.capitalType,
          debt_request: Number.parseInt(formData.debtRequest),
          total_cost: Number.parseInt(formData.totalCost),
          completed_value: Number.parseInt(formData.completedValue),
          project_description: formData.projectDescription,
          // Include the selected lender if available
          selected_lender: selectedLender
            ? {
                lender_id: selectedLender.lender_id,
                introduction_requested: introductionRequested,
                match_score: selectedLender.match_score || 0,
              }
            : undefined,
        }

        // Call the create project API
        const response = await mockApiService.createProject(1, projectData)

        if (response.success) {
          setSuccess("Project created successfully! Redirecting to dashboard...")

          // Wait a moment before redirecting to show the success message
          setTimeout(() => {
            router.push(`/borrower/projects/${response.project_id}`)
          }, 1500)
        } else {
          // Handle error
          setError("Project creation failed: " + (response.message || "Unknown error"))
        }
      } catch (error) {
        console.error("Error creating project:", error)
        setError("An unexpected error occurred while creating the project")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create New Project</h1>
            <p className="text-slate-600 mt-1">
              Provide details about your real estate project to find matching lenders
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/borrower">
              <Button variant="outline" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Project Details</CardTitle>
            <div className="text-sm text-muted-foreground">Step {step} of 2</div>
          </div>
          <CardDescription>
            {step === 1
              ? "Enter the basic information about your project"
              : "Provide financial details for your project"}
          </CardDescription>

          <div className="mt-4 flex items-center">
            <div className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-300"}`}></div>
            <div className={`h-0.5 flex-1 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}></div>
            <div className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}></div>
          </div>
        </CardHeader>

        {error && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {success && (
          <div className="px-6">
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </div>
        )}

        {selectedLender && (
          <div className="px-6 mb-4">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <AlertTitle>Selected Lender</AlertTitle>
              <AlertDescription>
                You've selected {selectedLender.company_name} as a potential lender for this project. They will be
                automatically added to your potential matches.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectAddress">Project Address</Label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="projectAddress"
                        name="projectAddress"
                        placeholder="123 Main St, New York, NY"
                        value={formData.projectAddress}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type</Label>
                    <Select
                      value={formData.assetType}
                      onValueChange={(value) => handleSelectChange("assetType", value)}
                      required
                    >
                      <SelectTrigger id="assetType">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Multifamily">Multifamily</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dealType">Deal Type</Label>
                    <Select
                      value={formData.dealType}
                      onValueChange={(value) => handleSelectChange("dealType", value)}
                      required
                    >
                      <SelectTrigger id="dealType">
                        <SelectValue placeholder="Select deal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acquisition">Acquisition</SelectItem>
                        <SelectItem value="Refinance">Refinance</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Bridge">Bridge</SelectItem>
                        <SelectItem value="Value-Add">Value-Add</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capitalType">Capital Type</Label>
                    <Select
                      value={formData.capitalType}
                      onValueChange={(value) => handleSelectChange("capitalType", value)}
                      required
                    >
                      <SelectTrigger id="capitalType">
                        <SelectValue placeholder="Select capital type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Debt">Debt</SelectItem>
                        <SelectItem value="Equity">Equity</SelectItem>
                        <SelectItem value="Mezzanine">Mezzanine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    name="projectDescription"
                    placeholder="Provide a detailed description of your project..."
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debtRequest">Debt Request ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="debtRequest"
                        name="debtRequest"
                        type="number"
                        placeholder="5,000,000"
                        value={formData.debtRequest}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalCost">Total Cost ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="totalCost"
                        name="totalCost"
                        type="number"
                        placeholder="7,000,000"
                        value={formData.totalCost}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completedValue">Completed Value ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="completedValue"
                        name="completedValue"
                        type="number"
                        placeholder="8,500,000"
                        value={formData.completedValue}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/50 mt-6">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Project Summary</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Address:</span>
                          <span className="ml-2 font-medium">{formData.projectAddress}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Asset Type:</span>
                          <span className="ml-2 font-medium">{formData.assetType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deal Type:</span>
                          <span className="ml-2 font-medium">{formData.dealType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Capital Type:</span>
                          <span className="ml-2 font-medium">{formData.capitalType}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        After creating your project, you'll be able to upload documents and request introductions to
                        matching lenders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            ) : (
              <div></div> // Empty div to maintain spacing
            )}

            {step < 2 ? (
              <Button type="button" onClick={handleNextStep} disabled={!validateStep1()} className="flex items-center">
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading || !validateStep2()}>
                {loading ? "Creating Project..." : "Create Project"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

