export interface City {
  name: string
  country: string
  countryCode: string
  timezone: string
  flag: string
}

export interface Country {
  name: string
  code: string
  flag: string
  cities: City[]
}

export const countries: Country[] = [
  {
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    cities: [
      { name: 'Lahore', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Karachi', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Islamabad', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Rawalpindi', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Peshawar', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Quetta', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Multan', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Faisalabad', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Sialkot', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Gujranwala', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
      { name: 'Bahawalpur', country: 'Pakistan', countryCode: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
    ],
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    cities: [
      { name: 'Makkah', country: 'Saudi Arabia', countryCode: 'SA', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
      { name: 'Madinah', country: 'Saudi Arabia', countryCode: 'SA', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
      { name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
      { name: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
      { name: 'Dammam', country: 'Saudi Arabia', countryCode: 'SA', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
    ],
  },
  {
    name: 'UAE',
    code: 'AE',
    flag: '🇦🇪',
    cities: [
      { name: 'Dubai', country: 'UAE', countryCode: 'AE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
      { name: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
      { name: 'Sharjah', country: 'UAE', countryCode: 'AE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
    ],
  },
  {
    name: 'Kuwait',
    code: 'KW',
    flag: '🇰🇼',
    cities: [
      { name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', timezone: 'Asia/Kuwait', flag: '🇰🇼' },
    ],
  },
  {
    name: 'Qatar',
    code: 'QA',
    flag: '🇶🇦',
    cities: [
      { name: 'Doha', country: 'Qatar', countryCode: 'QA', timezone: 'Asia/Qatar', flag: '🇶🇦' },
    ],
  },
  {
    name: 'Oman',
    code: 'OM',
    flag: '🇴🇲',
    cities: [
      { name: 'Muscat', country: 'Oman', countryCode: 'OM', timezone: 'Asia/Muscat', flag: '🇴🇲' },
    ],
  },
  {
    name: 'Bahrain',
    code: 'BH',
    flag: '🇧🇭',
    cities: [
      { name: 'Manama', country: 'Bahrain', countryCode: 'BH', timezone: 'Asia/Bahrain', flag: '🇧🇭' },
    ],
  },
  {
    name: 'Jordan',
    code: 'JO',
    flag: '🇯🇴',
    cities: [
      { name: 'Amman', country: 'Jordan', countryCode: 'JO', timezone: 'Asia/Amman', flag: '🇯🇴' },
    ],
  },
  {
    name: 'Lebanon',
    code: 'LB',
    flag: '🇱🇧',
    cities: [
      { name: 'Beirut', country: 'Lebanon', countryCode: 'LB', timezone: 'Asia/Beirut', flag: '🇱🇧' },
    ],
  },
  {
    name: 'Iraq',
    code: 'IQ',
    flag: '🇮🇶',
    cities: [
      { name: 'Baghdad', country: 'Iraq', countryCode: 'IQ', timezone: 'Asia/Baghdad', flag: '🇮🇶' },
      { name: 'Basra', country: 'Iraq', countryCode: 'IQ', timezone: 'Asia/Baghdad', flag: '🇮🇶' },
    ],
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    cities: [
      { name: 'Delhi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
      { name: 'Mumbai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
      { name: 'Hyderabad', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
      { name: 'Chennai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
      { name: 'Kolkata', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
      { name: 'Bangalore', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
    ],
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    flag: '🇧🇩',
    cities: [
      { name: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', timezone: 'Asia/Dhaka', flag: '🇧🇩' },
      { name: 'Chittagong', country: 'Bangladesh', countryCode: 'BD', timezone: 'Asia/Dhaka', flag: '🇧🇩' },
      { name: 'Sylhet', country: 'Bangladesh', countryCode: 'BD', timezone: 'Asia/Dhaka', flag: '🇧🇩' },
    ],
  },
  {
    name: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    cities: [
      { name: 'Istanbul', country: 'Turkey', countryCode: 'TR', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
      { name: 'Ankara', country: 'Turkey', countryCode: 'TR', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
      { name: 'Izmir', country: 'Turkey', countryCode: 'TR', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
    ],
  },
  {
    name: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    cities: [
      { name: 'Cairo', country: 'Egypt', countryCode: 'EG', timezone: 'Africa/Cairo', flag: '🇪🇬' },
      { name: 'Alexandria', country: 'Egypt', countryCode: 'EG', timezone: 'Africa/Cairo', flag: '🇪🇬' },
    ],
  },
  {
    name: 'Morocco',
    code: 'MA',
    flag: '🇲🇦',
    cities: [
      { name: 'Casablanca', country: 'Morocco', countryCode: 'MA', timezone: 'Africa/Casablanca', flag: '🇲🇦' },
      { name: 'Rabat', country: 'Morocco', countryCode: 'MA', timezone: 'Africa/Casablanca', flag: '🇲🇦' },
      { name: 'Marrakech', country: 'Morocco', countryCode: 'MA', timezone: 'Africa/Casablanca', flag: '🇲🇦' },
    ],
  },
  {
    name: 'Tunisia',
    code: 'TN',
    flag: '🇹🇳',
    cities: [
      { name: 'Tunis', country: 'Tunisia', countryCode: 'TN', timezone: 'Africa/Tunis', flag: '🇹🇳' },
    ],
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    cities: [
      { name: 'London', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', flag: '🇬🇧' },
      { name: 'Birmingham', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', flag: '🇬🇧' },
      { name: 'Manchester', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', flag: '🇬🇧' },
    ],
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    cities: [
      { name: 'Paris', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', flag: '🇫🇷' },
      { name: 'Marseille', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', flag: '🇫🇷' },
    ],
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    cities: [
      { name: 'Berlin', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin', flag: '🇩🇪' },
      { name: 'Munich', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin', flag: '🇩🇪' },
      { name: 'Frankfurt', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin', flag: '🇩🇪' },
    ],
  },
  {
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    cities: [
      { name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
    ],
  },
  {
    name: 'Belgium',
    code: 'BE',
    flag: '🇧🇪',
    cities: [
      { name: 'Brussels', country: 'Belgium', countryCode: 'BE', timezone: 'Europe/Brussels', flag: '🇧🇪' },
    ],
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    cities: [
      { name: 'Madrid', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', flag: '🇪🇸' },
      { name: 'Barcelona', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', flag: '🇪🇸' },
    ],
  },
  {
    name: 'USA',
    code: 'US',
    flag: '🇺🇸',
    cities: [
      { name: 'New York', country: 'USA', countryCode: 'US', timezone: 'America/New_York', flag: '🇺🇸' },
      { name: 'Chicago', country: 'USA', countryCode: 'US', timezone: 'America/Chicago', flag: '🇺🇸' },
      { name: 'Los Angeles', country: 'USA', countryCode: 'US', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
      { name: 'Houston', country: 'USA', countryCode: 'US', timezone: 'America/Chicago', flag: '🇺🇸' },
      { name: 'Detroit', country: 'USA', countryCode: 'US', timezone: 'America/Detroit', flag: '🇺🇸' },
    ],
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    cities: [
      { name: 'Toronto', country: 'Canada', countryCode: 'CA', timezone: 'America/Toronto', flag: '🇨🇦' },
      { name: 'Vancouver', country: 'Canada', countryCode: 'CA', timezone: 'America/Vancouver', flag: '🇨🇦' },
      { name: 'Montreal', country: 'Canada', countryCode: 'CA', timezone: 'America/Montreal', flag: '🇨🇦' },
    ],
  },
  {
    name: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    cities: [
      { name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
      { name: 'Penang', country: 'Malaysia', countryCode: 'MY', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
    ],
  },
  {
    name: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    cities: [
      { name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Jakarta', flag: '🇮🇩' },
      { name: 'Surabaya', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Jakarta', flag: '🇮🇩' },
    ],
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    cities: [
      { name: 'Singapore', country: 'Singapore', countryCode: 'SG', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    ],
  },
  {
    name: 'Thailand',
    code: 'TH',
    flag: '🇹🇭',
    cities: [
      { name: 'Bangkok', country: 'Thailand', countryCode: 'TH', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
    ],
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    cities: [
      { name: 'Tokyo', country: 'Japan', countryCode: 'JP', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    ],
  },
  {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    cities: [
      { name: 'Beijing', country: 'China', countryCode: 'CN', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
      { name: 'Shanghai', country: 'China', countryCode: 'CN', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
      { name: 'Hong Kong', country: 'China', countryCode: 'CN', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
    ],
  },
  {
    name: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    cities: [
      { name: 'Lagos', country: 'Nigeria', countryCode: 'NG', timezone: 'Africa/Lagos', flag: '🇳🇬' },
      { name: 'Kano', country: 'Nigeria', countryCode: 'NG', timezone: 'Africa/Lagos', flag: '🇳🇬' },
    ],
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    cities: [
      { name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', timezone: 'Africa/Johannesburg', flag: '🇿🇦' },
      { name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', timezone: 'Africa/Johannesburg', flag: '🇿🇦' },
    ],
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    cities: [
      { name: 'Sydney', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Sydney', flag: '🇦🇺' },
      { name: 'Melbourne', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Melbourne', flag: '🇦🇺' },
    ],
  },
]

export const allCities: City[] = countries.flatMap((country) => country.cities)

export const defaultCity: City = {
  name: 'Lahore',
  country: 'Pakistan',
  countryCode: 'PK',
  timezone: 'Asia/Karachi',
  flag: '🇵🇰',
}

export function getCitiesByCountry(countryCode: string): City[] {
  const country = countries.find((c) => c.code === countryCode)
  return country?.cities || []
}

export function getCityByName(cityName: string): City | undefined {
  return allCities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())
}
