"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockApiService, type Lender } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, DollarSign, Save, X } from "lucide-react"
import Link from "next/link"

export default function LendingCriteriaPage() {
  const router = useRouter()
  const [lender, setLender] = useState<Lender | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    assetTypes: [] as string[],
    dealTypes: [] as string[],
    capitalTypes: [] as string[],
    minLoanAmount: "",
    maxLoanAmount: "",
    locations: [] as string[],
    loanToValue: "",
    minInterestRate: "",
    maxInterestRate: "",
  })

  useEffect(() => {
    const fetchLenderData = async () => {
      try {
        setLoading(true)
        // For demo purposes, we'll use the first lender from the mock API
        const response = await mockApiService.getPreliminaryMatches()
        if (response.success && response.lenders.length > 0) {
          const lenderData = response.lenders[0]
          setLender({
            user_id: lenderData.lender_id,
            email: lenderData.user.email,
            role: "lender",
            company_name: lenderData.user.company_name,
            lending_criteria: lenderData.lending_criteria,
          })

          // Set form data
          setFormData({
            assetTypes: lenderData.lending_criteria.asset_types,
            dealTypes: lenderData.lending_criteria.deal_types,
            capitalTypes: lenderData.lending_criteria.capital_types,
            minLoanAmount: lenderData.lending_criteria.min_loan_amount.toString(),
            maxLoanAmount: lenderData.lending_criteria.max_loan_amount.toString(),
            locations: lenderData.lending_criteria.locations,
            loanToValue: lenderData.lending_criteria.loan_to_value?.toString() || "",
            minInterestRate: lenderData.lending_criteria.interest_rate_range?.min.toString() || "",
            maxInterestRate: lenderData.lending_criteria.interest_rate_range?.max.toString() || "",
          })
        }
      } catch (err) {
        setError("Failed to load lender data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLenderData()
  }, [])

  const handleCheckboxChange = (category: "assetTypes" | "dealTypes" | "capitalTypes", value: string) => {
    setFormData((prev) => {
      const currentValues = [...prev[category]]
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter((v) => v !== value) }
      } else {
        return { ...prev, [category]: [...currentValues, value] }
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const input = e.currentTarget
      const value = input.value.trim()

      if (value && !formData.locations.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          locations: [...prev.locations, value],
        }))
        input.value = ""
      }
    }
  }

  const handleRemoveLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((loc) => loc !== location),
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // In a real app, this would call an API to update the lending criteria
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the local lender state
      if (lender) {
        const updatedLender = {
          ...lender,
          lending_criteria: {
            asset_types: formData.assetTypes,
            deal_types: formData.dealTypes,
            capital_types: formData.capitalTypes,
            min_loan_amount: Number.parseInt(formData.minLoanAmount),
            max_loan_amount: Number.parseInt(formData.maxLoanAmount),
            locations: formData.locations,
            loan_to_value: formData.loanToValue ? Number.parseFloat(formData.loanToValue) : undefined,
            interest_rate_range:
              formData.minInterestRate && formData.maxInterestRate
                ? {
                    min: Number.parseFloat(formData.minInterestRate),
                    max: Number.parseFloat(formData.maxInterestRate),
                  }
                : undefined,
          },
        }
        setLender(updatedLender)
      }

      // Redirect back to lender dashboard
      router.push("/lender")
    } catch (err) {
      setError("Failed to save lending criteria")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lending criteria...</p>
        </div>
      </div>
    )
  }

  if (error || !lender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Link href="/lender">
            <Button>Back to Dashboard</Button>
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
            <h1 className="text-3xl font-bold text-slate-800">Lending Criteria</h1>
            <p className="text-slate-600 mt-1">Define your lending preferences to match with suitable projects</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/lender">
              <Button variant="outline" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Lending Preferences</CardTitle>
          <CardDescription>Update your lending criteria to match with the right borrowers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Asset Types</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the types of real estate assets you're interested in financing
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Multifamily", "Office", "Retail", "Industrial", "Hotel", "Land", "Mixed-Use"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`asset-${type}`}
                      checked={formData.assetTypes.includes(type)}
                      onCheckedChange={() => handleCheckboxChange("assetTypes", type)}
                    />
                    <label
                      htmlFor={`asset-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Deal Types</h3>
              <p className="text-sm text-muted-foreground mb-4">Select the types of deals you're willing to finance</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Acquisition", "Refinance", "Development", "Construction", "Bridge", "Value-Add"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`deal-${type}`}
                      checked={formData.dealTypes.includes(type)}
                      onCheckedChange={() => handleCheckboxChange("dealTypes", type)}
                    />
                    <label
                      htmlFor={`deal-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Capital Types</h3>
              <p className="text-sm text-muted-foreground mb-4">Select the types of capital you provide</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Debt", "Equity", "Mezzanine"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`capital-${type}`}
                      checked={formData.capitalTypes.includes(type)}
                      onCheckedChange={() => handleCheckboxChange("capitalTypes", type)}
                    />
                    <label
                      htmlFor={`capital-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Loan Amount Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minLoanAmount">Minimum ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="minLoanAmount"
                      name="minLoanAmount"
                      type="number"
                      placeholder="1,000,000"
                      value={formData.minLoanAmount}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoanAmount">Maximum ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="maxLoanAmount"
                      name="maxLoanAmount"
                      type="number"
                      placeholder="10,000,000"
                      value={formData.maxLoanAmount}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Additional Criteria</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanToValue">Maximum Loan-to-Value Ratio</Label>
                  <div className="relative">
                    <Input
                      id="loanToValue"
                      name="loanToValue"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="0.75"
                      value={formData.loanToValue}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter as a decimal (e.g., 0.75 for 75%)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Interest Rate Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minInterestRate">Minimum Rate</Label>
                <div className="relative">
                  <Input
                    id="minInterestRate"
                    name="minInterestRate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.05"
                    value={formData.minInterestRate}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter as a decimal (e.g., 0.05 for 5%)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxInterestRate">Maximum Rate</Label>
                <div className="relative">
                  <Input
                    id="maxInterestRate"
                    name="maxInterestRate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.08"
                    value={formData.maxInterestRate}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter as a decimal (e.g., 0.08 for 8%)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Preferred Locations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter locations where you're interested in financing projects (press Enter after each location)
            </p>
            <div className="space-y-2">
              <Input placeholder="City, State (e.g., New York, NY)" onKeyDown={handleAddLocation} />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.locations.map((location) => (
                  <Badge key={location} variant="secondary" className="flex items-center gap-1">
                    {location}
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(location)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {location}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/lender">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-1">
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save Criteria
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

