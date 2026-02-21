'use client'

import { useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, BookOpen, Moon, Clock, BookMarked, Star, Box, Navigation, HeartHandshake, Calculator, CircleDot } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { Spinner } from '@/components/ui/Spinner'

const QuranModel = dynamic(() => import('@/components/models/QuranModel').then(mod => mod.QuranModel), {
  ssr: false,
  loading: () => <ModelPlaceholder />,
})
const ChandModel = dynamic(() => import('@/components/models/ChandModel').then(mod => mod.ChandModel), {
  ssr: false,
  loading: () => <ModelPlaceholder />,
})
const NamazModel = dynamic(() => import('@/components/models/NamazModel').then(mod => mod.NamazModel), {
  ssr: false,
  loading: () => <ModelPlaceholder />,
})
const AllahNamesModel = dynamic(() => import('@/components/models/AllahNamesModel').then(mod => mod.AllahNamesModel), {
  ssr: false,
  loading: () => <ModelPlaceholder />,
})
const TasbeehModel = dynamic(() => import('@/components/models/TasbeehModel').then(mod => mod.TasbeehModel), {
  ssr: false,
  loading: () => <ModelPlaceholder />,
})

function ModelPlaceholder() {
  return (
    <div className="w-full h-[280px] flex items-center justify-center bg-primary/5 rounded-2xl">
      <Spinner size="lg" />
    </div>
  )
}

function IllustrationPlaceholder({ icon: Icon, color = 'primary' }: { icon: any; color?: string }) {
  const bgClass = color === 'gold' ? 'bg-gold/10' : 'bg-primary/10'
  const iconBgClass = color === 'gold' ? 'bg-gold/20' : 'bg-primary/20'
  const iconColorClass = color === 'gold' ? 'text-gold' : 'text-primary'
  
  return (
    <div className={`w-full h-[280px] flex items-center justify-center ${bgClass} rounded-2xl`}>
      <div className={`w-32 h-32 ${iconBgClass} rounded-full flex items-center justify-center`}>
        <Icon className={`w-16 h-16 ${iconColorClass}`} />
      </div>
    </div>
  )
}

const sections = [
  {
    number: '01',
    titleEn: 'Holy Quran',
    titleUr: 'قرآن مجید',
    descEn: 'Complete Holy Quran with Arabic text, Urdu translation, recitation and tafseer',
    descUr: 'مکمل قرآن پاک عربی متن، اردو ترجمہ، تلاوت اور تفسیر کے ساتھ',
    featuresEn: ['All 114 Surahs', 'Urdu & English translation', 'Audio recitation', 'Bookmarks & notes'],
    featuresUr: ['تمام 114 سورتیں', 'اردو اور انگریزی ترجمہ', 'آڈیو تلاوت', 'بُک مارک اور نوٹس'],
    route: '/quran',
    model: 'quran',
  },
  {
    number: '02',
    titleEn: 'Ramadan',
    titleUr: 'رمضان المبارک',
    descEn: 'Sehri and Iftar times, countdown timers and special duas',
    descUr: 'سحری اور افطار کے اوقات، کاؤنٹ ڈاؤن اور دعائیں',
    featuresEn: ['Sehri & Iftar timer', 'Multiple city timings', 'Special duas', 'Ramadan calendar'],
    featuresUr: ['سحری و افطار ٹائمر', 'متعدد شہروں کے اوقات', 'خصوصی دعائیں', 'رمضان کیلنڈر'],
    route: '/ramadan',
    model: 'chand',
  },
  {
    number: '03',
    titleEn: 'Prayer Times',
    titleUr: 'اوقاتِ نماز',
    descEn: 'Accurate prayer times for all five daily prayers with prayer guide',
    descUr: 'پانچ وقت کی نماز کے درست اوقات اور نماز کا مکمل طریقہ',
    featuresEn: ['Live prayer times', 'Next prayer alarm', 'Prayer method guide', 'Common mistakes'],
    featuresUr: ['لائیو نماز ٹائمز', 'اگلی نماز کا الارم', 'نماز کا طریقہ', 'عام غلطیاں'],
    route: '/prayer-times',
    model: 'namaz',
  },
  {
    number: '04',
    titleEn: 'Hadith',
    titleUr: 'احادیث مبارکہ',
    descEn: 'Collection of authentic Hadith from Bukhari, Muslim, Tirmidhi and more',
    descUr: 'صحیح احادیث کا مجموعہ - بخاری، مسلم، ترمذی اور دیگر',
    featuresEn: ['Sahih Bukhari', 'Sahih Muslim', 'Jami Tirmidhi', 'Search feature'],
    featuresUr: ['صحیح بخاری', 'صحیح مسلم', 'جامع ترمذی', 'تلاش کی سہولت'],
    route: '/hadith',
    model: 'illustration',
    icon: BookMarked,
  },
  {
    number: '05',
    titleEn: '99 Names of Allah',
    titleUr: 'اسماء الحسنٰی',
    descEn: 'Beautiful names of Allah with meanings and virtues',
    descUr: 'اللہ کے حسین ناموں کا مجموعہ، معانی اور فضائل کے ساتھ',
    featuresEn: ['99 beautiful names', 'English meanings', 'Audio pronunciation', 'Memorization aid'],
    featuresUr: ['99 خوبصورت نام', 'اردو معانی', 'آڈیو تلفظ', 'یاد کرنے کی سہولت'],
    route: '/99-names',
    model: 'allahnames',
  },
  {
    number: '06',
    titleEn: '3D Kaaba',
    titleUr: 'خانہ کعبہ 3D',
    descEn: '3D model of Kaaba with detailed information',
    descUr: 'خانہ کعبہ کا تھری ڈی ماڈل - تفصیلی معلومات کے ساتھ',
    featuresEn: ['3D interactive model', 'Hajar e Aswad', 'Maqam Ibrahim', 'Historical info'],
    featuresUr: ['3D انٹرایکٹو ماڈل', 'حجرِ اسود', 'مقامِ ابراہیم', 'تاریخی معلومات'],
    route: '/kaaba-3d',
    model: 'illustration',
    icon: Box,
  },
  {
    number: '07',
    titleEn: 'Qibla Finder',
    titleUr: 'قبلہ نما',
    descEn: 'Find Qibla direction using your phone',
    descUr: 'اپنے موبائل سے قبلے کی سمت معلوم کریں',
    featuresEn: ['Compass view', 'GPS location', 'Distance to Makkah', 'Accurate direction'],
    featuresUr: ['کمپاس نما', 'GPS لوکیشن', 'مکہ سے فاصلہ', 'درست سمت'],
    route: '/qibla',
    model: 'illustration',
    icon: Navigation,
  },
  {
    number: '08',
    titleEn: 'Daily Duas',
    titleUr: 'روزمرہ کی دعائیں',
    descEn: 'Daily masnoon duas with Arabic text and translation',
    descUr: 'روزمرہ کی مسنون دعائیں - عربی متن اور اردو ترجمہ',
    featuresEn: ['Morning & evening duas', 'Food duas', 'Travel duas', 'Audio facility'],
    featuresUr: ['صبح و شام کی دعائیں', 'کھانے کی دعائیں', 'سفر کی دعائیں', 'آڈیو سہولت'],
    route: '/duas',
    model: 'illustration',
    icon: HeartHandshake,
  },
  {
    number: '09',
    titleEn: 'Zakat Calculator',
    titleUr: 'زکوٰۃ کیلکولیٹر',
    descEn: 'Calculate your Zakat - gold, silver, cash and investments',
    descUr: 'اپنی زکوٰۃ کا حساب کریں - سونا، چاندی، نقد اور سرمایہ',
    featuresEn: ['Easy calculator', 'Nisab details', 'Gold/silver prices', 'Fiqh guidance'],
    featuresUr: ['آسان کیلکولیٹر', 'نصاب کی تفصیل', 'سونے چاندی کی قیمت', 'فقہی رہنمائی'],
    route: '/zakat',
    model: 'illustration',
    icon: Calculator,
  },
  {
    number: '10',
    titleEn: 'Digital Tasbeeh',
    titleUr: 'ڈیجیٹل تسبیح',
    descEn: 'Digital tasbeeh counter for dhikr and durood',
    descUr: 'ڈیجیٹل تسبیح کاؤنٹر - اذکار اور درود شریف',
    featuresEn: ['Easy counter', 'Multiple adhkar', 'Target setting', 'Progress tracking'],
    featuresUr: ['آسان کاؤنٹر', 'مختلف اذکار', 'ٹارگٹ سیٹنگ', 'پروگریس ٹریکنگ'],
    route: '/tasbeeh',
    model: 'tasbeeh',
  },
]

function SectionPanel({ section, index, isUrdu }: { section: typeof sections[0]; index: number; isUrdu: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isEven = index % 2 === 0

  const renderModel = () => {
    switch (section.model) {
      case 'quran':
        return <QuranModel className="w-full h-[280px]" />
      case 'chand':
        return <ChandModel className="w-full h-[280px]" />
      case 'namaz':
        return <NamazModel className="w-full h-[280px]" />
      case 'allahnames':
        return <AllahNamesModel className="w-full h-[280px]" />
      case 'tasbeeh':
        return <TasbeehModel className="w-full h-[280px]" />
      default:
        return <IllustrationPlaceholder icon={section.icon || BookOpen} />
    }
  }

  return (
    <section
      ref={ref}
      className={`py-16 px-4 md:px-8 lg:px-16
                  ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-primary-light/30 dark:bg-gray-800/50'}`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={isEven ? 'lg:order-1' : 'lg:order-2'}
          >
            {/* Number Badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-4xl font-bold text-gold">{section.number}</span>
              <div className="w-12 h-0.5 bg-gold" />
            </div>

            {/* Title */}
            <h2 className={`text-2xl md:text-3xl font-bold text-primary mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? section.titleUr : section.titleEn}
            </h2>

            {/* Description */}
            <p className={`text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? section.descUr : section.descEn}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {(isUrdu ? section.featuresUr : section.featuresEn).map((feature, i) => (
                <li key={i} className={`flex items-center gap-3 ${isUrdu ? 'rtl' : ''}`}>
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className={`text-gray-700 dark:text-gray-300 text-sm ${isUrdu ? 'font-nastaliq' : ''}`}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link href={section.route} className="btn-primary inline-flex items-center gap-2 group">
              <span className={isUrdu ? 'font-nastaliq' : ''}>{isUrdu ? 'ابھی دیکھیں' : 'View Now'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={isEven ? 'lg:order-2' : 'lg:order-1'}
          >
            <Link href={section.route} className="block group relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl 
                            group-hover:shadow-primary/30 transition-all duration-300
                            group-hover:scale-[1.02]">
                {renderModel()}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 
                               transition-colors duration-300 flex items-center justify-center">
                  <span className={`opacity-0 group-hover:opacity-100 transition-opacity
                                  bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full
                                  text-primary shadow-lg ${isUrdu ? 'font-nastaliq' : ''}`}>
                    {isUrdu ? 'کلک کریں' : 'Click to view'}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function ExplorePage() {
  const { lang } = useLanguage()
  const isUrdu = lang === 'ur'

  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 
                      backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-amiri">ن</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">NoorWeb</span>
          </Link>
          <Link href="/" className={`btn-outline py-2 px-4 text-sm ${isUrdu ? 'font-nastaliq' : ''}`}>
            {isUrdu ? 'گھر جائیں' : 'Go Home'}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-amiri text-gold mb-4">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </h1>
            <h2 className={`text-2xl md:text-4xl font-bold mb-6 ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'سیکشن ایکسپلورر' : 'Section Explorer'}
            </h2>
            <p className={`text-base md:text-lg text-white/80 max-w-2xl mx-auto ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'تمام سیکشنز کو دریافت کریں اور اپنا اسلامی سفر شروع کریں' : 'Explore all sections and start your Islamic journey'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Panels */}
      {sections.map((section, index) => (
        <SectionPanel key={section.number} section={section} index={index} isUrdu={isUrdu} />
      ))}

      {/* Final CTA */}
      <section className="py-16 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center px-4"
        >
          <h2 className={`text-2xl md:text-4xl font-bold mb-6 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
            {isUrdu ? 'تیار ہیں؟ شروع کریں' : 'Ready? Get Started'}
          </h2>
          <p className={`text-base text-white/80 mb-8 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
            {isUrdu ? 'اپنا اسلامی سفر ابھی شروع کریں' : 'Start your Islamic journey now'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quran" className={`btn-gold ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'قرآن پڑھیں' : 'Read Quran'}
            </Link>
            <Link href="/" className={`bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-colors ${isUrdu ? 'font-nastaliq' : ''}`}>
              {isUrdu ? 'ہوم پیج' : 'Home Page'}
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
