'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MapPin, Check } from 'lucide-react'
import { useCity } from '@/lib/context/CityContext'
import { useLanguage } from '@/lib/context/LanguageContext'
import { countries, City, getCitiesByCountry } from '@/lib/cities'

export function CityDropdown() {
  const { selectedCity, setSelectedCity } = useCity()
  const { lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === selectedCity.countryCode) || countries[0]
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
    setIsOpen(false)
  }

  const cities = getCitiesByCountry(selectedCountry.code)

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white
                   rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                   border border-gray-200"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium truncate max-w-[120px] text-black">
          {selectedCity.flag} {selectedCity.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-black transition-transform duration-200 flex-shrink-0
                     ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white
                       rounded-xl shadow-2xl border border-gray-200
                       overflow-hidden z-50"
          >
            <div className="p-3 border-b border-gray-200">
              <p className={`text-xs text-gray-600 mb-2 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                {isUrdu ? 'ملک منتخب کریں' : 'Select Country'}
              </p>
              <div className="flex flex-wrap gap-1">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country)}
                    title={country.name}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors text-black
                               ${selectedCountry.code === country.code
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-primary-light'
                      }`}
                  >
                    {country.flag}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <p className={`text-xs text-gray-600 px-3 pt-2 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                {isUrdu ? `${selectedCountry.name} کے شہر` : `Cities in ${selectedCountry.name}`}
              </p>
              {cities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-black
                             hover:bg-primary-light transition-colors
                             ${selectedCity.name === city.name ? 'bg-primary-light text-primary font-medium' : ''}`}
                >
                  <span className="text-sm truncate">{city.name}</span>
                  {selectedCity.name === city.name && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
