'use client'

import { useState, useEffect } from 'react'
import { formatInTimeZone } from 'date-fns-tz'

interface AnalogClockProps {
  timezone: string
  size?: number
  showLabel?: boolean
  cityName?: string
  className?: string
}

export function AnalogClock({
  timezone,
  size = 200,
  showLabel = true,
  cityName,
  className = '',
}: AnalogClockProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const getTimeInTimezone = () => {
    if (!mounted) return { hours: 0, minutes: 0, seconds: 0 }
    try {
      const hours = parseInt(formatInTimeZone(time, timezone, 'HH'))
      const minutes = parseInt(formatInTimeZone(time, timezone, 'mm'))
      const seconds = parseInt(formatInTimeZone(time, timezone, 'ss'))
      return { hours, minutes, seconds }
    } catch {
      const hours = time.getHours()
      const minutes = time.getMinutes()
      const seconds = time.getSeconds()
      return { hours, minutes, seconds }
    }
  }

  const { hours, minutes, seconds } = getTimeInTimezone()

  const hourDeg = (hours % 12) * 30 + minutes * 0.5
  const minuteDeg = minutes * 6 + seconds * 0.1
  const secondDeg = seconds * 6

  const center = size / 2
  const radius = size / 2 - 10

  const hourHandLength = radius * 0.5
  const minuteHandLength = radius * 0.7
  const secondHandLength = radius * 0.85

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="clock-face"
      >
        {/* Clock face background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="white"
          stroke="#0e7a6e"
          strokeWidth="3"
          className="dark:fill-gray-800"
        />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x1 = center + (radius - 15) * Math.cos(angle)
          const y1 = center + (radius - 15) * Math.sin(angle)
          const x2 = center + (radius - 5) * Math.cos(angle)
          const y2 = center + (radius - 5) * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0e7a6e"
              strokeWidth={i % 3 === 0 ? 3 : 1}
              strokeLinecap="round"
            />
          )
        })}

        {/* Hour numbers */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x = center + (radius - 30) * Math.cos(angle)
          const y = center + (radius - 30) * Math.sin(angle)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#1a1a1a"
              fontSize={size / 15}
              fontWeight="600"
              className="dark:fill-gray-200"
            >
              {hour}
            </text>
          )
        })}

        {/* Hour hand - using only calculated coordinates, no CSS transform */}
        <line
          x1={center}
          y1={center}
          x2={center + hourHandLength * Math.sin((hourDeg * Math.PI) / 180)}
          y2={center - hourHandLength * Math.cos((hourDeg * Math.PI) / 180)}
          stroke="#0a5c52"
          strokeWidth={size / 40}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center + minuteHandLength * Math.sin((minuteDeg * Math.PI) / 180)}
          y2={center - minuteHandLength * Math.cos((minuteDeg * Math.PI) / 180)}
          stroke="#0e7a6e"
          strokeWidth={size / 60}
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1={center}
          y1={center}
          x2={center + secondHandLength * Math.sin((secondDeg * Math.PI) / 180)}
          y2={center - secondHandLength * Math.cos((secondDeg * Math.PI) / 180)}
          stroke="#C8A951"
          strokeWidth={size / 100}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r={size / 30} fill="#C8A951" />
        <circle cx={center} cy={center} r={size / 50} fill="#0e7a6e" />
      </svg>

      {showLabel && cityName && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-full">
          {cityName}
        </p>
      )}
    </div>
  )
}
