"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import type { LenderData, FormData } from "./lender-matching-platform"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import LenderDetailCard from "./lender-detail-card"

interface LenderGraphProps {
  lenders: LenderData[]
  formData?: FormData
  filtersApplied?: boolean
}

export default function LenderGraph({
  lenders,
  formData = {
    asset_types: [],
    deal_types: [],
    capital_types: [],
    debt_ranges: [],
    custom_min_debt_request: "",
    custom_max_debt_request: "",
    locations: [],
  },
  filtersApplied = false,
}: LenderGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLender, setSelectedLender] = useState<LenderData | null>(null)
  const [hoveredLenderId, setHoveredLenderId] = useState<number | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)
  const lenderPositionsRef = useRef<
    Map<
      number,
      {
        x: number
        y: number
        targetX: number
        targetY: number
        radius: number
        color: string
        velocity: { x: number; y: number }
      }
    >
  >(new Map())
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      size: number
      color: string
      speed: number
      life: number
      maxLife: number
    }>
  >([])

  // Handle resize and initial size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight - 60 // Subtract header height

      setCanvasSize({ width, height })
      setCenterPoint({ x: width / 2, y: height / 2 })
    }

    // Initial size calculation
    updateCanvasSize()

    // Force another update after a short delay to ensure container is fully rendered
    const timeoutId = setTimeout(updateCanvasSize, 100)

    // Add resize listener
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Generate colors based on lender properties
  const getLenderColor = (lender: LenderData, useGrey = false) => {
    // If filters aren't applied or we're explicitly told to use grey, return a grey color
    if (useGrey || !filtersApplied) {
      return `hsl(220, 10%, 70%)`
    }

    // Base hue on primary asset type
    const assetTypeMap: Record<string, number> = {
      Multifamily: 210, // Blue
      Office: 260, // Purple
      Retail: 330, // Pink
      Industrial: 160, // Green
      Hotel: 30, // Orange
      Land: 120, // Green-blue
      "Mixed-Use": 280, // Violet
    }

    // Default hue
    let hue = 210

    // Get the first asset type or use default
    if (lender.lending_criteria.asset_types.length > 0) {
      const primaryType = lender.lending_criteria.asset_types[0]
      hue = assetTypeMap[primaryType] || hue
    }

    // Saturation based on match score (higher match = more saturated)
    const saturation = 70 + (lender.match_score || 0) * 30

    // Lightness based on loan amount (higher amount = darker)
    const normalizedAmount = Math.min(lender.lending_criteria.max_loan_amount / 15000000, 1)
    const lightness = 65 - normalizedAmount * 30

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // Initialize lender positions
  useEffect(() => {
    if (!canvasSize.width || !canvasSize.height || canvasSize.width === 0 || canvasSize.height === 0) return

    const newPositions = new Map()
    const center = { x: canvasSize.width / 2, y: canvasSize.height / 2 }

    // Sort lenders by match score for better initial positioning
    const sortedLenders = [...lenders].sort((a, b) => (b.match_score || 0) - (a.match_score || 0))

    // Calculate max distance to ensure lenders stay within bounds
    // Use 80% of the smaller dimension to ensure lenders stay within view
    const maxDistance = Math.min(canvasSize.width, canvasSize.height) * 0.4

    if (filtersApplied) {
      // When filters are applied, position lenders in a circle based on match score
      sortedLenders.forEach((lender, index) => {
        // If we already have a position for this lender, update it
        if (lenderPositionsRef.current.has(lender.lender_id)) {
          const currentPos = lenderPositionsRef.current.get(lender.lender_id)!

          // Update radius and color based on new data
          const radius = 15 + (lender.match_score || 0) * 20
          const color = getLenderColor(lender)

          // Calculate new target position (but keep current position for animation)
          const angle = (index / sortedLenders.length) * Math.PI * 2
          const distance = maxDistance * (0.5 + (1 - (lender.match_score || 0)) * 0.5)

          const targetX = center.x + Math.cos(angle) * distance
          const targetY = center.y + Math.sin(angle) * distance

          newPositions.set(lender.lender_id, {
            ...currentPos,
            radius,
            color,
            targetX,
            targetY,
          })
        } else {
          // Generate a new position
          const radius = 15 + (lender.match_score || 0) * 20
          const color = getLenderColor(lender)

          // Position in a circle around center, with higher match scores closer to center
          const angle = (index / sortedLenders.length) * Math.PI * 2
          const distance = maxDistance * (0.5 + (1 - (lender.match_score || 0)) * 0.5)

          const targetX = center.x + Math.cos(angle) * distance
          const targetY = center.y + Math.sin(angle) * distance

          // Add some randomness to initial position for animation
          const randomOffset = 50
          const startX = center.x + Math.random() * randomOffset * 2 - randomOffset
          const startY = center.y + Math.random() * randomOffset * 2 - randomOffset

          newPositions.set(lender.lender_id, {
            x: startX,
            y: startY,
            targetX,
            targetY,
            radius,
            color,
            velocity: { x: 0, y: 0 },
          })
        }
      })
    } else {
      // When no filters are applied, create a visually appealing random distribution

      // Use the golden angle for a natural-looking spiral distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ~2.4 radians or ~137.5 degrees

      sortedLenders.forEach((lender, index) => {
        // Generate a new position or update existing one
        const existingPos = lenderPositionsRef.current.get(lender.lender_id)
        const radius = 15 + Math.random() * 10 // Random size for visual interest
        const color = getLenderColor(lender, true) // Grey color when no filters

        // Create a spiral pattern with some randomization
        const angle = index * goldenAngle

        // Vary the distance from center based on index and add some randomness
        // This creates a spiral pattern with some natural variation
        const distanceFactor = 0.2 + (index / sortedLenders.length) * 0.8
        const baseDistance = maxDistance * distanceFactor
        const randomVariation = baseDistance * 0.2 // 20% random variation
        const distance = baseDistance + (Math.random() * randomVariation * 2 - randomVariation)

        const targetX = center.x + Math.cos(angle) * distance
        const targetY = center.y + Math.sin(angle) * distance

        if (existingPos) {
          newPositions.set(lender.lender_id, {
            ...existingPos,
            radius,
            color,
            targetX,
            targetY,
          })
        } else {
          // For new positions, start with some offset from the target for animation
          const randomOffset = 50
          const startX = center.x + Math.random() * randomOffset * 2 - randomOffset
          const startY = center.y + Math.random() * randomOffset * 2 - randomOffset

          newPositions.set(lender.lender_id, {
            x: startX,
            y: startY,
            targetX,
            targetY,
            radius,
            color,
            velocity: { x: 0, y: 0 },
          })
        }
      })
    }

    lenderPositionsRef.current = newPositions
  }, [lenders, canvasSize, filtersApplied])

  // Add particles
  const addParticles = (x: number, y: number, color: string, count = 5) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        size: Math.random() * 3 + 1,
        color,
        speed: Math.random() * 2 + 0.5,
        life: 0,
        maxLife: Math.random() * 30 + 20,
      })
    }
  }

  // Animation loop
  useEffect(() => {
    if (
      !canvasRef.current ||
      !canvasSize.width ||
      !canvasSize.height ||
      canvasSize.width === 0 ||
      canvasSize.height === 0
    )
      return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Create radial gradient for background
    const createBackground = () => {
      const gradient = ctx.createRadialGradient(
        centerPoint.x,
        centerPoint.y,
        0,
        centerPoint.x,
        centerPoint.y,
        canvasSize.width * 0.7,
      )
      gradient.addColorStop(0, "rgba(240, 240, 255, 0.2)")
      gradient.addColorStop(1, "rgba(240, 240, 255, 0)")
      return gradient
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

      // Draw background
      ctx.fillStyle = createBackground()
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      // Draw decorative circles
      ctx.strokeStyle = "rgba(180, 180, 230, 0.2)"
      ctx.lineWidth = 1

      for (let i = 1; i <= 10; i++) {
        const radius = i * (Math.min(canvasSize.width, canvasSize.height) * 0.1)
        ctx.beginPath()
        ctx.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw borrower at center
      ctx.beginPath()
      ctx.arc(centerPoint.x, centerPoint.y, 20, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(100, 100, 255, 0.8)"
      ctx.fill()

      // Glow effect for center
      const centerGlow = ctx.createRadialGradient(centerPoint.x, centerPoint.y, 0, centerPoint.x, centerPoint.y, 40)
      centerGlow.addColorStop(0, "rgba(100, 100, 255, 0.3)")
      centerGlow.addColorStop(1, "rgba(100, 100, 255, 0)")

      ctx.beginPath()
      ctx.arc(centerPoint.x, centerPoint.y, 40, 0, Math.PI * 2)
      ctx.fillStyle = centerGlow
      ctx.fill()

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.life++

        if (particle.life >= particle.maxLife) {
          particlesRef.current.splice(index, 1)
          return
        }

        const lifeRatio = particle.life / particle.maxLife
        const alpha = lifeRatio < 0.5 ? lifeRatio * 2 : 2 - lifeRatio * 2

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(")", `, ${alpha})`)
        ctx.fill()
      })

      // Draw connections from center to lenders
      lenders.forEach((lender) => {
        const pos = lenderPositionsRef.current.get(lender.lender_id)
        if (!pos) return

        // Only draw connections for lenders with good match scores and when filters are applied
        if ((lender.match_score || 0) > 0.3 && filtersApplied) {
          const matchStrength = lender.match_score || 0

          // Create gradient for connection
          const gradient = ctx.createLinearGradient(centerPoint.x, centerPoint.y, pos.x, pos.y)
          gradient.addColorStop(0, "rgba(100, 100, 255, 0.7)")
          gradient.addColorStop(
            1,
            `rgba(${pos.color.match(/\d+/g)?.slice(0, 3).join(", ") || "100, 100, 255"}, ${matchStrength * 0.7})`,
          )

          ctx.beginPath()
          ctx.moveTo(centerPoint.x, centerPoint.y)
          ctx.lineTo(pos.x, pos.y)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1 + matchStrength * 3
          ctx.stroke()

          // Animate particles along the connection line
          if (Math.random() < 0.05 * matchStrength) {
            const t = Math.random()
            const particleX = centerPoint.x + (pos.x - centerPoint.x) * t
            const particleY = centerPoint.y + (pos.y - centerPoint.y) * t
            addParticles(particleX, particleY, pos.color, 1)
          }
        }
      })

      // Update lender positions with physics
      lenders.forEach((lender) => {
        const pos = lenderPositionsRef.current.get(lender.lender_id)
        if (!pos) return

        // Spring physics for smooth movement
        const dx = (pos.targetX - pos.x) * 0.008
        const dy = (pos.targetY - pos.y) * 0.008

        // Update velocity with damping
        pos.velocity.x = pos.velocity.x * 0.9 + dx
        pos.velocity.y = pos.velocity.y * 0.9 + dy

        // Update position
        pos.x += pos.velocity.x
        pos.y += pos.velocity.y

        // Add particles occasionally based on movement speed
        const speed = Math.sqrt(pos.velocity.x * pos.velocity.x + pos.velocity.y * pos.velocity.y)
        if (speed > 0.5 && Math.random() < 0.1) {
          addParticles(pos.x, pos.y, pos.color, 1)
        }
      })

      // Draw lenders
      lenders.forEach((lender) => {
        const pos = lenderPositionsRef.current.get(lender.lender_id)
        if (!pos) return

        // Pulsate effect
        const pulse = Math.sin(time * 0.002 + lender.lender_id * 0.1) * 0.15 + 0.85
        const radius = pos.radius * pulse * zoomLevel

        // Get color based on whether filters are applied
        const nodeColor = filtersApplied ? pos.color : getLenderColor(lender, true)

        // Glow effect
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 1.5)

        const matchScore = lender.match_score || 0
        const glowOpacity = filtersApplied ? 0.1 + matchScore * 0.3 : 0.1

        glow.addColorStop(0, nodeColor.replace(")", `, ${glowOpacity})`))
        glow.addColorStop(1, nodeColor.replace(")", ", 0)"))

        // Draw glow
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Draw circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)

        // Create gradient fill
        const gradient = ctx.createRadialGradient(pos.x - radius * 0.3, pos.y - radius * 0.3, 0, pos.x, pos.y, radius)
        gradient.addColorStop(0, nodeColor.replace(")", ", 1)"))
        gradient.addColorStop(1, nodeColor.replace("hsl", "hsla").replace(")", ", 0.8)"))

        ctx.fillStyle = gradient
        ctx.fill()

        // Highlight for selected lender
        if (selectedLender && selectedLender.lender_id === lender.lender_id) {
          ctx.strokeStyle = "white"
          ctx.lineWidth = 3
          ctx.stroke()

          // Add extra particles for selected lender
          if (Math.random() < 0.2) {
            addParticles(pos.x, pos.y, nodeColor, 2)
          }
        }
        // Highlight for hovered lender
        else if (hoveredLenderId === lender.lender_id) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw company initial in the center for larger nodes
        if (radius > 15) {
          const initial = lender.user.company_name.charAt(0)
          ctx.fillStyle = "white"
          ctx.font = `${Math.floor(radius * 0.8)}px sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(initial, pos.x, pos.y)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [lenders, canvasSize, selectedLender, hoveredLenderId, zoomLevel, centerPoint, filtersApplied])

  // Handle mouse interactions
  useEffect(() => {
    if (!canvasRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is over any lender
      let found = false
      for (const lender of lenders) {
        const pos = lenderPositionsRef.current.get(lender.lender_id)
        if (!pos) continue

        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        if (distance <= pos.radius) {
          setHoveredLenderId(lender.lender_id)
          found = true
          canvas.style.cursor = "pointer"
          break
        }
      }

      if (!found) {
        setHoveredLenderId(null)
        canvas.style.cursor = "default"
      }
    }

    const handleMouseLeave = () => {
      setHoveredLenderId(null)
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "default"
      }
    }

    canvasRef.current.addEventListener("mousemove", handleMouseMove)
    canvasRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousemove", handleMouseMove)
        canvasRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [lenders])

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoomLevel(1)
  }

  // Handle lender click
  const handleLenderClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click is on any lender
    let clickedLender = null
    for (const lender of lenders) {
      const pos = lenderPositionsRef.current.get(lender.lender_id)
      if (!pos) continue

      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
      if (distance <= pos.radius) {
        clickedLender = lender
        break
      }
    }

    if (clickedLender) {
      // If clicking the same lender, toggle the selection
      if (selectedLender && selectedLender.lender_id === clickedLender.lender_id) {
        setSelectedLender(null)
      } else {
        setSelectedLender(clickedLender)
      }
    } else {
      // If clicking empty space, deselect
      setSelectedLender(null)
    }
  }

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">{lenders.length} Matching Lenders</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-md p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} title="Reset Zoom">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">Click on lenders to see details</div>
        </div>
      </div>

      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute inset-0"
          onClick={handleLenderClick}
        />

        {selectedLender && (
          <div className="absolute top-4 right-4 z-10">
            <LenderDetailCard
              lender={selectedLender}
              formData={formData}
              onClose={() => setSelectedLender(null)}
              color={getLenderColor(selectedLender, !filtersApplied)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

