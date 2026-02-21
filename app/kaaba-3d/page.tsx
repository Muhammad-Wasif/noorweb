'use client'

import Link from 'next/link'
import { Box, ArrowLeft } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'

export default function Kaaba3DPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Box className="w-20 h-20 text-gold mx-auto mb-6" />
          <h1 className="text-4xl font-amiri text-gold mb-2">الكعبة المشرفة</h1>
          <h2 className="text-3xl font-nastaliq font-bold text-primary mb-4 rtl">خانہ کعبہ 3D</h2>
          <p className="text-gray-600 dark:text-gray-400 font-nastaliq mb-8 rtl">
            یہ سیکشن جلد دستیاب ہوگا
          </p>
          <Link href="/explore" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-nastaliq">واپس جائیں</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
