"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import LenderGraph from "@/components/lender-graph"
import { mockApiService } from "@/lib/mock-api-service"
import type { FormData } from "@/components/lender-matching-platform"

// Helper function to extract unique locations from lenders
function extractLocationsFromLenders(lenders: any[]): string[] {
  const locationSet = new Set<string>()

  lenders.forEach((lender) => {
    if (lender.lending_criteria && lender.lending_criteria.locations) {
      lender.lending_criteria.locations.forEach((location: string) => {
        // Extract city from "City, State" format
        const city = location.split(",")[0].trim()
        locationSet.add(city)
      })
    }
  })

  return Array.from(locationSet).sort()
}

// Update the LandingPage component to properly handle lender clicks
export default function LandingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    asset_types: [],
    deal_types: [],
    capital_types: [],
    debt_ranges: [],
    custom_min_debt_request: "",
    custom_max_debt_request: "",
    locations: [],
  })
  const [lenders, setLenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersApplied, setFiltersApplied] = useState(false)

  // Fetch sample lenders for the interactive visualization
  useEffect(() => {
    const fetchLenders = async () => {
      try {
        setLoading(true)
        const response = await mockApiService.getPreliminaryMatches()
        if (response.success) {
          setLenders(response.lenders)
        }
      } catch (error) {
        console.error("Error fetching lenders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLenders()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const fieldName = id === "debt-request" ? "custom_min_debt_request" : id === "location" ? "locations" : id

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  // Update the handleCheckboxChange function to immediately calculate matches
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field as keyof FormData] as string[]), value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field as keyof FormData] as string[]).filter((item) => item !== value),
      }))
    }

    // Immediately set filters applied to true and update lender scores
    setFiltersApplied(true)
    updateLenderScores()
  }

  // Add a new function to update lender scores
  const updateLenderScores = () => {
    // Calculate match scores for all lenders based on current form data
    const updatedLenders = lenders.map((lender) => {
      // Calculate a match score based on criteria
      let score = 0
      let criteriaCount = 0

      // Check asset types
      if (formData.asset_types.length > 0) {
        criteriaCount++
        const matchingAssetTypes = formData.asset_types.filter((type) =>
          lender.lending_criteria.asset_types.includes(type),
        ).length

        if (matchingAssetTypes > 0) {
          score += matchingAssetTypes / formData.asset_types.length
        }
      }

      // Check deal types
      if (formData.deal_types.length > 0) {
        criteriaCount++
        const matchingDealTypes = formData.deal_types.filter((type) =>
          lender.lending_criteria.deal_types.includes(type),
        ).length

        if (matchingDealTypes > 0) {
          score += matchingDealTypes / formData.deal_types.length
        }
      }

      // Check capital types
      if (formData.capital_types.length > 0) {
        criteriaCount++
        const matchingCapitalTypes = formData.capital_types.filter((type) =>
          lender.lending_criteria.capital_types.includes(type),
        ).length

        if (matchingCapitalTypes > 0) {
          score += matchingCapitalTypes / formData.capital_types.length
        }
      }

      // Check locations
      if (formData.locations.length > 0) {
        criteriaCount++
        const matchingLocations = formData.locations.filter((location) =>
          lender.lending_criteria.locations.some((lenderLocation) =>
            lenderLocation.toLowerCase().includes(location.toLowerCase()),
          ),
        ).length

        if (matchingLocations > 0) {
          score += matchingLocations / formData.locations.length
        }
      }

      // Calculate final score
      const finalScore = criteriaCount > 0 ? score / criteriaCount : 0

      return {
        ...lender,
        match_score: finalScore,
      }
    })

    // Update lenders with match scores
    setLenders(updatedLenders)
  }

  // Update the handleLocationChange function to also update scores
  const handleLocationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      locations: [value],
    }))
    setFiltersApplied(true)
    updateLenderScores()
  }

  // This adds an explicit button to calculate matching scores
  const handleFindLenders = () => {
    // Force recalculation of scores
    const updatedLenders = lenders.map((lender) => {
      // Calculate a match score based on criteria
      let score = 0
      let criteriaCount = 0

      // Check asset types
      if (formData.asset_types.length > 0) {
        criteriaCount++
        const matchingAssetTypes = formData.asset_types.filter((type) =>
          lender.lending_criteria.asset_types.includes(type),
        ).length

        if (matchingAssetTypes > 0) {
          score += matchingAssetTypes / formData.asset_types.length
        }
      }

      // Check deal types
      if (formData.deal_types.length > 0) {
        criteriaCount++
        const matchingDealTypes = formData.deal_types.filter((type) =>
          lender.lending_criteria.deal_types.includes(type),
        ).length

        if (matchingDealTypes > 0) {
          score += matchingDealTypes / formData.deal_types.length
        }
      }

      // Check capital types
      if (formData.capital_types.length > 0) {
        criteriaCount++
        const matchingCapitalTypes = formData.capital_types.filter((type) =>
          lender.lending_criteria.capital_types.includes(type),
        ).length

        if (matchingCapitalTypes > 0) {
          score += matchingCapitalTypes / formData.capital_types.length
        }
      }

      // Check locations
      if (formData.locations.length > 0) {
        criteriaCount++
        const matchingLocations = formData.locations.filter((location) =>
          lender.lending_criteria.locations.some((lenderLocation) =>
            lenderLocation.toLowerCase().includes(location.toLowerCase()),
          ),
        ).length

        if (matchingLocations > 0) {
          score += matchingLocations / formData.locations.length
        }
      }

      // Calculate final score
      const finalScore = criteriaCount > 0 ? score / criteriaCount : 0

      return {
        ...lender,
        match_score: finalScore,
      }
    })

    // Update lenders with match scores
    setLenders(updatedLenders)

    // Apply filters
    setFiltersApplied(true)
  }

  // This function will be called when the "Contact Lender" button is clicked
  const handleContactLender = () => {
    // Redirect to register page when a lender is clicked
    // The lender information will be passed via the LenderDetailCard component
    router.push("/register")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">LenderMatch</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Find the perfect lender for your real estate project with our interactive matching platform. Adjust your
            criteria and watch as potential lenders dynamically update in real-time.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Left side: Borrower Form */}
          <div className="w-full lg:w-[30%]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Find Your Ideal Lender</CardTitle>
                <CardDescription>
                  Customize your search criteria to match with the perfect lenders for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Multifamily", "Office", "Retail", "Industrial", "Hotel", "Land", "Mixed-Use"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`asset-${type}`}
                          checked={formData.asset_types.includes(type)}
                          onCheckedChange={(checked) => handleCheckboxChange("asset_types", type, checked as boolean)}
                        />
                        <Label htmlFor={`asset-${type}`} className="text-sm font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deal Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Acquisition", "Refinance", "Development", "Construction", "Bridge", "Value-Add"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`deal-${type}`}
                          checked={formData.deal_types.includes(type)}
                          onCheckedChange={(checked) => handleCheckboxChange("deal_types", type, checked as boolean)}
                        />
                        <Label htmlFor={`deal-${type}`} className="text-sm font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Capital Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Debt", "Equity", "Mezzanine"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`capital-${type}`}
                          checked={formData.capital_types.includes(type)}
                          onCheckedChange={(checked) => handleCheckboxChange("capital_types", type, checked as boolean)}
                        />
                        <Label htmlFor={`capital-${type}`} className="text-sm font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Debt Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["$1M - $5M", "$5M - $10M", "$10M - $25M", "$25M - $50M", "$50M - $100M", "$100M+"].map(
                      (range) => (
                        <div key={range} className="flex items-center space-x-2">
                          <Checkbox
                            id={`debt-${range}`}
                            checked={formData.debt_ranges.includes(range)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("debt_ranges", range, checked as boolean)
                            }
                          />
                          <Label htmlFor={`debt-${range}`} className="text-sm font-normal cursor-pointer">
                            {range}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Locations</Label>
                  <div className="h-40 overflow-y-auto border rounded-md p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {loading ? (
                        <div className="col-span-2 text-center py-4">Loading locations...</div>
                      ) : lenders.length > 0 ? (
                        extractLocationsFromLenders(lenders).map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location}`}
                              checked={formData.locations.includes(location)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("locations", location, checked as boolean)
                              }
                            />
                            <Label htmlFor={`location-${location}`} className="text-sm font-normal cursor-pointer">
                              {location}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-4">No locations available</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-center text-muted-foreground w-full">
                  Lender matches update automatically as you select criteria
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Right side: Lender Graph */}
          <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-md p-4 h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading lenders...</p>
                </div>
              </div>
            ) : (
              <LenderGraph
                lenders={lenders}
                formData={formData}
                filtersApplied={filtersApplied}
                onLenderClick={handleContactLender}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

