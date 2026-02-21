'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Clock } from 'lucide-react'
import { formatInTimeZone } from 'date-fns-tz'
import { City, allCities, defaultCity } from '@/lib/cities'
import { Hourglass } from './Hourglass'
import { Modal } from './ui/Modal'

interface MultiCityClocksProps {
  initialCities?: City[]
  maxCities?: number
  showAnalog?: boolean
  compact?: boolean
  className?: string
}

export function MultiCityClocks({
  initialCities = [defaultCity],
  maxCities = 6,
  showAnalog = true,
  compact = false,
  className = '',
}: MultiCityClocksProps) {
  const [cities, setCities] = useState<City[]>(initialCities)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const updateTimes = () => {
      const times: { [key: string]: string } = {}
      cities.forEach((city) => {
        try {
          times[city.name] = formatInTimeZone(new Date(), city.timezone, 'HH:mm:ss')
        } catch {
          times[city.name] = new Date().toLocaleTimeString('en-US', { hour12: false })
        }
      })
      setCurrentTimes(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [cities])

  const addCity = (city: City) => {
    if (!cities.find((c) => c.name === city.name) && cities.length < maxCities) {
      setCities([...cities, city])
    }
    setIsModalOpen(false)
  }

  const removeCity = (cityName: string) => {
    if (cities.length > 1) {
      setCities(cities.filter((c) => c.name !== cityName))
    }
  }

  const availableCities = allCities.filter(
    (city) => !cities.find((c) => c.name === city.name)
  )

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary font-nastaliq rtl">
          شہروں کے اوقات
        </h3>
        {cities.length < maxCities && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary 
                       rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="font-nastaliq">شہر شامل کریں</span>
          </button>
        )}
      </div>

      <div className={`flex gap-4 overflow-x-auto pb-4 scrollbar-hide ${compact ? '' : 'flex-wrap'}`}> 
        <AnimatePresence>
          {cities.map((city) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4
                         ${compact ? 'w-40' : 'w-48'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{city.flag}</span>
                  <span className="font-medium text-sm">{city.name}</span>
                </div>
                {cities.length > 1 && (
                  <button
                    onClick={() => removeCity(city.name)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              {showAnalog && !compact && (
                <div className="flex justify-center mb-3">
                  <Hourglass
                    timezone={city.timezone}
                    size={120}
                    showLabel={false}
                  />
                </div>
              )}

              <div className="text-center">
                <p className="font-mono text-2xl text-primary font-bold">
                  {currentTimes[city.name] || '--:--:--'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{city.country}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="شہر شامل کریں"
      >
        <div className="max-h-80 overflow-y-auto">
          {availableCities.length === 0 ? (
            <p className="text-gray-500 text-center py-4 font-nastaliq rtl">
              تمام شہر پہلے سے شامل ہیں
            </p>
          ) : (
            <div className="space-y-1">
              {availableCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => addCity(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light 
                             rounded-lg transition-colors text-left"
                >
                  <span className="text-xl">{city.flag}</span>
                  <div>
                    <p className="font-medium">{city.name}</p>
                    <p className="text-sm text-gray-500">{city.country}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}