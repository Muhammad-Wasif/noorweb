'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatInTimeZone } from 'date-fns-tz'

interface HourglassProps {
    timezone: string
    size?: number
    cityName?: string
    className?: string
}

export function Hourglass({
    timezone,
    size = 200,
    cityName,
    className = '',
}: HourglassProps) {
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

    // Total seconds passed in the current hour
    const secondsPassedInHour = minutes * 60 + seconds
    const totalSecondsInHour = 3600

    // Ratio of sand in bottom (0 to 1)
    const ratio = secondsPassedInHour / totalSecondsInHour

    // Hourglass rotation: 0, 180, 360, 540, ...
    // Every hour it rotates 180 degrees.
    const rotation = hours * 180

    const width = size
    const height = size
    const padding = size * 0.1
    const innerWidth = width - padding * 2
    const innerHeight = height - padding * 2

    // Bulb height (approx half of inner height)
    const bulbHeight = innerHeight * 0.45

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <motion.div
                animate={{ rotate: rotation }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                style={{ width, height }}
                className="relative"
            >
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Glass Frame */}
                    <path
                        d={`M ${padding} ${padding} 
               L ${width - padding} ${padding} 
               L ${width / 2 + 5} ${height / 2} 
               L ${width - padding} ${height - padding} 
               L ${padding} ${height - padding} 
               L ${width / 2 - 5} ${height / 2} 
               Z`}
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-primary-dark"
                    />

                    {/* Top Sand (decreasing) */}
                    <clipPath id="top-clip">
                        <rect
                            x={padding}
                            y={padding + (ratio * bulbHeight)}
                            width={innerWidth}
                            height={bulbHeight}
                        />
                    </clipPath>
                    <path
                        d={`M ${padding + 5} ${padding + 5} 
               L ${width - padding - 5} ${padding + 5} 
               L ${width / 2} ${height / 2} 
               Z`}
                        fill="#C8A951"
                        clipPath="url(#top-clip)"
                        className="transition-all duration-1000 ease-linear"
                    />

                    {/* Bottom Sand (increasing) */}
                    <clipPath id="bottom-clip">
                        <rect
                            x={padding}
                            y={height - padding - (ratio * bulbHeight)}
                            width={innerWidth}
                            height={bulbHeight}
                        />
                    </clipPath>
                    <path
                        d={`M ${padding + 5} ${height - padding - 5} 
               L ${width - padding - 5} ${height - padding - 5} 
               L ${width / 2} ${height / 2} 
               Z`}
                        fill="#C8A951"
                        clipPath="url(#bottom-clip)"
                        className="transition-all duration-1000 ease-linear"
                    />

                    {/* Falling Sand Stream */}
                    {ratio < 1 && (
                        <line
                            x1={width / 2}
                            y1={height / 2}
                            x2={width / 2}
                            y2={height - padding - 5}
                            stroke="#C8A951"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                            className="animate-pulse"
                        />
                    )}
                </svg>
            </motion.div>

            {cityName && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-full">
                    {cityName}
                </p>
            )}
        </div>
    )
}
