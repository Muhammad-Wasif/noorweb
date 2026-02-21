'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CircleDot, ArrowLeft, RotateCcw } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion, AnimatePresence } from 'framer-motion'

const adhkarList = [
  { name: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'SubhanAllah', count: 33 },
  { name: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', count: 33 },
  { name: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', count: 34 },
  { name: 'Custom / Free', transliteration: 'استغفار / درود', count: Infinity },
]

export default function TasbeehPage() {
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentDhikrIndex, setCurrentDhikrIndex] = useState(0)

  const currentDhikr = adhkarList[currentDhikrIndex]

  const handleTap = () => {
    // Attempt vibration if supported
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50) // Short vibration

      // longer vibration at the end of a 33/34 cycle
      if (currentDhikr.count !== Infinity && count + 1 === currentDhikr.count) {
        navigator.vibrate([100, 50, 100])
      }
    }

    setCount(prev => prev + 1)
    setTotalCount(prev => prev + 1)
  }

  const handleReset = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100)
    }
    setCount(0)
  }

  const handleNextDhikr = () => {
    setCurrentDhikrIndex((prev) => (prev + 1) % adhkarList.length)
    setCount(0)
  }

  return (
    <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-2xl mx-auto text-center pt-10">
          <CircleDot className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">تسبیح</h1>
          <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary mb-8 rtl">ڈیجیٹل تسبیح</h2>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-primary/10 mb-8 relative">

            {/* Dhikr Selector */}
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={currentDhikr.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-4xl md:text-5xl font-amiri text-gold mb-2"
                >
                  {currentDhikr.name}
                </motion.h3>
              </AnimatePresence>
              <p className="text-gray-500 font-medium">{currentDhikr.transliteration}</p>
            </div>

            {/* Counter display */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 mb-10 shadow-inner border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-7xl md:text-8xl font-mono font-bold text-primary tabular-nums tracking-tighter">
                {String(count).padStart(2, '0')}
              </div>
              {currentDhikr.count !== Infinity && (
                <div className="text-gray-400 mt-2 text-lg font-medium">
                  / {currentDhikr.count}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6">
              {/* Main Tap Button */}
              <motion.button
                whileTap={{ scale: 0.95, y: 5 }}
                onClick={handleTap}
                className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-b from-primary to-primary-dark rounded-full shadow-[0_10px_0_0_#0a5c53,0_15px_20px_rgba(0,0,0,0.3)] active:shadow-[0_0px_0_0_#0a5c53,0_5px_10px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-75 mx-auto"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                  <span className="text-white font-bold text-xl uppercase tracking-widest relative z-10">Tap</span>
                </div>
              </motion.button>

              {/* Secondary Controls */}
              <div className="flex items-center justify-between w-full max-w-xs mt-4">
                <button
                  onClick={handleReset}
                  className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm"
                  aria-label="Reset counter"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total</p>
                  <p className="text-xl font-mono font-bold text-gray-600 dark:text-gray-300 tabular-nums">{totalCount}</p>
                </div>

                <button
                  onClick={handleNextDhikr}
                  className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm"
                >
                  Next Dhikr
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
