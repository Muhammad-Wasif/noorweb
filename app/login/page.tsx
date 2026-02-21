'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/context/AuthContext'
import { loginSchema, LoginFormData, getPasswordStrength } from '@/lib/validations/auth'
import { Modal } from '@/components/ui/Modal'

export default function LoginPage() {
  const router = useRouter()
  const { login, loginAsGuest } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const [password, setPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        toast.success('کامیابی سے لاگ ان ہو گئے!')
        router.push('/explore')
      } else {
        toast.error('ای میل یا پاس ورڈ غلط ہے')
      }
    } catch {
      toast.error('کچھ غلط ہو گیا')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    toast.success('مہمان کے طور پر خوش آمدید!')
    router.push('/explore')
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient with pattern */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 geometric-bg opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-5xl font-amiri text-gold">ن</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">NoorWeb</h1>
          <p className="text-xl font-nastaliq text-white/80 text-center rtl">
            آپ کا مکمل اسلامی ساتھی
          </p>
          <div className="mt-12 text-center">
            <p className="text-3xl font-amiri text-gold/90 leading-loose">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white to-primary-light">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-amiri text-white">ن</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">NoorWeb</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-nastaliq font-bold text-primary rtl">
                خوش آمدید
              </h2>
              <p className="text-gray-500 font-nastaliq rtl mt-2">
                اپنے اکاؤنٹ میں لاگ ان کریں
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-nastaliq text-gray-700 dark:text-gray-300 rtl mb-2">
                  ای میل
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="error-text">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-nastaliq text-gray-700 dark:text-gray-300 rtl mb-2">
                  پاس ورڈ
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      onChange: (e) => setPassword(e.target.value),
                    })}
                    className={`input-field pl-10 pr-12 ${errors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
                
                {/* Password strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`strength-bar ${
                          passwordStrength.label === 'weak'
                            ? 'strength-weak'
                            : passwordStrength.label === 'medium'
                            ? 'strength-medium'
                            : 'strength-strong'
                        }`}
                      />
                    </div>
                    <p className={`text-xs mt-1 rtl font-nastaliq ${
                      passwordStrength.label === 'weak'
                        ? 'text-red-500'
                        : passwordStrength.label === 'medium'
                        ? 'text-orange-500'
                        : 'text-green-500'
                    }`}>
                      {passwordStrength.urduLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline font-nastaliq"
                >
                  پاس ورڈ بھول گئے؟
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="font-nastaliq">لاگ ان کریں</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 font-nastaliq">
                  یا
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 
                        dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 
                        transition-colors mb-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-nastaliq text-gray-700 dark:text-gray-300">
                گوگل سے جاری رکھیں
              </span>
            </button>

            {/* Guest Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full btn-outline font-nastaliq"
            >
              مہمان کے طور پر جاری رکھیں
            </button>

            {/* Register Link */}
            <p className="mt-6 text-center text-gray-600 dark:text-gray-400 font-nastaliq rtl">
              اکاؤنٹ نہیں ہے؟{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                رجسٹر کریں
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Google Coming Soon Modal */}
      <Modal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        title="جلد آ رہا ہے"
      >
        <div className="text-center py-4">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-lg font-nastaliq text-gray-700 dark:text-gray-300 rtl">
            یہ سہولت جلد دستیاب ہوگی
          </p>
          <button
            onClick={() => setIsGoogleModalOpen(false)}
            className="mt-6 btn-primary"
          >
            <span className="font-nastaliq">بند کریں</span>
          </button>
        </div>
      </Modal>
    </div>
  )
}
