# Matriculation Photoshoot Portal - Qodesh Campus Church (GCTU)

Official matriculation photoshoot registration portal for Ghana Communication Technology University (GCTU) freshers by Qodesh Campus Church, Tesano.

## Features
- **Student Registration Portal**:
  - Full Name, Preferred Nickname, Gender selection, Date of Birth
  - WhatsApp phone number formatting (`+233`) and alternative contact line
  - Academic Level (Level 100 to 400, Diploma)
  - Faculty selection (FoCIS, FoE, GBS) and all GCTU courses of study
  - Comprehensive GCTU hostels database with automatic local landmarks, walking proximity, and nearby sites (GT Main Campus Blocks A/B/C, Unidaz, Delicious, Palace, Legacy, Eastern Pinnacle, Zack B, Twinkle, etc., plus custom residence input)
  - Fast Mode toggle for field queue agents / ushers
- **Administrator Dashboard**:
  - Protected by PIN (`777`)
  - Real-time cloud sync with Firebase Firestore + local storage offline fallback
  - Summary metrics: Total registrants, gender breakdown, faculty breakdown (FoCIS, FoE, GBS)
  - Live search by student name, phone, course, hostel, or ID
  - Multi-faceted filter system: Level, Faculty, Hostel, Follow-Up Status, Gender
  - Instant One-Click WhatsApp chat launch with pre-filled greeting
  - Detailed student profile drawer with shepherd assignments and follow-up notes
  - Manual student entry modal
  - Export all or filtered registrations to CSV spreadsheet (`.csv`)
  - Safe record deletion with confirmation modals

## Tech Stack
- React 19 + TypeScript
- Tailwind CSS v4
- Vite
- Firebase Firestore (Cloud persistent storage)
- Lucide React Icons

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
