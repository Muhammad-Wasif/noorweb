'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { searchQuran, surahNamesUrdu } from '@/lib/quranApi'

interface SearchResult {
  number: number
  text: string
  surah: { number: number; name: string; englishName: string }
  numberInSurah: number
}

export default function QuranSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchLang, setSearchLang] = useState<'ar' | 'ur' | 'en'>('ur')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    
    try {
      const edition = searchLang === 'ur' ? 'ur.jalandhry' : searchLang === 'en' ? 'en.sahih' : 'quran-uthmani'
      const data = await searchQuran(query, edition)
      setResults(data.matches || [])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-amiri text-gold mb-2">بحث في القرآن</h1>
            <h2 className="text-2xl font-nastaliq font-bold text-primary rtl">قرآن میں تلاش کریں</h2>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            {/* Language Tabs */}
            <div className="flex justify-center gap-2 mb-4">
              {[
                { value: 'ur', label: 'اردو' },
                { value: 'ar', label: 'عربی' },
                { value: 'en', label: 'English' },
              ].map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setSearchLang(lang.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-nastaliq transition-colors
                             ${searchLang === lang.value
                               ? 'bg-primary text-white'
                               : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-light'
                             }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchLang === 'ur' ? 'قرآن میں تلاش کریں...' : searchLang === 'ar' ? 'ابحث في القرآن...' : 'Search in Quran...'}
                className="w-full pl-14 pr-32 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700
                          focus:border-primary focus:ring-0 text-lg font-nastaliq rtl
                          bg-white dark:bg-gray-800"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تلاش'}
              </button>
            </div>
          </form>

          {/* Results */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-gray-500 font-nastaliq">تلاش ہو رہی ہے...</p>
            </div>
          ) : searched && results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-nastaliq text-gray-500 rtl">کوئی نتیجہ نہیں ملا</p>
              <p className="text-gray-400 mt-2">دوسرے الفاظ کے ساتھ دوبارہ کوشش کریں</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.length > 0 && (
                <p className="text-sm text-gray-500 font-nastaliq rtl mb-4">
                  {results.length} نتائج ملے
                </p>
              )}
              
              {results.map((result, index) => (
                <motion.div
                  key={`${result.surah.number}-${result.numberInSurah}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                >
                  <Link
                    href={`/quran/${result.surah.number}#ayah-${result.numberInSurah}`}
                    className="block card-hover p-6 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-primary">
                            {result.surah.number}:{result.numberInSurah}
                          </span>
                          <span className="text-sm text-gray-500 font-nastaliq rtl">
                            {surahNamesUrdu[result.surah.number] || result.surah.englishName}
                          </span>
                        </div>
                        <p className="font-nastaliq text-gray-700 dark:text-gray-300 rtl leading-relaxed line-clamp-3">
                          {result.text}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
