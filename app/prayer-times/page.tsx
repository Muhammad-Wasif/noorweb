'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Clock, Sun, Sunrise, Sunset, Moon, Star, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { CityDropdown } from '@/components/CityDropdown'
import { AnalogClock } from '@/components/AnalogClock'
import { DigitalClock, CountdownClock } from '@/components/DigitalClock'
import { MultiCityClocks } from '@/components/MultiCityClocks'
import { Spinner } from '@/components/ui/Spinner'
import { useCity } from '@/lib/context/CityContext'
import { getPrayerTimes, getNextPrayer, PrayerTimes as PrayerTimesType, HijriDate } from '@/lib/prayerApi'
import { defaultCity } from '@/lib/cities'

const NamazModel = dynamic(() => import('@/components/models/NamazModel').then(mod => mod.NamazModel), {
  ssr: false,
  loading: () => (
    <div className="canvas-container flex items-center justify-center bg-primary-light/50 rounded-2xl">
      <Spinner size="lg" />
    </div>
  ),
})

const prayerInfo = [
  { key: 'Fajr', name: 'فجر', icon: Moon, color: 'from-indigo-500 to-purple-600' },
  { key: 'Sunrise', name: 'طلوعِ آفتاب', icon: Sunrise, color: 'from-orange-400 to-yellow-500' },
  { key: 'Dhuhr', name: 'ظہر', icon: Sun, color: 'from-yellow-400 to-orange-500' },
  { key: 'Asr', name: 'عصر', icon: Sun, color: 'from-orange-500 to-red-500' },
  { key: 'Maghrib', name: 'مغرب', icon: Sunset, color: 'from-red-500 to-purple-600' },
  { key: 'Isha', name: 'عشاء', icon: Star, color: 'from-purple-600 to-indigo-800' },
]

const namazAyaat = [
  {
    arabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
    urdu: 'اور نماز قائم کرو اور زکوٰۃ دو اور رکوع کرنے والوں کے ساتھ رکوع کرو',
    reference: 'سورۃ البقرۃ 2:43',
  },
  {
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    urdu: 'بے شک نماز مومنوں پر مقررہ وقت پر فرض ہے',
    reference: 'سورۃ النساء 4:103',
  },
  {
    arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
    urdu: 'نمازوں کی حفاظت کرو، خصوصاً درمیانی نماز کی، اور اللہ کے لیے ادب سے کھڑے رہو',
    reference: 'سورۃ البقرۃ 2:238',
  },
  {
    arabic: 'وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ',
    urdu: 'اور نماز قائم کرو دن کے دونوں کناروں پر اور رات کے کچھ حصوں میں',
    reference: 'سورۃ ہود 11:114',
  },
]

const namazHadith = [
  {
    arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ',
    urdu: 'نماز دین کا ستون ہے',
    narrator: 'مسند احمد',
  },
  {
    arabic: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلَاةُ',
    urdu: 'قیامت کے دن بندے سے سب سے پہلے نماز کا حساب لیا جائے گا',
    narrator: 'سنن ترمذی',
  },
  {
    arabic: 'بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلَاةِ',
    urdu: 'آدمی اور شرک و کفر کے درمیان نماز چھوڑنا ہے',
    narrator: 'صحیح مسلم',
  },
]

const namazSteps = [
  { title: 'نیت', description: 'دل میں نماز کی نیت کریں' },
  { title: 'تکبیر تحریمہ', description: 'اللہ اکبر کہتے ہوئے ہاتھ اٹھائیں' },
  { title: 'قیام', description: 'ثنا، تعوذ، تسمیہ اور قرآن پڑھیں' },
  { title: 'رکوع', description: 'جھک کر سبحان ربی العظیم پڑھیں' },
  { title: 'قومہ', description: 'سیدھے کھڑے ہوں اور سمع اللہ لمن حمدہ کہیں' },
  { title: 'سجدہ', description: 'سجدے میں سبحان ربی الاعلیٰ پڑھیں' },
  { title: 'جلسہ', description: 'دو سجدوں کے درمیان بیٹھیں' },
  { title: 'قعدہ', description: 'التحیات اور درود شریف پڑھیں' },
  { title: 'سلام', description: 'السلام علیکم ورحمۃ اللہ کہہ کر سلام پھیریں' },
]

export default function PrayerTimesPage() {
  const { selectedCity } = useCity()
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null)
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)
  const [gregorianDate, setGregorianDate] = useState<string>('')
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; urduName: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    async function fetchPrayers() {
      setLoading(true)
      try {
        const data = await getPrayerTimes(selectedCity.name, selectedCity.country, selectedCity.countryCode)
        setPrayerTimes(data.data.timings)
        setHijriDate(data.data.date.hijri)
        setGregorianDate(data.data.date.readable)
      } catch (error) {
        console.error('Failed to fetch prayer times:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrayers()
  }, [selectedCity])

  useEffect(() => {
    if (!prayerTimes) return

    const updateNextPrayer = () => {
      const next = getNextPrayer(prayerTimes, new Date())
      setNextPrayer(next)
    }

    updateNextPrayer()
    const interval = setInterval(updateNextPrayer, 1000)
    return () => clearInterval(interval)
  }, [prayerTimes])

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />

      {/* Top Bar with City Dropdown */}
      <div className="fixed top-4 right-4 z-40">
        <CityDropdown />
      </div>

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-amiri text-gold mb-2">اوقاتِ الصلاة</h1>
            <h2 className="text-3xl font-nastaliq font-bold text-primary rtl">نماز کے اوقات</h2>
            <p className="text-gray-500 mt-2">
              {selectedCity.flag} {selectedCity.name}, {selectedCity.country}
            </p>
          </div>

          {/* Date Display */}
          {hijriDate && (
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-nastaliq rtl">
                  {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} ہجری
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm">
                {gregorianDate}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Prayer Cards */}
            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : prayerTimes ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {prayerInfo.map((prayer) => {
                    const Icon = prayer.icon
                    const time = prayerTimes[prayer.key as keyof PrayerTimesType]
                    const isNext = nextPrayer?.name === prayer.key

                    return (
                      <motion.div
                        key={prayer.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg
                                   ${isNext ? 'glow-border ring-2 ring-primary' : ''}`}
                      >
                        {isNext && (
                          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-nastaliq">
                            آنے والی
                          </span>
                        )}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${prayer.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-lg font-nastaliq font-bold text-gray-800 dark:text-gray-200 rtl">
                          {prayer.name}
                        </p>
                        <p className="text-2xl font-mono font-bold text-primary">
                          {time}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">Failed to load prayer times</p>
              )}

              {/* Countdown to Next Prayer */}
              {nextPrayer && (
                <div className="mt-8">
                  <CountdownClock
                    targetTime={nextPrayer.time}
                    timezone={selectedCity.timezone}
                    label={`${nextPrayer.urduName} تک باقی وقت`}
                  />
                </div>
              )}
            </div>

            {/* 3D Model and Clocks */}
            <div className="space-y-8">
              <NamazModel />

              {/* Clocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center">
                  <AnalogClock
                    timezone={selectedCity.timezone}
                    size={200}
                    showLabel={true}
                    cityName={selectedCity.name}
                  />
                </div>
                <DigitalClock
                  timezone={selectedCity.timezone}
                  showDate={true}
                  cityName={selectedCity.name}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Multi-City Clocks */}
          <div className="mb-12">
            <MultiCityClocks
              initialCities={[selectedCity, defaultCity]}
              maxCities={6}
            />
          </div>

          {/* Namaz Related Content */}
          <section className="py-12 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-nastaliq font-bold text-primary text-center mb-8 rtl">
              نماز کی فضیلت - قرآن سے
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {namazAyaat.map((ayah, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-r-4 border-gold"
                >
                  <p className="text-xl font-amiri text-gray-800 dark:text-gray-200 leading-loose rtl mb-4">
                    {ayah.arabic}
                  </p>
                  <p className="font-nastaliq text-gray-600 dark:text-gray-400 rtl mb-2">
                    {ayah.urdu}
                  </p>
                  <p className="text-sm text-gold">{ayah.reference}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Hadith Section */}
          <section className="py-12 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-nastaliq font-bold text-primary text-center mb-8 rtl">
              نماز کی فضیلت - احادیث سے
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {namazHadith.map((hadith, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-primary-light/50 dark:bg-gray-800 rounded-2xl p-6 text-center"
                >
                  <p className="text-xl font-amiri text-primary mb-3">{hadith.arabic}</p>
                  <p className="font-nastaliq text-gray-700 dark:text-gray-300 rtl mb-3">
                    {hadith.urdu}
                  </p>
                  <p className="text-sm text-gray-500">{hadith.narrator}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Namaz Guide */}
          <section className="py-12 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-2xl font-nastaliq font-bold text-primary rtl">
                نماز کا صحیح طریقہ
              </h3>
              {showGuide ? (
                <ChevronUp className="w-6 h-6 text-primary" />
              ) : (
                <ChevronDown className="w-6 h-6 text-primary" />
              )}
            </button>

            {showGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {namazSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <h4 className="text-lg font-nastaliq font-bold text-primary rtl">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-nastaliq rtl text-sm">
                      {step.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </section>

          {/* Common Mistakes */}
          <section className="py-12 pb-20 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-nastaliq font-bold text-primary text-center mb-8 rtl">
              نماز میں عام غلطیاں
            </h3>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
              <ul className="space-y-3 font-nastaliq rtl">
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>نماز میں جلدی کرنا اور رکوع و سجدہ میں اطمینان نہ ہونا</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>صف میں درمیان خالی جگہ چھوڑنا</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>امام سے پہلے رکوع و سجدہ میں جانا</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>نماز میں ادھر ادھر دیکھنا</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>سجدے میں کہنیاں زمین پر ٹکانا</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
