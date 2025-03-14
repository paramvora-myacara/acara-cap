"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import type { LenderData, FormData } from "./lender-matching-platform"
import { getMatchDetails } from "@/lib/matching-utils"

interface LenderDetailCardProps {
  lender: LenderData
  formData: FormData
  onClose: () => void
  color: string
}

export default function LenderDetailCard({ lender, formData, onClose, color }: LenderDetailCardProps) {
  const router = useRouter()
  const matchDetails = getMatchDetails(formData, lender)

  const handleContactLender = () => {
    router.push("/login")
  }

  return (
    <Card className="w-80 shadow-lg border-2" style={{ borderColor: color }}>
      <CardHeader className="py-3 flex flex-row justify-between items-start">
        <CardTitle className="text-base">{lender.user.company_name}</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-3 space-y-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">Match Score:</span>
            <span className="font-semibold">{Math.round((lender.match_score || 0) * 100)}%</span>
          </div>
          <Progress
            value={Math.round((lender.match_score || 0) * 100)}
            className="h-2"
            style={{ backgroundColor: "rgba(200, 200, 230, 0.3)" }}
            indicatorStyle={{ backgroundColor: color }}
          />
        </div>

        {/* Asset Types */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Asset Types:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      {matchDetails.asset_types.matches.length > 0
                        ? `${matchDetails.asset_types.matches.length} matches`
                        : "No matches"}
                    </span>
                    <Info className="h-3 w-3 ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Matching asset types: {matchDetails.asset_types.matches.join(", ") || "None"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-1">
            {lender.lending_criteria.asset_types.map((type) => (
              <Badge
                key={type}
                variant={matchDetails.asset_types.matches.includes(type) ? "default" : "outline"}
                className="text-xs"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Deal Types */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Deal Types:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      {matchDetails.deal_types.matches.length > 0
                        ? `${matchDetails.deal_types.matches.length} matches`
                        : "No matches"}
                    </span>
                    <Info className="h-3 w-3 ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Matching deal types: {matchDetails.deal_types.matches.join(", ") || "None"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-1">
            {lender.lending_criteria.deal_types.map((type) => (
              <Badge
                key={type}
                variant={matchDetails.deal_types.matches.includes(type) ? "default" : "outline"}
                className="text-xs"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Capital Types */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Capital Types:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      {matchDetails.capital_types.matches.length > 0
                        ? `${matchDetails.capital_types.matches.length} matches`
                        : "No matches"}
                    </span>
                    <Info className="h-3 w-3 ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Matching capital types: {matchDetails.capital_types.matches.join(", ") || "None"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-1">
            {lender.lending_criteria.capital_types.map((type) => (
              <Badge
                key={type}
                variant={matchDetails.capital_types.matches.includes(type) ? "default" : "outline"}
                className="text-xs"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Loan Range */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Loan Range:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{matchDetails.loan_amount.matches ? "Compatible" : "Not compatible"}</span>
                    <Info className="h-3 w-3 ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Your range: ${matchDetails.loan_amount.borrowerRange.min.toLocaleString()} -
                    {matchDetails.loan_amount.borrowerRange.max === Number.POSITIVE_INFINITY
                      ? "No max"
                      : "$" + matchDetails.loan_amount.borrowerRange.max.toLocaleString()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className={`text-sm ${matchDetails.loan_amount.matches ? "font-medium" : "text-muted-foreground"}`}>
            ${lender.lending_criteria.min_loan_amount.toLocaleString()} - $
            {lender.lending_criteria.max_loan_amount.toLocaleString()}
          </div>
        </div>

        {/* Locations */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Locations:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      {matchDetails.locations.matches.length > 0
                        ? `${matchDetails.locations.matches.length} matches`
                        : "No matches"}
                    </span>
                    <Info className="h-3 w-3 ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Matching locations: {matchDetails.locations.matches.join(", ") || "None"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-1">
            {lender.lending_criteria.locations.map((location) => {
              const city = location.split(",")[0]
              const isMatch = matchDetails.locations.matches.some((match) =>
                location.toLowerCase().includes(match.toLowerCase()),
              )
              return (
                <Badge key={location} variant={isMatch ? "default" : "outline"} className="text-xs">
                  {city}
                </Badge>
              )
            })}
          </div>
        </div>

        <Button
          className="w-full mt-4"
          size="sm"
          style={{
            backgroundColor: color,
            color: "white",
          }}
          onClick={handleContactLender}
        >
          Contact Lender
        </Button>
      </CardContent>
    </Card>
  )
}

