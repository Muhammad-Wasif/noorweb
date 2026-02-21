'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookMarked, ArrowLeft, Search, Loader2, ArrowRight } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/Spinner'

interface HadithBook {
  id: string
  bookName: string
  writerName: string
  bookSlug: string
  hadiths_count: string
}

const AVAILABLE_BOOKS: HadithBook[] = [
  { id: 'bukhari', bookName: 'Sahih al-Bukhari', writerName: 'Imam Bukhari', bookSlug: 'bukhari', hadiths_count: '7563' },
  { id: 'muslim', bookName: 'Sahih Muslim', writerName: 'Imam Muslim', bookSlug: 'muslim', hadiths_count: '7500' },
  { id: 'abudawud', bookName: 'Sunan Abu Dawud', writerName: 'Imam Abu Dawud', bookSlug: 'abudawud', hadiths_count: '5274' },
  { id: 'tirmidhi', bookName: 'Sunan al-Tirmidhi', writerName: 'Imam Tirmidhi', bookSlug: 'tirmidhi', hadiths_count: '3956' },
  { id: 'nasai', bookName: 'Sunan al-Nasai', writerName: 'Imam Nasai', bookSlug: 'nasai', hadiths_count: '5758' },
  { id: 'ibnmajah', bookName: 'Sunan ibn Majah', writerName: 'Imam Ibn Majah', bookSlug: 'ibnmajah', hadiths_count: '4341' },
]

// CDN base URL for fawazahmed0/hadith-api
const CDN_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1'

export default function HadithPage() {
  const [books, setBooks] = useState<HadithBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Books are now static for stability
    setBooks(AVAILABLE_BOOKS)
    setLoading(false)
  }, [])

  const filteredBooks = books.filter(book =>
    book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.writerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-10">
          <div className="text-center mb-10">
            <BookMarked className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">احادیث مبارکہ</h1>
            <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary mb-6 rtl">صحیح احادیث</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Explore authentic collections of Hadith. Select a book to read its chapters and narrations.
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search collection or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-primary/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-500 font-medium">Loading Collections...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <AnimatePresence>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border-t-4 border-primary hover:border-gold transition-colors block group cursor-pointer"
                    >
                      <Link href={`/hadith/${book.bookSlug}`} className="block h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <BookMarked className="w-6 h-6 text-primary group-hover:text-gold transition-colors" />
                          </div>
                          <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            {book.hadiths_count} Hadiths
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                          {book.bookName}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 mb-4 flex-grow">
                          By {book.writerName}
                        </p>

                        <div className="flex items-center text-primary text-sm font-bold mt-auto group-hover:translate-x-2 transition-transform">
                          Read Book <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    No books found matching your search.
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}
