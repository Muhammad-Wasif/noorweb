'use client'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  }

  return (
    <div
      className={`${sizeClasses[size]} border-primary/20 border-t-primary rounded-full animate-spin ${className}`}
    />
  )
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-primary font-nastaliq text-lg">لوڈ ہو رہا ہے...</p>
      </div>
    </div>
  )
}
