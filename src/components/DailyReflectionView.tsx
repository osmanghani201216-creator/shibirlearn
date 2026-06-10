/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DailyReflection } from '../types';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Trash2, 
  Calendar, 
  Check, 
  Smile, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, isFirebaseEnabled } from '../firebase';

interface DailyReflectionViewProps {
  isPopupOnly?: boolean;
  onClosePopup?: () => void;
  onClickTestIshaPopup?: () => void;
}

export default function DailyReflectionView({ 
  isPopupOnly = false, 
  onClosePopup,
  onClickTestIshaPopup 
}: DailyReflectionViewProps) {
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'deed' | 'gratitude'>('deed');
  const [filterCategory, setFilterCategory] = useState<'all' | 'deed' | 'gratitude'>('all');
  const [showHistory, setShowHistory] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Monitor auth state changes
  useEffect(() => {
    if (!isFirebaseEnabled) {
      setCurrentUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
    });
    return () => unsubscribe();
  }, []);

  // Sync reflections in real-time if signed in, or fetch from localstorage
  useEffect(() => {
    if (currentUser) {
      const path = `users/${currentUser.uid}/reflections`;
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded: DailyReflection[] = [];
        snapshot.forEach((snapDoc) => {
          loaded.push({ id: snapDoc.id, ...snapDoc.data() } as DailyReflection);
        });
        setReflections(loaded);
      }, (error) => {
        // Log clean diagnostic telemetry
        handleFirestoreError(error, OperationType.LIST, path);
      });
      
      return () => unsubscribe();
    } else {
      // Offline LocalStorage fallback
      const saved = localStorage.getItem('daily_reflections');
      if (saved) {
        try {
          setReflections(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing reflections:', e);
        }
      } else {
        setReflections([]);
      }
    }
  }, [currentUser]);

  // Save changes locally (only used for offline mode)
  const saveReflectionsLocally = (newReflections: DailyReflection[]) => {
    setReflections(newReflections);
    localStorage.setItem('daily_reflections', JSON.stringify(newReflections));
  };

  const handleAddReflection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newRefId = Math.random().toString(36).substring(2, 9);
    const newRef: DailyReflection = {
      id: newRefId,
      date: todayStr,
      timestamp: Date.now(),
      text: text.trim(),
      category: category
    };

    if (currentUser) {
      const path = `users/${currentUser.uid}/reflections`;
      try {
        await setDoc(doc(db, path, newRefId), {
          ...newRef,
          userId: currentUser.uid
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `${path}/${newRefId}`);
      }
    } else {
      const updated = [newRef, ...reflections];
      saveReflectionsLocally(updated);
    }

    setText('');
    
    // Show a success animation/feedback
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      if (isPopupOnly && onClosePopup) {
        onClosePopup();
      }
    }, 2000);
  };

  const handleDeleteReflection = async (id: string) => {
    if (currentUser) {
      const path = `users/${currentUser.uid}/reflections`;
      try {
        await deleteDoc(doc(db, path, id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
      }
    } else {
      const updated = reflections.filter(ref => ref.id !== id);
      saveReflectionsLocally(updated);
    }
  };

  // Convert Gregorian date string (e.g., 2026-06-09) to elegant Bengali date label
  const formatReflectionDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      
      const year = toBengaliNumber(parts[0]);
      const day = toBengaliNumber(parseInt(parts[2], 10));
      
      const monthsBn = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const monthName = monthsBn[monthIdx] || '';
      
      return `${day} ${monthName}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Get current day reflections count
  const todayStr = new Date().toISOString().split('T')[0];
  const todayReflections = reflections.filter(r => r.date === todayStr);

  // Grouped or filtered reflections
  const filteredRefReflections = reflections.filter(r => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  if (isPopupOnly) {
    return (
      <div className="text-left space-y-4" id="popup-reflection-form">
        <div className="flex items-center gap-3 border-b border-emerald-50 pb-3">
          <div className="bg-amber-100 text-amber-705 p-2 rounded-2xl">
            <Sparkles size={22} className="text-amber-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#064e3b]">
              ইশার পর আত্মবিশ্লেষণ ও কৃতজ্ঞতা
            </h3>
            <p className="text-[11px] text-emerald-800 font-medium">
              শান্ত মনে সারাদিন স্মরণ করে একটি ভালো কাজ বা পরম করুণাময়ের কৃতজ্ঞতাটি টুকে রাখুন।
            </p>
          </div>
        </div>

        <form onSubmit={handleAddReflection} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-black text-emerald-950 mb-2">প্রতিফলন ক্যাটাগরি:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('deed')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  category === 'deed'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-emerald-50/40 text-emerald-850 border-emerald-100/50 hover:bg-emerald-50'
                }`}
                id="popup-cat-deed"
              >
                <Award size={14} />
                একটি ভালো কাজ (Deed)
              </button>
              <button
                type="button"
                onClick={() => setCategory('gratitude')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  category === 'gratitude'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-emerald-50/40 text-emerald-850 border-emerald-100/50 hover:bg-emerald-50'
                }`}
                id="popup-cat-grat"
              >
                <Smile size={14} />
                দিনের কৃতজ্ঞতা (Gratitude)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-emerald-950 mb-1.5">আপনার অনুভূতি:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                category === 'deed'
                  ? 'আজ চমৎকার কাজটি যা আপনি করতে পেরেছেন... (যেমন: আজকে নিজের পকেট খরচ থেকে একজন এতিমকে সাহায্য করলাম)'
                  : 'এমন কিছু যা আপনাকে আজ কৃতজ্ঞ করেছে বা আনন্দ দিয়েছে... (যেমন: আজকে পরিবারের সাথে অনেক শান্তিময় সময় কাটালাম)'
              }
              rows={3}
              maxLength={250}
              className="w-full p-3 border border-emerald-100 rounded-xl text-xs bg-emerald-50/10 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700/60 font-semibold focus:border-transparent transition-all placeholder:text-slate-400 leading-normal"
              id="popup-reflection-textarea"
              required
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1">
              <span>সর্বাধিক ২৫০টি অক্ষর</span>
              <span>লিখেছেন: {toBengaliNumber(text.length)} / ২৫০ অক্ষর</span>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClosePopup}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black rounded-xl cursor-pointer transition-colors"
              id="popup-btn-cancel"
            >
              আজ নয়, বন্ধ করুন
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer flex justify-center items-center gap-1.5"
              id="popup-btn-submit"
            >
              <Check size={14} />
              ডায়েরিতে সংরক্ষণ করুন
            </button>
          </div>
        </form>

        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-800 border border-emerald-700 text-white rounded-2xl p-3 text-center text-xs font-bold shadow-md"
            >
              ✨ আপনার সুন্দর জীবনবোধ ও প্রতিফলন সফলভাবে ডায়েরিতে যোগ হয়েছে!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5" id="home-daily-reflection-widget">
      <h3 className="text-sm font-extrabold text-emerald-950 mb-3.5 flex items-center justify-between border-b border-emerald-50 pb-2.5">
        <span className="flex items-center gap-1.5">
          <BookOpen className="text-emerald-700 animate-pulse" size={17} />
          দৈনিক প্রতিফলন ও কৃতজ্ঞতা ডায়েরি
        </span>
        <span className="text-[10px] bg-amber-50 text-amber-80 * border border-amber-100 px-1.5 py-0.5 rounded-full font-bold">
          আজকের টাস্ক: {toBengaliNumber(todayReflections.length)} টি এড হয়েছে
        </span>
      </h3>

      {/* Main Journal Quick Add Form */}
      <form onSubmit={handleAddReflection} className="space-y-3">
        <p className="text-[10.5px] leading-relaxed text-slate-500 font-semibold mb-1">
          সারাদিনের কর্মব্যস্ততা শেষে আত্মশুদ্ধির মূল চাবিকাঠি হলো আত্মবিশ্লেষণ। পরম প্রভুর প্রতি এক কনা কৃতজ্ঞতা আমাদের আত্মিক প্রশান্তি বৃদ্ধি করে।
        </p>

        {/* Categories toggler */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCategory('deed')}
            className={`flex-1 py-1.5 px-3 text-[10.5px] font-black rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              category === 'deed'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-emerald-50/20 text-emerald-800 border-emerald-100/40 hover:bg-emerald-100/30'
            }`}
            id="widget-cat-deed"
          >
            <Award size={13} />
            একটি ভালো কাজ (Deed)
          </button>
          <button
            type="button"
            onClick={() => setCategory('gratitude')}
            className={`flex-1 py-1.5 px-3 text-[10.5px] font-black rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              category === 'gratitude'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-emerald-50/20 text-emerald-800 border-emerald-100/40 hover:bg-emerald-100/30'
            }`}
            id="widget-cat-gratitude"
          >
            <Smile size={13} />
            কৃতজ্ঞতা অনুভূতি (Gratitude)
          </button>
        </div>

        {/* Input Text Box */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              category === 'deed'
                ? 'আজকে প্রশংসনীয় কী ভালো কাজ করলেন টুকে রাখুন...'
                : 'আজকের একটি ইতিবাচক ঘটনা যা আপনাকে আনন্দ দিয়েছে...'
            }
            maxLength={250}
            rows={2}
            className="w-full text-xs p-3 border border-emerald-550 border-emerald-100 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700/60 font-semibold bg-emerald-50/10 placeholder:text-slate-400"
            id="widget-reflection-input"
            required
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <span>মোট {toBengaliNumber(250 - text.length)} অক্ষর বাকি</span>
          <div className="flex items-center gap-1.5">
            {onClickTestIshaPopup && (
              <button
                type="button"
                onClick={onClickTestIshaPopup}
                className="px-2 py-1 bg-amber-50 text-amber-950 border border-amber-200/50 hover:bg-amber-100 font-black rounded-lg text-[9px] inline-flex items-center gap-1 transition-all cursor-pointer"
                title="ইশা আজানের পর স্বয়ংক্রিয়ভাবে পপআপ চালু হওয়ার ডেমো"
                id="widget-btn-test-popup"
              >
                পপআপ টেস্ট করুন ⚡
              </button>
            )}
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-800 text-white hover:bg-emerald-950 font-black rounded-lg inline-flex items-center gap-1 transition-all cursor-pointer"
              id="widget-btn-save"
            >
              <Plus size={13} />
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      </form>

      {/* Success Success feedback */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="my-3 py-2 text-center bg-emerald-50 text-emerald-850 font-bold border border-emerald-150 rounded-lg text-[11px]"
          >
            💖 আপনার সুন্দর অনুভূতিটি ডায়েরিতে সংরক্ষিত হয়েছে!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accordion History past logs drawer */}
      <div className="mt-4 pt-3.5 border-t border-emerald-50/60">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full text-xs font-extrabold text-emerald-900 border border-emerald-100 bg-emerald-50/20 py-2 px-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-emerald-50"
          id="btn-toggle-reflection-history"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-emerald-700" />
            পূর্ববর্তী সকল প্রতিফলন ও ডায়েরি ({toBengaliNumber(reflections.length)} টি)
          </span>
          {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showHistory && (
          <div className="mt-3 space-y-3 max-h-[300px] overflow-y-auto pr-1" id="history-container">
            {/* Filter buttons internally in history */}
            <div className="flex gap-1 mb-2 bg-emerald-50/20 p-1 rounded-lg border border-slate-100">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`flex-1 py-1 text-[9px] font-bold rounded cursor-pointer transition-all ${filterCategory === 'all' ? 'bg-white text-emerald-900 shadow-3xs hover:bg-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                সব
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('deed')}
                className={`flex-1 py-1 text-[9px] font-bold rounded cursor-pointer transition-all ${filterCategory === 'deed' ? 'bg-white text-emerald-900 shadow-3xs hover:bg-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                ভালো কাজ
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('gratitude')}
                className={`flex-1 py-1 text-[9px] font-bold rounded cursor-pointer transition-all ${filterCategory === 'gratitude' ? 'bg-white text-emerald-900 shadow-3xs hover:bg-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                কৃতজ্ঞতা
              </button>
            </div>

            {filteredRefReflections.length > 0 ? (
              filteredRefReflections.map(ref => (
                <div
                  key={ref.id}
                  className="p-3 bg-white border border-slate-100 rounded-xl relative hover:border-emerald-100 group flex items-start gap-2 text-left"
                >
                  <div className="mt-0.5 shrink-0">
                    {ref.category === 'deed' ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Award size={10} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Smile size={10} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold mb-1">
                      <span>{formatReflectionDate(ref.date)}</span>
                      <span>•</span>
                      <span className={ref.category === 'deed' ? 'text-emerald-700' : 'text-amber-700'}>
                        {ref.category === 'deed' ? 'ভালো কাজ' : 'কৃতজ্ঞতা ডায়েরি'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-950 font-bold">
                      {ref.text}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteReflection(ref.id)}
                    className="absolute right-2.5 top-2.5 text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md"
                    title="মুছে ফেলুন"
                    id={`btn-del-reflection-${ref.id}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-[10.5px] italic">
                কোনো প্রতিফলন খুঁজে পাওয়া যায়নি।
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
