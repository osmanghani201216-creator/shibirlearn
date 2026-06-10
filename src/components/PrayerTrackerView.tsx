import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  Check, 
  Heart, 
  RotateCcw, 
  TrendingUp, 
  FileText, 
  Activity, 
  BookOpen, 
  Eye, 
  Bookmark,
  Users,
  User,
  Coffee,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, query, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, isFirebaseEnabled } from '../firebase';

// Prayer states options
type PrayerStatus = 'pending' | 'performed_jamat' | 'performed_alone' | 'missed' | 'qaza_done' | 'excused';

interface SinglePrayerLog {
  status: PrayerStatus;
  loggedAt?: string;
}

interface DayPrayerLog {
  fajr: SinglePrayerLog;
  dhuhr: SinglePrayerLog;
  asr: SinglePrayerLog;
  maghrib: SinglePrayerLog;
  isha: SinglePrayerLog;
  tahajjud?: SinglePrayerLog;
  witr?: SinglePrayerLog;
  notes?: string;
}

interface SavedLogs {
  [dateKey: string]: DayPrayerLog; // dateKey: "YYYY-MM-DD"
}

// Initial/default template for a single day
const createEmptyDayLog = (): DayPrayerLog => ({
  fajr: { status: 'pending' },
  dhuhr: { status: 'pending' },
  asr: { status: 'pending' },
  maghrib: { status: 'pending' },
  isha: { status: 'pending' },
  tahajjud: { status: 'pending' },
  witr: { status: 'pending' },
  notes: ''
});

const PRAYER_METADATA = [
  { key: 'fajr', labelBn: 'ফজর (Fajr)', icon: '🌅', colorClass: 'border-orange-200 bg-orange-50/40 text-orange-850' },
  { key: 'dhuhr', labelBn: 'যোহর (Dhuhr)', icon: '☀️', colorClass: 'border-amber-200 bg-amber-50/40 text-amber-900' },
  { key: 'asr', labelBn: 'আসর (Asr)', icon: '🌤️', colorClass: 'border-sky-200 bg-sky-50/40 text-sky-900' },
  { key: 'maghrib', labelBn: 'মাগরিব (Maghrib)', icon: '🌇', colorClass: 'border-rose-200 bg-rose-50/40 text-rose-900' },
  { key: 'isha', labelBn: 'এশা (Isha)', icon: '🌃', colorClass: 'border-indigo-200 bg-indigo-50/40 text-indigo-900' },
  { key: 'tahajjud', labelBn: 'তাহাজ্জুদ (Tahajjud - নফল)', icon: '🌙', colorClass: 'border-violet-200 bg-violet-50/40 text-violet-900', isOptional: true },
  { key: 'witr', labelBn: 'বিতর (Witr - ওয়াজিব/সুন্নাত)', icon: '✨', colorClass: 'border-teal-200 bg-teal-50/40 text-teal-900', isOptional: true }
] as const;

const STATUS_OPTS = [
  { id: 'performed_jamat', labelBn: 'জামাতে পড়েছি', icon: <Users size={13} />, color: 'bg-emerald-600 text-white hover:bg-emerald-700', border: 'border-emerald-600' },
  { id: 'performed_alone', labelBn: 'একা পড়েছি', icon: <User size={13} />, color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-950', border: 'border-emerald-300' },
  { id: 'missed', labelBn: 'পড়া হয়নি (ক্বাজা)', icon: <XCircle size={13} />, color: 'bg-red-50 text-red-700 hover:bg-red-100', border: 'border-red-200' },
  { id: 'qaza_done', labelBn: 'ক্বাজা আদায় করেছি', icon: <CheckCircle2 size={13} />, color: 'bg-amber-100 text-amber-800 hover:bg-amber-200', border: 'border-amber-300' },
  { id: 'excused', labelBn: 'ছাড়যোগ্য (ওজর)', icon: <Coffee size={13} />, color: 'bg-slate-100 text-slate-600 hover:bg-slate-200', border: 'border-slate-300' },
  { id: 'pending', labelBn: 'চিহ্নিত নয়', icon: <Clock size={13} />, color: 'bg-slate-50 text-slate-400 hover:bg-slate-100', border: 'border-slate-200' }
];

export default function PrayerTrackerView({ onBack }: { onBack: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [logs, setLogs] = useState<SavedLogs>({});
  const [currentDayNotes, setCurrentDayNotes] = useState<string>('');
  const [streakDays, setStreakDays] = useState<number>(0);
  const [showHadith, setShowHadith] = useState<boolean>(true);
  const [chartMode, setChartMode] = useState<'ratio' | 'detailed'>('ratio');

  // Helper date key formatter (YYYY-MM-DD)
  const getDateKey = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const selectedKey = getDateKey(selectedDate);
  const currentLog = logs[selectedKey] || createEmptyDayLog();

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

  // Listen to cloud logs in real-time, or fetch from localstorage
  useEffect(() => {
    if (currentUser) {
      const path = `users/${currentUser.uid}/prayer_logs`;
      const q = query(collection(db, path));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded: SavedLogs = {};
        snapshot.forEach((snapDoc) => {
          loaded[snapDoc.id] = snapDoc.data() as DayPrayerLog;
        });
        setLogs(loaded);
        recalculateStreak(loaded);
      }, (error) => {
        // Safe wrap error matching strict rule constraint
        handleFirestoreError(error, OperationType.LIST, path);
      });
      
      return () => unsubscribe();
    } else {
      // Fallback offline storage
      const loadedRaw = localStorage.getItem('prayer_tracker_logs_db_v1');
      if (loadedRaw) {
        try {
          const parsed = JSON.parse(loadedRaw) as SavedLogs;
          setLogs(parsed);
          recalculateStreak(parsed);
        } catch (e) {
          console.error('Failed to parse prayer logs database', e);
        }
      } else {
        setLogs({});
        setStreakDays(0);
      }
    }
  }, [currentUser]);

  // Sync state notes with log
  useEffect(() => {
    setCurrentDayNotes(currentLog.notes || '');
  }, [selectedKey, logs]);

  // Save changes locally (only used for offline fallback)
  const saveLogsLocally = (updatedLogs: SavedLogs) => {
    localStorage.setItem('prayer_tracker_logs_db_v1', JSON.stringify(updatedLogs));
  };

  // Push individual day log to firestore
  const saveLogsToCloud = async (dateKey: string, dayLog: DayPrayerLog) => {
    if (currentUser) {
      const path = `users/${currentUser.uid}/prayer_logs`;
      
      // Map to Firestore conformant flat entities format
      const ishaState = dayLog.isha?.status || 'pending';
      const fajrState = dayLog.fajr?.status || 'pending';
      const dhuhrState = dayLog.dhuhr?.status || 'pending';
      const asrState = dayLog.asr?.status || 'pending';
      const maghribState = dayLog.maghrib?.status || 'pending';
      const tahajjudState = dayLog.tahajjud?.status || 'pending';
      const witrState = dayLog.witr?.status || 'pending';

      try {
        await setDoc(doc(db, path, dateKey), {
          date: dateKey,
          timestamp: Date.now(),
          userId: currentUser.uid,
          fajr: fajrState,
          dhuhr: dhuhrState,
          asr: asrState,
          maghrib: maghribState,
          isha: ishaState,
          tahajjud: tahajjudState,
          witr: witrState,
          notes: dayLog.notes || ''
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${path}/${dateKey}`);
      }
    }
  };

  // Save updates helper
  const saveLogs = async (updatedLogs: SavedLogs, targetDateKey: string) => {
    setLogs(updatedLogs);
    recalculateStreak(updatedLogs);

    if (currentUser) {
      const dayLog = updatedLogs[targetDateKey] || createEmptyDayLog();
      await saveLogsToCloud(targetDateKey, dayLog);
    } else {
      saveLogsLocally(updatedLogs);
    }
  };

  // Status updates for specific prayer key
  const setPrayerStatus = (prayerKey: keyof DayPrayerLog, status: PrayerStatus) => {
    const updated = { ...logs };
    if (!updated[selectedKey]) {
      updated[selectedKey] = createEmptyDayLog();
    }
    
    // Ensure nested object exists
    const prayerLogObj = updated[selectedKey][prayerKey];
    if (prayerLogObj && typeof prayerLogObj === 'object') {
      (updated[selectedKey][prayerKey] as SinglePrayerLog) = {
        status,
        loggedAt: new Date().toISOString()
      };
    } else {
      updated[selectedKey][prayerKey] = {
        status,
        loggedAt: new Date().toISOString()
      };
    }

    saveLogs(updated, selectedKey);
  };

  // Notes update handler
  const saveNotes = () => {
    const updated = { ...logs };
    if (!updated[selectedKey]) {
      updated[selectedKey] = createEmptyDayLog();
    }
    updated[selectedKey].notes = currentDayNotes;
    saveLogs(updated, selectedKey);
  };

  // Calculate Streak of continuous days having logged all 5 obligatory Fajr-Isha prayers as Performed (Jamat, Alone, or Excused)
  const recalculateStreak = (currentLogs: SavedLogs) => {
    let streak = 0;
    const tempDate = new Date();
    
    // Check backwards from today
    for (let i = 0; i < 40; i++) {
      const checkKey = getDateKey(tempDate);
      const dayLog = currentLogs[checkKey];
      
      if (!dayLog) {
        // If it is 'Today' and no log is found yet, we don't break the streak immediately
        if (i === 0) {
          tempDate.setDate(tempDate.getDate() - 1);
          continue;
        }
        break;
      }

      // Check 5 obligatory prayers
      const obligatories: (keyof DayPrayerLog)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const allPerformed = obligatories.every(pKey => {
        const pObj = dayLog[pKey];
        if (!pObj) return false;
        const status = (pObj as SinglePrayerLog).status;
        return status === 'performed_jamat' || status === 'performed_alone' || status === 'excused';
      });

      if (allPerformed) {
        streak++;
      } else {
        // Only break streak if it is not today (or if it is today and some prayers already missed)
        const hasMisses = obligatories.some(pKey => {
          const pObj = dayLog[pKey];
          return pObj && (pObj as SinglePrayerLog).status === 'missed';
        });

        if (i > 0 || hasMisses) {
          break;
        }
      }
      
      tempDate.setDate(tempDate.getDate() - 1);
    }
    
    setStreakDays(streak);
  };

  // Run streak recalculator when logs mounts
  useEffect(() => {
    recalculateStreak(logs);
  }, [logs]);

  // Navigate dates
  const changeDate = (daysOffset: number) => {
    const newD = new Date(selectedDate);
    newD.setDate(newD.getDate() + daysOffset);
    setSelectedDate(newD);
  };

  const setToday = () => {
    setSelectedDate(new Date());
  };

  // Generate 7-day strip centered around the selectedDate
  const getDayStrip = () => {
    const dates = [];
    const base = new Date(selectedDate);
    base.setDate(base.getDate() - 3); // Start 3 days back

    for (let i = 0; i < 7; i++) {
      dates.push(new Date(base));
      base.setDate(base.getDate() + 1);
    }
    return dates;
  };

  const dayStrip = getDayStrip();

  // Stats calculate
  const getSelectedDayStats = () => {
    const obligatories: (keyof DayPrayerLog)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let performed = 0;
    let missed = 0;
    let pending = 0;
    let excused = 0;

    obligatories.forEach(pKey => {
      const pObj = currentLog[pKey] as SinglePrayerLog;
      const status = pObj?.status || 'pending';
      if (status === 'performed_jamat' || status === 'performed_alone' || status === 'qaza_done') performed++;
      else if (status === 'missed') missed++;
      else if (status === 'excused') excused++;
      else pending++;
    });

    const totalCalculable = obligatories.length - excused;
    const pct = totalCalculable > 0 ? Math.round((performed / totalCalculable) * 100) : 100;

    return { performed, missed, pending, excused, pct };
  };

  const dayStats = getSelectedDayStats();

  // Weekly stats
  const getWeeklyCompletedCount = () => {
    let completed = 0;
    let totalObligatory = 0;
    const tempDate = new Date();
    
    for (let i = 0; i < 7; i++) {
      const key = getDateKey(tempDate);
      const dayLog = logs[key];
      if (dayLog) {
        const obligs: (keyof DayPrayerLog)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        obligs.forEach(pKey => {
          const status = (dayLog[pKey] as SinglePrayerLog)?.status || 'pending';
          if (status !== 'excused') {
            totalObligatory++;
            if (status === 'performed_jamat' || status === 'performed_alone' || status === 'qaza_done') {
              completed++;
            }
          }
        });
      } else {
        totalObligatory += 5;
      }
      tempDate.setDate(tempDate.getDate() - 1);
    }

    const pct = totalObligatory > 0 ? Math.round((completed / totalObligatory) * 100) : 0;
    return { completed, totalObligatory, pct };
  };

  const weeklyStats = getWeeklyCompletedCount();

  // Detail stats for Recharts weekly pie chart
  const getWeeklyDetailedStats = () => {
    let performedJamat = 0;
    let performedAlone = 0;
    let missed = 0;
    let qaza = 0;
    let excused = 0;
    let pending = 0;
    
    // Create an array mapping current logs for the past 7 days (ending today)
    const tempDate = new Date();
    for (let i = 0; i < 7; i++) {
      const key = getDateKey(tempDate);
      const dayLog = logs[key];
      const obligs: (keyof DayPrayerLog)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      
      obligs.forEach(pKey => {
        const status = (dayLog?.[pKey] as SinglePrayerLog)?.status || 'pending';
        if (status === 'performed_jamat') performedJamat++;
        else if (status === 'performed_alone') performedAlone++;
        else if (status === 'missed') missed++;
        else if (status === 'qaza_done') qaza++;
        else if (status === 'excused') excused++;
        else pending++;
      });
      tempDate.setDate(tempDate.getDate() - 1);
    }
    
    const totalObligatory = 35 - excused;
    const completed = performedJamat + performedAlone + qaza;
    const pct = totalObligatory > 0 ? Math.round((completed / totalObligatory) * 100) : 0;
    
    // Custom Bengali labels & values for Recharts data (Detailed Breakdown)
    const chartData = [
      { name: 'জামাতে আদায় (Jamat)', value: performedJamat, color: '#047857' }, // Emerald-700
      { name: 'একাকী আদায় (Alone)', value: performedAlone, color: '#0d9488' }, // Teal-600
      { name: 'ক্বাজা সম্পন্ন (Qaza)', value: qaza, color: '#d97706' }, // Amber-600
      { name: 'ছুটে গেছে (Missed)', value: missed, color: '#dc2626' }, // Red-600
      { name: 'ওজর/ছাড়যোগ্য (Excused)', value: excused, color: '#475569' }, // Slate-600
      { name: 'চিহ্নিত নয় (Pending)', value: pending, color: '#cbd5e1' }  // Slate-300
    ].filter(item => item.value > 0);

    // Default to keep Recharts from crashing on completely empty arrays
    if (chartData.length === 0) {
      chartData.push({ name: 'চিহ্নিত নয় (Pending)', value: 35, color: '#cbd5e1' });
    }

    // Performed vs Missed Ratio Data
    const performedCount = performedJamat + performedAlone + qaza;
    const missedCount = missed;
    const remainingCount = excused + pending;

    const ratioChartData = [
      { name: 'আদায়কৃত সালাত (Performed)', value: performedCount, color: '#10b981' }, // Emerald-500
      { name: 'ছুটে গেছে (Missed)', value: missedCount, color: '#ef4444' } // Red-500
    ].filter(item => item.value > 0);

    if (remainingCount > 0) {
      ratioChartData.push({ name: 'ছাড়যোগ্য/বাকি (Remaining)', value: remainingCount, color: '#e2e8f0' }); // Muted slate-200
    }

    if (ratioChartData.length === 0) {
      ratioChartData.push({ name: 'কোনো রেকর্ড নেই', value: 35, color: '#cbd5e1' });
    }

    // Ratio of completed over actually determined (completed + missed)
    const activeTotal = performedCount + missedCount;
    const ratioPct = activeTotal > 0 ? Math.round((performedCount / activeTotal) * 100) : 0;

    return {
      performedJamat,
      performedAlone,
      missed,
      qaza,
      excused,
      pending,
      completed,
      totalObligatory,
      pct,
      chartData,
      ratioChartData,
      performedCount,
      missedCount,
      remainingCount,
      ratioPct
    };
  };

  const detailedWeeklyStats = getWeeklyDetailedStats();

  const getWeeklyBarChartData = () => {
    const data = [];
    const tempDate = new Date();
    // Go back 6 days to start from 7 days ago, then increment forward
    tempDate.setDate(tempDate.getDate() - 6);
    
    const daysBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

    for (let i = 0; i < 7; i++) {
      const key = getDateKey(tempDate);
      const dayLog = logs[key];
      let performed = 0;
      let missed = 0;

      if (dayLog) {
        const obligs: (keyof DayPrayerLog)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        obligs.forEach(pKey => {
          const status = (dayLog[pKey] as SinglePrayerLog)?.status || 'pending';
          if (status === 'performed_jamat' || status === 'performed_alone' || status === 'qaza_done') {
            performed++;
          } else if (status === 'missed') {
            missed++;
          }
        });
      }

      const dayLabel = `${daysBn[tempDate.getDay()]} (${toBengaliNumber(tempDate.getDate())})`;
      data.push({
        name: dayLabel,
        'আদায়কৃত': performed,
        'ছুটে গেছে': missed,
      });

      tempDate.setDate(tempDate.getDate() + 1);
    }
    return data;
  };

  const weeklyBarChartData = getWeeklyBarChartData();

  // Custom formatted date
  const formatBanglaDate = (date: Date) => {
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    const dayName = days[date.getDay()];
    const dayBn = toBengaliNumber(date.getDate());
    const monthName = months[date.getMonth()];
    const yearBn = toBengaliNumber(date.getFullYear());

    return `${dayName}, ${dayBn} ${monthName} ${yearBn}`;
  };

  // Status visual colors
  const getStatusPillAndText = (status: PrayerStatus) => {
    switch (status) {
      case 'performed_jamat':
        return { label: 'জামাতে আদায়কৃত', colorClass: 'bg-emerald-600 text-white' };
      case 'performed_alone':
        return { label: 'একাকী আদায়কৃত', colorClass: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'missed':
        return { label: 'ছুটে গেছে', colorClass: 'bg-red-50 text-red-700 border-red-250' };
      case 'qaza_done':
        return { label: 'ক্বাজা সম্পন্ন', colorClass: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'excused':
        return { label: 'জরুরি ওজর', colorClass: 'bg-slate-100 text-slate-600 border-slate-200' };
      default:
        return { label: 'অপেক্ষমাণ', colorClass: 'bg-slate-50 text-slate-400 border-dashed border-slate-300' };
    }
  };

  // Reset current day's logs
  const handleResetDay = () => {
    if (window.confirm('আপনার কি এই দিনের সকল সালাতের হিসেব মুছে নতুন করে শুরু করতে চান?')) {
      const updated = { ...logs };
      updated[selectedKey] = createEmptyDayLog();
      saveLogs(updated, selectedKey);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="prayer-tracker-root">
      
      {/* 1. APP HERO SECTION */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer shrink-0"
            id="prayer-tracker-back-btn"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-white p-3 rounded-2xl shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                সহজ সালাত ট্র্যাকার (Prayer Tracker)
              </h1>
              <p className="text-xs text-emerald-700 font-semibold leading-normal mt-0.5">
                প্রতিদিন আপনার ৫ ওয়াক্ত সালাত আদায়ের হিসেব রাখুন এবং সুন্দর গ্রাফের মাধ্যমে অগ্রগতির পরিসংখ্যান দেখুন
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Streak Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-150 px-5 py-3 rounded-2xl shrink-0 shadow-xs animate-pulse">
          <Award className="text-orange-600 size-6 shrink-0" />
          <div>
            <div className="text-[10px] text-orange-950 font-black tracking-wider uppercase">বর্তমান সালাত স্ট্রিক</div>
            <div className="text-base font-black text-slate-900 font-sans">
              {toBengaliNumber(streakDays)} দিন টানা নিয়মিত সালাত
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        
        {/* Today Completion Card */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl hover:shadow-xs transition-shadow relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 text-emerald-800 shrink-0">
            <Activity size={90} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md">আজকের অগ্রগতি</span>
            <span className="font-sans text-xs bg-slate-150 font-bold text-slate-800 px-2 py-0.5 rounded-sm">আজ</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 font-sans">{toBengaliNumber(dayStats.performed)}</span>
            <span className="text-slate-500 text-xs font-sans">/ ৫ ওয়াক্ত</span>
          </div>
          <div className="mt-2.5 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${dayStats.pct}%` }} 
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">আজকের দিনের সালাত সম্পাদন হার {toBengaliNumber(dayStats.pct)}%</p>
        </div>

        {/* Weekly Progress Card */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl hover:shadow-xs transition-shadow relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 text-sky-850 shrink-0">
            <TrendingUp size={90} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md">সাপ্তাহিক রিপোর্ট</span>
            <span className="font-sans text-xs bg-slate-150 font-bold text-slate-800 px-2 py-0.5 rounded-sm">৭ দিন</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-950 font-sans">
              {toBengaliNumber(weeklyStats.completed)}
            </span>
            <span className="text-slate-500 text-xs font-sans">ওয়াক্ত</span>
          </div>
          <div className="mt-2.5 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${weeklyStats.pct}%` }} 
            />
          </div>
          <p className="text-[10px] text-indigo-950 font-medium mt-2">বিগত ৭ দিনে ৩৫ ওয়াক্তের মধ্যে {toBengaliNumber(weeklyStats.completed)} ওয়াক্ত আদায়কৃত</p>
        </div>

        {/* Prayer Quote Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <BookOpen size={20} className="text-emerald-300" />
            <span className="text-[10px] font-bold text-emerald-100 bg-emerald-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">কুরআনের বাণী</span>
          </div>
          <div>
            <p className="text-xs leading-relaxed font-semibold italic text-emerald-50 mt-3">
              "নিশ্চয়ই সালাত মানুষকে অশ্লীল ও মন্দ কাজ থেকে বিরত রাখে।"
            </p>
            <div className="text-[10px] text-emerald-300/90 font-bold mt-2 text-right">
              — সূরা আল-আনকাবুত: ৪৫
            </div>
          </div>
        </div>
      </div>

      {/* 2.1 WEEKLY PIE CHART & ANALYTICS SECTION */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8" id="weekly-analysis-chart-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                সাপ্তাহিক সালাত বিশ্লেষণ ও পাই চার্ট (Weekly Prayer Insights & Chart)
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans">
                {chartMode === 'ratio' ? 'বিগত ৭ দিনে আদায়কৃত বনাম ছুটে যাওয়া সালাতের শতকরা অনুপাত' : 'বিগত ৭ দিনের ৩৫ ওয়াক্ত সালাত সম্পাদন হারের বিস্তারিত তথ্যচিত্র'}
              </p>
            </div>
          </div>
          
          {/* Chart mode selection tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start sm:self-center">
            <button
              onClick={() => setChartMode('ratio')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                chartMode === 'ratio'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              আদায় বনাম বাদ (Ratio)
            </button>
            <button
              onClick={() => setChartMode('detailed')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                chartMode === 'detailed'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বিস্তারিত বণ্টন (Details)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Detailed Stats & Insights column */}
          <div className="md:col-span-7 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
              <div className="bg-emerald-50/40 border border-emerald-100/50 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-emerald-800 font-extrabold block">জামাতে আদায়</span>
                <span className="text-xl font-black text-emerald-950 block mt-1">
                  {toBengaliNumber(detailedWeeklyStats.performedJamat)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">ওয়াক্ত</span>
              </div>
              <div className="bg-teal-50/40 border border-teal-100/50 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-teal-800 font-extrabold block">একাকী আদায়</span>
                <span className="text-xl font-black text-teal-950 block mt-1">
                  {toBengaliNumber(detailedWeeklyStats.performedAlone)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">ওয়াক্ত</span>
              </div>
              <div className="bg-amber-50/40 border border-amber-100/50 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-amber-800 font-extrabold block">ক্বাজা সম্পন্ন</span>
                <span className="text-xl font-black text-amber-950 block mt-1">
                  {toBengaliNumber(detailedWeeklyStats.qaza)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">ওয়াক্ত</span>
              </div>
              <div className="bg-red-50/40 border border-red-100/50 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-red-800 font-extrabold block">ছুটে গেছে</span>
                <span className="text-xl font-black text-red-950 block mt-1">
                  {toBengaliNumber(detailedWeeklyStats.missed)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">ওয়াক্ত</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-600 font-extrabold block">ওজর/ছাড়যোগ্য</span>
                <span className="text-xl font-black text-slate-900 block mt-1">
                  {toBengaliNumber(detailedWeeklyStats.excused)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">ওয়াক্ত</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-100/40 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 font-extrabold block">বাকি/চিহ্নিত নয়</span>
                <span className="text-xl font-black text-slate-400 block mt-1">
                  {toBengaliNumber(detailedWeeklyStats.pending)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">ওয়াক্ত</span>
              </div>
            </div>

            {/* AI/Insight comment based on completion percentage */}
            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl flex items-start gap-3">
              <Sparkles className="text-amber-500 size-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-slate-800">সাপ্তাহিক রিয়েল-টাইম মূল্যায়ন ও পরামর্শ</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                  {chartMode === 'ratio' ? (
                    detailedWeeklyStats.performedCount + detailedWeeklyStats.missedCount === 0 ? (
                      <span>বিগত ৭ দিনে কোনো আদায়কৃত বা ছুটে যাওয়া সালাত ট্র্যাকিং ডেটা রেকর্ড করা হয়নি। নিয়মিত ট্র্যাকিং শুরু করুন!</span>
                    ) : (
                      <span>আপনার মোট নির্ধারিত সালাতগুলোর মধ্যে সফলভাবে আদায় করেছেন <strong>{toBengaliNumber(detailedWeeklyStats.performedCount)} ওয়াক্ত</strong> এবং অলসতা/অসাবধানতাবশত বাদ পড়েছে <strong>{toBengaliNumber(detailedWeeklyStats.missedCount)} ওয়াক্ত</strong>। বিগত ৭ দিনের আদায়কৃত সালাতের হার আপনার ছুটে যাওয়া সালাতের চেয়ে <strong>{toBengaliNumber(detailedWeeklyStats.ratioPct)}% সফল!</strong></span>
                    )
                  ) : (
                    detailedWeeklyStats.pct >= 85 ? (
                      <span>মাশাআল্লাহ! বিগত ৭ দিনে আপনার সালাত আদায়ের হার অত্যন্ত চমৎকার ও নিয়মতান্ত্রিক ({toBengaliNumber(detailedWeeklyStats.pct)}%)। আপনার আধ্যা্তিক একাগ্রতা ও দ্বীনের ওপর ইস্তেকামাত বজায় রাখতে দোয়া করি। জামাতে আদায়ে আরও প্রেষণা দিন!</span>
                    ) : detailedWeeklyStats.pct >= 50 ? (
                      <span>আলহামদুলিল্লাহ, আপনার সালাত আদায়ের হার {toBengaliNumber(detailedWeeklyStats.pct)}%। চেষ্টা বাড়াতে হবে যাতে অলসতা কাটিয়ে ছুটে যাওয়া ও ক্বাজা সালাতের সংখ্যা শূন্যের কোঠায় নামিয়ে আনা যায়। জামাতের চেষ্টা বৃদ্ধি করুন।</span>
                    ) : detailedWeeklyStats.completed > 0 ? (
                      <span>আপনার সালাত ট্র্যাকার রেকর্ড বলছে ৫ ওয়াক্ত নিয়মিত আদায়ে আরেকটু যত্নবান হওয়া প্রয়োজন ({toBengaliNumber(detailedWeeklyStats.pct)}%)। অলসতা ও কাজের ফাঁকেও সালাতের ওয়াক্তগুলো আগেভাগে নির্ধারণ করুন, আল্লাহ সহায় হোন।</span>
                    ) : (
                      <span>বিগত ৭ দিনে এখনো কোনো সালাত ট্র্যাকিং সম্পন্ন হয়নি! আপনার সালাত আদায়ের সুন্দর ও নিয়মতান্ত্রিক রেকর্ড ধরে রাখতে ওপরের ওয়াক্তসমূহের তালিকা চিহ্নিত করা শুরু করুন।</span>
                    )
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Pie Chart column */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 p-4 rounded-2xl animate-fade-in" id="recharts-pie-container">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 font-sans">
              {chartMode === 'ratio' ? 'সালাত আদায় বনাম ছুট রেশিও' : 'সালাত বণ্টনের শতকরা অনুপাত'}
            </span>
            
            <div className="w-full h-56 font-sans relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartMode === 'ratio' ? detailedWeeklyStats.ratioChartData : detailedWeeklyStats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(chartMode === 'ratio' ? detailedWeeklyStats.ratioChartData : detailedWeeklyStats.chartData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${toBengaliNumber(Number(value))} ওয়াক্ত`, name]}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Central textual percentage indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-emerald-950 font-sans tracking-tight">
                  {toBengaliNumber(chartMode === 'ratio' ? detailedWeeklyStats.ratioPct : detailedWeeklyStats.pct)}%
                </span>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                  {chartMode === 'ratio' ? 'সাফল্য হার' : 'আদায়কৃত'}
                </span>
              </div>
            </div>

            {/* Custom Pie Chart Legends */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-3 max-w-sm">
              {(chartMode === 'ratio' ? detailedWeeklyStats.ratioChartData : detailedWeeklyStats.chartData).map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-slate-600 font-extrabold font-sans">
                    {entry.name}: {toBengaliNumber(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2.2 WEEKLY SUMMARY BAR CHART CARD */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 transition-all" id="weekly-bar-chart-section">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              সাপ্তাহিক সংক্ষিপ্ত বিবরণ ও সালাত বার চার্ট (Weekly Summary & Bar Chart)
            </h3>
            <p className="text-xs text-slate-500 font-semibold font-sans">
              বিগত ৭ দিনে দৈনিক আদায়কৃত বনাম ছুটে যাওয়া সালাত ওয়াক্তের তুলনা (সর্বোচ্চ ৫ ওয়াক্ত)
            </p>
          </div>
        </div>

        <div className="w-full h-80 font-sans relative p-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyBarChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                allowDecimals={false} 
                domain={[0, 5]} 
              />
              <Tooltip
                formatter={(value, name) => [`${toBengaliNumber(Number(value))} ওয়াক্ত`, name]}
                contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif', backgroundColor: '#ffffff', color: '#1e293b' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} 
              />
              <Bar name="আদায়কৃত সালাত" dataKey="আদায়কৃত" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar name="ছুটে যাওয়া সালাত" dataKey="ছুটে গেছে" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. INTERACTIVE CALENDAR DATE STRIP */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-emerald-800 shrink-0" size={18} />
            <h3 className="text-sm font-black text-slate-900">
              {formatBanglaDate(selectedDate)}
            </h3>
            {selectedDate.toDateString() !== new Date().toDateString() && (
              <button
                onClick={setToday}
                className="text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 cursor-pointer transition-all rounded-md"
              >
                আজকে যান
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => changeDate(-1)}
              className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 cursor-pointer rounded-lg transition-colors"
              title="পূর্ববর্তী দিন"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => changeDate(1)}
              className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 cursor-pointer rounded-lg transition-colors"
              title="পরবর্তী দিন"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Date Stripe Buttons */}
        <div className="grid grid-cols-7 gap-2">
          {dayStrip.map((day, idx) => {
            const isSelected = day.toDateString() === selectedDate.toDateString();
            const isToday = day.toDateString() === new Date().toDateString();
            const key = getDateKey(day);
            const dayLogObj = logs[key];
            
            // Count performed prayers for mini badge visual
            const obligs: (keyof DayPrayerLog)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
            let doneCount = 0;
            if (dayLogObj) {
              obligs.forEach(k => {
                const s = (dayLogObj[k] as SinglePrayerLog)?.status;
                if (s === 'performed_jamat' || s === 'performed_alone' || s === 'qaza_done') doneCount++;
              });
            }

            const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

            return (
              <motion.button
                key={idx}
                onClick={() => setSelectedDate(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 flex flex-col items-center justify-between rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' 
                    : isToday 
                    ? 'border-amber-400 bg-amber-50/20' 
                    : 'border-slate-100 hover:border-slate-250 hover:bg-slate-50/30'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  {dayNames[day.getDay()]}
                </span>
                
                <span className={`text-[13px] font-black leading-tight flex items-center justify-center font-sans h-6 w-6 rounded-full ${
                  isSelected 
                    ? 'text-white bg-emerald-800' 
                    : isToday 
                    ? 'text-amber-800 bg-amber-100 font-extrabold' 
                    : 'text-slate-700'
                }`}>
                  {toBengaliNumber(day.getDate())}
                </span>

                {/* Micro indicators for registered prayers */}
                <div className="flex gap-0.5 mt-2 overflow-hidden h-1 items-center justify-center">
                  {[1, 2, 3, 4, 5].map((bulletIdx) => {
                    const isBulletActive = doneCount >= bulletIdx;
                    return (
                      <span 
                        key={bulletIdx} 
                        className={`w-1 h-1 rounded-full ${
                          isBulletActive ? 'bg-emerald-600' : 'bg-slate-200'
                        }`} 
                      />
                    );
                  })}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTUAL PRAYERS ACTION PANEL LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side 2/3: Prayers logger list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Clock size={16} className="text-emerald-800" />
              আজকের ওয়াক্ত সমূহ
            </h3>
            
            <button
              onClick={handleResetDay}
              className="text-[10px] font-bold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100/70 border border-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              দিনের তালিকা রিসেট
            </button>
          </div>

          <div className="space-y-3">
            {PRAYER_METADATA.map((prayer) => {
              const logEntry = currentLog[prayer.key] as SinglePrayerLog;
              const currentStatus = logEntry?.status || 'pending';
              const visual = getStatusPillAndText(currentStatus);

              return (
                <div 
                  key={prayer.key}
                  className={`bg-white border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-xs ${
                    currentStatus !== 'pending' ? 'border-emerald-100' : 'border-slate-100'
                  }`}
                  id={`prayer-row-${prayer.key}`}
                >
                  {/* Left Label of prayer info */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label="prayer-icon">
                      {prayer.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">
                          {prayer.labelBn}
                        </h4>
                        {'isOptional' in prayer && prayer.isOptional && (
                          <span className="text-[9px] font-bold bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded-sm">
                            নফল/ঐচ্ছিক
                          </span>
                        )}
                      </div>
                      
                      {/* Current active status feedback */}
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center gap-1 font-sans">
                        বর্তমান অবস্থা: 
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black ${visual.colorClass}`}>
                          {visual.label}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right interactive button triggers for logging prayer status */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {STATUS_OPTS.map((opt) => {
                      const isActive = currentStatus === opt.id;
                      
                      // Filter options slightly for optional/sunnah prayers (optional prayers don't need 'qaza' or 'jamat' generally)
                      if ('isOptional' in prayer && prayer.isOptional && (opt.id === 'performed_jamat' || opt.id === 'qaza_done')) {
                        return null; 
                      }

                      return (
                        <motion.button
                          key={opt.id}
                          onClick={() => setPrayerStatus(prayer.key, opt.id as PrayerStatus)}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive 
                              ? `${opt.color} shadow-xs font-bold` 
                              : `bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/60`
                          }`}
                          id={`btn-${prayer.key}-${opt.id}`}
                        >
                          {isActive ? (
                            <motion.span
                              initial={{ scale: 0.6, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              className="inline-flex items-center"
                            >
                              {opt.icon}
                            </motion.span>
                          ) : (
                            opt.icon
                          )}
                          <span>{opt.labelBn}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side 1/3: Daily Spiritual Notes / Reminders */}
        <div className="space-y-6">
          
          {/* Notes Card */}
          <div className="bg-white border border-emerald-100 p-5 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText size={15} className="text-emerald-700" />
              আজকের দিনলিপি / নোটস (Notes)
            </h3>
            
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              সালাত আদায়ের ফিলিংস, বিশেষ দোয়া বা দিনটি নিয়ে আধ্যাত্মিক কোনো অনুভূতি লিখে রাখতে পারেন।
            </p>

            <textarea
              placeholder="আজকে প্রথম তকবিরে দাঁড়িয়ে খুশু-খুশু উপভোগ করেছি..."
              value={currentDayNotes}
              onChange={(e) => setCurrentDayNotes(e.target.value)}
              className="w-full h-28 p-3 text-xs bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl text-slate-800 font-sans resize-none"
              id="prayer-tracker-notes-textarea"
            />

            <button
              onClick={saveNotes}
              className="w-full bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check size={14} />
              <span>নোটস সংরক্ষণ করুন</span>
            </button>
          </div>

          {/* Guidelines and Q&As */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle size={15} />
              প্রয়োজনীয় গাইডলাইন
            </h4>
            
            <div className="space-y-3 font-sans text-[11px] text-emerald-950/90 leading-relaxed">
              <div>
                <span className="font-extrabold text-emerald-900">জামাতে সালাত আদায়ের ফযীলত:</span>
                <p className="mt-0.5">রাসূলুল্লাহ (সাঃ) বলেছেন, জামাতে সালাত আদায়ের ফযীলত একাকী আদায়ের চেয়ে ২৭ গুণ বেশি। এ কারণে সম্ভব হলে "জামাতে পড়েছি" মার্ক করুন।</p>
              </div>
              <hr className="border-emerald-150" />
              <div>
                <span className="font-extrabold text-emerald-900">ক্বাজা নামাজ আদায়:</span>
                <p className="mt-0.5">ভুলবশত বা ইচ্ছাকৃত কোনো সালাত ছুটে গেলে দ্রুত তা কাজা আদায় করে ট্র্যাকার-এ "ক্বাজা আদায় করেছি" দিয়ে আপডেট করুন।</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
