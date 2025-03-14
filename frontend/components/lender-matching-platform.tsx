"use client"

import { useState, useEffect } from "react"
import BorrowerForm from "@/components/borrower-form"
import LenderGraph from "@/components/lender-graph"
import { apiService } from "@/lib/api-service"
import { calculateMatchScore } from "@/lib/matching-utils"

export type FormData = {
  asset_types: string[]
  deal_types: string[]
  capital_types: string[]
  debt_ranges: string[]
  custom_min_debt_request: string
  custom_max_debt_request: string
  locations: string[]
}

export type LenderData = {
  lender_id: number
  user: {
    email: string
    company_name: string
  }
  lending_criteria: {
    asset_types: string[]
    deal_types: string[]
    capital_types: string[]
    min_loan_amount: number
    max_loan_amount: number
    locations: string[]
  }
  match_score?: number
}

// Add a function to extract unique locations from lenders
function extractUniqueLocations(lenders: LenderData[]): string[] {
  const locationSet = new Set<string>()

  lenders.forEach((lender) => {
    lender.lending_criteria.locations.forEach((location) => {
      // Extract city from "City, State" format
      const city = location.split(",")[0].trim()
      locationSet.add(city)
    })
  })

  return Array.from(locationSet).sort()
}

export default function LenderMatchingPlatform() {
  const [formData, setFormData] = useState<FormData>({
    asset_types: [],
    deal_types: [],
    capital_types: [],
    debt_ranges: [],
    custom_min_debt_request: "",
    custom_max_debt_request: "",
    locations: [],
  })

  const [lenders, setLenders] = useState<LenderData[]>([])
  const [filteredLenders, setFilteredLenders] = useState<LenderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [filtersApplied, setFiltersApplied] = useState(false)

  useEffect(() => {
    // Fetch lenders from the mock API service
    const fetchLenders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiService.getPreliminaryMatches()
        if (response.success) {
          setLenders(response.lenders)
          setFilteredLenders(response.lenders)

          // Extract unique locations from the lenders
          const locations = extractUniqueLocations(response.lenders)
          setAvailableLocations(locations)
        } else {
          setError(response.error || "Failed to fetch lenders")
        }
      } catch (error) {
        console.error("Error fetching lenders:", error)
        setError("Failed to load lender data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLenders()
  }, [])

  useEffect(() => {
    // Check if any filters are applied
    const hasFilters =
      formData.asset_types.length > 0 ||
      formData.deal_types.length > 0 ||
      formData.capital_types.length > 0 ||
      formData.locations.length > 0 ||
      formData.custom_min_debt_request !== "" ||
      formData.custom_max_debt_request !== ""

    setFiltersApplied(hasFilters)

    // Filter and score lenders based on form data
    let filtered = [...lenders]

    // Apply basic filtering
    if (formData.asset_types.length > 0) {
      filtered = filtered.filter((lender) =>
        formData.asset_types.some((type) => lender.lending_criteria.asset_types.includes(type)),
      )
    }

    if (formData.deal_types.length > 0) {
      filtered = filtered.filter((lender) =>
        formData.deal_types.some((type) => lender.lending_criteria.deal_types.includes(type)),
      )
    }

    if (formData.capital_types.length > 0) {
      filtered = filtered.filter((lender) =>
        formData.capital_types.some((type) => lender.lending_criteria.capital_types.includes(type)),
      )
    }

    if (formData.locations.length > 0) {
      filtered = filtered.filter((lender) =>
        formData.locations.some((location) =>
          lender.lending_criteria.locations.some((lenderLocation) => lenderLocation.includes(location)),
        ),
      )
    }

    const minDebt = formData.custom_min_debt_request ? Number.parseInt(formData.custom_min_debt_request) : 0
    const maxDebt = formData.custom_max_debt_request
      ? Number.parseInt(formData.custom_max_debt_request)
      : Number.POSITIVE_INFINITY

    if (minDebt > 0 || maxDebt < Number.POSITIVE_INFINITY) {
      filtered = filtered.filter(
        (lender) =>
          lender.lending_criteria.max_loan_amount >= minDebt && lender.lending_criteria.min_loan_amount <= maxDebt,
      )
    }

    // Calculate match scores using our new utility function
    filtered = filtered.map((lender) => ({
      ...lender,
      match_score: calculateMatchScore(formData, lender),
    }))

    // Sort by match score
    filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))

    setFilteredLenders(filtered)
  }, [formData, lenders])

  const handleFormChange = (newFormData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newFormData }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">LenderMatch</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Find the perfect lender for your real estate project with our interactive matching platform. Adjust your
          criteria and watch as potential lenders dynamically update in real-time.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        <div className="w-full lg:w-[30%]">
          <BorrowerForm formData={formData} onChange={handleFormChange} availableLocations={availableLocations} />
        </div>
        <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-md p-4 h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading lenders...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
                <p className="text-slate-600 mb-4">{error}</p>
              </div>
            </div>
          ) : (
            <LenderGraph lenders={filteredLenders} formData={formData} filtersApplied={filtersApplied} />
          )}
        </div>
      </div>
    </div>
  )
}

