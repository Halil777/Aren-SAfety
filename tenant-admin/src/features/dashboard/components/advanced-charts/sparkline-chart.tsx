import { useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SparklineData {
  value: number
  label?: string
}

export interface SparklineChartProps {
  data: number[] | SparklineData[]
  width?: number
  height?: number
  className?: string
  color?: string
  fillColor?: string
  strokeWidth?: number
  smooth?: boolean
}

export function SparklineChart({
  data,
  width = 100,
  height = 30,
  className,
  color = 'rgba(139, 92, 246, 1)', // violet-500
  fillColor = 'rgba(139, 92, 246, 0.2)',
  strokeWidth = 2,
  smooth = true,
}: SparklineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set actual canvas size (accounting for devicePixelRatio)
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Extract values
    const values = data.map((d) => (typeof d === 'number' ? d : d.value))
    if (values.length === 0) return

    // Calculate dimensions
    const padding = 2
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    // Calculate points
    const points = values.map((value, index) => {
      const x = padding + (index / (values.length - 1 || 1)) * chartWidth
      const y = padding + chartHeight - ((value - min) / range) * chartHeight
      return { x, y }
    })

    // Draw fill area
    if (fillColor) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, height - padding)

      if (smooth && points.length > 2) {
        // Smooth curve for fill
        ctx.lineTo(points[0].x, points[0].y)
        for (let i = 0; i < points.length - 1; i++) {
          const current = points[i]
          const next = points[i + 1]
          const midX = (current.x + next.x) / 2
          ctx.quadraticCurveTo(current.x, current.y, midX, (current.y + next.y) / 2)
        }
        const last = points[points.length - 1]
        ctx.lineTo(last.x, last.y)
      } else {
        // Straight lines for fill
        points.forEach((point) => ctx.lineTo(point.x, point.y))
      }

      ctx.lineTo(points[points.length - 1].x, height - padding)
      ctx.closePath()
      ctx.fillStyle = fillColor
      ctx.fill()
    }

    // Draw stroke line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    if (smooth && points.length > 2) {
      // Smooth curve
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i]
        const next = points[i + 1]
        const midX = (current.x + next.x) / 2
        ctx.quadraticCurveTo(current.x, current.y, midX, (current.y + next.y) / 2)
      }
      const last = points[points.length - 1]
      ctx.lineTo(last.x, last.y)
    } else {
      // Straight lines
      points.forEach((point) => ctx.lineTo(point.x, point.y))
    }

    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [data, width, height, color, fillColor, strokeWidth, smooth])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block', className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  )
}
