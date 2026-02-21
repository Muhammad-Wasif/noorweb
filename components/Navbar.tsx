'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, LogOut, Globe } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { useLanguage } from '@/lib/context/LanguageContext'

const navLinks = [
  { href: '/quran', label: { ur: 'قرآن', en: 'Quran' } },
  { href: '/prayer-times', label: { ur: 'نماز', en: 'Prayer' } },
  { href: '/ramadan', label: { ur: 'رمضان', en: 'Ramadan' } },
  { href: '/hadith', label: { ur: 'احادیث', en: 'Hadith' } },
]

const companyLinks = [
  { href: '/about', label: { ur: 'ہمارے بارے میں', en: 'About Us' } },
  { href: '/contact', label: { ur: 'رابطہ کریں', en: 'Contact Us' } },
  { href: '/blog', label: { ur: 'بلاگ', en: 'Blog' } },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { lang, toggleLang } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const t = (text: { ur: string; en: string }) => text[lang]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${isScrolled
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
                    : 'bg-white/10 backdrop-blur-md backdrop-saturate-150'
                  } border-b ${isScrolled ? 'border-gray-200 dark:border-gray-800' : 'border-white/20'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always links to home */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-amiri">ن</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block whitespace-nowrap">NoorWeb</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap
                           ${lang === 'ur' ? 'font-nastaliq' : 'font-inter'}
                           ${pathname === link.href
                             ? 'text-primary'
                             : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                           }`}
              >
                {t(link.label)}
              </Link>
            ))}

            {/* Company Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setIsCompanyOpen(!isCompanyOpen); setIsSupportOpen(false) }}
                className={`flex items-center gap-1 text-sm font-medium text-gray-700 
                           dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap
                           ${lang === 'ur' ? 'font-nastaliq' : 'font-inter'}`}
              >
                {t({ ur: 'کمپنی', en: 'Company' })}
                <ChevronDown className={`w-4 h-4 transition-transform ${isCompanyOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCompanyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                               rounded-xl shadow-xl py-2 border border-gray-200 dark:border-gray-700"
                  >
                    {companyLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsCompanyOpen(false)}
                        className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                                   hover:bg-primary-light ${lang === 'ur' ? 'font-nastaliq rtl' : 'font-inter'}`}
                      >
                        {t(link.label)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setIsSupportOpen(!isSupportOpen); setIsCompanyOpen(false) }}
                className={`flex items-center gap-1 text-sm font-medium text-gray-700 
                           dark:text-gray-300 hover:text-primary transition-colors whitespace-nowrap
                           ${lang === 'ur' ? 'font-nastaliq' : 'font-inter'}`}
              >
                {t({ ur: 'سپورٹ', en: 'Support' })}
                <ChevronDown className={`w-4 h-4 transition-transform ${isSupportOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isSupportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 
                               rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className={`text-sm font-bold text-primary mb-3 ${lang === 'ur' ? 'font-nastaliq rtl' : 'font-inter'}`}>
                      {t({ ur: 'عطیات کی تفصیلات', en: 'Donation Details' })}
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <p><strong>Bank:</strong> HBL</p>
                      <p><strong>Account:</strong> NoorWeb Foundation</p>
                      <p><strong>IBAN:</strong> PK00HABB0000000000000000</p>
                      <p><strong>JazzCash:</strong> 0300-0000000</p>
                      <p><strong>EasyPaisa:</strong> 0300-0000000</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg hover:bg-primary-light transition-colors"
              title={lang === 'ur' ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            >
              <Globe className="w-5 h-5 text-primary" />
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-outline text-sm py-2 px-4">
                  {t({ ur: 'لاگ ان', en: 'Login' })}
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  {t({ ur: 'رجسٹر', en: 'Register' })}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-light transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-gray-700 dark:text-gray-300 ${lang === 'ur' ? 'font-nastaliq rtl' : 'font-inter'}`}
                >
                  {t(link.label)}
                </Link>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-gray-700 dark:text-gray-300 ${lang === 'ur' ? 'font-nastaliq rtl' : 'font-inter'}`}
                >
                  {t(link.label)}
                </Link>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="btn-outline flex-1 text-center">
                    {t({ ur: 'لاگ ان', en: 'Login' })}
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 text-center">
                    {t({ ur: 'رجسٹر', en: 'Register' })}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
