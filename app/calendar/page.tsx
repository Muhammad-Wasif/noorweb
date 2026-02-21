'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { Spinner } from '@/components/ui/Spinner'
import { useCity } from '@/lib/context/CityContext'

interface DayData {
  gregorian: {
    date: string
    day: string
    month: { en: string }
    year: string
  }
  hijri: {
    date: string
    day: string
    month: { en: string; ar: string }
    year: string
    designation: { abbreviated: string }
  }
}

export default function CalendarPage() {
  const { selectedCity } = useCity()
  const [calendarData, setCalendarData] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get current date details for highlighting
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
  const todayDay = today.getDate()

  useEffect(() => {
    async function fetchCalendar() {
      setLoading(true)
      try {
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const adjustment = selectedCity.countryCode === 'PK' || selectedCity.countryCode === 'IN' || selectedCity.countryCode === 'BD' ? -1 : 0
        const response = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}?adjustment=${adjustment}`)
        const data = await response.json()
        setCalendarData(data.data)
      } catch (error) {
        console.error('Failed to fetch calendar:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCalendar()
  }, [currentDate])

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Calculate empty days to pad the start of the grid (Sunday = 0, Monday = 1, etc.)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const hijriMonthEn = calendarData.length > 0 ? calendarData[0].hijri.month.en : ''
  const hijriMonthAr = calendarData.length > 0 ? calendarData[0].hijri.month.ar : ''
  const hijriYear = calendarData.length > 0 ? calendarData[0].hijri.year : ''

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-5xl mx-auto pt-10">
          <div className="text-center mb-10">
            <CalendarIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">التقويم الإسلامي</h1>
            <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary rtl">اسلامی کیلنڈر</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-primary/10 overflow-hidden">
            {/* Header Controls */}
            <div className="bg-primary/5 dark:bg-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between border-b border-primary/10">
              <button onClick={prevMonth} className="btn-outline px-4 py-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 mb-4 sm:mb-0">
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-1">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                {hijriMonthEn && (
                  <p className="text-gold font-amiri text-lg">
                    {hijriMonthAr} | {hijriMonthEn} {hijriYear} AH
                  </p>
                )}
              </div>

              <button onClick={nextMonth} className="btn-outline px-4 py-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 mt-4 sm:mt-0">
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-32">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="p-4 md:p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="text-center font-bold text-primary py-2 text-sm sm:text-base">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 sm:gap-4">
                  {emptyDays.map(day => (
                    <div key={`empty-${day}`} className="aspect-square rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-transparent"></div>
                  ))}

                  {calendarData.map((day, index) => {
                    const isToday = isCurrentMonth && parseInt(day.gregorian.day, 10) === todayDay
                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-xl border p-1 sm:p-2 flex flex-col justify-between transition-colors relative overflow-hidden group ${isToday
                          ? 'border-gold bg-gold/10 shadow-sm'
                          : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/30 hover:bg-primary/5'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-sm sm:text-lg font-bold ${isToday ? 'text-gold' : 'text-gray-700 dark:text-gray-300'}`}>
                            {parseInt(day.gregorian.day, 10)}
                          </span>
                        </div>
                        <div className="self-end text-right">
                          <span className={`text-xl sm:text-2xl font-amiri leading-none ${isToday ? 'text-primary' : 'text-primary/70 group-hover:text-primary transition-colors'}`}>
                            {parseInt(day.hijri.day, 10)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
