# NoorWeb - نور ویب

آپ کا مکمل اسلامی ساتھی | Your Complete Islamic Companion

## Features (MVP)

- **قرآن مجید** - Complete Quran with Urdu translation, search, and bookmarks
- **اوقاتِ نماز** - Prayer times with real-time clocks and countdown
- **رمضان** - Iftar & Sehri countdown with multi-city support
- **سیکشن ایکسپلورر** - Cinematic walkthrough of all features
- **3D Models** - Interactive 3D models using Three.js

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **3D Models:** @react-three/fiber + @react-three/drei
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Date/Time:** date-fns + date-fns-tz

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Add your GLB model files to `/public/models/`:
   - quran.glb
   - namaz.glb
   - chand.glb
   - digital_tasbeeh.glb
   - allah names.glb

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/noorweb
├── /app                    # Next.js App Router pages
│   ├── /login             # Login page
│   ├── /register          # Register page
│   ├── /explore           # Section Explorer
│   ├── /quran             # Quran pages
│   ├── /prayer-times      # Prayer Times
│   ├── /ramadan           # Ramadan countdown
│   └── ...                # Other sections
├── /components            # React components
│   ├── /models            # 3D model components
│   └── /ui                # UI components
├── /lib                   # Utilities
│   ├── /context           # React context providers
│   ├── /hooks             # Custom hooks
│   └── /validations       # Zod schemas
└── /public/models         # GLB 3D model files
```

## APIs Used

- **AlAdhan API** - Prayer times
- **AlQuran Cloud API** - Quran text and translations

## Design System

- **Primary:** #0e7a6e (Sea Green)
- **Gold:** #C8A951
- **Fonts:** Amiri (Arabic), Noto Nastaliq Urdu, Inter (English)

## License

MIT
