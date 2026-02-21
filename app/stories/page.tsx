'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookHeart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion, AnimatePresence } from 'framer-motion'

interface Story {
  id: string
  titleEn: string
  titleUr: string
  summaryEn: string
  summaryUr: string
  contentEn: string
  contentUr: string
}

const stories: Story[] = [
  {
    id: '1',
    titleEn: 'Prophet Adam (AS) - The First Human',
    titleUr: 'حضرت آدم (ع) - پہلے انسان',
    summaryEn: 'The creation of the first human being and his descent to Earth.',
    summaryUr: 'پہلے انسان کی تخلیق اور زمین پر ان کا نزول۔',
    contentEn: 'Allah created Prophet Adam (AS) from clay. He commanded the angels to prostrate to him out of respect, but Iblis (Satan) refused due to arrogance. Adam and his wife Hawa (Eve) were placed in Paradise but were tricked by Satan into eating from the forbidden tree. They repented, and Allah forgave them, sending them to Earth as the first humans and prophets, beginning the story of mankind.',
    contentUr: 'اللہ تعالیٰ نے حضرت آدم علیہ السلام کو مٹی سے پیدا کیا۔ فرشتوں کو سجدہ کرنے کا حکم دیا لیکن ابلیس نے تکبر کے باعث انکار کیا۔ آدم (ع) اور حوا (ع) کو جنت میں رکھا گیا لیکن شیطان کے بہکانے پر انہوں نے ممنوعہ درخت کا پھل کھا لیا۔ انہوں نے توبہ کی جسے اللہ نے قبول فرمایا اور انہیں زمین پر پہلا انسان اور نبی بنا کر بھیجا، جس سے نوع انسانی کا آغاز ہوا۔'
  },
  {
    id: '2',
    titleEn: 'Prophet Nuh (AS) - The Great Flood',
    titleUr: 'حضرت نوح (ع) - عظیم طوفان',
    summaryEn: 'The story of patience, a massive ark, and the great flood.',
    summaryUr: 'صبر، ایک عظیم کشتی، اور زبردست طوفان کی کہانی۔',
    contentEn: 'Prophet Nuh (AS) preached to his people for 950 years, but only a few believed. Allah commanded him to build a massive ark to save the believers and pairs of animals from an impending great flood that would wipe out the disbelievers. Even Nuh\'s own son refused to board the ark and perished. The ark eventually rested on Mount Judi, marking a new beginning for humanity.',
    contentUr: 'حضرت نوح علیہ السلام نے 950 سال تک اپنی قوم کو تبلیغ کی لیکن بہت کم لوگ ایمان لائے۔ اللہ نے انہیں ایک بڑی کشتی بنانے کا حکم دیا تاکہ مومنوں اور جانوروں کے جوڑوں کو آنے والے عظیم طوفان سے بچایا جا سکے۔ یہاں تک کہ نوح (ع) کے اپنے بیٹے نے کشتی پر سوار ہونے سے انکار کر دیا اور غرق ہو گیا۔ آخرکار کشتی کوہ جودی پر رکی اور انسانیت کا نیا آغاز ہوا۔'
  },
  {
    id: '3',
    titleEn: 'Prophet Ibrahim (AS) - The Friend of Allah',
    titleUr: 'حضرت ابراہیم (ع) - خلیل اللہ',
    summaryEn: 'The father of prophets and his unwavering faith in one God.',
    summaryUr: 'انبیاء کے والد اور ایک خدا پر ان کا غیر متزلزل ایمان۔',
    contentEn: 'Prophet Ibrahim (AS) lived in a society of idol worshippers. Through intellect and divine guidance, he realized the existence of One God. He famously destroyed the idols of his people, for which King Nimrod threw him into a massive fire. However, Allah commanded the fire to be cool and safe for Ibrahim. Later, he rebuilt the Kaaba with his son Ismail (AS) and established the rites of Hajj.',
    contentUr: 'حضرت ابراہیم علیہ السلام بت پرستوں کے معاشرے میں پیدا ہوئے۔ اپنی عقل اور الہی ہدایت سے انہوں نے خدائے واحد کی پہچان کی۔ انہوں نے اپنی قوم کے بتوں کو توڑ دیا، جس پر نمرود نے انہیں دہکتی ہوئی آگ میں پھینک دیا۔ لیکن اللہ کے حکم سے وہ آگ ان کے لیے ٹھنڈی اور سلامتی والی بن گئی۔ بعد میں، انہوں نے اپنے بیٹے کی مدد سے خانہ کعبہ کی تعمیر نو کی اور حج کے مناسک قائم کیے۔'
  }
]

export default function StoriesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleStory = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center pt-10">
          <BookHeart className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">قصص الأنبياء</h1>
          <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary mb-12 rtl">انبیاء کی کہانیاں</h2>

          <div className="space-y-6 text-left">
            {stories.map((story) => {
              const isExpanded = expandedId === story.id

              return (
                <div
                  key={story.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-primary/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleStory(story.id)}
                    className="w-full text-left p-6 sm:p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="pr-4">
                      <h3 className="text-xl font-bold text-primary mb-2">{story.titleEn}</h3>
                      <h3 className="text-2xl font-nastaliq text-gold mb-2 rtl">{story.titleUr}</h3>
                      <p className="text-gray-500 text-sm hidden sm:block">{story.summaryEn}</p>
                    </div>
                    <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700"
                      >
                        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-bold text-primary mb-3 uppercase tracking-wider text-sm">English</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                              {story.contentEn}
                            </p>
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-primary mb-3 uppercase tracking-wider text-sm font-nastaliq rtl">ترجمہ</h4>
                            <p className="text-gray-700 dark:text-gray-300 font-nastaliq rtl leading-relaxed text-justify text-lg">
                              {story.contentUr}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </main>
  )
}
