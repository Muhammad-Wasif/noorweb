'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, Bookmark, BookmarkCheck, Copy, Share2, Settings, Moon, Sun, Minus, Plus, List, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { SectionMenu } from '@/components/SectionMenu'
import { Spinner } from '@/components/ui/Spinner'
import { getSurahWithTranslation, SurahData, surahNamesUrdu, reciters } from '@/lib/quranApi'
import { useBookmarks } from '@/lib/hooks/useLocalStorage'

export default function SurahReaderPage() {
  const params = useParams()
  const surahNumber = Number(params.surah)

  const [arabicData, setArabicData] = useState<SurahData | null>(null)
  const [translationData, setTranslationData] = useState<SurahData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEnglish, setShowEnglish] = useState(false)
  const [fontSize, setFontSize] = useState(24)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentReciter, setCurrentReciter] = useState(reciters[0])
  const [currentAyah, setCurrentAyah] = useState<number | null>(null)

  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  useEffect(() => {
    async function fetchSurah() {
      setLoading(true)
      try {
        const data = await getSurahWithTranslation(surahNumber)
        setArabicData(data.arabic)
        setTranslationData(data.translation)
      } catch (error) {
        console.error('Failed to fetch surah:', error)
        toast.error('سورت لوڈ کرنے میں مسئلہ')
      } finally {
        setLoading(false)
      }
    }

    if (surahNumber >= 1 && surahNumber <= 114) {
      fetchSurah()
      setCurrentAyah(null)
      setIsPlaying(false)
    }
  }, [surahNumber])

  // Scroll to current ayah
  useEffect(() => {
    if (currentAyah !== null && ayahRefs.current[currentAyah]) {
      ayahRefs.current[currentAyah]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentAyah])

  const toggleBookmark = (ayahNumber: number, arabicText: string, urduText: string) => {
    if (isBookmarked(surahNumber, ayahNumber)) {
      removeBookmark(surahNumber, ayahNumber)
      toast.success('بُک مارک ہٹا دیا گیا')
    } else {
      addBookmark({
        surahNumber,
        surahName: arabicData?.name || '',
        ayahNumber,
        arabicText,
        urduText,
      })
      toast.success('بُک مارک محفوظ ہو گیا')
    }
  }

  const copyAyah = (arabicText: string, urduText: string) => {
    navigator.clipboard.writeText(`${arabicText}\n\n${urduText}`)
    toast.success('آیت کاپی ہو گئی')
  }

  const shareAyah = (ayahNumber: number) => {
    if (navigator.share) {
      navigator.share({
        title: `سورۃ ${arabicData?.name} - آیت ${ayahNumber}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('لنک کاپی ہو گیا')
    }
  }

  const playAyah = async (ayahNumber: number) => {
    if (currentAyah === ayahNumber && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      return
    }

    setCurrentAyah(ayahNumber)
    setIsPlaying(true)

    const absoluteAyahNumber = arabicData?.ayahs.find(a => a.numberInSurah === ayahNumber)?.number

    if (absoluteAyahNumber) {
      const url = `https://cdn.islamic.network/quran/audio/128/${currentReciter.identifier}/${absoluteAyahNumber}.mp3`
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play().catch(err => {
          console.error("Playback failed:", err)
          toast.error("آڈیو چلانے میں مسئلہ")
          setIsPlaying(false)
        })
      }
    }
  }

  const handleAudioEnded = () => {
    if (currentAyah !== null && arabicData && currentAyah < arabicData.numberOfAyahs) {
      playAyah(currentAyah + 1)
    } else {
      setIsPlaying(false)
      setCurrentAyah(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </main>
    )
  }

  if (!arabicData || !translationData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-nastaliq text-gray-500 rtl">سورت نہیں ملی</p>
          <Link href="/quran" className="btn-primary mt-4">واپس جائیں</Link>
        </div>
      </main>
    )
  }

  return (
    <main dir="ltr" className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-white to-primary-light/30'}`}>
      <SectionMenu />
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Added spacer for global menu button on mobile */}
            <div className="w-12 lg:hidden" />
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
            >
              <List className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-amiri text-primary">{arabicData.name}</h1>
              <p className="text-sm text-gray-500 font-nastaliq rtl">
                {surahNamesUrdu[surahNumber]} - {arabicData.numberOfAyahs} آیات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 w-72"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">ترتیبات</h3>
            <button onClick={() => setShowSettings(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 font-nastaliq block mb-2 rtl">فونٹ سائز</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(40, fontSize + 2))}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reciter */}
          <div>
            <label className="text-sm text-gray-500 font-nastaliq block mb-2 rtl">قاری</label>
            <select
              value={currentReciter.identifier}
              onChange={(e) => setCurrentReciter(reciters.find(r => r.identifier === e.target.value) || reciters[0])}
              className="input-field text-sm"
            >
              {reciters.map((reciter) => (
                <option key={reciter.identifier} value={reciter.identifier}>
                  {reciter.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-30
                        transform transition-transform duration-300
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4">
          <h3 className="font-bold text-gray-500 text-sm mb-3">سورتیں</h3>
          <div className="space-y-1">
            {[...Array(114)].map((_, i) => (
              <Link
                key={i + 1}
                href={`/quran/${i + 1}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors
                           ${surahNumber === i + 1
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <span className="font-bold mr-2">{i + 1}.</span>
                <span className="font-nastaliq rtl">{surahNamesUrdu[i + 1]}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pt-20 lg:pl-64">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Bismillah */}
          {surahNumber !== 9 && (
            <div className="text-center mb-12">
              <p className="text-3xl font-amiri text-gold leading-loose">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </div>
          )}

          {/* Ayahs */}
          <div className="space-y-8">
            {arabicData.ayahs.map((ayah, index) => {
              const translation = translationData.ayahs[index]
              const bookmarked = isBookmarked(surahNumber, ayah.numberInSurah)
              const isActive = currentAyah === ayah.numberInSurah

              return (
                <motion.div
                  key={ayah.numberInSurah}
                  ref={(el) => { ayahRefs.current[ayah.numberInSurah] = el }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: isActive ? 'rgba(212, 175, 55, 0.05)' : ''
                  }}
                  transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  className={`bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border-2 ${isActive ? 'border-gold shadow-lg ring-1 ring-gold/20' : 'border-transparent'}`}
                >
                  {/* Ayah Number Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${isActive ? 'bg-gold text-white' : 'bg-primary/10 text-primary'}`}>
                        {ayah.numberInSurah}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => playAyah(ayah.numberInSurah)}
                        className={`p-2 rounded-lg transition-colors ${isActive && isPlaying ? 'text-primary bg-primary/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title={isActive && isPlaying ? "Pause" : "Play"}
                      >
                        {isActive && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => toggleBookmark(ayah.numberInSurah, ayah.text, translation?.text || '')}
                        className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-gold bg-gold/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => copyAyah(ayah.text, translation?.text || '')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareAyah(ayah.numberInSurah)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <p
                    className={`font-amiri leading-loose rtl mb-4 transition-colors duration-500 ${isActive ? 'text-gold' : 'text-gray-800 dark:text-gray-200'}`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
                  >
                    {ayah.text}
                    <span className="text-gold mx-2 gold-separator"></span>
                  </p>

                  {/* Translation */}
                  {translation && (
                    <p className={`font-nastaliq text-lg leading-relaxed rtl transition-colors duration-500 ${isActive ? 'text-gold/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      {translation.text}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pb-20">
            {surahNumber > 1 ? (
              <Link
                href={`/quran/${surahNumber - 1}`}
                className="btn-outline flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-nastaliq">پچھلی سورت</span>
              </Link>
            ) : (
              <div />
            )}

            {surahNumber < 114 ? (
              <Link
                href={`/quran/${surahNumber + 1}`}
                className="btn-primary flex items-center gap-2"
              >
                <span className="font-nastaliq">اگلی سورت</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
