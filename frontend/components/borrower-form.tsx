"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { FormData } from "./lender-matching-platform"

// Options for the form fields
const ASSET_TYPES = ["Multifamily", "Office", "Retail", "Industrial", "Hotel", "Land", "Mixed-Use"]
const DEAL_TYPES = ["Acquisition", "Refinance", "Construction", "Bridge", "Value-Add", "Development"]
const CAPITAL_TYPES = ["Debt", "Equity", "Mezzanine"]
const DEBT_RANGES = ["$1M - $5M", "$5M - $10M", "$10M - $25M", "$25M - $50M", "$50M+"]
// Remove the hardcoded LOCATIONS constant
// const LOCATIONS = ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Boston"]

// Update the interface to accept availableLocations
interface BorrowerFormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  availableLocations?: string[]
}

// Update the component to use the provided locations or fallback to an empty array
export default function BorrowerForm({ formData, onChange, availableLocations = [] }: BorrowerFormProps) {
  const [tempSelection, setTempSelection] = useState({
    asset_type: "",
    deal_type: "",
    capital_type: "",
    debt_range: "",
    location: "",
  })

  const handleAddItem = (field: keyof FormData, value: string) => {
    if (!value) return

    // For array fields
    if (Array.isArray(formData[field])) {
      if (!(formData[field] as string[]).includes(value)) {
        onChange({ [field]: [...(formData[field] as string[]), value] })
      }

      // Reset the temp selection
      setTempSelection((prev) => ({ ...prev, [field.replace("s", "")]: "" }))
    }
  }

  const handleRemoveItem = (field: keyof FormData, value: string) => {
    if (Array.isArray(formData[field])) {
      onChange({
        [field]: (formData[field] as string[]).filter((item) => item !== value),
      })
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    onChange({ [field]: value })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Find Your Ideal Lender</CardTitle>
        <CardDescription>
          Customize your search criteria to match with the perfect lenders for your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asset Types */}
        <div className="space-y-2">
          <Label htmlFor="asset-type">Asset Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.asset_types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("asset_types", type)} />
              </Badge>
            ))}
          </div>
          <Select
            value={tempSelection.asset_type || ""}
            onValueChange={(value) => {
              setTempSelection((prev) => ({ ...prev, asset_type: "" }))
              handleAddItem("asset_types", value)
            }}
          >
            <SelectTrigger id="asset-type">
              <SelectValue placeholder="Select asset types" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Deal Types */}
        <div className="space-y-2">
          <Label htmlFor="deal-type">Deal Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.deal_types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("deal_types", type)} />
              </Badge>
            ))}
          </div>
          <Select
            value={tempSelection.deal_type}
            onValueChange={(value) => {
              setTempSelection((prev) => ({ ...prev, deal_type: value }))
              handleAddItem("deal_types", value)
            }}
          >
            <SelectTrigger id="deal-type">
              <SelectValue placeholder="Select deal types" />
            </SelectTrigger>
            <SelectContent>
              {DEAL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capital Types */}
        <div className="space-y-2">
          <Label htmlFor="capital-type">Capital Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.capital_types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("capital_types", type)} />
              </Badge>
            ))}
          </div>
          <Select
            value={tempSelection.capital_type}
            onValueChange={(value) => {
              setTempSelection((prev) => ({ ...prev, capital_type: value }))
              handleAddItem("capital_types", value)
            }}
          >
            <SelectTrigger id="capital-type">
              <SelectValue placeholder="Select capital types" />
            </SelectTrigger>
            <SelectContent>
              {CAPITAL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Debt Ranges */}
        <div className="space-y-2">
          <Label htmlFor="debt-range">Debt Ranges</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.debt_ranges.map((range) => (
              <Badge key={range} variant="secondary" className="flex items-center gap-1">
                {range}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("debt_ranges", range)} />
              </Badge>
            ))}
          </div>
          <Select
            value={tempSelection.debt_range}
            onValueChange={(value) => {
              setTempSelection((prev) => ({ ...prev, debt_range: value }))
              handleAddItem("debt_ranges", value)
            }}
          >
            <SelectTrigger id="debt-range">
              <SelectValue placeholder="Select debt ranges" />
            </SelectTrigger>
            <SelectContent>
              {DEBT_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        {/* Locations */}
        <div className="space-y-2">
          <Label htmlFor="location">Locations</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.locations.map((location) => (
              <Badge key={location} variant="secondary" className="flex items-center gap-1">
                {location}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("locations", location)} />
              </Badge>
            ))}
          </div>
          <Select
            value={tempSelection.location}
            onValueChange={(value) => {
              setTempSelection((prev) => ({ ...prev, location: value }))
              handleAddItem("locations", value)
            }}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder={availableLocations.length > 0 ? "Select locations" : "Loading locations..."} />
            </SelectTrigger>
            <SelectContent>
              {availableLocations.length > 0 ? (
                availableLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  No locations available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => {
            // Reset all form data
            onChange({
              asset_types: [],
              deal_types: [],
              capital_types: [],
              debt_ranges: [],
              custom_min_debt_request: "",
              custom_max_debt_request: "",
              locations: [],
            })
            setTempSelection({
              asset_type: "",
              deal_type: "",
              capital_type: "",
              debt_range: "",
              location: "",
            })
          }}
          variant="outline"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}

