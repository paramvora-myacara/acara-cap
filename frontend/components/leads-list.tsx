"use client"

import type { Match } from "@/lib/mock-api-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, CheckCircle, Clock, FileText, MessageSquare, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface LeadsListProps {
  matches: Match[]
}

export default function LeadsList({ matches }: LeadsListProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Filter matches based on status
  const filteredMatches = matches.filter((match) => {
    if (filterStatus === "all") return true
    return match.match_status === filterStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Lender Matches</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="filter" className="text-sm font-medium">
            Status:
          </label>
          <select
            id="filter"
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.match_id} match={match} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No lender matches found</p>
            <p className="text-sm text-center text-muted-foreground max-w-md">
              When you request introductions to lenders and they are approved by our mediators, they will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{match.lender_details.company_name}</CardTitle>
            <CardDescription>Match for {match.project_details.project_address.split(",")[0]}</CardDescription>
          </div>
          <MatchStatusBadge status={match.match_status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Asset Type</p>
            <p className="font-medium">{match.project_details.asset_type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deal Type</p>
            <p className="font-medium">{match.project_details.deal_type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Capital Type</p>
            <p className="font-medium">{match.project_details.capital_type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Debt Request</p>
            <p className="font-medium">${(match.project_details.debt_request / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground">Match Created</p>
          <p className="font-medium">{new Date(match.created_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href={`/borrower/matches/${match.match_id}`} className="w-full">
          <Button variant="default" size="sm" className="w-full">
            View Match Details
          </Button>
        </Link>
        <div className="flex gap-2 w-full">
          <Link href={`/borrower/projects/${match.project_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
              <FileText className="h-3 w-3" />
              Project
            </Button>
          </Link>
          <Link href={`/borrower/messages?project=${match.project_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Message
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

function MatchStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Accepted
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          {status}
        </Badge>
      )
  }
}

