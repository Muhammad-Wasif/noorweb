'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookOpen, ArrowLeft, Search } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/Spinner'

interface Chapter {
    id: string
    chapterNumber: string
    name: string
    bookSlug: string
}

const CDN_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1'

export default function ChaptersPage() {
    const { bookSlug } = useParams()
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        async function fetchChapters() {
            try {
                // Fetching from the English edition for metadata and sections
                const res = await fetch(`${CDN_URL}/editions/eng-${bookSlug}.json`)
                if (!res.ok) throw new Error('Failed to fetch chapters')
                const data = await res.json()

                // The new API structure has metadata at the root of the book JSON
                const sections = (data as any).metadata?.sections || {}
                const chapterList = Object.entries(sections).map(([num, name]) => ({
                    id: num,
                    chapterNumber: num,
                    name: name as string,
                    bookSlug: bookSlug as string
                })).filter(c => c.chapterNumber !== '0') // Skip '0' if present

                setChapters(chapterList)
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching chapters')
            } finally {
                setLoading(false)
            }
        }

        if (bookSlug) {
            fetchChapters()
        }
    }, [bookSlug])

    const filteredChapters = chapters.filter(chapter =>
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.chapterNumber.includes(searchQuery)
    )

    return (
        <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
            <SectionMenu />
            <div className="pt-20 px-4 pb-20">
                <div className="max-w-4xl mx-auto pt-10">
                    <div className="mb-10 text-center">
                        <Link href="/hadith" className="inline-flex items-center text-primary hover:underline mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
                        </Link>

                        <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="text-3xl md:text-5xl font-amiri text-gold mb-4 capitalize">
                            {bookSlug?.toString().replace(/-/g, ' ')}
                        </h1>
                        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-8">Chapters</h2>

                        <div className="max-w-md mx-auto relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-primary/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Spinner size="lg" />
                            <p className="mt-4 text-gray-500 font-medium">Loading Chapters...</p>
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
                        <div className="space-y-4">
                            <AnimatePresence>
                                {filteredChapters.length > 0 ? (
                                    filteredChapters.map((chapter, index) => (
                                        <motion.div
                                            key={chapter.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={`/hadith/${bookSlug}/${chapter.chapterNumber}`}
                                                className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-primary/10 hover:border-primary hover:shadow-lg transition-all group"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                                            {chapter.chapterNumber}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg group-hover:text-primary transition-colors">
                                                                {chapter.name}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        No chapters found matching your search.
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
