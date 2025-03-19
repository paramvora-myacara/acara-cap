"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // Import Checkbox component
import { X } from "lucide-react"
import type { FormData } from "./lender-matching-platform"

// Options for the form fields
const ASSET_TYPES = ["Multifamily", "Office", "Retail", "Industrial", "Hotel", "Land", "Mixed-Use"]
const DEAL_TYPES = ["Acquisition", "Refinance", "Construction", "Bridge", "Value-Add", "Development"]
const CAPITAL_TYPES = ["Debt", "Equity", "Mezzanine"]
const DEBT_RANGES = ["$1M - $5M", "$5M - $10M", "$10M - $25M", "$25M - $50M", "$50M+"]

interface BorrowerFormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  availableLocations?: string[]
}

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

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    if (Array.isArray(formData[field])) {
      const currentValues = formData[field] as string[]
      if (checked && !currentValues.includes(value)) {
        onChange({ [field]: [...currentValues, value] })
      } else if (!checked && currentValues.includes(value)) {
        onChange({ [field]: currentValues.filter((item) => item !== value) })
      }
    }
    // No need for a delay - changes are applied immediately
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    onChange({ [field]: value })
    // Changes are applied immediately
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
          <Label>Asset Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.asset_types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("asset_types", type)} />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ASSET_TYPES.map((type) => (
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

        {/* Deal Types */}
        <div className="space-y-2">
          <Label>Deal Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.deal_types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("deal_types", type)} />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEAL_TYPES.map((type) => (
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

        {/* Capital Types */}
        <div className="space-y-2">
          <Label>Capital Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.capital_types.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("capital_types", type)} />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CAPITAL_TYPES.map((type) => (
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

        {/* Debt Ranges */}
        <div className="space-y-2">
          <Label>Debt Ranges</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.debt_ranges.map((range) => (
              <Badge key={range} variant="secondary" className="flex items-center gap-1">
                {range}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("debt_ranges", range)} />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["$1M - $5M", "$5M - $10M", "$10M - $25M", "$25M - $50M", "$50M - $100M", "$100M+"].map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox
                  id={`debt-${range}`}
                  checked={formData.debt_ranges.includes(range)}
                  onCheckedChange={(checked) => handleCheckboxChange("debt_ranges", range, checked as boolean)}
                />
                <Label htmlFor={`debt-${range}`} className="text-sm font-normal cursor-pointer">
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Debt Request */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-debt">Min Debt ($)</Label>
            <Input
              id="min-debt"
              type="number"
              placeholder="1,000,000"
              value={formData.custom_min_debt_request}
              onChange={(e) => handleInputChange("custom_min_debt_request", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-debt">Max Debt ($)</Label>
            <Input
              id="max-debt"
              type="number"
              placeholder="50,000,000"
              value={formData.custom_max_debt_request}
              onChange={(e) => handleInputChange("custom_max_debt_request", e.target.value)}
            />
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <Label>Locations</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.locations.map((location) => (
              <Badge key={location} variant="secondary" className="flex items-center gap-1">
                {location}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveItem("locations", location)} />
              </Badge>
            ))}
          </div>
          <div className="h-40 overflow-y-auto border rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              {availableLocations.length > 0 ? (
                availableLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={formData.locations.includes(location)}
                      onCheckedChange={(checked) => handleCheckboxChange("locations", location, checked as boolean)}
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

