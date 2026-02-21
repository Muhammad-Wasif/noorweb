'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation, ArrowLeft, Compass } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { Spinner } from '@/components/ui/Spinner'
import { motion } from 'framer-motion'

export default function QiblaPage() {
  const [qibla, setQibla] = useState<number | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getLocationAndQibla = () => {
    setLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`)
          const data = await response.json()
          setQibla(data.data.direction)
        } catch (error) {
          setLocationError('Failed to fetch Qibla direction. Please try again.')
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setLocationError('Please allow location access to find Qibla direction.')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    getLocationAndQibla()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Navigation className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">قبلہ نما</h1>
          <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary mb-8 rtl">قبلے کی سمت</h2>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-auto shadow-2xl border border-primary/10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-500 font-nastaliq">سمت تلاش کی جا رہی ہے...</p>
              </div>
            ) : locationError ? (
              <div className="py-8">
                <p className="text-red-500 mb-6 font-nastaliq">{locationError}</p>
                <button
                  onClick={getLocationAndQibla}
                  className="btn-primary"
                >
                  <span className="font-nastaliq">دوبارہ کوشش کریں</span>
                </button>
              </div>
            ) : qibla !== null ? (
              <div className="flex flex-col items-center py-8">
                <div className="relative w-64 h-64 mb-8">
                  {/* Compass Background */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 flex items-center justify-center">
                    <div className="absolute top-2 font-bold text-gray-400">N</div>
                    <div className="absolute bottom-2 font-bold text-gray-400">S</div>
                    <div className="absolute right-2 font-bold text-gray-400">E</div>
                    <div className="absolute left-2 font-bold text-gray-400">W</div>
                  </div>

                  {/* Qibla Pointer */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: qibla }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  >
                    <div className="w-2 h-32 bg-gradient-to-t from-transparent to-primary absolute top-4 rounded-full origin-bottom" style={{ height: '50%' }}>
                      <Compass className="absolute -top-6 -left-3 w-8 h-8 text-gold" style={{ transform: `rotate(${-qibla}deg)` }} />
                    </div>
                  </motion.div>
                </div>

                <h3 className="text-4xl font-bold text-primary mb-2">
                  {qibla.toFixed(1)}°
                </h3>
                <p className="text-gray-500 font-nastaliq mb-2">شمال سے قبلہ کا زاویہ</p>
                <p className="text-sm text-gold font-nastaliq mt-4 text-center">
                  نوٹ: درستگی کے لیے اپنے فون کو ہموار سطح پر رکھیں اور مقام کی اجازت دیں۔
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
