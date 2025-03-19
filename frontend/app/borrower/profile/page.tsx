"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { mockApiService, type Borrower } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Building, Edit2, Mail, Phone, Save, User } from "lucide-react"
import Link from "next/link"

export default function BorrowerProfilePage() {
  const [borrower, setBorrower] = useState<Borrower | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
  })

  // In a real app, we would get the borrower ID from the authenticated user
  const borrowerId = 1

  useEffect(() => {
    const fetchBorrowerProfile = async () => {
      try {
        setLoading(true)
        const response = await mockApiService.getBorrowerProfile(borrowerId)
        if (response.success) {
          setBorrower(response.borrower)
          setFormData({
            firstName: response.borrower.first_name || "",
            lastName: response.borrower.last_name || "",
            email: response.borrower.email || "",
            phoneNumber: response.borrower.phone_number || "",
            companyName: response.borrower.company_name || "",
          })
        } else {
          setError("Failed to load borrower profile")
        }
      } catch (err) {
        setError("An error occurred while loading profile data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBorrowerProfile()
  }, [borrowerId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      // In a real app, this would call an API to update the profile
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the local borrower state
      if (borrower) {
        const updatedBorrower = {
          ...borrower,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          company_name: formData.companyName,
        }
        setBorrower(updatedBorrower)
      }

      setEditMode(false)
    } catch (err) {
      console.error("Error saving profile:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Profile</h3>
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
            <h1 className="text-3xl font-bold text-slate-800">Your Profile</h1>
            <p className="text-slate-600 mt-1">Manage your personal and company information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/borrower">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>Your account information and completion status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">
                    {borrower?.first_name?.[0]}
                    {borrower?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">
                  {borrower?.first_name} {borrower?.last_name}
                </h3>
                <p className="text-muted-foreground">{borrower?.company_name}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{borrower?.email}</span>
                </div>
                {borrower?.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{borrower.phone_number}</span>
                  </div>
                )}
                {borrower?.company_name && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{borrower.company_name}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  variant={editMode ? "outline" : "default"}
                  className="w-full"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                {editMode ? "Edit your profile information below" : "Your personal and company information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      {editMode ? (
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="h-10 px-3 py-2 rounded-md border bg-muted">
                          {formData.firstName || "Not provided"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      {editMode ? (
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                      ) : (
                        <div className="h-10 px-3 py-2 rounded-md border bg-muted">
                          {formData.lastName || "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {editMode ? (
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    ) : (
                      <div className="h-10 px-3 py-2 rounded-md border bg-muted">{formData.email}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    {editMode ? (
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="h-10 px-3 py-2 rounded-md border bg-muted">
                        {formData.phoneNumber || "Not provided"}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="company" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    {editMode ? (
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="h-10 px-3 py-2 rounded-md border bg-muted">
                        {formData.companyName || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Additional company fields could be added here */}
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Additional company information fields will be available soon.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            {editMode && (
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={saving} className="ml-auto">
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

