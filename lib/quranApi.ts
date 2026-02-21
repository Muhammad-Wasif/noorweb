import axios from 'axios'

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
}

export interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean }
}

export interface SurahData {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: 'Meccan' | 'Medinan'
  numberOfAyahs: number
  ayahs: Ayah[]
}

export interface Translation {
  number: number
  text: string
  numberInSurah: number
}

const QURAN_API_BASE = 'https://api.alquran.cloud/v1'

export async function getAllSurahs(): Promise<Surah[]> {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/surah`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching surahs:', error)
    throw error
  }
}

export async function getSurah(surahNumber: number): Promise<SurahData> {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/surah/${surahNumber}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching surah:', error)
    throw error
  }
}

export async function getSurahWithTranslation(
  surahNumber: number,
  edition: string = 'ur.jalandhry' // Urdu translation by default
): Promise<{ arabic: SurahData; translation: SurahData }> {
  try {
    const [arabicRes, translationRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/surah/${surahNumber}`),
      axios.get(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`),
    ])
    return {
      arabic: arabicRes.data.data,
      translation: translationRes.data.data,
    }
  } catch (error) {
    console.error('Error fetching surah with translation:', error)
    throw error
  }
}

export async function getRandomAyah(): Promise<{
  arabic: Ayah
  translation: Ayah
  surah: { number: number; name: string; englishName: string }
}> {
  try {
    const randomSurah = Math.floor(Math.random() * 114) + 1
    const surahInfo = await getSurah(randomSurah)
    const randomAyah = Math.floor(Math.random() * surahInfo.numberOfAyahs) + 1
    
    const [arabicRes, urduRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/ayah/${randomSurah}:${randomAyah}`),
      axios.get(`${QURAN_API_BASE}/ayah/${randomSurah}:${randomAyah}/ur.jalandhry`),
    ])
    
    return {
      arabic: arabicRes.data.data,
      translation: urduRes.data.data,
      surah: {
        number: surahInfo.number,
        name: surahInfo.name,
        englishName: surahInfo.englishName,
      },
    }
  } catch (error) {
    console.error('Error fetching random ayah:', error)
    throw error
  }
}

export async function searchQuran(query: string, edition: string = 'ur.jalandhry'): Promise<{
  count: number
  matches: Array<{
    number: number
    text: string
    surah: { number: number; name: string; englishName: string }
    numberInSurah: number
  }>
}> {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/search/${encodeURIComponent(query)}/${edition}`)
    return response.data.data
  } catch (error) {
    console.error('Error searching Quran:', error)
    throw error
  }
}

export async function getAyahAudio(surahNumber: number, ayahNumber: number, reciter: string = 'ar.alafasy'): Promise<string> {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/ayah/${surahNumber}:${ayahNumber}/${reciter}`)
    return response.data.data.audio
  } catch (error) {
    console.error('Error fetching audio:', error)
    throw error
  }
}

// Available Urdu translations
export const urduEditions = [
  { identifier: 'ur.jalandhry', name: 'فتح محمد جالندھری' },
  { identifier: 'ur.ahmedali', name: 'احمد علی' },
  { identifier: 'ur.junagarhi', name: 'محمد جوناگڑھی' },
]

// Available reciters
export const reciters = [
  { identifier: 'ar.alafasy', name: 'مشاری العفاسی', englishName: 'Mishary Alafasy' },
  { identifier: 'ar.abdulbasitmurattal', name: 'عبد الباسط', englishName: 'Abdul Basit' },
  { identifier: 'ar.abdurrahmaansudais', name: 'عبد الرحمٰن السديس', englishName: 'Abdurrahman As-Sudais' },
  { identifier: 'ar.husary', name: 'محمود خليل الحصري', englishName: 'Mahmoud Khalil Al-Husary' },
  { identifier: 'ar.minshawi', name: 'محمد صديق المنشاوي', englishName: 'Muhammad Siddiq Al-Minshawi' },
]

// Surah names in Urdu
export const surahNamesUrdu: { [key: number]: string } = {
  1: 'الفاتحہ',
  2: 'البقرہ',
  3: 'آل عمران',
  4: 'النساء',
  5: 'المائدہ',
  6: 'الانعام',
  7: 'الاعراف',
  8: 'الانفال',
  9: 'التوبہ',
  10: 'یونس',
  11: 'ھود',
  12: 'یوسف',
  13: 'الرعد',
  14: 'ابراھیم',
  15: 'الحجر',
  16: 'النحل',
  17: 'بنی اسرائیل',
  18: 'الکہف',
  19: 'مریم',
  20: 'طٰہٰ',
  21: 'الانبیاء',
  22: 'الحج',
  23: 'المومنون',
  24: 'النور',
  25: 'الفرقان',
  26: 'الشعراء',
  27: 'النمل',
  28: 'القصص',
  29: 'العنکبوت',
  30: 'الروم',
  31: 'لقمان',
  32: 'السجدہ',
  33: 'الاحزاب',
  34: 'سبا',
  35: 'فاطر',
  36: 'یٰس',
  37: 'الصافات',
  38: 'ص',
  39: 'الزمر',
  40: 'المومن',
  41: 'حٰم السجدہ',
  42: 'الشوریٰ',
  43: 'الزخرف',
  44: 'الدخان',
  45: 'الجاثیہ',
  46: 'الاحقاف',
  47: 'محمد',
  48: 'الفتح',
  49: 'الحجرات',
  50: 'ق',
  51: 'الذاریات',
  52: 'الطور',
  53: 'النجم',
  54: 'القمر',
  55: 'الرحمٰن',
  56: 'الواقعہ',
  57: 'الحدید',
  58: 'المجادلہ',
  59: 'الحشر',
  60: 'الممتحنہ',
  61: 'الصف',
  62: 'الجمعہ',
  63: 'المنافقون',
  64: 'التغابن',
  65: 'الطلاق',
  66: 'التحریم',
  67: 'الملک',
  68: 'القلم',
  69: 'الحاقہ',
  70: 'المعارج',
  71: 'نوح',
  72: 'الجن',
  73: 'المزمل',
  74: 'المدثر',
  75: 'القیامۃ',
  76: 'الدھر',
  77: 'المرسلات',
  78: 'النبا',
  79: 'النازعات',
  80: 'عبس',
  81: 'التکویر',
  82: 'الانفطار',
  83: 'المطففین',
  84: 'الانشقاق',
  85: 'البروج',
  86: 'الطارق',
  87: 'الاعلیٰ',
  88: 'الغاشیہ',
  89: 'الفجر',
  90: 'البلد',
  91: 'الشمس',
  92: 'اللیل',
  93: 'الضحیٰ',
  94: 'الم نشرح',
  95: 'التین',
  96: 'العلق',
  97: 'القدر',
  98: 'البینہ',
  99: 'الزلزال',
  100: 'العادیات',
  101: 'القارعہ',
  102: 'التکاثر',
  103: 'العصر',
  104: 'الہمزہ',
  105: 'الفیل',
  106: 'قریش',
  107: 'الماعون',
  108: 'الکوثر',
  109: 'الکافرون',
  110: 'النصر',
  111: 'اللہب',
  112: 'الاخلاص',
  113: 'الفلق',
  114: 'الناس',
}
