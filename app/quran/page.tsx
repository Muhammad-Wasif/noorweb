'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Search, BookOpen, MapPin } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { Spinner } from '@/components/ui/Spinner'
import { getAllSurahs, Surah, surahNamesUrdu } from '@/lib/quranApi'



export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all')

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const data = await getAllSurahs()
        setSurahs(data)
      } catch (error) {
        console.error('Failed to fetch surahs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSurahs()
  }, [])

  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surahNamesUrdu[surah.number]?.includes(searchQuery) ||
      surah.number.toString() === searchQuery

    const matchesFilter = filter === 'all' || surah.revelationType === filter

    return matchesSearch && matchesFilter
  })

  return (
    <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />

      {/* Hero Section */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-right"
            >
              <h1 className="text-4xl md:text-5xl font-amiri text-gold mb-2">
                القرآن الكریم
              </h1>
              <h2 className="text-3xl font-nastaliq font-bold text-primary mb-4 rtl">
                قرآن مجید میں خوش آمدید
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-nastaliq rtl mb-6">
                مکمل قرآن پاک اردو ترجمہ اور تفسیر کے ساتھ
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                <Link href="/quran/search" className="btn-outline text-sm">
                  <Search className="w-4 h-4 inline mr-2" />
                  تلاش کریں
                </Link>
                <Link href="/quran/bookmarks" className="btn-primary text-sm">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  بُک مارکس
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.2 },
                x: { duration: 0.8, delay: 0.2 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="relative flex items-center justify-center h-[300px] md:h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-gold/10 rounded-full blur-3xl opacity-50" />
              <Image
                src="/quran-model-nobg.png"
                alt="Holy Quran"
                width={350}
                height={350}
                className="relative z-10 w-full max-w-[350px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 px-4 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="سورت تلاش کریں..."
                className="input-field pl-10 font-nastaliq rtl"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'تمام', labelEn: 'All' },
                { value: 'Meccan', label: 'مکی', labelEn: 'Meccan' },
                { value: 'Medinan', label: 'مدنی', labelEn: 'Medinan' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-nastaliq transition-colors
                             ${filter === tab.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-light'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Surah Grid */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSurahs.map((surah, index) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5) }}
                >
                  <Link
                    href={`/quran/${surah.number}`}
                    className="block card-hover p-4 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Number Badge */}
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center
                                    group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                        <span className="font-bold">{surah.number}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-amiri text-primary truncate">
                          {surah.name}
                        </h3>
                        <p className="text-lg font-nastaliq text-gray-700 dark:text-gray-300 rtl truncate">
                          {surahNamesUrdu[surah.number] || surah.englishName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          <span>{surah.numberOfAyahs} آیات</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {surah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filteredSurahs.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-500 font-nastaliq text-xl rtl">
                کوئی سورت نہیں ملی
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
