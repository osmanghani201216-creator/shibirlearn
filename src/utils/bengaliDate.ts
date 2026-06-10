/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Bengali Months
export const BENGALI_MONTHS = [
  'বৈশাখ',   // Boishakh (Apr 14 - May 14)
  'জ্যৈষ্ঠ',  // Joistho (May 15 - Jun 14)
  'আষাঢ়',   // Ashar (Jun 15 - Jul 16)
  'শ্রাবণ',   // Shrabon (Jul 17 - Aug 17)
  'ভাদ্র',    // Bhadra (Aug 18 - Sep 17)
  'আশ্বিন',   // Ashwin (Sep 18 - Oct 17)
  'কার্তিক',  // Kartik (Oct 18 - Nov 16)
  'অগ্রহায়ণ', // Agrahayan (Nov 17 - Dec 16)
  'পৌষ',    // Poush (Dec 17 - Jan 15)
  'মাঘ',     // Magh (Jan 16 - Feb 14)
  'ফাল্গুন',  // Falgun (Feb 15 - Mar 15)
  'চৈত্র'     // Chaitra (Mar 16 - Apr 13)
];

export const BENGALI_NUMBERS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  return num
    .toString()
    .split('')
    .map(digit => {
      const idx = parseInt(digit, 10);
      return !isNaN(idx) ? BENGALI_NUMBERS[idx] : digit;
    })
    .join('');
}

export const BENGALI_WEEKDAYS = [
  'রবিবার',  // Sunday
  'সোমবার',  // Monday
  'মঙ্গলবার', // Tuesday
  'বুধবার',  // Wednesday
  'বৃহস্পতিবার', // Thursday
  'শুক্রবার',  // Friday
  'শনিবার'   // Saturday
];

/**
 * Converts a Gregorian Date object to Bengali Date string (revision of 2019 BD Govt calendar)
 */
export function getBengaliDate(date: Date): { day: number; month: string; year: number; weekday: string; fullString: string } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  // Bengali month lengths (revised 2019)
  // First 6 months (Boishakh to Ashwin) are 31 days
  // Next 6 months are 30 days except Falgun which is 31 days in leap year
  const getMonthDays = (yr: number) => [
    31, // Boishakh (Apr 14)
    31, // Joistho (May 15)
    31, // Ashar (Jun 15)
    31, // Shrabon (Jul 16)
    31, // Bhadra (Aug 16)
    31, // Ashwin (Sep 16)
    30, // Kartik (Oct 17)
    30, // Agrahayan (Nov 16)
    30, // Poush (Dec 16)
    30, // Magh (Jan 15)
    ((yr % 4 === 0 && yr % 100 !== 0) || (yr % 400 === 0)) ? 31 : 30, // Falgun (Feb 14)
    30  // Chaitra (Mar 16)
  ];

  // We find day of year relative to April 14
  // Let's create a date for April 14 of the same year
  let startOfBengaliYear = new Date(year, 3, 14); // April 14
  
  let diffTime = date.getTime() - startOfBengaliYear.getTime();
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let bYear = year - 593; // Bengali Year starts at Gregorian 594 AD (Boishakh 1st)
  
  if (diffDays < 0) {
    // We are before April 14, meaning we belong to the previous Bengali year
    startOfBengaliYear = new Date(year - 1, 3, 14);
    diffTime = date.getTime() - startOfBengaliYear.getTime();
    diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    bYear = year - 594;
  }

  // Now distribute diffDays over the months
  const mDays = getMonthDays(year);
  let accumulatedDays = 0;
  let bMonthIdx = 0;
  let bDay = 1;

  for (let i = 0; i < 12; i++) {
    const daysInThisMonth = mDays[i];
    if (diffDays >= accumulatedDays && diffDays < accumulatedDays + daysInThisMonth) {
      bMonthIdx = i;
      bDay = diffDays - accumulatedDays + 1;
      break;
    }
    accumulatedDays += daysInThisMonth;
  }

  const bMonth = BENGALI_MONTHS[bMonthIdx];
  const weekday = BENGALI_WEEKDAYS[date.getDay()];

  const dayStr = toBengaliNumber(bDay);
  const yearStr = toBengaliNumber(bYear);

  return {
    day: bDay,
    month: bMonth,
    year: bYear,
    weekday,
    fullString: `${weekday}, ${dayStr} ${bMonth}, ${yearStr} বঙ্গাব্দ`
  };
}
