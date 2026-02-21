'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Plus, X, Calendar, Clock } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { CityDropdown } from '@/components/CityDropdown'
import { AnalogClock } from '@/components/AnalogClock'
import { DigitalClock } from '@/components/DigitalClock'
import { Spinner } from '@/components/ui/Spinner'
import { Modal } from '@/components/ui/Modal'
import { useCity } from '@/lib/context/CityContext'
import { getPrayerTimes, PrayerTimes as PrayerTimesType, HijriDate } from '@/lib/prayerApi'
import { City, allCities, defaultCity } from '@/lib/cities'
import { formatInTimeZone } from 'date-fns-tz'

const ChandModel = dynamic(() => import('@/components/models/ChandModel').then(mod => mod.ChandModel), {
  ssr: false,
  loading: () => (
    <div className="canvas-container flex items-center justify-center bg-primary-light/50 rounded-2xl">
      <Spinner size="lg" />
    </div>
  ),
})

const sehriDua = {
  arabic: 'وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
  urdu: 'میں نے ماہ رمضان کے کل کے روزے کی نیت کی',
  transliteration: 'Wa bisawmi ghadin nawaitu min shahri ramadan',
}

const iftarDua = {
  arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
  urdu: 'اے اللہ! میں نے تیرے لیے روزہ رکھا اور تیرے رزق سے افطار کیا',
  transliteration: 'Allahumma laka sumtu wa ala rizqika aftartu',
}

const preloadedCities = ['Lahore', 'Karachi', 'Dubai', 'London', 'New York', 'Toronto']

interface CityTiming {
  city: City
  sehriTime: string
  iftarTime: string
  currentTime: string
}

export default function RamadanPage() {
  const { selectedCity } = useCity()
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null)
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [countdownTarget, setCountdownTarget] = useState<'sehri' | 'iftar'>('iftar')
  const [showSehriDua, setShowSehriDua] = useState(false)
  const [showIftarDua, setShowIftarDua] = useState(false)
  const [multiCityTimings, setMultiCityTimings] = useState<CityTiming[]>([])
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false)

  // Fetch prayer times for main city
  useEffect(() => {
    async function fetchPrayers() {
      setLoading(true)
      try {
        const data = await getPrayerTimes(selectedCity.name, selectedCity.country, selectedCity.countryCode)
        setPrayerTimes(data.data.timings)
        setHijriDate(data.data.date.hijri)
      } catch (error) {
        console.error('Failed to fetch prayer times:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrayers()
  }, [selectedCity])

  // Initialize multi-city timings
  useEffect(() => {
    async function initMultiCity() {
      const timings: CityTiming[] = []
      for (const cityName of preloadedCities) {
        const city = allCities.find(c => c.name === cityName)
        if (city) {
          try {
            const data = await getPrayerTimes(city.name, city.country, city.countryCode)
            timings.push({
              city,
              sehriTime: data.data.timings.Imsak,
              iftarTime: data.data.timings.Maghrib,
              currentTime: formatInTimeZone(new Date(), city.timezone, 'HH:mm:ss'),
            })
          } catch {
            // Skip failed cities
          }
        }
      }
      setMultiCityTimings(timings)
    }
    initMultiCity()
  }, [])

  // Update countdown and contextual duas
  useEffect(() => {
    if (!prayerTimes) return

    const updateCountdown = () => {
      const now = new Date()
      try {
        const currentTimeStr = formatInTimeZone(now, selectedCity.timezone, 'HH:mm:ss')
        const [currentHour, currentMin, currentSec] = currentTimeStr.split(':').map(Number)
        const currentTotalSeconds = currentHour * 3600 + currentMin * 60 + currentSec

        const [sehriHour, sehriMin] = prayerTimes.Imsak.split(':').map(Number)
        const sehriTotalSeconds = sehriHour * 3600 + sehriMin * 60

        const [iftarHour, iftarMin] = prayerTimes.Maghrib.split(':').map(Number)
        const iftarTotalSeconds = iftarHour * 3600 + iftarMin * 60

        let diffSeconds: number
        let target: 'sehri' | 'iftar'

        if (currentTotalSeconds < sehriTotalSeconds) {
          diffSeconds = sehriTotalSeconds - currentTotalSeconds
          target = 'sehri'
        } else if (currentTotalSeconds < iftarTotalSeconds) {
          diffSeconds = iftarTotalSeconds - currentTotalSeconds
          target = 'iftar'
        } else {
          diffSeconds = (24 * 3600 - currentTotalSeconds) + sehriTotalSeconds
          target = 'sehri'
        }

        setCountdownTarget(target)
        setCountdown({
          hours: Math.floor(diffSeconds / 3600),
          minutes: Math.floor((diffSeconds % 3600) / 60),
          seconds: diffSeconds % 60,
        })

        // Show contextual duas (within 15 minutes)
        const sehriDiff = Math.abs(currentTotalSeconds - sehriTotalSeconds)
        const iftarDiff = Math.abs(currentTotalSeconds - iftarTotalSeconds)

        setShowSehriDua(sehriDiff <= 15 * 60 && currentTotalSeconds <= sehriTotalSeconds)
        setShowIftarDua(iftarDiff <= 15 * 60 && currentTotalSeconds <= iftarTotalSeconds)
      } catch {
        // Handle error silently
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [prayerTimes, selectedCity.timezone])

  // Update multi-city times
  useEffect(() => {
    const interval = setInterval(() => {
      setMultiCityTimings(prev => prev.map(timing => ({
        ...timing,
        currentTime: formatInTimeZone(new Date(), timing.city.timezone, 'HH:mm:ss'),
      })))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const addCity = async (city: City) => {
    if (multiCityTimings.find(t => t.city.name === city.name)) return
    if (multiCityTimings.length >= 6) return

    try {
      const data = await getPrayerTimes(city.name, city.country, city.countryCode)
      setMultiCityTimings([...multiCityTimings, {
        city,
        sehriTime: data.data.timings.Imsak,
        iftarTime: data.data.timings.Maghrib,
        currentTime: formatInTimeZone(new Date(), city.timezone, 'HH:mm:ss'),
      }])
    } catch (error) {
      console.error('Failed to add city:', error)
    }
    setIsAddCityModalOpen(false)
  }

  const removeCity = (cityName: string) => {
    setMultiCityTimings(multiCityTimings.filter(t => t.city.name !== cityName))
  }

  const getRamadanDay = () => {
    if (hijriDate?.month.number === 9) {
      return parseInt(hijriDate.day)
    }
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white">
      <SectionMenu />

      {/* Top Bar with City Dropdown */}
      <div className="fixed top-4 right-4 z-40">
        <CityDropdown />
      </div>

      {/* Ramadan Banner */}
      <div className="pt-16 pb-4 text-center ramadan-shimmer">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gold/20 backdrop-blur-sm py-2 px-4 inline-block rounded-full"
        >
          <span className="text-gold font-amiri text-lg">رَمَضَانُ الْمُبَارَكُ</span>
        </motion.div>
      </div>

      <div className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left - Model */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl" />
                <ChandModel className="relative z-10" />
              </motion.div>

              {/* Right - Info */}
              <div className="text-center lg:text-right">
                <h1 className="text-5xl font-amiri text-gold mb-4">رمضان المبارک</h1>
                <h2 className="text-3xl font-nastaliq font-bold mb-6 rtl">مبارک ہو</h2>

                {hijriDate && (
                  <div className="flex flex-wrap justify-center lg:justify-end gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gold" />
                      <span className="font-nastaliq rtl">
                        {hijriDate.day} {hijriDate.month.ar} {hijriDate.year}
                      </span>
                    </div>
                    {getRamadanDay() && (
                      <div className="bg-gold/20 backdrop-blur-sm rounded-xl px-6 py-3">
                        <span className="font-nastaliq rtl">رمضان کا دن {getRamadanDay()} / 30</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-white/70 font-nastaliq rtl text-lg">
                  {selectedCity.flag} {selectedCity.name}, {selectedCity.country}
                </p>
              </div>
            </div>
          </section>

          {/* Main Countdown */}
          <section className="py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                {countdownTarget === 'sehri' ? (
                  <Moon className="w-8 h-8 text-gold" />
                ) : (
                  <Sun className="w-8 h-8 text-gold" />
                )}
                <h3 className="text-2xl font-nastaliq rtl">
                  {countdownTarget === 'sehri' ? 'سحری تک باقی وقت' : 'افطار تک باقی وقت'}
                </h3>
              </div>

              <div className="flex justify-center gap-4 md:gap-8">
                {[
                  { value: countdown.hours, label: 'گھنٹے' },
                  { value: countdown.minutes, label: 'منٹ' },
                  { value: countdown.seconds, label: 'سیکنڈ' },
                ].map((item, index) => (
                  <div key={item.label} className="text-center">
                    <motion.div
                      key={item.value}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-5xl md:text-7xl font-mono font-bold text-gold"
                    >
                      {item.value.toString().padStart(2, '0')}
                    </motion.div>
                    <p className="text-sm text-white/60 font-nastaliq mt-2">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Sehri/Iftar Times */}
              {prayerTimes && (
                <div className="flex justify-center gap-8 mt-8">
                  <div className="text-center">
                    <p className="text-white/60 font-nastaliq text-sm">سحری</p>
                    <p className="text-2xl font-mono">{prayerTimes.Imsak}</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <p className="text-white/60 font-nastaliq text-sm">افطار</p>
                    <p className="text-2xl font-mono">{prayerTimes.Maghrib}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </section>

          {/* Clocks Section */}
          <section className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="bg-white rounded-full p-4 shadow-2xl">
                  <AnalogClock
                    timezone={selectedCity.timezone}
                    size={220}
                    showLabel={true}
                    cityName={selectedCity.name}
                  />
                </div>
              </div>
              <DigitalClock
                timezone={selectedCity.timezone}
                showDate={true}
                cityName={selectedCity.name}
                size="lg"
                className="[&_*]:text-white [&_.text-primary]:text-gold"
              />
            </div>
          </section>

          {/* Multi-City Panel */}
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-nastaliq font-bold rtl">شہروں کے اوقات</h3>
              {multiCityTimings.length < 6 && (
                <button
                  onClick={() => setIsAddCityModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-nastaliq">شہر شامل کریں</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {multiCityTimings.map((timing) => (
                  <motion.div
                    key={timing.city.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{timing.city.flag}</span>
                        <div>
                          <p className="font-medium">{timing.city.name}</p>
                          <p className="text-xs text-white/60">{timing.city.country}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCity(timing.city.name)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-center mb-4">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <AnalogClock
                          timezone={timing.city.timezone}
                          size={100}
                          showLabel={false}
                        />
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <p className="text-2xl font-mono font-bold text-gold">
                        {timing.currentTime}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/60 font-nastaliq">سحری</p>
                        <p className="font-mono">{timing.sehriTime}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/60 font-nastaliq">افطار</p>
                        <p className="font-mono">{timing.iftarTime}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Contextual Duas */}
          <AnimatePresence>
            {showSehriDua && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-8"
              >
                <div className="bg-gold/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-gold/30">
                  <h3 className="text-xl font-nastaliq text-gold mb-4 rtl">سحری کی دعا</h3>
                  <p className="text-3xl font-amiri text-gold leading-loose mb-4">
                    {sehriDua.arabic}
                  </p>
                  <p className="font-nastaliq text-lg rtl mb-2">{sehriDua.urdu}</p>
                  <p className="text-sm text-white/60">{sehriDua.transliteration}</p>
                </div>
              </motion.section>
            )}

            {showIftarDua && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-8"
              >
                <div className="bg-gold/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-gold/30">
                  <h3 className="text-xl font-nastaliq text-gold mb-4 rtl">افطار کی دعا</h3>
                  <p className="text-3xl font-amiri text-gold leading-loose mb-4">
                    {iftarDua.arabic}
                  </p>
                  <p className="font-nastaliq text-lg rtl mb-2">{iftarDua.urdu}</p>
                  <p className="text-sm text-white/60">{iftarDua.transliteration}</p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Static Duas (always visible) */}
          <section className="py-8">
            <h3 className="text-2xl font-nastaliq font-bold text-center mb-8 rtl">رمضان کی دعائیں</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-nastaliq text-gold mb-4 rtl">سحری کی دعا</h4>
                <p className="text-2xl font-amiri text-center leading-loose mb-3">
                  {sehriDua.arabic}
                </p>
                <p className="font-nastaliq text-center rtl">{sehriDua.urdu}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-nastaliq text-gold mb-4 rtl">افطار کی دعا</h4>
                <p className="text-2xl font-amiri text-center leading-loose mb-3">
                  {iftarDua.arabic}
                </p>
                <p className="font-nastaliq text-center rtl">{iftarDua.urdu}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add City Modal */}
      <Modal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        title="شہر شامل کریں"
      >
        <div className="max-h-80 overflow-y-auto">
          {allCities
            .filter(city => !multiCityTimings.find(t => t.city.name === city.name))
            .map((city) => (
              <button
                key={city.name}
                onClick={() => addCity(city)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light 
                           rounded-lg transition-colors text-left text-gray-800"
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
      </Modal>
    </main>
  )
}
