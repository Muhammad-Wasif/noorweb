import axios from 'axios'

export interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
  Imsak: string
  Midnight: string
}

export interface HijriDate {
  date: string
  format: string
  day: string
  weekday: { en: string; ar: string }
  month: { number: number; en: string; ar: string }
  year: string
  designation: { abbreviated: string; expanded: string }
}

export interface PrayerApiResponse {
  code: number
  status: string
  data: {
    timings: PrayerTimes
    date: {
      readable: string
      timestamp: string
      hijri: HijriDate
      gregorian: {
        date: string
        format: string
        day: string
        weekday: { en: string }
        month: { number: number; en: string }
        year: string
      }
    }
    meta: {
      latitude: number
      longitude: number
      timezone: string
      method: { id: number; name: string }
    }
  }
}

const calculationMethods: Record<string, number> = {
  'PK': 1, // University of Islamic Sciences, Karachi
  'IN': 1, // University of Islamic Sciences, Karachi
  'BD': 1, // University of Islamic Sciences, Karachi
  'SA': 4, // Umm al-Qura University, Makkah
  'AE': 4, // Umm al-Qura University, Makkah
  'QA': 4, // Umm al-Qura University, Makkah
  'KW': 4, // Umm al-Qura University, Makkah
  'OM': 4, // Umm al-Qura University, Makkah
  'BH': 4, // Umm al-Qura University, Makkah
  'GB': 3, // Islamic Society of North America (ISNA) or customized
  'US': 2, // Islamic Society of North America (ISNA)
  'CA': 2, // ISNA
  'default': 3, // Muslim World League
}

const hijriAdjustments: Record<string, number> = {
  'PK': -1, // Common adjustment for Pakistan relative to standard astronomical calc
  'IN': -1,
  'BD': -1,
  'SA': 0, // Using Umm al-Qura directly usually matches
  'default': 0,
}

export async function getPrayerTimes(city: string, country: string, countryCode?: string): Promise<PrayerApiResponse> {
  const method = countryCode ? (calculationMethods[countryCode] || calculationMethods['default']) : 1;
  const adjustment = countryCode ? (hijriAdjustments[countryCode] || hijriAdjustments['default']) : 0;

  try {
    const response = await axios.get<PrayerApiResponse>(
      `https://api.aladhan.com/v1/timingsByCity`,
      {
        params: {
          city,
          country,
          method: method,
          adjustment: adjustment,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    throw error
  }
}

export async function getPrayerTimesByDate(
  city: string,
  country: string,
  date: string // DD-MM-YYYY format
): Promise<PrayerApiResponse> {
  try {
    const response = await axios.get<PrayerApiResponse>(
      `https://api.aladhan.com/v1/timingsByCity/${date}`,
      {
        params: {
          city,
          country,
          method: 1,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching prayer times by date:', error)
    throw error
  }
}

export async function getMonthlyPrayerTimes(
  city: string,
  country: string,
  month: number,
  year: number
): Promise<PrayerApiResponse[]> {
  try {
    const response = await axios.get(
      `https://api.aladhan.com/v1/calendarByCity/${year}/${month}`,
      {
        params: {
          city,
          country,
          method: 1,
        },
      }
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching monthly prayer times:', error)
    throw error
  }
}

export function getNextPrayer(timings: PrayerTimes, currentTime: Date): {
  name: string
  time: string
  urduName: string
} | null {
  const prayers = [
    { name: 'Fajr', time: timings.Fajr, urduName: 'فجر' },
    { name: 'Sunrise', time: timings.Sunrise, urduName: 'طلوعِ آفتاب' },
    { name: 'Dhuhr', time: timings.Dhuhr, urduName: 'ظہر' },
    { name: 'Asr', time: timings.Asr, urduName: 'عصر' },
    { name: 'Maghrib', time: timings.Maghrib, urduName: 'مغرب' },
    { name: 'Isha', time: timings.Isha, urduName: 'عشاء' },
  ]

  const currentHours = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()
  const currentTotalMinutes = currentHours * 60 + currentMinutes

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number)
    const prayerTotalMinutes = hours * 60 + minutes

    if (prayerTotalMinutes > currentTotalMinutes) {
      return prayer
    }
  }

  // If all prayers have passed, return Fajr for next day
  return { name: 'Fajr', time: timings.Fajr, urduName: 'فجر' }
}

export function formatTimeRemaining(targetTime: string, currentTime: Date): string {
  const [targetHours, targetMinutes] = targetTime.split(':').map(Number)

  let targetDate = new Date(currentTime)
  targetDate.setHours(targetHours, targetMinutes, 0, 0)

  // If target time has passed, it's for tomorrow
  if (targetDate <= currentTime) {
    targetDate.setDate(targetDate.getDate() + 1)
  }

  const diffMs = targetDate.getTime() - currentTime.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const hours = Math.floor(diffSecs / 3600)
  const minutes = Math.floor((diffSecs % 3600) / 60)
  const seconds = diffSecs % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
