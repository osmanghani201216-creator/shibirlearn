/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculatePrayerTimes, formatTimeBn, BANGLADESH_DISTRICTS } from '../utils/prayerTimes';
import { getBengaliDate, toBengaliNumber } from '../utils/bengaliDate';
import { getHijriDate } from '../utils/hijriDate';
import { Calendar, ChevronLeft, ChevronRight, Printer, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarViewProps {
  selectedDistrictId: string;
  juristicSchool: 'hanafi' | 'shafi';
  onBack: () => void;
}

export default function CalendarView({ selectedDistrictId, juristicSchool, onBack }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month Names
  const MONTHS_BN = [
    'জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  // Days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);
  
  // First day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Create array of days
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredDays = daysArray.filter((date) => {
    const dayNumeric = date.getDate().toString();
    const dayBn = toBengaliNumber(dayNumeric);
    const dayOfWeek = getBengaliDate(date).weekday;
    const hijri = getHijriDate(date);
    const bengali = getBengaliDate(date);

    const matchesQuery = 
      dayNumeric.includes(searchQuery) ||
      dayBn.includes(searchQuery) ||
      dayOfWeek.includes(searchQuery) ||
      hijri.monthBn.includes(searchQuery) ||
      bengali.month.includes(searchQuery);

    return matchesQuery;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 py-6"
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer transition-colors"
          id="btn-calendar-back"
        >
          <ArrowLeft size={18} />
          <span>মূল পাতায় ফিরে যান</span>
        </button>
        <span className="text-xl font-bold text-emerald-900 border-l-4 border-emerald-600 pl-3">
          ক্যালেন্ডার ও সময়সূচী
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6 mb-6">
        {/* Date Selector Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-50 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100 transition-colors cursor-pointer"
              id="btn-prev-month"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center md:text-left min-w-[200px]">
              <h2 className="text-lg font-bold text-emerald-950">
                {MONTHS_BN[month]} - {toBengaliNumber(year)}
              </h2>
              <p className="text-xs text-emerald-600 mt-0.5">
                {getBengaliDate(daysArray[0]).month} - {getBengaliDate(daysArray[daysArray.length - 1]).month} ১৪৩৩ বঙ্গাব্দ
              </p>
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100 transition-colors cursor-pointer"
              id="btn-next-month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 rounded-lg border border-emerald-100 transition-colors cursor-pointer"
              id="btn-today"
            >
              আজ
            </button>
            
            <div className="flex rounded-lg border border-emerald-100 p-0.5 bg-emerald-50/50">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-emerald-700 text-white shadow-sm' : 'text-emerald-800 hover:bg-emerald-100/50'}`}
                id="btn-mode-table"
              >
                টেবিল ভিউ
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-emerald-700 text-white shadow-sm' : 'text-emerald-800 hover:bg-emerald-100/50'}`}
                id="btn-mode-grid"
              >
                মাসিক গ্রিড
              </button>
            </div>

            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 transition-colors cursor-pointer"
              title="প্রিন্ট করুন"
              id="btn-print-calendar"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* Filter and search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="তারিখ, বার বা মাস লিখে খুঁজুন (উদাঃ ১৫, সোমবার)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-emerald-100 rounded-xl bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
            id="input-calendar-search"
          />
        </div>

        {/* Calendar Content */}
        {viewMode === 'table' ? (
          // TABLE LIST VIEW (extremely popular for Ramadan/Islamic sheets)
          <div className="overflow-x-auto rounded-xl border border-emerald-50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white text-xs md:text-sm font-semibold">
                  <th className="p-3 text-center">তারিখ (ইংরেজি)</th>
                  <th className="p-3 text-center">তারিখ (বাংলা)</th>
                  <th className="p-3 text-center">তারিখ (হিজরি)</th>
                  <th className="p-3 text-center">ফজর</th>
                  <th className="p-3 text-center">সূর্যোদয়</th>
                  <th className="p-3 text-center">যুহর</th>
                  <th className="p-3 text-center">আসর</th>
                  <th className="p-3 text-center">মাগরিব</th>
                  <th className="p-3 text-center">ইশা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-xs md:text-sm">
                {filteredDays.map((date) => {
                  const pTimes = calculatePrayerTimes(date, selectedDistrictId, juristicSchool);
                  const bDate = getBengaliDate(date);
                  const hDate = getHijriDate(date);
                  const isToday = date.getDate() === 8 && date.getMonth() === 5 && date.getFullYear() === 2026;

                  return (
                    <tr 
                      key={date.toISOString()} 
                      className={`hover:bg-emerald-50/40 transition-colors ${isToday ? 'bg-emerald-100/50 font-bold text-emerald-950' : 'text-emerald-900'}`}
                    >
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="font-semibold">{toBengaliNumber(date.getDate())}</span>
                        <span className="text-xs text-emerald-600 block">{bDate.weekday}</span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {toBengaliNumber(bDate.day)} {bDate.month}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {toBengaliNumber(hDate.day)} {hDate.monthBn}
                      </td>
                      <td className="p-3 text-center font-mono text-emerald-950">{formatTimeBn(pTimes.fajr)}</td>
                      <td className="p-3 text-center font-mono text-emerald-600">{formatTimeBn(pTimes.sunrise)}</td>
                      <td className="p-3 text-center font-mono text-emerald-950">{formatTimeBn(pTimes.dhuhr)}</td>
                      <td className="p-3 text-center font-mono text-emerald-950">{formatTimeBn(pTimes.asr)}</td>
                      <td className="p-3 text-center font-mono text-emerald-900">{formatTimeBn(pTimes.maghrib)}</td>
                      <td className="p-3 text-center font-mono text-emerald-950">{formatTimeBn(pTimes.isha)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredDays.length === 0 && (
              <div className="text-center py-8 text-emerald-600 text-sm">
                কোনো তথ্য পাওয়া যায়নি।
              </div>
            )}
          </div>
        ) : (
          // GRID CALENDAR VIEW
          <div>
            {/* Weekdays Headers */}
            <div className="grid grid-cols-7 text-center font-semibold text-xs text-emerald-800 bg-emerald-50/50 py-2 rounded-lg mb-2">
              <div>রবি</div>
              <div>সোম</div>
              <div>মঙ্গল</div>
              <div>বুধ</div>
              <div>বৃহস্পতি</div>
              <div>শুক্র</div>
              <div>শনি</div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {/* Padding for first day */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square bg-emerald-50/10 rounded-xl" />
              ))}

              {/* Dates */}
              {daysArray.map((date) => {
                const isToday = date.getDate() === 8 && date.getMonth() === 5 && date.getFullYear() === 2026;
                const pTimes = calculatePrayerTimes(date, selectedDistrictId, juristicSchool);
                const hDate = getHijriDate(date);
                const bDate = getBengaliDate(date);

                return (
                  <div
                    key={date.toISOString()}
                    className={`aspect-square p-2 border rounded-xl flex flex-col justify-between transition-colors relative group overflow-hidden ${
                      isToday 
                        ? 'border-emerald-700 bg-emerald-50' 
                        : 'border-emerald-50 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-bold ${isToday ? 'text-emerald-900 bg-emerald-200 w-6 h-6 flex items-center justify-center rounded-full' : 'text-emerald-950'}`}>
                        {toBengaliNumber(date.getDate())}
                      </span>
                      <span className="text-[10px] text-emerald-600 text-right leading-tight">
                        {toBengaliNumber(hDate.day)} {hDate.monthBn.substring(0, 5)}...
                      </span>
                    </div>

                    {/* Popover overlay or mini-preview */}
                    <div className="mt-1 md:mt-2 text-[9px] text-emerald-800 font-mono space-y-0.5 leading-none">
                      <div className="flex justify-between">
                        <span>ফ:</span>
                        <span>{formatTimeBn(pTimes.fajr)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>মা:</span>
                        <span>{formatTimeBn(pTimes.maghrib)}</span>
                      </div>
                    </div>

                    {/* Tooltip trigger */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-emerald-950/95 text-white p-2 flex flex-col justify-center text-[10px] transition-all rounded-xl scale-95 duration-150">
                      <p className="font-bold border-b border-white/20 pb-1 mb-1 text-center">
                        {toBengaliNumber(date.getDate())} {MONTHS_BN[month]}
                      </p>
                      <div className="space-y-0.5">
                        <div className="flex justify-between"><span>ফজর:</span> <span>{pTimes.fajr}</span></div>
                        <div className="flex justify-between"><span>যুহর:</span> <span>{pTimes.dhuhr}</span></div>
                        <div className="flex justify-between"><span>আসর:</span> <span>{pTimes.asr}</span></div>
                        <div className="flex justify-between"><span>মাগরিব:</span> <span>{pTimes.maghrib}</span></div>
                        <div className="flex justify-between"><span>ইশা:</span> <span>{pTimes.isha}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Islamic Calendar Legend / Info card */}
      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-4 text-xs text-emerald-800 flex items-start gap-3">
        <Calendar className="text-emerald-700 shrink-0 mt-0.5" size={16} />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-900">ক্যালেন্ডার ব্যবহারের নিয়মাবলী:</p>
          <ul className="list-disc list-inside space-y-0.5 leading-relaxed">
            <li>ইংরেজি মাসের পাশে ইসলামিক হিজরী ও বাংলা তারিখ নির্দেশিত আছে।</li>
            <li>মাগরিবের নামাজের সাথে সাথে ইসলামিক হিজরী তারিখ পরবর্তী দিনে পরিবর্তিত হয়।</li>
            <li>আপনার নির্বাচিত জেলা: <strong className="text-emerald-950 font-bold">{(BANGLADESH_DISTRICTS.find(d => d.id === selectedDistrictId) || BANGLADESH_DISTRICTS[0]).nameBn}</strong>। সেটিংসে গিয়ে যেকোনো সময়ে জেলা পরিবর্তন করতে পারেন।</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
