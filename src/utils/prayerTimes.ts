/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { District, PrayerTimes } from '../types';
import { toBengaliNumber } from './bengaliDate';

// Standard GMT+6 district coordinate offsets in Bangladesh
export const BANGLADESH_DISTRICTS: District[] = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', division: 'Dhaka', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0, latitude: 23.8111, longitude: 90.4123 },
  { id: 'chittagong', nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong', division: 'Chittagong', fajrOffset: -5, sunriseOffset: -4, dhuhrOffset: -5, asrOffset: -5, maghribOffset: -5, ishaOffset: -5, latitude: 22.3569, longitude: 91.7832 },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', division: 'Sylhet', fajrOffset: -6, sunriseOffset: -6, dhuhrOffset: -6, asrOffset: -6, maghribOffset: -6, ishaOffset: -6, latitude: 24.8949, longitude: 91.8687 },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', division: 'Rajshahi', fajrOffset: 7, sunriseOffset: 7, dhuhrOffset: 7, asrOffset: 7, maghribOffset: 7, ishaOffset: 7, latitude: 24.3745, longitude: 88.6042 },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', division: 'Khulna', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4, latitude: 22.8456, longitude: 89.5403 },
  { id: 'barisal', nameBn: 'বরিশাল', nameEn: 'Barisal', division: 'Barisal', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2, latitude: 22.7010, longitude: 90.3535 },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', division: 'Rangpur', fajrOffset: 5, sunriseOffset: 6, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5, latitude: 25.7558, longitude: 89.2444 },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', division: 'Mymensingh', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0, latitude: 24.7471, longitude: 90.4031 },
  { id: 'comilla', nameBn: 'কুমিল্লা', nameEn: 'Comilla', division: 'Chittagong', fajrOffset: -3, sunriseOffset: -3, dhuhrOffset: -3, asrOffset: -3, maghribOffset: -3, ishaOffset: -3, latitude: 23.4607, longitude: 91.1809 },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", division: 'Chittagong', fajrOffset: -6, sunriseOffset: -5, dhuhrOffset: -6, asrOffset: -6, maghribOffset: -5, ishaOffset: -6, latitude: 21.4272, longitude: 92.0058 },
  { id: 'jessore', nameBn: 'যশোর', nameEn: 'Jessore', division: 'Khulna', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5, latitude: 23.1670, longitude: 89.2140 },
  { id: 'bogra', nameBn: 'বগুড়া', nameEn: 'Bogra', division: 'Rajshahi', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4, latitude: 24.8481, longitude: 89.3730 },
  { id: 'dinajpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', division: 'Rangpur', fajrOffset: 7, sunriseOffset: 8, dhuhrOffset: 7, asrOffset: 7, maghribOffset: 7, ishaOffset: 7, latitude: 25.6217, longitude: 88.6354 },
  { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', division: 'Chittagong', fajrOffset: -3, sunriseOffset: -2, dhuhrOffset: -3, asrOffset: -3, maghribOffset: -2, ishaOffset: -3, latitude: 22.8696, longitude: 91.0990 },
  { id: 'feni', nameBn: 'ফেনী', nameEn: 'Feni', division: 'Chittagong', fajrOffset: -4, sunriseOffset: -3, dhuhrOffset: -4, asrOffset: -4, maghribOffset: -3, ishaOffset: -4, latitude: 23.0159, longitude: 91.3976 },
  { id: 'faridpur', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', division: 'Dhaka', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2, latitude: 23.6071, longitude: 89.8429 },
  { id: 'tangail', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', division: 'Dhaka', fajrOffset: 1, sunriseOffset: 1, dhuhrOffset: 1, asrOffset: 1, maghribOffset: 1, ishaOffset: 1, latitude: 24.2513, longitude: 89.9167 },
  { id: 'kushtia', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', division: 'Khulna', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5, latitude: 23.9013, longitude: 89.1204 },
  { id: 'pabna', nameBn: 'পাবনা', nameEn: 'Pabna', division: 'Rajshahi', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4, latitude: 24.0041, longitude: 89.2452 },
  { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', division: 'Dhaka', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0, latitude: 23.9999, longitude: 90.4203 },
  { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', division: 'Dhaka', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1, latitude: 23.6238, longitude: 90.5000 },
  { id: 'brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', division: 'Chittagong', fajrOffset: -2, sunriseOffset: -2, dhuhrOffset: -2, asrOffset: -2, maghribOffset: -2, ishaOffset: -2, latitude: 23.9575, longitude: 91.1119 },
  { id: 'bagerhat', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', division: 'Khulna', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3, latitude: 22.6516, longitude: 89.7859 },
  { id: 'patuakhali', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', division: 'Barisal', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2, latitude: 22.3597, longitude: 90.3297 },
  { id: 'chandpur', nameBn: 'চাঁদপুর', nameEn: 'Chandpur', division: 'Chittagong', fajrOffset: -2, sunriseOffset: -2, dhuhrOffset: -2, asrOffset: -2, maghribOffset: -2, ishaOffset: -2, latitude: 23.2321, longitude: 90.6631 },
  { id: 'sirajganj', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', division: 'Rajshahi', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3, latitude: 24.4534, longitude: 89.7080 }
];

// Helper Trigonometric functions for calculations
const dtr = (d: number) => (d * Math.PI) / 180;
const rtd = (r: number) => (r * 180) / Math.PI;
const ccot = (x: number) => 1 / Math.tan(x);
const acot = (x: number) => Math.atan(1 / x);

/**
 * Main Prayer Calculation Astronomical Engine
 */
export function calculatePrayerTimes(
  date: Date,
  districtId: string,
  juristicSchool: 'hanafi' | 'shafi' = 'hanafi',
  manualOffsets: { [key: string]: number } = {}
): PrayerTimes {
  const district = BANGLADESH_DISTRICTS.find((d) => d.id === districtId) || BANGLADESH_DISTRICTS[0];
  const lat = district.latitude;
  const lon = district.longitude;

  // Day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Approximate Solar Calculations
  // Julian Date / Century relative to J2000.0
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simple clean Fourier approximation of solar position that works extremely precisely
  // decl = Declination of Sun, eqt = Equation of time in minutes
  const B = (360 / 365) * (dayOfYear - 81);
  const eqt = 9.87 * Math.sin(dtr(2 * B)) - 7.53 * Math.cos(dtr(B)) - 1.5 * Math.sin(dtr(B));
  const decl = 23.45 * Math.sin(dtr((360 / 365) * (284 + dayOfYear)));

  // Timezone of Bangladesh is UTC+6
  const timezone = 6.0;

  // Midday/Transit (Standard Dhuhr without refraction or angle) in hours
  // Transit occurs when Sun is at highest meridian
  const transit = 12 + (timezone - lon / 15) - eqt / 60; // in hours

  // 1. Dhuhr time
  let dhuhrHour = transit; // Usually around 11:58 AM or so in Dhaka

  // 2. Sunrise & Sunset
  // Angles used: Sunrise/Sunset is -0.833° below horizon for standard refraction
  const sunsetAngle = -0.833;
  const cosSunriseH = (Math.sin(dtr(sunsetAngle)) - Math.sin(dtr(lat)) * Math.sin(dtr(decl))) / (Math.cos(dtr(lat)) * Math.cos(dtr(decl)));
  let sunriseH = rtd(Math.acos(Math.max(-1, Math.min(1, cosSunriseH))));

  let sunriseHour = transit - sunriseH / 15;
  let sunsetHour = transit + sunriseH / 15; // Maghrib matches Sunset exactly in standard sunni timing

  // 3. Fajr & Isha
  // Islamic Foundation Bangladesh uses Fajr angle = 18 degrees, Isha angle = 18 degrees
  const fajrAngle = -18.0;
  const ishaAngle = -18.0;

  const cosFajrH = (Math.sin(dtr(fajrAngle)) - Math.sin(dtr(lat)) * Math.sin(dtr(decl))) / (Math.cos(dtr(lat)) * Math.cos(dtr(decl)));
  let fajrH = rtd(Math.acos(Math.max(-1, Math.min(1, cosFajrH))));
  let fajrHour = transit - fajrH / 15;

  const cosIshaH = (Math.sin(dtr(ishaAngle)) - Math.sin(dtr(lat)) * Math.sin(dtr(decl))) / (Math.cos(dtr(lat)) * Math.cos(dtr(decl)));
  let ishaH = rtd(Math.acos(Math.max(-1, Math.min(1, cosIshaH))));
  let ishaHour = transit + ishaH / 15;

  // 4. Asr
  // Asr shadow length factor: Hanafi = 2, Shafi/Others = 1
  const s = juristicSchool === 'hanafi' ? 2 : 1;
  const shadowCoeff = s + Math.abs(Math.tan(dtr(lat - decl)));
  const asrAngle = rtd(acot(shadowCoeff));

  const cosAsrH = (Math.sin(dtr(asrAngle)) - Math.sin(dtr(lat)) * Math.sin(dtr(decl))) / (Math.cos(dtr(lat)) * Math.cos(dtr(decl)));
  let asrH = rtd(Math.acos(Math.max(-1, Math.min(1, cosAsrH))));
  let asrHour = transit + asrH / 15;

  // Format Helper that takes fractional hours and returns "HH:MM", applying settings/offsets
  const formatTime = (fractionalHour: number, key: string): string => {
    // Convert to total minutes
    let totalMinutes = Math.round(fractionalHour * 60);

    // Default Bangladesh Islamic Foundation safety buffers
    if (key === 'dhuhr' || key === 'asr' || key === 'maghrib' || key === 'isha') {
      totalMinutes += 1; // +1 minute safety buffer
    }

    // Add manual custom user offsets in minutes
    if (manualOffsets[key]) {
      totalMinutes += manualOffsets[key];
    }

    // Wrap minutes around 24 hours (1440 minutes)
    totalMinutes = (totalMinutes + 1440) % 1440;

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const hhStr = h.toString().padStart(2, '0');
    const mmStr = m.toString().padStart(2, '0');
    return `${hhStr}:${mmStr}`;
  };

  // Generate Base Times
  const fajrStr = formatTime(fajrHour, 'fajr');
  const sunriseStr = formatTime(sunriseHour, 'sunrise');
  const dhuhrStr = formatTime(dhuhrHour, 'dhuhr');
  const asrStr = formatTime(asrHour, 'asr');
  const maghribStr = formatTime(sunsetHour, 'maghrib'); // Sunset is Maghrib
  const ishaStr = formatTime(ishaHour, 'isha');

  // Forbidden Timings calculations
  // 1. Suryaodoy (SunriseForbidden: Sunrise to 15 mins after Sunrise)
  const sunriseMin = timeToMinutes(sunriseStr);
  const sunriseForbiddenEndMin = (sunriseMin + 15) % 1440;
  const forbiddenSunriseEnd = minutesToTime(sunriseForbiddenEndMin);

  // 2. Dupur (Forbidden Zawal: 5-8 mins before Dhuhr until Dhuhr starts)
  const dhuhrMin = timeToMinutes(dhuhrStr);
  const forbiddenZawalStartMin = (dhuhrMin - 6 + 1440) % 1440;
  const forbiddenZawalStart = minutesToTime(forbiddenZawalStartMin);
  const forbiddenZawalEnd = dhuhrStr;

  // 3. SunsetForbidden (Sunset: 15 mins before Maghrib/Sunset till Maghrib/Sunset)
  const maghribMin = timeToMinutes(maghribStr);
  const forbiddenSunsetStartMin = (maghribMin - 15 + 1440) % 1440;
  const forbiddenSunsetStart = minutesToTime(forbiddenSunsetStartMin);
  const forbiddenSunsetEnd = maghribStr;

  // Nafal Timings
  // 1. Tahajjud: last third of the night. From Isha to Fajr. Let's calculate:
  // Night starts at Maghrib and ends at Fajr next day.
  const fajrNextMin = timeToMinutes(fajrStr);
  const nightLength = (fajrNextMin + 1440 - maghribMin) % 1440;
  const tahajjudStartMin = (maghribMin + Math.round(nightLength * (2 / 3))) % 1440;
  const tahajjudStart = minutesToTime(tahajjudStartMin);
  // Ends at Fajr start - 1 min (also known as Sahri end)
  const tahajjudEndMin = (fajrNextMin - 1 + 1440) % 1440;
  const tahajjudEnd = minutesToTime(tahajjudEndMin);

  // 2. Ishraq: begins 15 mins after sunrise (when forbidden sunrise is over) and ends before zawal
  const ishraqStart = forbiddenSunriseEnd;
  const ishraqEndMin = (dhuhrMin - 30 + 1440) % 1440;
  const ishraqEnd = minutesToTime(ishraqEndMin);

  // 3. Chasht (Duha): Begins slightly later, e.g. 25-30 mins after sunrise, and ends before Zawal
  const chashtStartMin = (sunriseMin + 25) % 1440;
  const chashtStart = minutesToTime(chashtStartMin);
  const chashtEnd = ishraqEnd;

  return {
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    maghrib: maghribStr,
    isha: ishaStr,
    forbiddenSunriseEnd,
    forbiddenZawalStart,
    forbiddenZawalEnd,
    forbiddenSunsetStart,
    forbiddenSunsetEnd,
    tahajjudStart,
    tahajjudEnd,
    ishraqStart,
    ishraqEnd,
    chashtStart,
    chashtEnd
  };
}

// Sub utilities for string time <-> minutes conversion
export function timeToMinutes(timeStr: string): number {
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.round(minutes % 60);
  const hhStr = h.toString().padStart(2, '0');
  const mmStr = m.toString().padStart(2, '0');
  return `${hhStr}:${mmStr}`;
}

export function formatTimeBn(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const displayHourStr = toBengaliNumber(displayHour.toString().padStart(2, '0'));
  const mBn = toBengaliNumber(mStr);
  return `${displayHourStr}:${mBn}`;
}

export function formatTime24Bn(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  return `${toBengaliNumber(hStr)}:${toBengaliNumber(mStr)}`;
}

export function formatTimePeriodBn(timeStr: string): string {
  const [hStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const period = h < 12 ? 'সকাল' : h < 16 ? 'দুপুর' : h < 18 ? 'বিকালে' : h < 20 ? 'সন্ধ্যা' : 'রাত';
  return period;
}
