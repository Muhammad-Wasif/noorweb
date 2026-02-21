'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    setIsInitialized(true)
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

export interface Bookmark {
  surahNumber: number
  surahName: string
  ayahNumber: number
  arabicText: string
  urduText: string
  createdAt: string
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('noorweb-bookmarks', [])

  const addBookmark = (bookmark: Omit<Bookmark, 'createdAt'>) => {
    const newBookmark = {
      ...bookmark,
      createdAt: new Date().toISOString(),
    }
    setBookmarks([...bookmarks, newBookmark])
  }

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks(
      bookmarks.filter(
        (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
      )
    )
  }

  const isBookmarked = (surahNumber: number, ayahNumber: number): boolean => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    )
  }

  return { bookmarks, addBookmark, removeBookmark, isBookmarked }
}

export interface ReadingProgress {
  surahNumber: number
  ayahNumber: number
  lastRead: string
}

export function useReadingProgress() {
  const [progress, setProgress] = useLocalStorage<ReadingProgress | null>(
    'noorweb-reading-progress',
    null
  )

  const saveProgress = (surahNumber: number, ayahNumber: number) => {
    setProgress({
      surahNumber,
      ayahNumber,
      lastRead: new Date().toISOString(),
    })
  }

  return { progress, saveProgress }
}

export interface TasbeehCount {
  [dhikr: string]: number
}

export function useTasbeeh() {
  const [counts, setCounts] = useLocalStorage<TasbeehCount>('noorweb-tasbeeh', {})

  const increment = (dhikr: string) => {
    setCounts({
      ...counts,
      [dhikr]: (counts[dhikr] || 0) + 1,
    })
  }

  const reset = (dhikr: string) => {
    setCounts({
      ...counts,
      [dhikr]: 0,
    })
  }

  const getCount = (dhikr: string): number => counts[dhikr] || 0

  return { counts, increment, reset, getCount }
}
