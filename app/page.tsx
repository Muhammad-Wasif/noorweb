'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Moon, Star, Navigation, Calculator, BookMarked, HeartHandshake, ArrowRight, Play, Box, Calendar, Newspaper, CircleDot, BookHeart } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Spinner } from '@/components/ui/Spinner'
import { useCity } from '@/lib/context/CityContext'
import { useLanguage } from '@/lib/context/LanguageContext'
/* ... previous imports ... */
import { getPrayerTimes, getNextPrayer, formatTimeRemaining, PrayerTimes } from '@/lib/prayerApi'

const features = [
  /* ... features array ... */
  { icon: BookOpen, en: 'Quran', ur: 'قرآن مجید', descEn: 'Complete Holy Quran', descUr: 'مکمل قرآن پاک', href: '/quran', color: 'primary' },
  { icon: Clock, en: 'Prayer Times', ur: 'اوقاتِ نماز', descEn: 'Live Prayer Times', descUr: 'لائیو نماز ٹائمز', href: '/prayer-times', color: 'primary' },
  { icon: Moon, en: 'Ramadan', ur: 'رمضان', descEn: 'Sehri & Iftar', descUr: 'سحری و افطار', href: '/ramadan', color: 'gold' },
  { icon: BookMarked, en: 'Hadith', ur: 'احادیث', descEn: 'Authentic Hadith', descUr: 'صحیح احادیث', href: '/hadith', color: 'primary' },
  { icon: Star, en: '99 Names', ur: 'اسماء الحسنٰی', descEn: 'Asma ul Husna', descUr: 'اللہ کے نام', href: '/99-names', color: 'gold' },
  { icon: Navigation, en: 'Qibla', ur: 'قبلہ نما', descEn: 'Qibla Direction', descUr: 'قبلے کی سمت', href: '/qibla', color: 'primary' },
  { icon: HeartHandshake, en: 'Duas', ur: 'دعائیں', descEn: 'Daily Duas', descUr: 'روزمرہ کی دعائیں', href: '/duas', color: 'primary' },
  { icon: Box, en: '3D Kaaba', ur: 'خانہ کعبہ 3D', descEn: 'Kaaba Model', descUr: 'کعبہ ماڈل', href: '/kaaba-3d', color: 'primary' },
  { icon: Calculator, en: 'Zakat', ur: 'زکوٰۃ', descEn: 'Calculator', descUr: 'کیلکولیٹر', href: '/zakat', color: 'gold' },
  { icon: Calendar, en: 'Calendar', ur: 'اسلامی کیلنڈر', descEn: 'Islamic Calendar', descUr: 'کیلنڈر', href: '/calendar', color: 'primary' },
  { icon: Newspaper, en: 'Blog', ur: 'بلاگ', descEn: 'Islamic Articles', descUr: 'اسلامی مضامین', href: '/blog', color: 'gold' },
  { icon: CircleDot, en: 'Tasbeeh', ur: 'تسبیح', descEn: 'Digital Counter', descUr: 'ڈیجیٹل کاؤنٹر', href: '/tasbeeh', color: 'primary' },
  { icon: BookHeart, en: 'Stories', ur: 'انبیاء کی کہانیاں', descEn: 'Prophet Stories', descUr: 'قصص', href: '/stories', color: 'gold' },
]

const testimonials = [
  { quoteEn: 'This app changed my life', quoteUr: 'اس ایپ نے میری زندگی بدل دی', nameEn: 'Ahmed Ali', nameUr: 'احمد علی', roleEn: 'Student', roleUr: 'طالب علم' },
  { quoteEn: 'Best Islamic app ever', quoteUr: 'بہترین اسلامی ایپ', nameEn: 'Fatima Khan', nameUr: 'فاطمہ خان', roleEn: 'Teacher', roleUr: 'معلمہ' },
  { quoteEn: 'Easy to use and very helpful', quoteUr: 'استعمال میں آسان اور بہت مفید', nameEn: 'Muhammad Umar', nameUr: 'محمد عمر', roleEn: 'Business', roleUr: 'کاروباری' },
]

const dailyAyah = {
  arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  urdu: 'بے شک مشکل کے ساتھ آسانی ہے',
  english: 'Indeed, with hardship comes ease.',
  reference: 'Surah Ash-Sharh 94:6',
  referenceUr: 'سورۃ الشرح ۹۴:۶',
}

const dailyHadith = {
  arabic: 'الدِّينُ النَّصِيحَةُ',
  urdu: 'دین خیرخواہی کا نام ہے',
  english: 'Religion is sincerity.',
  narrator: 'Sahih Muslim',
  narratorUr: 'صحیح مسلم',
}

function PrayerWidget() {
  const { selectedCity } = useCity()
  const { lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; urduName: string } | null>(null)
  const [countdown, setCountdown] = useState('--:--:--')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrayers() {
      try {
        const data = await getPrayerTimes(selectedCity.name, selectedCity.country, selectedCity.countryCode)
        setPrayerTimes(data.data.timings)
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
      if (next) setCountdown(formatTimeRemaining(next.time, new Date()))
    }
    updateNextPrayer()
    const interval = setInterval(updateNextPrayer, 1000)
    return () => clearInterval(interval)
  }, [prayerTimes])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
        <Spinner size="md" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold text-primary ${isUrdu ? 'font-nastaliq' : ''}`}>
          {isUrdu ? 'اگلی نماز' : 'Next Prayer'}
        </h3>
        <span className="text-sm text-gray-500">{selectedCity.flag} {selectedCity.name}</span>
      </div>

      {nextPrayer && (
        <div className="text-center">
          <p className="text-2xl font-bold text-primary mb-1">
            {isUrdu ? nextPrayer.urduName : nextPrayer.name}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{nextPrayer.time}</p>
          <div className="bg-primary-light dark:bg-primary/20 rounded-xl p-4">
            <p className={`text-sm text-gray-500 mb-1 ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'باقی وقت' : 'Time Remaining'}
            </p>
            <p className="text-4xl font-mono font-bold text-primary">{countdown}</p>
          </div>
        </div>
      )}

      <Link href="/prayer-times" className="mt-4 flex items-center justify-center gap-2 text-primary hover:underline">
        <span className={isUrdu ? 'font-nastaliq' : ''}>{isUrdu ? 'مکمل اوقات دیکھیں' : 'View Full Schedule'}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export default function HomePage() {
  const { lang } = useLanguage()
  const isUrdu = lang === 'ur'

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen pt-20 bg-gradient-to-br from-white via-primary-light/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xl md:text-2xl font-amiri text-gold mb-4">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>

              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                {isUrdu ? 'آپ کا مکمل اسلامی ساتھی' : 'Your Complete Islamic Companion'}
              </h1>

              <p className={`text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                {isUrdu
                  ? 'قرآن مجید، اوقاتِ نماز، احادیث، دعائیں اور بہت کچھ - سب ایک جگہ۔ اپنے اسلامی سفر کو آج ہی شروع کریں۔'
                  : 'Quran, Prayer Times, Hadith, Duas and much more - all in one place. Start your Islamic journey today.'}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/explore" className="btn-primary flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span className={isUrdu ? 'font-nastaliq' : ''}>{isUrdu ? 'شروع کریں' : 'Get Started'}</span>
                </Link>
                <Link href="/quran" className="btn-outline flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className={isUrdu ? 'font-nastaliq' : ''}>{isUrdu ? 'قرآن پڑھیں' : 'Read Quran'}</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-primary">114</p>
                  <p className={`text-sm text-gray-600 ${isUrdu ? 'font-nastaliq' : ''}`}>{isUrdu ? 'سورتیں' : 'Surahs'}</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-gold">6236</p>
                  <p className={`text-sm text-gray-600 ${isUrdu ? 'font-nastaliq' : ''}`}>{isUrdu ? 'آیات' : 'Ayahs'}</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className={`text-sm text-gray-600 ${isUrdu ? 'font-nastaliq' : ''}`}>{isUrdu ? 'شہر' : 'Cities'}</p>
                </div>
              </div>
            </motion.div>

            {/* 3D Model / Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.2 },
                x: { duration: 0.8, delay: 0.2 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="relative h-[300px] md:h-[380px] lg:h-[420px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-gold/10 rounded-full blur-3xl opacity-50" />
              <img
                src="/quran-model-nobg.png"
                alt="Holy Quran"
                className="relative z-10 w-full max-w-[400px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Daily Ayah Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-xl mb-6 text-white/80 ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'آج کی آیت' : 'Verse of the Day'}
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-amiri leading-loose mb-4">
              {dailyAyah.arabic}
            </p>
            <p className={`text-lg sm:text-xl text-primary-light mb-2 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? dailyAyah.urdu : dailyAyah.english}
            </p>
            <p className="text-sm text-gold">{isUrdu ? dailyAyah.referenceUr : dailyAyah.reference}</p>
          </motion.div>
        </div>
      </section>

      {/* Daily Hadith Section */}
      <section className="py-16 bg-white dark:bg-gray-900 geometric-bg">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-l-4 border-gold"
          >
            <h2 className={`text-xl mb-6 text-gray-500 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'آج کی حدیث' : 'Hadith of the Day'}
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-amiri text-center text-gray-800 dark:text-gray-200 mb-4">
              {dailyHadith.arabic}
            </p>
            <p className={`text-base sm:text-lg text-center text-primary mb-2 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? dailyHadith.urdu : dailyHadith.english}
            </p>
            <p className="text-center text-gray-500 text-sm">{isUrdu ? dailyHadith.narratorUr : dailyHadith.narrator}</p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-primary-light/30 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold text-primary mb-2 ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'خصوصیات' : 'Features'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.en}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={feature.href} className="block card-hover p-4 sm:p-6 text-center group">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl 
                                   ${feature.color === 'gold' ? 'bg-gold/10' : 'bg-primary/10'}
                                   flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.color === 'gold' ? 'text-gold' : 'text-primary'}`} />
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 ${isUrdu ? 'font-nastaliq' : ''}`}>
                      {isUrdu ? feature.ur : feature.en}
                    </h3>
                    <p className={`text-xs sm:text-sm text-gray-500 ${isUrdu ? 'font-nastaliq' : ''}`}>
                      {isUrdu ? feature.descUr : feature.descEn}
                    </p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Prayer Widget Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold text-primary mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                {isUrdu ? 'اوقاتِ نماز' : 'Prayer Times'}
              </h2>
              <p className={`text-gray-600 dark:text-gray-400 mb-6 leading-relaxed ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                {isUrdu
                  ? 'اپنے شہر کے نماز کے اوقات دیکھیں اور کبھی کوئی نماز نہ چھوڑیں۔ ہماری ایپ آپ کو پانچوں نمازوں کے درست اوقات فراہم کرتی ہے۔'
                  : 'View prayer times for your city and never miss a prayer. Our app provides accurate timings for all five daily prayers.'}
              </p>
              <Link href="/prayer-times" className="btn-primary inline-flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className={isUrdu ? 'font-nastaliq' : ''}>{isUrdu ? 'مکمل اوقات' : 'View Schedule'}</span>
              </Link>
            </div>
            <PrayerWidget />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary-light/30 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold text-primary mb-2 ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'تاثرات' : 'Testimonials'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
              >
                <p className={`text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 text-center ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                  &ldquo;{isUrdu ? testimonial.quoteUr : testimonial.quoteEn}&rdquo;
                </p>
                <div className="text-center">
                  <p className={`font-bold text-gray-800 dark:text-gray-200 ${isUrdu ? 'font-nastaliq' : ''}`}>
                    {isUrdu ? testimonial.nameUr : testimonial.nameEn}
                  </p>
                  <p className={`text-sm text-gray-500 ${isUrdu ? 'font-nastaliq' : ''}`}>
                    {isUrdu ? testimonial.roleUr : testimonial.roleEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'آج ہی اپنا سفر شروع کریں' : 'Start Your Journey Today'}
            </h2>
            <p className={`text-lg text-white/80 mb-8 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'نور ویب کے ساتھ اپنی روحانیت کو مضبوط بنائیں' : 'Strengthen your spirituality with NoorWeb'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className={`bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-colors ${isUrdu ? 'font-nastaliq' : ''}`}>
                {isUrdu ? 'ابھی رجسٹر کریں' : 'Register Now'}
              </Link>
              <Link href="/explore" className={`border-2 border-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors ${isUrdu ? 'font-nastaliq' : ''}`}>
                {isUrdu ? 'مزید دیکھیں' : 'Explore More'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
