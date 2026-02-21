'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

const footerLinks = {
  sections: [
    { href: '/quran', en: 'Quran', ur: 'قرآن مجید' },
    { href: '/prayer-times', en: 'Prayer Times', ur: 'اوقاتِ نماز' },
    { href: '/ramadan', en: 'Ramadan', ur: 'رمضان' },
    { href: '/hadith', en: 'Hadith', ur: 'احادیث' },
    { href: '/duas', en: 'Duas', ur: 'دعائیں' },
  ],
  features: [
    { href: '/99-names', en: '99 Names', ur: 'اسماء الحسنٰی' },
    { href: '/qibla', en: 'Qibla', ur: 'قبلہ نما' },
    { href: '/zakat', en: 'Zakat', ur: 'زکوٰۃ' },
    { href: '/calendar', en: 'Calendar', ur: 'اسلامی کیلنڈر' },
    { href: '/tasbeeh', en: 'Tasbeeh', ur: 'تسبیح' },
  ],
  company: [
    { href: '/about', en: 'About Us', ur: 'ہمارے بارے میں' },
    { href: '/contact', en: 'Contact', ur: 'رابطہ کریں' },
    { href: '/blog', en: 'Blog', ur: 'بلاگ' },
    { href: '/stories', en: 'Stories', ur: 'انبیاء کی کہانیاں' },
  ],
}

const socialLinks = [
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  const { lang } = useLanguage()
  const isUrdu = lang === 'ur'

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-gold text-2xl font-amiri">ن</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">NoorWeb</h3>
                <p className="text-sm text-white/60 font-nastaliq">نور ویب</p>
              </div>
            </Link>
            <p className={`text-white/70 text-sm leading-relaxed mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu 
                ? 'آپ کا مکمل اسلامی ساتھی - قرآن، نماز، احادیث اور بہت کچھ ایک جگہ'
                : 'Your complete Islamic companion - Quran, Prayer, Hadith and more in one place'}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className={`text-lg font-bold mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'سیکشنز' : 'Sections'}
            </h4>
            <ul className="space-y-2">
              {footerLinks.sections.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-white/70 hover:text-white transition-colors block ${isUrdu ? 'font-nastaliq rtl' : ''}`}
                  >
                    {isUrdu ? link.ur : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className={`text-lg font-bold mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'خصوصیات' : 'Features'}
            </h4>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-white/70 hover:text-white transition-colors block ${isUrdu ? 'font-nastaliq rtl' : ''}`}
                  >
                    {isUrdu ? link.ur : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-lg font-bold mb-4 ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              {isUrdu ? 'رابطہ' : 'Contact'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">info@noorweb.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">+92 300 0000000</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
                  {isUrdu ? 'لاہور، پاکستان' : 'Lahore, Pakistan'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-white/60 text-sm ${isUrdu ? 'font-nastaliq rtl' : ''}`}>
              © {new Date().getFullYear()} {isUrdu ? 'نور ویب - تمام حقوق محفوظ ہیں' : 'NoorWeb - All rights reserved'}
            </p>
            <p className="text-white/60 text-sm font-amiri">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
