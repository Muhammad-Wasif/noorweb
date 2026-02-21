'use client'

import { useState, useEffect } from 'react'
import { formatInTimeZone } from 'date-fns-tz'

interface DigitalClockProps {
  timezone: string
  showDate?: boolean
  cityName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function DigitalClock({
  timezone,
  showDate = false,
  cityName,
  className = '',
  size = 'md',
}: DigitalClockProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<string>('--:--:--')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      try {
        const now = new Date()
        setTime(formatInTimeZone(now, timezone, 'HH:mm:ss'))
        if (showDate) {
          setDate(formatInTimeZone(now, timezone, 'EEEE, dd MMMM yyyy'))
        }
      } catch {
        const now = new Date()
        setTime(now.toLocaleTimeString('en-US', { hour12: false }))
        if (showDate) {
          setDate(now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          }))
        }
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timezone, showDate])

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-7xl',
  }

  if (!mounted) {
    return (
      <div className={`text-center ${className}`}>
        {cityName && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium truncate">
            {cityName}
          </p>
        )}
        <div
          className={`font-mono ${sizeClasses[size]} text-primary font-bold tracking-wider
                      bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl 
                      px-6 py-4 shadow-lg inline-block`}
        >
          --:--:--
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      {cityName && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium truncate">
          {cityName}
        </p>
      )}
      <div
        className={`font-mono ${sizeClasses[size]} text-primary font-bold tracking-wider
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl 
                    px-6 py-4 shadow-lg inline-block`}
      >
        {time}
      </div>
      {showDate && date && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">{date}</p>
      )}
    </div>
  )
}

interface CountdownClockProps {
  targetTime: string
  timezone: string
  label?: string
  className?: string
  onComplete?: () => void
}

export function CountdownClock({
  targetTime,
  timezone,
  label,
  className = '',
  onComplete,
}: CountdownClockProps) {
  const [mounted, setMounted] = useState(false)
  const [remaining, setRemaining] = useState('--:--:--')

  useEffect(() => {
    setMounted(true)
    const calculateRemaining = () => {
      try {
        const now = new Date()
        const currentTimeStr = formatInTimeZone(now, timezone, 'HH:mm:ss')
        const [currentHour, currentMin, currentSec] = currentTimeStr.split(':').map(Number)
        const [targetHour, targetMin] = targetTime.split(':').map(Number)

        const currentTotalSeconds = currentHour * 3600 + currentMin * 60 + currentSec
        const targetTotalSeconds = targetHour * 3600 + targetMin * 60

        let diffSeconds = targetTotalSeconds - currentTotalSeconds

        if (diffSeconds <= 0) {
          diffSeconds += 24 * 3600
        }

        if (diffSeconds <= 1 && onComplete) {
          onComplete()
        }

        const hours = Math.floor(diffSeconds / 3600)
        const minutes = Math.floor((diffSeconds % 3600) / 60)
        const seconds = diffSeconds % 60

        setRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      } catch {
        setRemaining('--:--:--')
      }
    }

    calculateRemaining()
    const interval = setInterval(calculateRemaining, 1000)
    return () => clearInterval(interval)
  }, [targetTime, timezone, onComplete])

  return (
    <div className={`text-center ${className}`}>
      {label && (
        <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
          {label}
        </p>
      )}
      <div
        className="font-mono text-4xl md:text-5xl text-primary font-bold tracking-wider
                   glass rounded-2xl px-6 py-4 shadow-xl inline-block
                   border-2 border-primary/20"
      >
        {mounted ? remaining : '--:--:--'}
      </div>
    </div>
  )
}
