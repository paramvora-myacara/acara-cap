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
import { AlertCircle, ArrowLeft, DollarSign, MapPin, Save } from "lucide-react"
import Link from "next/link"

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = Number.parseInt(params.id)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true)
        const response = await mockApiService.getProjectDetails(projectId)

        if (response.success) {
          const project = response.project
          setFormData({
            projectAddress: project.project_address,
            assetType: project.asset_type,
            dealType: project.deal_type,
            capitalType: project.capital_type,
            debtRequest: project.debt_request.toString(),
            totalCost: project.total_cost.toString(),
            completedValue: project.completed_value.toString(),
            projectDescription: project.project_description || "",
          })
        } else {
          setError("Failed to load project details")
        }
      } catch (err) {
        setError("An error occurred while loading project data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [projectId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    return (
      formData.projectAddress &&
      formData.assetType &&
      formData.dealType &&
      formData.capitalType &&
      formData.debtRequest &&
      formData.totalCost &&
      formData.completedValue
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setSaving(true)

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
        }

        // Call the update project API
        const response = await mockApiService.updateProject(projectId, projectData)

        if (response.success) {
          // Redirect back to the project details page
          router.push(`/borrower/projects/${projectId}`)
        } else {
          // Handle error
          setError("Project update failed: " + response.message)
        }
      } catch (error) {
        setError("Error updating project")
        console.error("Error updating project:", error)
      } finally {
        setSaving(false)
      }
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Project</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Link href={`/borrower/projects/${projectId}`}>
            <Button>Back to Project</Button>
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
            <h1 className="text-3xl font-bold text-slate-800">Edit Project</h1>
            <p className="text-slate-600 mt-1">Update the details of your real estate project</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href={`/borrower/projects/${projectId}`}>
              <Button variant="outline" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Update the information about your project</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
          </CardContent>

          <CardFooter className="flex justify-between">
            <Link href={`/borrower/projects/${projectId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button type="submit" disabled={saving || !validateForm()} className="flex items-center gap-1">
              {saving ? (
                "Saving Changes..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

