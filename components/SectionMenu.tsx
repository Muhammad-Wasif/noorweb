'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Home, Compass, BookOpen, Clock, Moon, BookMarked,
  Star, Navigation, HeartHandshake, Box, Calculator, Calendar,
  Newspaper, CircleDot, BookHeart, Info, Phone, Globe
} from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

const menuItems = [
  { href: '/', icon: Home, urdu: 'مرکزی صفحہ', english: 'Home' },
  { href: '/explore', icon: Compass, urdu: 'سیکشن ایکسپلورر', english: 'Explore' },
  { href: '/quran', icon: BookOpen, urdu: 'قرآن مجید', english: 'Quran' },
  { href: '/prayer-times', icon: Clock, urdu: 'اوقاتِ نماز', english: 'Prayer Times' },
  { href: '/ramadan', icon: Moon, urdu: 'رمضان / افطار سحری', english: 'Ramadan' },
  { href: '/hadith', icon: BookMarked, urdu: 'احادیث', english: 'Hadith' },
  { href: '/99-names', icon: Star, urdu: 'اسماء الحسنٰی', english: '99 Names' },
  { href: '/qibla', icon: Navigation, urdu: 'قبلہ نما', english: 'Qibla' },
  { href: '/duas', icon: HeartHandshake, urdu: 'دعائیں', english: 'Duas' },
  { href: '/kaaba-3d', icon: Box, urdu: 'خانہ کعبہ 3D', english: '3D Kaaba' },
  { href: '/zakat', icon: Calculator, urdu: 'زکوٰۃ', english: 'Zakat' },
  { href: '/calendar', icon: Calendar, urdu: 'اسلامی کیلنڈر', english: 'Calendar' },
  { href: '/blog', icon: Newspaper, urdu: 'بلاگ', english: 'Blog' },
  { href: '/tasbeeh', icon: CircleDot, urdu: 'تسبیح', english: 'Tasbeeh' },
  { href: '/stories', icon: BookHeart, urdu: 'انبیاء کی کہانیاں', english: 'Stories' },
]

export function SectionMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { lang, toggleLang } = useLanguage()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                   hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      <button
        onClick={toggleLang}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                   hover:shadow-xl transition-all duration-300 hover:scale-105 md:hidden"
        aria-label="Toggle language"
      >
        <Globe className="w-6 h-6 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-[70] 
                         shadow-2xl overflow-y-auto scrollbar-hide"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl font-amiri">ن</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-primary">NoorWeb</h2>
                      <p className="text-sm text-gray-500 font-nastaliq">نور ویب</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                   ${isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'hover:bg-primary-light text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{item.english}</span>
                          <span className="font-nastaliq text-xs rtl truncate opacity-70">{item.urdu}</span>
                        </div>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light 
                               text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">About Us</span>
                      <span className="font-nastaliq text-xs rtl opacity-70">ہمارے بارے میں</span>
                    </div>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light 
                               text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">Contact</span>
                      <span className="font-nastaliq text-xs rtl opacity-70">رابطہ کریں</span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
