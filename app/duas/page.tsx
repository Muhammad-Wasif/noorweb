'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeartHandshake, ArrowLeft, Sun, Moon, Utensils, Bed } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion } from 'framer-motion'

interface Dua {
  id: string
  category: string
  titleEn: string
  titleUr: string
  arabic: string
  transliteration: string
  translationEn: string
  translationUr: string
  icon: any
}

const duas: Dua[] = [
  {
    id: '1',
    category: 'morning',
    titleEn: 'Morning Supplication',
    titleUr: 'صبح کی دعا',
    arabic: 'اَللّٰهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa ilaykan-nushoor',
    translationEn: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
    translationUr: 'اے اللہ! ہم نے تیری ہی مدد سے صبح کی اور تیری ہی مدد سے شام کی، اور تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے ہم مریں گے اور تیری ہی طرف لوٹ کر جانا ہے۔',
    icon: Sun,
  },
  {
    id: '2',
    category: 'eating',
    titleEn: 'Before Eating',
    titleUr: 'کھانا کھانے سے پہلے کی دعا',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: 'Bismillahi wa \'ala barakatillah',
    translationEn: 'In the name of Allah and with the blessings of Allah I begin (eating).',
    translationUr: 'اللہ کے نام کے ساتھ اور اللہ کی برکت پر (میں کھانا شروع کرتا ہوں)۔',
    icon: Utensils,
  },
  {
    id: '3',
    category: 'sleep',
    titleEn: 'Before Sleeping',
    titleUr: 'سونے سے پہلے کی دعا',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Allahumma bismika amutu wa ahya',
    translationEn: 'O Allah, in Your name I die and I live.',
    translationUr: 'اے اللہ! میں تیرے ہی نام کے ساتھ مرتا ہوں (یعنی سوتا ہوں) اور جیتا ہوں (یعنی جاگتا ہوں)۔',
    icon: Bed,
  },
  {
    id: '4',
    category: 'evening',
    titleEn: 'Evening Supplication',
    titleUr: 'شام کی دعا',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah',
    translationEn: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    translationUr: 'ہم نے شام کی اور شام کے وقت تمام بادشاہی اللہ کے لیے ہے، اور تمام تعریفیں اللہ کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں۔',
    icon: Moon,
  },
]

export default function DuasPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', nameEn: 'All', nameUr: 'سب' },
    { id: 'morning', nameEn: 'Morning', nameUr: 'صبح' },
    { id: 'evening', nameEn: 'Evening', nameUr: 'شام' },
    { id: 'eating', nameEn: 'Eating', nameUr: 'کھانا' },
    { id: 'sleep', nameEn: 'Sleep', nameUr: 'نیند' },
  ]

  const filteredDuas = activeCategory === 'all'
    ? duas
    : duas.filter(dua => dua.category === activeCategory)

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center pt-10">
          <HeartHandshake className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">دعائیں</h1>
          <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary mb-8 rtl">روزمرہ کی دعائیں</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-nastaliq transition-all duration-300 ${activeCategory === cat.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10'
                  }`}
              >
                {cat.nameUr} | {cat.nameEn}
              </button>
            ))}
          </div>

          {/* Duas List */}
          <div className="space-y-6 text-left">
            {filteredDuas.map((dua, index) => {
              const Icon = dua.icon
              return (
                <motion.div
                  key={dua.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-xl border-t-4 border-primary relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-32 h-32" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{dua.titleEn}</h3>
                      <h3 className="text-2xl font-nastaliq text-primary rtl">{dua.titleUr}</h3>
                    </div>

                    <p className="text-2xl md:text-4xl font-amiri text-gold text-center mb-8 leading-loose">
                      {dua.arabic}
                    </p>

                    <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Transliteration</p>
                        <p className="text-gray-600 dark:text-gray-400 italic">{dua.transliteration}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">English</p>
                          <p className="text-gray-700 dark:text-gray-300">{dua.translationEn}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider font-nastaliq rtl">ترجمہ</p>
                          <p className="text-gray-700 dark:text-gray-300 font-nastaliq rtl text-lg leading-relaxed">{dua.translationUr}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
