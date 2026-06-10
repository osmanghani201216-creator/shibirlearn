/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomReminder } from '../types';
import { Bell, BellOff, ArrowLeft, Plus, Trash2, PlusCircle, Volume2, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';
import { audioSynth } from '../utils/audioSynth';

interface CustomNotificationViewProps {
  onBack: () => void;
}

export default function CustomNotificationView({ onBack }: CustomNotificationViewProps) {
  const [reminders, setReminders] = useState<CustomReminder[]>(() => {
    const saved = localStorage.getItem('custom_reminders');
    if (saved) return JSON.parse(saved);
    // Initial defaults
    return [
      { id: 'rem-fajr', prayerKey: 'fajr', minutesBefore: 15, isEnabled: false, label: 'সাহরী খাওয়ার সময়!', soundType: 'beep_soft' },
      { id: 'rem-maghrib', prayerKey: 'maghrib', minutesBefore: 10, isEnabled: false, label: 'ইফতার ও মাগরিবের প্রস্তুতি নিন', soundType: 'melody' }
    ];
  });

  const [prayerKey, setPrayerKey] = useState<CustomReminder['prayerKey']>('fajr');
  const [minutesBefore, setMinutesBefore] = useState<number>(10);
  const [label, setLabel] = useState('');
  const [soundType, setSoundType] = useState<CustomReminder['soundType']>('melody');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const saveReminders = (updated: CustomReminder[]) => {
    setReminders(updated);
    localStorage.setItem('custom_reminders', JSON.stringify(updated));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const newRem: CustomReminder = {
      id: `rem-${Date.now()}`,
      prayerKey,
      minutesBefore,
      isEnabled: true,
      label,
      soundType
    };

    const updated = [newRem, ...reminders];
    saveReminders(updated);
    setLabel('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveReminders(updated);
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, isEnabled: !r.isEnabled };
      }
      return r;
    });
    saveReminders(updated);
  };

  const handleTestSound = (type: CustomReminder['soundType']) => {
    audioSynth.play(type, 0.5);
  };

  const getPrayerNameBn = (key: string) => {
    const names: { [k: string]: string } = {
      fajr: 'ফজর',
      sunrise: 'সূর্যোদয়',
      dhuhr: 'যুহর',
      asr: 'আসর',
      maghrib: 'মাগরিব',
      isha: 'ইশা',
      tahajjud: 'তাহাজ্জুদ'
    };
    return names[key] || key;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto px-4 py-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer transition-colors"
          id="btn-notifications-back"
        >
          <ArrowLeft size={18} />
          <span>মূল পাতায় ফিরে যান</span>
        </button>
        <span className="text-xl font-bold text-emerald-900 border-l-4 border-emerald-600 pl-3">
          কাস্টম নোটিফিকেশন সিস্টেম
        </span>
      </div>

      {/* Intro details */}
      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-4 mb-6 text-xs text-emerald-800 flex items-start gap-3">
        <Info className="text-emerald-700 shrink-0 mt-0.5" size={16} />
        <div>
          <p className="font-semibold text-emerald-900">স্মার্ট নোটিফিকেশন এলার্ম:</p>
          <p className="mt-1 leading-relaxed">
            ওয়াক্তের নির্ধারিত সময়ের পূর্বে বা পরে যেকোনো কাস্টম নোটিফিকেশন এলার্ম সেট করতে পারেন। 
            যেমন – "মাগরিব ওয়াক্ত শুরু হবার ১০ মিনিট পূর্বে ইফতারের জন্য প্রস্তুতি নিন" কিংবা "ফজরের ৩০ মিনিট আগে সাহরি এলার্ম"।
          </p>
        </div>
      </div>

      {/* Reminder Creator Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6 mb-6">
        <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
          <PlusCircle size={18} className="text-emerald-700" />
          নতুন কাস্টম এলার্ম যুক্ত করুন
        </h3>

        <form onSubmit={handleAddReminder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Waqt */}
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">কার সাথে সম্পর্কিত?</label>
              <select
                value={prayerKey}
                onChange={(e) => setPrayerKey(e.target.value as any)}
                className="w-full text-xs font-medium border border-emerald-100 rounded-xl px-3 py-2 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition-all"
                id="select-reminder-prayer"
              >
                <option value="fajr">ফজর ওয়াক্ত</option>
                <option value="sunrise">সূর্যোদয়</option>
                <option value="dhuhr">যুহর ওয়াক্ত</option>
                <option value="asr">আসর ওয়াক্ত</option>
                <option value="maghrib">মাগরিব ওয়াক্ত</option>
                <option value="isha">ইশা ওয়াক্ত</option>
                <option value="tahajjud">তাহাজ্জুদ ওয়াক্ত</option>
              </select>
            </div>

            {/* Select Time difference */}
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">কতক্ষণ আগে?</label>
              <select
                value={minutesBefore}
                onChange={(e) => setMinutesBefore(parseInt(e.target.value, 10))}
                className="w-full text-xs font-medium border border-emerald-100 rounded-xl px-3 py-2 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition-all"
                id="select-reminder-offset"
              >
                <option value="5">৫ মিনিট আগে</option>
                <option value="10">১০ মিনিট আগে</option>
                <option value="15">১৫ মিনিট আগে</option>
                <option value="20">২০ মিনিট আগে</option>
                <option value="30">৩০ মিনিট আগে</option>
                <option value="45">৪৫ মিনিট আগে</option>
                <option value="60">১ ঘন্টা আগে</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Custom Sound Selection */}
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">এলার্ম সাউন্ড:</label>
              <div className="flex gap-2">
                <select
                  value={soundType}
                  onChange={(e) => setSoundType(e.target.value as any)}
                  className="flex-1 text-xs font-medium border border-emerald-100 rounded-xl px-3 py-2 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition-all"
                  id="select-reminder-sound"
                >
                  <option value="melody">সুরময় ঘণ্টা (Melody)</option>
                  <option value="adhan_short">ক্ষুদ্র আজান টোন</option>
                  <option value="beep_soft">নরম মিউজিক্যাল বিপ</option>
                  <option value="beep_digital">ডিজিটাল বিপ বিপ</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleTestSound(soundType)}
                  className="p-2 border border-emerald-100 hover:bg-emerald-50 text-emerald-800 rounded-xl cursor-pointer transition-colors"
                  title="সাউন্ড শুনুন"
                  id="btn-test-sound"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>

            {/* Label Text Input */}
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">নোটিফিকেশনের শিরোনাম বা মেসেজ:</label>
              <input
                type="text"
                placeholder="যেমনঃ সাহরী খেতে উঠুন, অজুর প্রস্তুতি"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full text-xs font-medium border border-emerald-100 rounded-xl px-3 py-2 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                id="input-reminder-label"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            id="btn-submit-reminder"
          >
            <Plus size={16} />
            এলার্ম অ্যালার্টটি যুক্ত করুন
          </button>
        </form>
      </div>

      {/* Toast feedback */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-850 text-white py-2 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mb-4 text-xs font-semibold"
          >
            <Check size={16} className="text-emerald-300" />
            <span>সফলভাবে কাস্টম এলার্ম অ্যালার্ট সংরক্ষন করা হয়েছে!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alarm list */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
        <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-2">
          <Bell size={18} className="text-emerald-700" />
          আপনার সক্রিয় কাস্টম এলার্ম তালিকা
        </h3>

        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 border rounded-2xl flex items-center justify-between gap-4 transition-all ${rem.isEnabled ? 'bg-emerald-50/20 border-emerald-100/70' : 'bg-gray-50/40 border-gray-100 opacity-60'}`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-emerald-800 text-white font-bold rounded text-[10px] leading-tight">
                    {getPrayerNameBn(rem.prayerKey)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-950">
                    {toBengaliNumber(rem.minutesBefore)} মিনিট আগে
                  </span>
                </div>
                <p className="text-xs text-emerald-900 font-semibold">{rem.label}</p>
                <div className="flex items-center gap-3 text-[10px] text-emerald-600 font-medium">
                  <span>সাউন্ড: {rem.soundType === 'melody' ? 'সুরময় ঘণ্টা' : rem.soundType === 'adhan_short' ? 'আজান টোন' : rem.soundType === 'beep_soft' ? 'নরম বিপ' : 'ডিজিটাল বিপ'}</span>
                  <button 
                    onClick={() => handleTestSound(rem.soundType)}
                    className="text-emerald-800 font-sans font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    <Volume2 size={10} />
                    শুনুন
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Active switch */}
                <button
                  onClick={() => handleToggleReminder(rem.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rem.isEnabled ? 'bg-emerald-750' : 'bg-gray-200'}`}
                  id={`btn-rem-toggle-${rem.id}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${rem.isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-2 border border-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-xl cursor-pointer transition-all"
                  title="মুছে ফেলুন"
                  id={`btn-rem-delete-${rem.id}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="text-center py-10 text-emerald-600 space-y-2">
              <BellOff className="mx-auto text-emerald-400 opacity-60" size={32} />
              <p className="text-xs">এখনও কোনো কাস্টম নোটিফিকেশন তৈরি করা হয়নি।</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
