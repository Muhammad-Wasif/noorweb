'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Trash2, ArrowRight, Calendar, BookOpen } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { useBookmarks, Bookmark as BookmarkType } from '@/lib/hooks/useLocalStorage'
import { surahNamesUrdu } from '@/lib/quranApi'

type GroupBy = 'surah' | 'date'

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks()
  const [groupBy, setGroupBy] = useState<GroupBy>('surah')

  const groupedBookmarks = () => {
    if (groupBy === 'surah') {
      const groups: { [key: number]: BookmarkType[] } = {}
      bookmarks.forEach((bookmark) => {
        if (!groups[bookmark.surahNumber]) {
          groups[bookmark.surahNumber] = []
        }
        groups[bookmark.surahNumber].push(bookmark)
      })
      return Object.entries(groups).map(([surahNumber, items]) => ({
        key: surahNumber,
        title: surahNamesUrdu[Number(surahNumber)] || `سورت ${surahNumber}`,
        items: items.sort((a, b) => a.ayahNumber - b.ayahNumber),
      }))
    } else {
      const groups: { [key: string]: BookmarkType[] } = {}
      bookmarks.forEach((bookmark) => {
        const date = new Date(bookmark.createdAt).toLocaleDateString('ur-PK')
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(bookmark)
      })
      return Object.entries(groups)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, items]) => ({
          key: date,
          title: date,
          items,
        }))
    }
  }

  const handleRemove = (surahNumber: number, ayahNumber: number) => {
    removeBookmark(surahNumber, ayahNumber)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-nastaliq font-bold text-primary rtl flex items-center gap-3">
                <Bookmark className="w-8 h-8" />
                بُک مارکس
              </h1>
              <p className="text-gray-500 mt-1">
                {bookmarks.length} محفوظ آیات
              </p>
            </div>

            {/* Group Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setGroupBy('surah')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                           ${groupBy === 'surah'
                             ? 'bg-primary text-white'
                             : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-light'
                           }`}
              >
                <BookOpen className="w-4 h-4" />
                سورت
              </button>
              <button
                onClick={() => setGroupBy('date')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                           ${groupBy === 'date'
                             ? 'bg-primary text-white'
                             : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-light'
                           }`}
              >
                <Calendar className="w-4 h-4" />
                تاریخ
              </button>
            </div>
          </div>

          {/* Bookmarks */}
          {bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-nastaliq text-gray-500 rtl mb-2">
                کوئی بُک مارک نہیں
              </p>
              <p className="text-gray-400 mb-6">
                قرآن پڑھتے ہوئے آیات کو محفوظ کریں
              </p>
              <Link href="/quran" className="btn-primary">
                قرآن پڑھیں
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedBookmarks().map((group) => (
                <div key={group.key}>
                  <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 font-nastaliq rtl mb-4 flex items-center gap-2">
                    {groupBy === 'date' && <Calendar className="w-5 h-5" />}
                    {groupBy === 'surah' && <BookOpen className="w-5 h-5" />}
                    {group.title}
                    <span className="text-sm font-normal text-gray-400">
                      ({group.items.length})
                    </span>
                  </h2>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {group.items.map((bookmark) => (
                        <motion.div
                          key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="card-hover p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <Link
                              href={`/quran/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`}
                              className="flex-1 group"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                                  {bookmark.ayahNumber}
                                </span>
                                <span className="text-sm text-gray-500 font-nastaliq rtl">
                                  {surahNamesUrdu[bookmark.surahNumber]}
                                </span>
                              </div>
                              
                              <p className="font-amiri text-lg text-gray-800 dark:text-gray-200 leading-loose rtl mb-2 line-clamp-2">
                                {bookmark.arabicText}
                              </p>
                              
                              <p className="font-nastaliq text-gray-600 dark:text-gray-400 rtl line-clamp-2">
                                {bookmark.urduText}
                              </p>

                              <div className="flex items-center gap-2 mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-nastaliq">پڑھیں</span>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </Link>

                            <button
                              onClick={() => handleRemove(bookmark.surahNumber, bookmark.ayahNumber)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                              title="ہٹائیں"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
