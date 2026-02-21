'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language } from '../translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('noorweb-lang') as Language
    if (savedLang === 'ur' || savedLang === 'en') {
      setLangState(savedLang)
    } else {
      localStorage.setItem('noorweb-lang', 'en')
      setLangState('en')
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('noorweb-lang', newLang)
  }

  const toggleLang = () => {
    const newLang = lang === 'ur' ? 'en' : 'ur'
    setLang(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
