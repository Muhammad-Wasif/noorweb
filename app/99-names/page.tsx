'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ArrowLeft } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { Spinner } from '@/components/ui/Spinner'
import { motion } from 'framer-motion'

interface NameOfAllah {
  name: string
  transliteration: string
  number: number
  en: {
    meaning: string
  }
}

export default function NamesPage() {
  const [names, setNames] = useState<NameOfAllah[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNames() {
      try {
        const response = await fetch('https://api.aladhan.com/v1/asmaAlHusna')
        const data = await response.json()
        setNames(data.data)
      } catch (error) {
        console.error('Failed to fetch names:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNames()
  }, [])

  return (
    <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-7xl mx-auto text-center pt-10">
          <Star className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">اسماء الحسنٰی</h1>
          <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary mb-8 rtl">اللہ کے 99 نام</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {names.map((name, index) => (
                <motion.div
                  key={name.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-t-4 border-gold hover:scale-105 transition-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {name.number}
                    </span>
                    <h3 className="text-3xl font-amiri text-gold text-right">{name.name}</h3>
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-2">{name.transliteration}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{name.en.meaning}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
