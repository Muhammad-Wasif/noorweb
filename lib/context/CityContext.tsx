'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { City, defaultCity } from '../cities'

interface CityContextType {
  selectedCity: City
  setSelectedCity: (city: City) => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<City>(defaultCity)

  useEffect(() => {
    const savedCity = localStorage.getItem('noorweb-city')
    if (savedCity) {
      try {
        setSelectedCityState(JSON.parse(savedCity))
      } catch {
        localStorage.removeItem('noorweb-city')
      }
    }
  }, [])

  const setSelectedCity = (city: City) => {
    setSelectedCityState(city)
    localStorage.setItem('noorweb-city', JSON.stringify(city))
  }

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return context
}
