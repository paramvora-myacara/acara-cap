"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, CheckCircle, ChevronRight, User } from "lucide-react"
import { mockApiService } from "@/lib/mock-api-service"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<"borrower" | "lender">("borrower")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    companyName: "",
    // Lender specific fields
    assetTypes: [] as string[],
    dealTypes: [] as string[],
    capitalTypes: [] as string[],
    minLoanAmount: "",
    maxLoanAmount: "",
    locations: [] as string[],
  })

  // For query parameters (preliminary match data)
  const [preliminaryData, setPreliminaryData] = useState({
    asset_type: "",
    deal_type: "",
    capital_type: "",
    debt_request: "",
    location: "",
  })

  // Parse query parameters on component mount
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setPreliminaryData({
        asset_type: params.get("asset_type") || "",
        deal_type: params.get("deal_type") || "",
        capital_type: params.get("capital_type") || "",
        debt_request: params.get("debt_request") || "",
        location: params.get("location") || "",
      })
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[]
      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          return { ...prev, [name]: currentValues.filter((v) => v !== value) }
        } else {
          return { ...prev, [name]: [...currentValues, value] }
        }
      }
      return prev
    })
  }

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.companyName) {
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (role === "lender") {
      if (
        formData.assetTypes.length === 0 ||
        formData.dealTypes.length === 0 ||
        formData.capitalTypes.length === 0 ||
        !formData.minLoanAmount ||
        !formData.maxLoanAmount ||
        formData.locations.length === 0
      ) {
        return false
      }
    }
    return true
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Add useEffect to handle lender information from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)

      // Get lender data if available
      const lenderParam = params.get("lender")
      if (lenderParam) {
        try {
          const lenderData = JSON.parse(decodeURIComponent(lenderParam))
          // Store lender data in localStorage for use after registration
          localStorage.setItem("selectedLender", JSON.stringify(lenderData))
        } catch (error) {
          console.error("Error parsing lender data:", error)
        }
      }

      // Get form data if available
      const formDataParam = params.get("formData")
      if (formDataParam) {
        try {
          const formData = JSON.parse(decodeURIComponent(formDataParam))
          setPreliminaryData({
            asset_type: formData.asset_type || "",
            deal_type: formData.deal_type || "",
            capital_type: formData.capital_type || "",
            debt_request: formData.debt_request || "",
            location: formData.location || "",
          })
        } catch (error) {
          console.error("Error parsing form data:", error)
        }
      }
    }
  }, [])

  // Update the handleSubmit function to redirect with lender information
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if ((step === 3 && role === "borrower") || (step === 3 && role === "lender" && validateStep3())) {
      setLoading(true)

      try {
        // Prepare registration data
        const registrationData = {
          email: formData.email,
          password: formData.password,
          role: role,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          company_name: formData.companyName,
          // Add lender-specific data if role is lender
          ...(role === "lender" && {
            lending_criteria: {
              asset_types: formData.assetTypes,
              deal_types: formData.dealTypes,
              capital_types: formData.capitalTypes,
              min_loan_amount: Number.parseInt(formData.minLoanAmount),
              max_loan_amount: Number.parseInt(formData.maxLoanAmount),
              locations: formData.locations,
            },
          }),
        }

        // Call the register API
        const response = await mockApiService.register(registrationData)

        if (response.success) {
          // If registration is successful, redirect to login or directly to dashboard
          if (role === "borrower") {
            // Check if there's a selected lender to include in the redirect
            const selectedLender = localStorage.getItem("selectedLender")

            // If there was preliminary data or a selected lender, redirect to new project page
            if (preliminaryData.asset_type || selectedLender) {
              console.log("Redirecting to new project with lender data")
              const lenderParam = selectedLender ? `&lender=${encodeURIComponent(selectedLender)}` : ""

              // Store form data in localStorage for use in new project page
              if (preliminaryData.asset_type) {
                localStorage.setItem("preliminaryFormData", JSON.stringify(preliminaryData))
              }

              // Redirect to new project page
              window.location.href = `/borrower/projects/new?prefill=true${lenderParam}`
            } else {
              router.push("/borrower/projects/new")
            }
          } else {
            // For lenders, redirect to lender dashboard
            router.push("/lender")
          }
        } else {
          // Handle registration error
          console.error("Registration failed:", response.message)
        }
      } catch (error) {
        console.error("Error during registration:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Join our platform to connect borrowers with the right lenders for real estate projects.
          </CardDescription>

          <Tabs defaultValue={role} onValueChange={(value) => setRole(value as "borrower" | "lender")} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="borrower" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Borrower
              </TabsTrigger>
              <TabsTrigger value="lender" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Lender
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-6 flex items-center">
            <div className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-300"}`}></div>
            <div className={`h-0.5 flex-1 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}></div>
            <div className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}></div>
            <div className={`h-0.5 flex-1 ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}></div>
            <div className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}></div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && role === "borrower" && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-green-50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">Almost Done!</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Your borrower account is ready to be created. Click the button below to complete registration
                        and start creating your first project.
                      </p>
                    </div>
                  </div>
                </div>

                {preliminaryData.asset_type && (
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Your Preliminary Project Data</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {preliminaryData.asset_type && (
                        <div>
                          <p className="text-muted-foreground">Asset Type</p>
                          <p className="font-medium">{preliminaryData.asset_type}</p>
                        </div>
                      )}
                      {preliminaryData.deal_type && (
                        <div>
                          <p className="text-muted-foreground">Deal Type</p>
                          <p className="font-medium">{preliminaryData.deal_type}</p>
                        </div>
                      )}
                      {preliminaryData.capital_type && (
                        <div>
                          <p className="text-muted-foreground">Capital Type</p>
                          <p className="font-medium">{preliminaryData.capital_type}</p>
                        </div>
                      )}
                      {preliminaryData.debt_request && (
                        <div>
                          <p className="text-muted-foreground">Debt Request</p>
                          <p className="font-medium">
                            ${Number.parseInt(preliminaryData.debt_request).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {preliminaryData.location && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium">{preliminaryData.location}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This information will be pre-filled in your new project form.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && role === "lender" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Asset Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Multifamily", "Office", "Retail", "Industrial", "Hotel", "Land", "Mixed-Use"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`asset-${type}`}
                          checked={formData.assetTypes.includes(type)}
                          onChange={() => handleMultiSelectChange("assetTypes", type)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`asset-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deal Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Acquisition", "Refinance", "Development", "Construction", "Bridge", "Value-Add"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`deal-${type}`}
                          checked={formData.dealTypes.includes(type)}
                          onChange={() => handleMultiSelectChange("dealTypes", type)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`deal-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Capital Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Debt", "Equity", "Mezzanine"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`capital-${type}`}
                          checked={formData.capitalTypes.includes(type)}
                          onChange={() => handleMultiSelectChange("capitalTypes", type)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`capital-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLoanAmount">Min Loan Amount ($)</Label>
                    <Input
                      id="minLoanAmount"
                      name="minLoanAmount"
                      type="number"
                      placeholder="1,000,000"
                      value={formData.minLoanAmount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoanAmount">Max Loan Amount ($)</Label>
                    <Input
                      id="maxLoanAmount"
                      name="maxLoanAmount"
                      type="number"
                      placeholder="10,000,000"
                      value={formData.maxLoanAmount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Locations</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "New York, NY",
                      "Los Angeles, CA",
                      "Chicago, IL",
                      "Miami, FL",
                      "San Francisco, CA",
                      "Boston, MA",
                    ].map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`location-${location}`}
                          checked={formData.locations.includes(location)}
                          onChange={() => handleMultiSelectChange("locations", location)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`location-${location}`} className="text-sm font-normal">
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="flex w-full gap-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1">
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1"
                  disabled={(step === 1 && !validateStep1()) || (step === 2 && !validateStep2())}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={loading || (role === "lender" && !validateStep3())}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <span>Already have an account? </span>
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

