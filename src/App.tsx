/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, ViewType, CustomReminder } from './types';
import { getBengaliDate, toBengaliNumber } from './utils/bengaliDate';
import { getHijriDate } from './utils/hijriDate';
import { calculatePrayerTimes, timeToMinutes, formatTimeBn, BANGLADESH_DISTRICTS } from './utils/prayerTimes';
import { audioSynth } from './utils/audioSynth';

// Subcomponents
import CalendarView from './components/CalendarView';
import MosqueView from './components/MosqueView';
import SettingsView from './components/SettingsView';
import CustomNotificationView from './components/CustomNotificationView';
import OnlineLibraryView from './components/OnlineLibraryView';
import DailyWisdomView from './components/DailyWisdomView';
import BoardBooksView from './components/BoardBooksView';
import ITCoursesView from './components/ITCoursesView';
import SpokenEnglishView from './components/SpokenEnglishView';
import PrayerTrackerView from './components/PrayerTrackerView';
import HistoryView from './components/HistoryView';
import QuranHadithEasyWayView from './components/QuranHadithEasyWayView';
import IslamicQuizView from './components/IslamicQuizView';
import ZakatCalculatorView from './components/ZakatCalculatorView';
import DailyReflectionView from './components/DailyReflectionView';
import ShareModal from './components/ShareModal';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, logoutUser, isFirebaseEnabled } from './firebase';

// Icons
import {
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  Bell,
  Share2,
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  Compass,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle,
  FlameKindling,
  BookOpen,
  Laptop,
  Languages,
  History,
  HelpCircle,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function ShibirLogo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" referrerPolicy="no-referrer">
      <polygon points="50,5 95,38 78,92 22,92 5,38" fill="#38bdf8" />
      <polygon points="50,15 85,41 72,83 28,83 15,41" stroke="#991b1b" strokeWidth="1.5" fill="none" />
      <path d="M 33 60 A 24 24 0 1 0 75 52 A 20 20 0 1 1 33 60" fill="#ffffff" />
      <path d="M 41 33 L 42.5 37 L 46.5 37 L 43.5 39.5 L 44.5 43.5 L 41 41 L 37.5 43.5 L 38.5 39.5 L 35.5 37 L 39.5 37 Z" fill="#ffffff" />
      <text x="50" y="58" fill="#e11d48" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        الله أكبر
      </text>
    </svg>
  );
}

// Setup default app settings
const DEFAULT_SETTINGS: AppSettings = {
  selectedDistrictId: 'dhaka',
  juristicSchool: 'hanafi',
  alarmVolume: 0.5,
  isMuted: false,
  offsets: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  alarmSoundType: 'melody',
  enabledNotifications: {
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  },
  darkMode: false,
  selectedAdhanSample: 'synth_classic',
  customAdhanBase64: '',
  customAdhanName: ''
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled) {
      setUser(null);
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [activeView, setActiveView] = useState<ViewType>('home');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);
  const [showReflectionPopup, setShowReflectionPopup] = useState(false);
  const [activeAlertLabel, setActiveAlertLabel] = useState('');
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [hasCompassSupport, setHasCompassSupport] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mouseBearing, setMouseBearing] = useState(0); // mock rotational bearing for desktop users
  
  // App settings state with fallback loading from LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('prayer_times_settings');
    if (saved) return JSON.parse(saved);
    return DEFAULT_SETTINGS;
  });

  // Load custom alerts setup
  const [customReminders, setCustomReminders] = useState<CustomReminder[]>(() => {
    const saved = localStorage.getItem('custom_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Reference for the audio alert interval triggers
  const completedTriggersRef = useRef<Set<string>>(new Set());

  // Set up dynamic running clock
  useEffect(() => {
    // Standard clock runner (speed matches real time)
    const interval = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync settings updates
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('prayer_times_settings', JSON.stringify(newSettings));
  };

  // Reload custom reminders when tab changes
  useEffect(() => {
    if (activeView === 'home') {
      const saved = localStorage.getItem('custom_reminders');
      if (saved) setCustomReminders(JSON.parse(saved));
    }
  }, [activeView]);

  // Handle Compass Device orientation or mouse drag simulator
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHasCompassSupport(true);
        // Qibla direction from Bangladesh is approx 273 degrees (West-Northwest)
        // alpha goes 0 to 360 degrees
        setMouseBearing(e.alpha);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const pTimes = calculatePrayerTimes(
    currentTime,
    settings.selectedDistrictId,
    settings.juristicSchool,
    settings.offsets
  );

  const activeDistrict = BANGLADESH_DISTRICTS.find((d) => d.id === settings.selectedDistrictId) || BANGLADESH_DISTRICTS[0];

  // Convert current hours/mins to minutes for comparisons
  const curHours = currentTime.getHours();
  const curMins = currentTime.getMinutes();
  const currentTotalMins = curHours * 60 + curMins;

  // Specific absolute timings in minutes
  const fMin = timeToMinutes(pTimes.fajr);
  const srMin = timeToMinutes(pTimes.sunrise);
  const dhMin = timeToMinutes(pTimes.dhuhr);
  const asMin = timeToMinutes(pTimes.asr);
  const mgMin = timeToMinutes(pTimes.maghrib);
  const isMin = timeToMinutes(pTimes.isha);

  // Forbidden ranges in minutes
  const forbiddenSrEnd = timeToMinutes(pTimes.forbiddenSunriseEnd);
  const forbiddenZwStart = timeToMinutes(pTimes.forbiddenZawalStart);
  const forbiddenZwEnd = timeToMinutes(pTimes.forbiddenZawalEnd);
  const forbiddenSsStart = timeToMinutes(pTimes.forbiddenSunsetStart);
  const forbiddenSsEnd = timeToMinutes(pTimes.forbiddenSunsetEnd);

  // Determine current active block & remaining minutes
  let currentWaqt = '';
  let currentRange = '';
  let nextWaqt = '';
  let nextWaqtTimeStr = '';
  let minsRemaining = 0;

  if (currentTotalMins >= fMin && currentTotalMins < srMin) {
    currentWaqt = 'fajr';
    currentRange = `${pTimes.fajr} - ${pTimes.sunrise}`;
    nextWaqt = 'সূর্যোদয়';
    nextWaqtTimeStr = pTimes.sunrise;
    minsRemaining = srMin - currentTotalMins;
  } else if (currentTotalMins >= srMin && currentTotalMins < dhMin) {
    // Morning post-sun, not an official waqt but let's label elegantly
    currentWaqt = 'sunrise';
    currentRange = `${pTimes.sunrise} - ${pTimes.dhuhr}`;
    nextWaqt = 'যুহর';
    nextWaqtTimeStr = pTimes.dhuhr;
    minsRemaining = dhMin - currentTotalMins;
  } else if (currentTotalMins >= dhMin && currentTotalMins < asMin) {
    currentWaqt = 'dhuhr';
    currentRange = `${pTimes.dhuhr} - ${pTimes.asr}`;
    nextWaqt = 'আসর';
    nextWaqtTimeStr = pTimes.asr;
    minsRemaining = asMin - currentTotalMins;
  } else if (currentTotalMins >= asMin && currentTotalMins < mgMin) {
    currentWaqt = 'asr';
    currentRange = `${pTimes.asr} - ${pTimes.maghrib}`;
    nextWaqt = 'মাগরিব';
    nextWaqtTimeStr = pTimes.maghrib;
    minsRemaining = mgMin - currentTotalMins;
  } else if (currentTotalMins >= mgMin && currentTotalMins < isMin) {
    currentWaqt = 'maghrib';
    currentRange = `${pTimes.maghrib} - ${pTimes.isha}`;
    nextWaqt = 'ইশা';
    nextWaqtTimeStr = pTimes.isha;
    minsRemaining = isMin - currentTotalMins;
  } else {
    currentWaqt = 'isha';
    currentRange = `${pTimes.isha} - ${pTimes.fajr}`;
    nextWaqt = 'ফজর';
    nextWaqtTimeStr = pTimes.fajr;
    // Calculates through midnight wrapping
    if (currentTotalMins >= isMin) {
      minsRemaining = (1440 - currentTotalMins) + fMin;
    } else {
      minsRemaining = fMin - currentTotalMins;
    }
  }

  // Check if forbidden prayer time is active
  let isForbiddenActive = false;
  let activeForbiddenLabel = '';
  let activeForbiddenRange = '';

  if (currentTotalMins >= srMin && currentTotalMins <= forbiddenSrEnd) {
    isForbiddenActive = true;
    activeForbiddenLabel = 'সূর্যোদয় (Sunrise)';
    activeForbiddenRange = `${pTimes.sunrise} - ${pTimes.forbiddenSunriseEnd}`;
  } else if (currentTotalMins >= forbiddenZwStart && currentTotalMins <= forbiddenZwEnd) {
    isForbiddenActive = true;
    activeForbiddenLabel = 'দুপুর জাওয়াল (Zawal/Noon)';
    activeForbiddenRange = `${pTimes.forbiddenZawalStart} - ${pTimes.forbiddenZawalEnd}`;
  } else if (currentTotalMins >= forbiddenSsStart && currentTotalMins <= forbiddenSsEnd) {
    isForbiddenActive = true;
    activeForbiddenLabel = 'সূর্যাস্ত (Sunset / Maghrib Pre-time)';
    activeForbiddenRange = `${pTimes.forbiddenSunsetStart} - ${pTimes.forbiddenSunsetEnd}`;
  }

  // Format dynamic Countdown Text
  const remHours = Math.floor(minsRemaining / 60);
  const remMins = minsRemaining % 60;
  const countdownText = `${remHours > 0 ? toBengaliNumber(remHours) + ' ঘণ্টা ' : ''}${toBengaliNumber(remMins)} মিনিট`;

  // Daily alert notification scheduler running on current clock updates
  useEffect(() => {
    const hmStr = `${curHours.toString().padStart(2, '0')}:${curMins.toString().padStart(2, '0')}`;
    const triggerKey = `${hmStr}-${currentTime.getDate()}`;

    if (completedTriggersRef.current.has(triggerKey)) return;

    // Check main Waqt targets for enabled system notifications
    const waqtKeys: { [key: string]: keyof AppSettings['enabledNotifications'] } = {
      [pTimes.fajr]: 'fajr',
      [pTimes.sunrise]: 'sunrise',
      [pTimes.dhuhr]: 'dhuhr',
      [pTimes.asr]: 'asr',
      [pTimes.maghrib]: 'maghrib',
      [pTimes.isha]: 'isha'
    };

    const targetWaqtMatch = Object.keys(waqtKeys).find(t => t === hmStr);
    
    if (targetWaqtMatch) {
      const pKey = waqtKeys[targetWaqtMatch];
      const isEnabled = settings.enabledNotifications[pKey];

      if (isEnabled && !settings.isMuted) {
        // Trigger sound & alert
        completedTriggersRef.current.add(triggerKey);
        setIsPlayingAlert(true);
        const nameBn = pKey === 'fajr' ? 'ফজর' : pKey === 'sunrise' ? 'সূর্যোদয়' : pKey === 'dhuhr' ? 'যুহর' : pKey === 'asr' ? 'আসর' : pKey === 'maghrib' ? 'মাগরিব' : 'ইশা';
        setActiveAlertLabel(`আজানের সময় হয়েছে! পবিত্র ${nameBn} নামাজের ওয়াক্ত শুরু হয়েছে।`);
        audioSynth.play(settings.alarmSoundType, settings.alarmVolume, settings.selectedAdhanSample, settings.customAdhanBase64);

        // Native browser notification if allowed
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('নামাজের সময়সূচী', {
            body: `পবিত্র ${nameBn} নামাজের সময় হয়েছে (${targetWaqtMatch})।`,
            icon: '/favicon.ico'
          });
        }

        if (pKey === 'isha') {
          setShowReflectionPopup(true);
        }
      }
    }

    // Check Custom reminders
    customReminders.forEach((rem) => {
      if (!rem.isEnabled || settings.isMuted) return;

      // Anchor Waqt target in minutes
      const pTimeStr = pTimes[rem.prayerKey as keyof typeof pTimes] || pTimes.fajr;
      const anchorMin = timeToMinutes(pTimeStr);
      const targetMin = (anchorMin - rem.minutesBefore + 1440) % 1440;
      
      if (currentTotalMins === targetMin) {
        completedTriggersRef.current.add(triggerKey);
        setIsPlayingAlert(true);
        setActiveAlertLabel(`স্মার্ট এলার্ম: ${rem.label}`);
        audioSynth.play(rem.soundType, settings.alarmVolume, settings.selectedAdhanSample, settings.customAdhanBase64);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('নামাজের এলার্ম অ্যালার্ট', {
            body: rem.label,
            icon: '/favicon.ico'
          });
        }
      }
    });

  }, [currentTime, pTimes, settings, customReminders, curHours, curMins, currentTotalMins]);

  // Request Notifications Permissions
  const handleRequestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setShowNotificationPrompt(false);
        }
      });
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowNotificationPrompt(true);
    }
  }, []);

  const dismissAlertSound = () => {
    setIsPlayingAlert(false);
    setActiveAlertLabel('');
  };

  const getWaqtNameBn = (key: string) => {
    const names: { [k: string]: string } = {
      fajr: 'ফজর',
      sunrise: 'সূর্যোদয়',
      dhuhr: 'যুহর',
      asr: 'আসর',
      maghrib: 'মাগরিব',
      isha: 'ইশা'
    };
    return names[key] || key;
  };

  // Convert numerical bearing to nice compass textual direction
  const getQiblaCompassRotationStyle = () => {
    // Qibla direction index in Bangladesh is ~273 degrees.
    // We adjust it by mouse / device alpha orientation
    const orientationAdjust = mouseBearing;
    return { transform: `rotate(${273 - orientationAdjust}deg)` };
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-200 ${
      settings.darkMode 
        ? 'dark bg-slate-950 text-slate-150 selection:bg-slate-800 selection:text-slate-100' 
        : 'bg-[#f3f9f6] text-emerald-950 selection:bg-emerald-200 selection:text-emerald-900'
    }`}>
      {/* Dynamic top safety banners for warning levels */}
      <AnimatePresence>
        {isForbiddenActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#b91c1c] text-white grow-0 text-center py-2 px-4 shadow text-xs md:text-sm font-semibold flex items-center justify-center gap-2"
          >
            <AlertTriangle size={16} className="animate-bounce" />
            <span>সতর্কতা: নামাজের নিষিদ্ধ সময় চলছে! ({activeForbiddenLabel}: {toBengaliNumber(activeForbiddenRange)})। এই সময়ে সিজদাহ বা নামাজ পড়া মাকরূহ।</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlayingAlert && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-x-4 top-4 z-50 bg-[#064e3b] text-white p-4 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto border border-emerald-550 border-emerald-400"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center animate-ping text-emerald-300 relative">
                <Bell size={20} className="absolute" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-sm">সক্রিয় এলার্ম রানিং</p>
                <p className="text-xs text-emerald-200 mt-0.5">{activeAlertLabel}</p>
              </div>
            </div>
            <button
              onClick={dismissAlertSound}
              className="py-1.5 px-4 bg-emerald-50 text-emerald-900 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
              id="btn-dismiss-alarm-call"
            >
              এলার্ম বন্ধ করুনন (Stop)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReflectionPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-emerald-100 relative"
              id="reflection-popup-modal"
            >
              <DailyReflectionView 
                isPopupOnly={true} 
                onClosePopup={() => setShowReflectionPopup(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal 
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            currentTime={currentTime}
            pTimes={pTimes}
            activeDistrict={activeDistrict}
            settings={settings}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 w-full flex flex-col justify-start">
        {/* App Title Header Banner */}
        <header className="text-center py-6 px-4 bg-white border-b border-emerald-50">
          {/* Firebase Auth Sync Panel */}
          {isFirebaseEnabled && (
            <div className="max-w-md mx-auto mb-4 bg-emerald-50/40 border border-emerald-100/55 rounded-2xl p-2.5 flex items-center justify-between gap-3 text-left">
              {authLoading ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mx-auto">
                  <div className="size-3.5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
                  <span>সংযুক্তি পরীক্ষা করা হচ্ছে...</span>
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-2.5">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="size-8 rounded-full border border-emerald-200" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="size-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-emerald-950 truncate leading-none mb-0.5">
                        {user.displayName}
                      </p>
                      <p className="text-[9px] text-emerald-700 font-bold flex items-center gap-1 leading-none">
                        <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        ক্লাউড সিঙ্ক সক্রিয় (Cloud Server Active)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => logoutUser()}
                    className="px-2.5 py-1 text-[9px] font-black text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/50 rounded-lg transition-all cursor-pointer shrink-0"
                    id="btn-auth-logout"
                  >
                    লগ আউট
                  </button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-emerald-950 leading-none mb-0.5">
                      ক্লাউড সিঙ্ক অফলাইন ☁️
                    </p>
                    <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                      আপনার যেকোনো ডিভাইস থেকে নিরাপদে ডাটা অ্যাক্সেস করতে গুগল দিয়ে লগইন করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="px-3 py-1.5 text-[10px] font-black text-white bg-emerald-800 hover:bg-emerald-900 shadow-3xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    id="btn-auth-login"
                  >
                    সাইন ইন করুন
                  </button>
                </>
              )}
            </div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-emerald-950 tracking-tight flex items-center justify-center gap-2"
          >
            <ShibirLogo className="size-9" />
            <span>শিবির ডট কম BD</span>
          </motion.h1>

          <p className="text-xs md:text-sm font-semibold text-emerald-850/80 mt-1.5">
            {getHijriDate(currentTime, (settings as any).hijriOffset ?? 0).fullString} • {getBengaliDate(currentTime).fullString}
          </p>

          <div className="flex justify-center items-center gap-2 mt-2">
            <MapPin size={14} className="text-emerald-700" />
            <span className="text-xs md:text-sm font-bold text-emerald-900">
              {activeDistrict.nameBn}, বাংলাদেশ
            </span>
            <button
              onClick={() => setActiveView('settings')}
              className="p-1 hover:bg-emerald-50 text-emerald-700 rounded transition-colors text-[10px] font-semibold border border-emerald-100"
              id="btn-district-change-header"
            >
              জেলা পরিবর্তন
            </button>
          </div>

          {/* Current Live countdown pill */}
          <div className="inline-flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 py-1.5 px-4 rounded-full mt-4 text-xs font-semibold text-emerald-900 shadow-sm leading-none animate-pulse">
            <Clock size={14} className="text-emerald-700 animate-spin-slow" />
            <span>বর্তমান সময়: <span className="font-mono font-bold">{toBengaliNumber(currentTime.toLocaleTimeString('bn-BD'))}</span></span>
            <span className="text-emerald-300">|</span>
            <span>পরবর্তী ওয়াক্ত: <strong className="text-emerald-950 font-bold">{nextWaqt}</strong> শুরু হতে <span className="font-bold text-emerald-850">{countdownText}</span> বাকী</span>
          </div>

          {/* Quick Tabs Menu Buttons */}
          <nav className="flex justify-center flex-wrap gap-2 mt-5">
            <button
              onClick={() => setActiveView('home')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'home'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-home"
            >
              <Moon size={14} />
              ওয়াক্ত সূচী
            </button>
            <a
              href="https://al-quran-tafsir-1062549469096.asia-southeast1.run.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60"
              id="nav-tab-al-quran"
            >
              <BookOpen size={14} />
              আল-কুরআন
            </a>
            <button
              onClick={() => setActiveView('library')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'library'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-library"
            >
              <BookOpen size={14} />
              অনলাইন লাইব্রেরি
            </button>
            <button
              onClick={() => setActiveView('quran_hadith')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'quran_hadith'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-quran-hadith"
            >
              <BookOpen size={14} />
              কুরআন ও হাদিস সহজ উপায়
            </button>
            <button
              onClick={() => setActiveView('board_books')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'board_books'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-board-books"
            >
              <BookOpen size={14} />
              বোর্ড বই
            </button>
            <button
              onClick={() => setActiveView('it_courses')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'it_courses'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-it-courses"
            >
              <Laptop size={14} />
              IT Course
            </button>
            <button
              onClick={() => setActiveView('spoken_english')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'spoken_english'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-spoken-english"
            >
              <Languages size={14} />
              ক্লাস এবং স্পোকেন ইংরেজি
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'history'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-history"
            >
              <History size={14} />
              ইতিহাস
            </button>
            <button
              onClick={() => setActiveView('prayer_tracker')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'prayer_tracker'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-prayer-tracker"
            >
              <CheckCircle size={14} />
              সালাত ট্র্যাকার
            </button>
            <button
              onClick={() => setActiveView('quiz')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'quiz'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-quiz"
            >
              <HelpCircle size={14} />
              ইসলামিক কুইজ
            </button>
            <button
              onClick={() => setActiveView('zakat')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'zakat'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-zakat"
            >
              <Coins size={14} />
              জাকাত ক্যালকুলেটর
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'calendar'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-calendar"
            >
              <CalendarIcon size={14} />
              ক্যালেন্ডার
            </button>
            <button
              onClick={() => setActiveView('mosque')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'mosque'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-mosque"
            >
              <MapPin size={14} />
              মসজিদ
            </button>
            <button
              onClick={() => setActiveView('custom_notifications')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'custom_notifications'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-custom-notif"
            >
              <Bell size={14} />
              কাস্টম এলার্ম
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`px-4 py-2 text-xs font-bold rounded-xl outline-none cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === 'settings'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/60'
              }`}
              id="nav-tab-settings"
            >
              <SettingsIcon size={14} />
              সেটিংস
            </button>
          </nav>
        </header>

        {/* View Routing Render Layout */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeView === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="home-grid"
                className="w-full max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* 5 WAQTS LIST PRAYER SECTION (8 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-2 mb-3 flex-wrap gap-2">
                    <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                      <Clock size={18} className="text-emerald-700" />
                      ওয়াক্তের সময়সূচী
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-3xs rounded-lg transition-all cursor-pointer border border-emerald-700"
                        id="btn-share-prayer-times"
                      >
                        <Share2 size={13} />
                        শেয়ার করুন
                      </button>
                      <span className="text-[10px] text-emerald-600 bg-white border border-emerald-100 py-1 px-2 rounded-full font-bold">
                        মাযহাব: {settings.juristicSchool === 'hanafi' ? 'হানাফী' : 'শাফেয়ী'}
                      </span>
                    </div>
                  </div>

                  {/* Fajr, Sunrise landmark, Dhuhr, Asr, Maghrib, Isha */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* Fajr Card */}
                    {(() => {
                      const isActive = currentWaqt === 'fajr';
                      return (
                        <div 
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-offset-2 ring-emerald-700 scale-[1.01]'
                              : 'bg-white border-emerald-100/60 hover:bg-emerald-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'}`}>
                              <Moon size={20} />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                ফজর
                                {isActive && <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                                {isActive && <span className="text-[10px] bg-red-800/20 text-red-200 border border-red-500/20 leading-tight py-0.5 px-1.5 rounded-full font-sans font-bold">বর্তমান</span>}
                              </h4>
                              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`}>সাহরীর শেষ সময় ও ফজরের শুরু</p>
                            </div>
                          </div>
                          <span className="font-mono text-base font-semibold text-right leading-none">
                            {formatTimeBn(pTimes.fajr)} - {formatTimeBn(pTimes.sunrise)}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Dhuhr Card */}
                    {(() => {
                      const isActive = currentWaqt === 'dhuhr';
                      return (
                        <div 
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-offset-2 ring-emerald-700 scale-[1.01]'
                              : 'bg-white border-emerald-100/60 hover:bg-emerald-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'}`}>
                              <Sun size={20} />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                যুহর
                                {isActive && <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                                {isActive && <span className="text-[10px] bg-red-800/20 text-red-200 border border-red-500/20 leading-tight py-0.5 px-1.5 rounded-full font-sans font-bold">বর্তমান</span>}
                              </h4>
                              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`}>দুপুরের মধ্যাহ্ন ও জাওয়াল পরবর্তী</p>
                            </div>
                          </div>
                          <span className="font-mono text-base font-semibold text-right leading-none">
                            {formatTimeBn(pTimes.dhuhr)} - {formatTimeBn(pTimes.asr)}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Asr Card */}
                    {(() => {
                      const isActive = currentWaqt === 'asr';
                      return (
                        <div 
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-offset-2 ring-emerald-700 scale-[1.01]'
                              : 'bg-white border-emerald-100/60 hover:bg-emerald-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'}`}>
                              <Sun size={20} className="stroke-dasharray" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                আসর
                                {isActive && <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                                {isActive && <span className="text-[10px] bg-red-800/20 text-red-200 border border-red-500/20 leading-tight py-0.5 px-1.5 rounded-full font-sans font-bold">বর্তমান</span>}
                              </h4>
                              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`}>বিকেলের শেষ রোদের হালকা সময়ে</p>
                            </div>
                          </div>
                          <span className="font-mono text-base font-semibold text-right leading-none">
                            {formatTimeBn(pTimes.asr)} - {formatTimeBn(pTimes.maghrib)}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Maghrib Card */}
                    {(() => {
                      const isActive = currentWaqt === 'maghrib';
                      return (
                        <div 
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-offset-2 ring-emerald-700 scale-[1.01]'
                              : 'bg-white border-emerald-100/60 hover:bg-emerald-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'}`}>
                              <Sunset size={20} />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                মাগরিব
                                {isActive && <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                                {isActive && <span className="text-[10px] bg-red-800/20 text-red-200 border border-red-500/20 leading-tight py-0.5 px-1.5 rounded-full font-sans font-bold">বর্তমান</span>}
                              </h4>
                              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`}>সূর্যাস্ত পরবর্তী ইফতারের সময়</p>
                            </div>
                          </div>
                          <span className="font-mono text-base font-semibold text-right leading-none">
                            {formatTimeBn(pTimes.maghrib)} - {formatTimeBn(pTimes.isha)}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Isha Card */}
                    {(() => {
                      const isActive = currentWaqt === 'isha';
                      return (
                        <div 
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-offset-2 ring-emerald-700 scale-[1.01]'
                              : 'bg-white border-emerald-100/60 hover:bg-emerald-50/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'}`}>
                              <Moon size={20} />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                ইশা
                                {isActive && <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                                {isActive && <span className="text-[10px] bg-red-800/20 text-red-200 border border-red-500/20 leading-tight py-0.5 px-1.5 rounded-full font-sans font-bold">বর্তমান</span>}
                              </h4>
                              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`}>রাত্রিকালীন তারাবি ও শেষ ইশা সময়সসীমা</p>
                            </div>
                          </div>
                          <span className="font-mono text-base font-semibold text-right leading-none">
                            {formatTimeBn(pTimes.isha)} - {formatTimeBn(pTimes.fajr)}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* NAFAL PRAYER TIMES SECTION (Tahajjud, Ishraq, Chasht) */}
                  <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mt-4">
                    <h3 className="text-sm font-extrabold text-emerald-950 mb-4 flex items-center gap-1.5 border-b border-emerald-50 pb-2.5">
                      <Moon className="text-emerald-700" size={16} />
                      নফল নামাজের সময়সূচী
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Tahajjud */}
                      <div className="p-3 border border-emerald-50 rounded-xl bg-emerald-50/10 flex flex-col justify-between text-center min-h-[110px]">
                        <span className="text-xs font-bold text-emerald-950">তাহাজ্জুদ</span>
                        <span className="text-[9px] text-emerald-600 block mt-1">সাহরী শেষ সময়</span>
                        <span className="text-sm font-mono font-bold text-emerald-850 mt-2 block leading-tight">
                          {formatTimeBn(pTimes.tahajjudStart)} - {formatTimeBn(pTimes.tahajjudEnd)}
                        </span>
                      </div>
                      
                      {/* Ishraq */}
                      <div className="p-3 border border-emerald-50 rounded-xl bg-emerald-50/10 flex flex-col justify-between text-center min-h-[110px]">
                        <span className="text-xs font-bold text-emerald-950">ইশরাক</span>
                        <span className="text-[9px] text-emerald-600 block mt-1">সূর্যোদয়ের ১৫ মিনিট পর</span>
                        <span className="text-sm font-mono font-bold text-emerald-850 mt-2 block leading-tight">
                          {formatTimeBn(pTimes.ishraqStart)} - {formatTimeBn(pTimes.ishraqEnd)}
                        </span>
                      </div>

                      {/* Chasht */}
                      <div className="p-3 border border-emerald-50 rounded-xl bg-emerald-50/10 flex flex-col justify-between text-center min-h-[110px]">
                        <span className="text-xs font-bold text-emerald-950">চাশত</span>
                        <span className="text-[9px] text-emerald-600 block mt-1">পূর্বাহ্নকালীন দ্বোহা সালাত</span>
                        <span className="text-sm font-mono font-bold text-emerald-850 mt-2 block leading-tight">
                          {formatTimeBn(pTimes.chashtStart)} - {formatTimeBn(pTimes.chashtEnd)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORBIDDEN PRAYER TIMES & REAL-TIME COMPASS (5 Cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Daily Wisdom Card */}
                  <DailyWisdomView />

                  {/* Daily Reflection & Gratitude Card */}
                  <DailyReflectionView onClickTestIshaPopup={() => setShowReflectionPopup(true)} />

                  {/* Prayer Tracker Callout Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 hover:shadow-xs transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-emerald-800 text-white p-2.5 rounded-xl shadow-sm leading-none flex items-center justify-center shrink-0">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-emerald-950">সহজ সালাত ট্র্যাকার</h4>
                          <p className="text-[10px] text-emerald-750 leading-normal mt-0.5">আপনার ফজর থেকে এশা প্রত্যেক সালাত আদায়ের হিসেব রাখুন নিজের ফোনে।</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('prayer_tracker')}
                      className="w-full mt-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] text-[11px] text-white font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>সালাত ট্র্যাকার ওপেন করুন</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* History and Heritage Callout Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 hover:shadow-xs transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-amber-600 text-white p-2.5 rounded-xl shadow-sm leading-none flex items-center justify-center shrink-0">
                          <History size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-amber-950">ইতিহাস ও ঐতিহ্য লাইব্রেরি</h4>
                          <p className="text-[10px] text-amber-800/80 leading-normal mt-0.5">বাংলাদেশ ইসলামী ছাত্রশিবির, বাংলাদেশ জামায়াতে ইসলামী এবং ইসলামের সোনালী খিলাফতের প্রামাণ্য ইতিহাস ও উইকিপিডিয়া লিংকসমূহ।</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('history')}
                      className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-[11px] text-white font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>ইতিহাস লাইব্রেরি ওপেন করুন</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* Forbidden timings card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
                    <h3 className="text-sm font-extrabold text-emerald-950 mb-4 flex items-center gap-1.5 border-b border-emerald-50 pb-2.5">
                      <AlertTriangle className="text-amber-600" size={17} />
                      নামাজের নিষিদ্ধ সময়সূচী
                    </h3>
                    
                    <div className="space-y-3.5">
                      {/* Sunrise forbidden */}
                      <div className="flex items-center justify-between border-b border-emerald-50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                            <Sunrise size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block">সূর্যোদয়</span>
                            <span className="text-[10px] text-emerald-600">উদ্বোধনকালীন ১৫ মিনিট</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-850 bg-amber-50 px-2 py-1 rounded">
                          {formatTimeBn(pTimes.sunrise)} - {formatTimeBn(pTimes.forbiddenSunriseEnd)}
                        </span>
                      </div>

                      {/* Zawal forbidden */}
                      <div className="flex items-center justify-between border-b border-emerald-50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                            <Sun size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block">দুপুর (জাওয়াল)</span>
                            <span className="text-[10px] text-emerald-600">মধ্যাহ্ন সূর্য মধ্য গগণে</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-850 bg-amber-50 px-2 py-1 rounded">
                          {formatTimeBn(pTimes.forbiddenZawalStart)} - {formatTimeBn(pTimes.forbiddenZawalEnd)}
                        </span>
                      </div>

                      {/* Sunset forbidden */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                            <Sunset size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block">সূর্যাস্ত</span>
                            <span className="text-[10px] text-emerald-600">মাগরিবের ঠিক ১৫ মি: আগে</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-850 bg-amber-50 px-2 py-1 rounded">
                          {formatTimeBn(pTimes.forbiddenSunsetStart)} - {formatTimeBn(pTimes.forbiddenSunsetEnd)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME SIMULATED KIBLAH COMPASS WHEEL */}
                  <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 flex flex-col items-center">
                    <h3 className="w-full text-sm font-extrabold text-emerald-950 mb-3 border-b border-emerald-50 pb-2 flex items-center gap-1.5">
                      <Compass className="text-emerald-700 animate-spin-slow" size={17} />
                      কিবলা কম্পাস (Qibla Direction)
                    </h3>
                    
                    <p className="text-[10px] text-emerald-650 text-center leading-normal mb-4">
                      বাংলাদেশ থেকে কিবলার কোণ প্রায় <strong className="text-emerald-950">২৭৩° (পশ্চিম-উত্তরপশ্চিম)</strong>। ফোনের মোশন সেন্সর বা নিকেল ঘোরান।
                    </p>

                    {/* Interactive Compass Disc */}
                    <div className="relative w-40 h-40 rounded-full border-4 border-emerald-50 flex items-center justify-center bg-[#fdfdfd] shadow-inner mb-3">
                      <div className="absolute inset-2 rounded-full border border-emerald-100/30 flex items-center justify-center">
                        <span className="absolute top-1 text-[11px] font-bold text-red-650 font-mono">N</span>
                        <span className="absolute bottom-1 text-[11px] font-bold text-emerald-800 font-mono">S</span>
                        <span className="absolute left-1 text-[11px] font-bold text-emerald-800 font-mono">W</span>
                        <span className="absolute right-1 text-[11px] font-bold text-emerald-800 font-mono">E</span>
                      </div>

                      {/* Rotating compass needle dial */}
                      <motion.div 
                        style={getQiblaCompassRotationStyle()}
                        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        {/* Needle line */}
                        <div className="w-1.5 h-28 bg-[#94a3b8] rounded-full relative flex flex-col justify-between items-center">
                          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white absolute top-0 -mt-1 shadow" />
                          <div className="w-4 h-4 bg-emerald-700 rounded-full border-2 border-white absolute bottom-0 -mb-1 shadow" />
                        </div>

                        {/* Kaaba Direction Icon */}
                        <div className="absolute top-1 rotate-[273deg] translate-x-5 -translate-y-7 bg-emerald-900 border border-emerald-700 p-1.5 rounded-full text-yellow-300 shadow-md">
                          🕋
                        </div>
                      </motion.div>

                      {/* Center Pin */}
                      <div className="w-4 h-4 bg-emerald-900 rounded-full border-2 border-white z-10 shadow" />
                    </div>

                    {/* Drag / Rotate slider controls for desktop mock */}
                    {!hasCompassSupport && (
                      <div className="w-full space-y-1 mt-1">
                        <label className="block text-[9px] font-bold text-center text-emerald-600">কম্পাস ঘোরানোর সিমুলেটর (মাউস দিয়ে টেস্ট করুন):</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={mouseBearing}
                          onChange={(e) => setMouseBearing(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-emerald-50 accent-emerald-850 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Safe user action prompt for browser notifications permission */}
                  {showNotificationPrompt && (
                    <motion.div
                      layout
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 space-y-3"
                    >
                      <div className="flex gap-2 text-emerald-800 text-xs">
                        <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          আজানের সুক্ষ্ম সময়সূচীতে ব্রাউজারে নোটিফিকেশন অ্যালার্ট পপ-আপ চালু করতে চান? নিচে ক্লিক করে অনুমতি বা পারমিশন এক্সেপ্ট করুন।
                        </p>
                      </div>
                      <button
                        onClick={handleRequestNotifications}
                        className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-xs text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                        id="btn-permit-notifications"
                      >
                        নোটিফিকেশন সক্রিয় করুন (Enable)
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'library' && (
              <OnlineLibraryView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'board_books' && (
              <BoardBooksView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'it_courses' && (
              <ITCoursesView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'spoken_english' && (
              <SpokenEnglishView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'quran_hadith' && (
              <QuranHadithEasyWayView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'history' && (
              <HistoryView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'prayer_tracker' && (
              <PrayerTrackerView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'quiz' && (
              <IslamicQuizView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'zakat' && (
              <ZakatCalculatorView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'calendar' && (
              <CalendarView 
                selectedDistrictId={settings.selectedDistrictId}
                juristicSchool={settings.juristicSchool}
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'mosque' && (
              <MosqueView 
                selectedDistrictId={settings.selectedDistrictId}
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'custom_notifications' && (
              <CustomNotificationView 
                onBack={() => setActiveView('home')}
              />
            )}

            {activeView === 'settings' && (
              <SettingsView 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onBack={() => setActiveView('home')}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer copyright */}
      <footer className="text-center py-5 px-4 text-[10px] text-emerald-700/60 bg-white border-t border-emerald-50 shrink-0">
        <p>পবিত্র নামাজের সময়সূচী ওয়েব অ্যাপ্লিকেশন • সর্বস্বত্ব সংরক্ষিত ২০২৬ Ⓒ ইসলামিক ওয়েব সার্ভিস</p>
      </footer>

      {/* Floating Dark Mode Toggle */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleUpdateSettings({
          ...settings,
          darkMode: !settings.darkMode
        })}
        className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full shadow-lg cursor-pointer transition-colors flex items-center justify-center border ${
          settings.darkMode
            ? 'bg-emerald-800 text-yellow-300 hover:bg-emerald-700 border-emerald-600 shadow-emerald-950/40'
            : 'bg-white text-emerald-800 hover:bg-emerald-50 border-emerald-100 shadow-emerald-900/10'
        }`}
        title={settings.darkMode ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
        id="btn-floating-dark-mode-toggle"
      >
        {settings.darkMode ? (
          <Sun size={20} className="text-yellow-300 fill-yellow-300" />
        ) : (
          <Moon size={20} className="fill-emerald-800" />
        )}
      </motion.button>
    </div>
  );
}
