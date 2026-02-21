import { z } from 'zod'

export const emailSchema = z
  .string()
  .min(1, { message: 'ای میل درج کریں' })
  .email({ message: 'درست ای میل درج کریں' })
  .refine(
    (email) => {
      const validDomains = ['.com', '.net', '.org', '.pk', '.edu', '.gov', '.io', '.co']
      return validDomains.some((domain) => email.toLowerCase().endsWith(domain))
    },
    { message: 'درست ڈومین والا ای میل درج کریں' }
  )

export const passwordSchema = z
  .string()
  .min(8, { message: 'پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'پاس ورڈ میں ایک بڑا حرف ہونا چاہیے',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'پاس ورڈ میں ایک نمبر ہونا چاہیے',
  })
  .refine((password) => /[@!#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password), {
    message: 'پاس ورڈ میں ایک خاص حرف ہونا چاہیے (@, !, #, $)',
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'پاس ورڈ درج کریں' }),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'نام کم از کم 2 حروف کا ہونا چاہیے' }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'پاس ورڈ کی تصدیق کریں' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'پاس ورڈ مماثل نہیں ہیں',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

export function getPasswordStrength(password: string): {
  score: number
  label: 'weak' | 'medium' | 'strong'
  urduLabel: string
} {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[@!#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++
  
  if (score <= 2) {
    return { score, label: 'weak', urduLabel: 'کمزور' }
  } else if (score <= 4) {
    return { score, label: 'medium', urduLabel: 'درمیانہ' }
  } else {
    return { score, label: 'strong', urduLabel: 'مضبوط' }
  }
}
