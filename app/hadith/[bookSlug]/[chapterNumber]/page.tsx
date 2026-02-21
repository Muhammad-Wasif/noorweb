'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/Spinner'

interface HadithItem {
    id: string
    hadithNumber: string
    text: string
    arabicText?: string
    englishText?: string
    status: string
}

const CDN_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1'

export default function HadithsPage() {
    const { bookSlug, chapterNumber } = useParams()
    const [hadiths, setHadiths] = useState<HadithItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    useEffect(() => {
        async function fetchHadithContent() {
            if (!bookSlug || !chapterNumber) return

            setLoading(true)
            try {
                const [urduRes, arabicRes, englishRes] = await Promise.all([
                    fetch(`${CDN_URL}/editions/urd-${bookSlug}/sections/${chapterNumber}.json`),
                    fetch(`${CDN_URL}/editions/ara-${bookSlug}/sections/${chapterNumber}.json`),
                    fetch(`${CDN_URL}/editions/eng-${bookSlug}/sections/${chapterNumber}.json`)
                ])

                const [urduData, arabicData, englishData] = await Promise.all([
                    urduRes.json(),
                    arabicRes.json(),
                    englishRes.json()
                ])

                const urduHadiths = urduData.hadiths || []
                const arabicHadiths = arabicData.hadiths || []
                const englishHadiths = englishData.hadiths || []

                // Create lookups for faster merging
                const arabicMap = new Map(arabicHadiths.map((h: any) => [h.hadithnumber, h.text]))
                const englishMap = new Map(englishHadiths.map((h: any) => [h.hadithnumber, h.text]))

                const merged = urduHadiths.map((h: any, index: number) => ({
                    id: `${h.hadithnumber}-${index}`,
                    hadithNumber: h.hadithnumber,
                    text: h.text, // Urdu
                    arabicText: arabicMap.get(h.hadithnumber) || '',
                    englishText: englishMap.get(h.hadithnumber) || '',
                    status: 'Sahih'
                }))

                setHadiths(merged)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching hadiths')
            } finally {
                setLoading(false)
            }
        }

        fetchHadithContent()
    }, [bookSlug, chapterNumber])

    return (
        <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
            <SectionMenu />
            <div className="pt-20 px-4 pb-20">
                <div className="max-w-4xl mx-auto pt-10">
                    <div className="mb-10 text-center">
                        <Link href={`/hadith/${bookSlug}`} className="inline-flex items-center text-primary hover:underline mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Chapters
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-amiri text-gold mb-4 capitalize">
                            {bookSlug?.toString().replace(/-/g, ' ')}
                        </h1>
                        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-8">
                            Chapter {chapterNumber}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Spinner size="lg" />
                            <p className="mt-4 text-gray-500 font-medium">Loading Hadiths...</p>
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
                        <div className="space-y-12">
                            <AnimatePresence>
                                {hadiths.length > 0 ? (
                                    hadiths.map((hadith, index) => (
                                        <motion.div
                                            key={hadith.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border-t-4 border-primary text-left relative"
                                        >
                                            <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10 rotate-180" />

                                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                                                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                                                    Hadith {hadith.hadithNumber}
                                                </span>
                                                <span className={`px-4 py-2 rounded-full font-bold text-sm ${hadith.status.toLowerCase().includes('sahih') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                    {hadith.status}
                                                </span>
                                            </div>

                                            <p className="text-2xl md:text-4xl font-amiri text-gold text-right mb-10 leading-loose rtl">
                                                {hadith.arabicText}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                                <div>
                                                    <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">English</h3>
                                                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify">
                                                        {hadith.englishText}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider font-nastaliq rtl">ترجمہ</h3>
                                                    <p className="text-gray-700 dark:text-gray-300 font-nastaliq rtl text-xl leading-relaxed text-justify">
                                                        {hadith.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        No Hadiths found in this chapter.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

