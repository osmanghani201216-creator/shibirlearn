/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  division: string;
  // Minutes offset from Dhaka times
  fajrOffset: number;
  sunriseOffset: number;
  dhuhrOffset: number;
  asrOffset: number;
  maghribOffset: number;
  ishaOffset: number;
  latitude: number;
  longitude: number;
}

export interface PrayerTimes {
  fajr: string;      // "hh:mm" 24h or "hh:mm AM/PM"
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  forbiddenSunriseEnd: string; // Sunrise end (e.g. 15 mins after Sunrise start)
  forbiddenZawalStart: string; // Noon start (e.g. 5 mins before Dhuhr)
  forbiddenZawalEnd: string;   // Noon end (Dhuhr start)
  forbiddenSunsetStart: string;// Sunset start (e.g. 15 mins before Maghrib)
  forbiddenSunsetEnd: string;  // Sunset end (Maghrib start)
  tahajjudStart: string;        // E.g. Midnight to Fajr start
  tahajjudEnd: string;
  ishraqStart: string;         // E.g. 15-20 mins after sunrise
  ishraqEnd: string;
  chashtStart: string;         // Mid-morning (e.g. 9:00 AM)
  chashtEnd: string;
}

export interface CustomReminder {
  id: string;
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'sunrise' | 'tahajjud';
  minutesBefore: number; // minutes before (positive) or after (negative)
  isEnabled: boolean;
  label: string;
  soundType: 'adhan_short' | 'beep_digital' | 'beep_soft' | 'melody';
}

export interface Mosque {
  id: string;
  nameBn: string;
  nameEn: string;
  locationBn: string;
  distance: string;
  facilities: string[]; // ['মহিলাদের নামাজের জায়গা', 'অজু করার জায়গা', 'গাড়ি পার্কিং', 'জুতা রাখার নিরাপদ জায়গা']
  jamatTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
  };
  mapsUrl: string;
}

export interface AppSettings {
  selectedDistrictId: string;
  juristicSchool: 'hanafi' | 'shafi'; // Hanafi is general for BD
  alarmVolume: number; // 0 to 1
  isMuted: boolean;
  offsets: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  alarmSoundType: 'adhan_short' | 'beep_digital' | 'beep_soft' | 'melody';
  enabledNotifications: {
    fajr: boolean;
    sunrise: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  darkMode?: boolean;
  selectedAdhanSample?: 'synth_classic' | 'synth_makkah' | 'synth_madinah' | 'synth_aqsa' | 'synth_dhaka' | 'mp3_makkah' | 'mp3_madinah' | 'mp3_egypt' | 'custom_uploaded';
  customAdhanBase64?: string;
  customAdhanName?: string;
}

export type ViewType = 'home' | 'calendar' | 'mosque' | 'settings' | 'custom_notifications' | 'library' | 'board_books' | 'it_courses' | 'spoken_english' | 'prayer_tracker' | 'history' | 'quran_hadith' | 'quiz' | 'zakat';

export interface DailyReflection {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  text: string;
  category: 'deed' | 'gratitude';
}

