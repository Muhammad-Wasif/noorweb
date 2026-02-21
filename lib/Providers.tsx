'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { CityProvider } from './context/CityContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CityProvider>
          {children}
        </CityProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
