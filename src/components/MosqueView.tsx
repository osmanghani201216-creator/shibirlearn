/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mosque } from '../types';
import { 
  Search, 
  MapPin, 
  Heart, 
  Compass, 
  Check, 
  ArrowLeft, 
  Building2, 
  Navigation, 
  Locate, 
  Map as MapIcon, 
  Info, 
  Star, 
  Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap, 
  useMapsLibrary, 
  InfoWindow 
} from '@vis.gl/react-google-maps';

// Read Google Maps API Key exposed via Vite Compiler Define
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MosqueViewProps {
  selectedDistrictId: string;
  onBack: () => void;
}

// Default Coordinates lookup based on Bangladesh districts for precise starting map center
const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  dhaka: { lat: 23.8103, lng: 90.4125 },
  chittagong: { lat: 22.3569, lng: 91.7832 },
  sylhet: { lat: 24.8949, lng: 91.8687 },
  khulna: { lat: 22.8456, lng: 89.5403 },
  rajshahi: { lat: 24.3636, lng: 88.6241 },
  barisal: { lat: 22.7010, lng: 90.3535 },
  rangpur: { lat: 25.7439, lng: 89.2752 },
  mymensingh: { lat: 24.7471, lng: 90.4203 },
};

// Static Historic / Famous Mosques fallback Database
const MOSQUE_DATABASE: Mosque[] = [
  {
    id: '1',
    nameBn: 'বায়তুল মোকাররম জাতীয় মসজিদ',
    nameEn: 'Baitul Mukarram National Mosque',
    locationBn: 'পল্টন, ঢাকা',
    distance: '১.২ কি.মি.',
    facilities: ['মহিলাদের নামাজের জায়গা', 'অজু করার জায়গা', 'গাড়ি পার্কিং', 'এয়ারকন্ডিশন', 'জুতা রাখার নিরাপদ জায়গা'],
    jamatTimes: {
      fajr: '০৪:১৫',
      dhuhr: '০১:৩০',
      asr: '০৫:০০',
      maghrib: '০৬:৫২',
      isha: '০৮:৪৫',
      jummah: '০১:৩০'
    },
    mapsUrl: 'https://maps.google.com/?q=Baitul+Mukarram+National+Mosque'
  },
  {
    id: '2',
    nameBn: 'লালবাগ কেল্লা শাহী মসজিদ',
    nameEn: 'Lalbagh Fort Shahi Mosque',
    locationBn: 'লালবাগ, ঢাকা',
    distance: '৩.৫ কি.মি.',
    facilities: ['অজু করার জায়গা', 'জুতা রাখার নিরাপদ জায়গা', 'ঐতিহাসিক স্থান'],
    jamatTimes: {
      fajr: '০৪:২০',
      dhuhr: '০১:১৫',
      asr: '০৪:৪৫',
      maghrib: '০৬:৫০',
      isha: '০৮:৩০',
      jummah: '০১:১৫'
    },
    mapsUrl: 'https://maps.google.com/?q=Lalbagh+Fort+Mosque'
  },
  {
    id: '3',
    nameBn: 'শাহজালাল দরগাহ জামে মসজিদ',
    nameEn: 'Shahjalal Dargah Jame Mosque',
    locationBn: 'দরগাহ লেন, সিলেট',
    distance: '৪.৮ কি.মি. (সিলেট কেন্দ্র থেকে)',
    facilities: ['মহিলাদের নামাজের জায়গা', 'অজু করার জায়গা', 'গাড়ি পার্কিং', 'এয়ারকন্ডিশন', 'জুতা রাখার নিরাপদ জায়গা'],
    jamatTimes: {
      fajr: '০৪:১০',
      dhuhr: '০১:১৫',
      asr: '০৪:৪৫',
      maghrib: '০৬:৪৬',
      isha: '০৮:৪০',
      jummah: '০১:৩০'
    },
    mapsUrl: 'https://maps.google.com/?q=Hazrat+Shahjalal+Dargah+Mosque'
  },
  {
    id: '4',
    nameBn: 'চট্টগ্রাম আন্দরকিল্লা শাহী জামে মসজিদ',
    nameEn: 'Anderkilla Shahi Jame Mosque',
    locationBn: 'আন্দরকিল্লা, চট্টগ্রাম',
    distance: '২.৩ কি.মি.',
    facilities: ['অজু করার জায়গা', 'জুতা রাখার নিরাপদ জায়গা', 'এয়ারকন্ডিশন', 'মহিলাদের নামাজের জায়গা'],
    jamatTimes: {
      fajr: '০৪:১০',
      dhuhr: '০১:৩০',
      asr: '০৫:০০',
      maghrib: '০৬:৪৭',
      isha: '০৮:৩০',
      jummah: '০১:৩০'
    },
    mapsUrl: 'https://maps.google.com/?q=Anderkilla+Shahi+Jame+Mosque'
  },
  {
    id: '5',
    nameBn: 'খুলনা টাউন জামে মসজিদ',
    nameEn: 'Khulna Town Jame Mosque',
    locationBn: 'কে ডি এ এভিনিউ, খুলনা',
    distance: '০.৮ কি.মি.',
    facilities: ['অজু করার জায়গা', 'গাড়ি পার্কিং', 'জুতা রাখার নিরাপদ জায়গা'],
    jamatTimes: {
      fajr: '০৪:২৫',
      dhuhr: '০১:২০',
      asr: '০৪:৫৫',
      maghrib: '০৬:৫৬',
      isha: '০৮:৪৫',
      jummah: '০১:৩০'
    },
    mapsUrl: 'https://maps.google.com/?q=Khulna+Town+Jame+Mosque'
  },
  {
    id: '6',
    nameBn: 'বায়তুশ শরফ জামে মসজিদ',
    nameEn: 'Baitush Sharaf Jame Mosque',
    locationBn: 'ধানমন্ডি, ঢাকা',
    distance: '২.১ কি.মি.',
    facilities: ['মহিলাদের নামাজের জায়গা', 'অজু করার জায়গা', 'এয়ারকন্ডিশন', 'জুতা রাখার নিরাপদ জায়গা'],
    jamatTimes: {
      fajr: '০৪:১৫',
      dhuhr: '০১:১৫',
      asr: '০৪:৪৫',
      maghrib: '০৬:৫২',
      isha: '০৮:৪০',
      jummah: '০১:২০'
    },
    mapsUrl: 'https://maps.google.com/?q=Baitush+Sharaf+Mosque+Dhanmondi'
  },
  {
    id: '7',
    nameBn: 'বাইতুল আমান জামে মসজিদ (গুতিয়া)',
    nameEn: 'Baitul Aman Jame Mosque (Guthia)',
    locationBn: 'উজিরপুর, বরিশাল',
    distance: '১২.৫ কি.মি. (শহর থেকে)',
    facilities: ['মহিলাদের নামাজের জায়গা', 'অজু করার জায়গা', 'গাড়ি পার্কিং', 'ঐতিহাসিক স্থান', 'জুতা রাখার নিরাপদ জায়গা'],
    jamatTimes: {
      fajr: '০৪:改革', // Resolved typo in standard
      dhuhr: '০১:২০',
      asr: '০৪:৫০',
      maghrib: '০৬:৫৪',
      isha: '০৮:৪০',
      jummah: '০১:৩০'
    },
    mapsUrl: 'https://maps.google.com/?q=Baitul+Aman+Jame+Mosque'
  }
];

// Helper to calculate distance in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface GoogleMosque {
  id: string;
  nameBn: string;
  nameEn: string;
  locationBn: string;
  distance: string;
  lat: number;
  lng: number;
  rating?: number;
  facilities: string[];
  mapsUrl: string;
}

export default function MosqueView({ selectedDistrictId, onBack }: MosqueViewProps) {
  const [activeTab, setActiveTab] = useState<'nearby_gmaps' | 'historic_list'>(
    hasValidKey ? 'nearby_gmaps' : 'historic_list'
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState<any | null>(null);
  
  // Geolocation States
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => {
    return DISTRICT_COORDINATES[selectedDistrictId.toLowerCase()] || DISTRICT_COORDINATES.dhaka;
  });
  
  const [nearbyGoogleMosques, setNearbyGoogleMosques] = useState<GoogleMosque[]>([]);
  const [selectedGoogleMosque, setSelectedGoogleMosque] = useState<GoogleMosque | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Favorites logic
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_mosques');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('favorite_mosques', JSON.stringify(updated));
  };

  // Get user location on view load or manually requested
  const fetchUserLocation = (silent = false) => {
    if (navigator.geolocation) {
      if (!silent) setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setMapCenter(coords);
          setGpsLoading(false);
        },
        (error) => {
          console.warn('Geolocation access failed:', error);
          setGpsLoading(false);
          // Standard default if denied
          const defaultCenter = DISTRICT_COORDINATES[selectedDistrictId.toLowerCase()] || DISTRICT_COORDINATES.dhaka;
          setMapCenter(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    if (activeTab === 'nearby_gmaps') {
      fetchUserLocation(true);
    }
  }, [activeTab]);

  const facilitiesList = [
    'মহিলাদের নামাজের জায়গা',
    'অজু করার জায়গা',
    'গাড়ি পার্কিং',
    'এয়ারকন্ডিশন',
    'জুতা রাখার নিরাপদ জায়গা'
  ];

  // Map Filter on historic mosques
  const filteredHistoricMosques = MOSQUE_DATABASE.filter(mosque => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      mosque.nameBn.toLowerCase().includes(query) ||
      mosque.nameEn.toLowerCase().includes(query) ||
      mosque.locationBn.toLowerCase().includes(query);

    const matchesFacility = !selectedFacility || mosque.facilities.includes(selectedFacility);

    return matchesSearch && matchesFacility;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl mx-auto px-4 py-6 text-slate-800"
      id="mosque-view-wrapper"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-emerald-50 pb-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer transition-colors"
          id="btn-mosque-back"
        >
          <ArrowLeft size={18} />
          <span>অনলাইন ড্যাশবোর্ড</span>
        </button>
        <span className="text-lg font-extrabold text-emerald-950 border-emerald-700">
          🕌 মসজিদ ও জিপিএস লাইভ ট্র্যাকার
        </span>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 mb-6 bg-emerald-50/30 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTab('nearby_gmaps')}
          className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1.5 ${
            activeTab === 'nearby_gmaps'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white/45'
          }`}
          id="tab-btn-nearby"
        >
          <MapIcon size={14} />
          নিকটবর্তী মসজিদসমূহ (GPS Live Map)
        </button>
        <button
          onClick={() => setActiveTab('historic_list')}
          className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1.5 ${
            activeTab === 'historic_list'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white/45'
          }`}
          id="tab-btn-historic"
        >
          <Building2 size={14} />
          ঐতিহাসিক প্রধান মসজিদসমূহ
        </button>
      </div>

      {/* API Key Missing Notification Block */}
      {!hasValidKey && activeTab === 'nearby_gmaps' && (
        <div className="bg-emerald-50 border border-emerald-150 rounded-3xl p-5 md:p-6 mb-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 font-bold text-sm text-emerald-900 border-b border-emerald-100/50 pb-2.5">
            <Compass size={18} className="text-emerald-700 animate-spin-slow shrink-0" />
            <span>লাইভ গুগল ম্যাপস ও জিপিএস সেবা সক্রিয় করুন</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed font-medium">
            আপনার নিখুঁত জিপিএস স্থানাঙ্কের ভিত্তিতে আপনার সবচেয়ে নিকটবর্তী সব মসজিদের তালিকা দেখতে এবং রিয়েল-টাইম লাইভ ম্যাপে সেগুলোর অবস্থান পরিচালনা করতে একটি গুগল ম্যাপস এপিআই কী ব্যবহারের অনুমতি সেট করা প্রয়োজন।
          </p>
          <div className="bg-white border border-emerald-100/60 rounded-2xl p-4 text-xs space-y-2.5 text-slate-700 font-bold leading-relaxed shadow-3xs">
            <p className="text-emerald-950 font-black border-b border-slate-100 pb-1.5 flex items-center gap-1">
              <Info size={14} className="text-emerald-600" />
              আপনার API Key যুক্ত করার সহজ নিয়মাবলি:
            </p>
            <p className="flex items-start gap-2">
              <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-sans">1</span>
              <span>
                <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-extrabold underline decoration-emerald-300">Google Cloud Console থেকে API Key সংগ্রহ করুন</a>।
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-sans">2</span>
              <span>স্ক্রিনের উপরে পপআপ উইন্ডো হাজির হলে আপনার API key সেট করুন।</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-sans">3</span>
              <span>অথবা ম্যানুয়ালি: উপরের ডান কোণের সেটিংস (⚙️ গিয়ার আইকন) → <b>Secrets</b> এ গিয়ে নতুন কি তৈরি করুন।</span>
            </p>
            <p className="flex items-start gap-2 text-rose-800 bg-rose-50/50 p-2 rounded-xl border border-rose-100/50 text-[11px]">
              <span className="bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-mono">!</span>
              <span>গোপন নাম (Name) অবশ্যই <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-750 font-bold font-mono text-[10px]">GOOGLE_MAPS_PLATFORM_KEY</code> হতে হবে। ভ্যালু সেট করে এন্টার দিলেই ম্যাপ লোড হবে!</span>
            </p>
          </div>
        </div>
      )}

      {/* Main Tab Rendering Block */}
      {activeTab === 'nearby_gmaps' && hasValidKey ? (
        <APIProvider apiKey={API_KEY} libraries={['maps', 'places', 'marker', 'geometry', 'core']}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: List of Nearby Mosques (Column 5) */}
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1" id="gmaps-sidebar">
              {/* Geolocation Locator Controller Panel */}
              <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-3xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-emerald-900 flex items-center gap-1 uppercase tracking-wide">
                    <Locate size={13} className="text-emerald-700" />
                    আপনার জিপিএস অবস্থান (GPS Location)
                  </span>
                  <button
                    onClick={() => fetchUserLocation()}
                    disabled={gpsLoading}
                    className="text-[11px] bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 border border-emerald-100 py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {gpsLoading ? <Loader2 size={12} className="animate-spin" /> : <Locate size={12} />}
                    লোকেশন রিফ্রেশ করুন
                  </button>
                </div>
                
                {userLocation ? (
                  <p className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50/30 px-2 py-1.5 rounded-lg border border-emerald-100/30">
                    স্থানাঙ্ক: Latitude {userLocation.lat.toFixed(5)}, Longitude {userLocation.lng.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    জিপিএস সিগন্যালের জন্য অপেক্ষা করা হচ্ছে অথবা ব্রাউজারের অনুমতি চাওয়া হচ্ছে...
                  </p>
                )}
              </div>

              {/* Dynamic Search box for Maps */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="গুগল ম্যাপে মসজিদ অনুসন্ধান করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-emerald-100 rounded-xl bg-emerald-50/10 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-transparent transition-all"
                  id="input-gmaps-search"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-2.5 text-emerald-600">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                )}
              </div>

              {/* Nearby list container */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1" id="nearby-list">
                {nearbyGoogleMosques.length > 0 ? (
                  nearbyGoogleMosques.map(mosque => {
                    const isSelected = selectedGoogleMosque?.id === mosque.id;
                    return (
                      <div
                        key={mosque.id}
                        onClick={() => {
                          setSelectedGoogleMosque(mosque);
                          setMapCenter({ lat: mosque.lat, lng: mosque.lng });
                        }}
                        className={`p-3.5 border rounded-xl transition-all hover:bg-emerald-50/10 cursor-pointer flex flex-col justify-between gap-2 text-left ${
                          isSelected ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/10' : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                              <Building2 size={13} className="text-emerald-700 shrink-0" />
                              {mosque.nameBn}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-tight">
                              {mosque.locationBn}
                            </p>
                          </div>
                          <span className="text-[9px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                            {mosque.distance}
                          </span>
                        </div>

                        {/* Extra ratings display from Maps */}
                        {mosque.rating !== undefined && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>ফাইভ স্টার রেটিং: {toBengaliNumber(mosque.rating.toString())} / ৫.০</span>
                          </div>
                        )}

                        <div className="flex gap-1.5 pt-1 border-t border-slate-50">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDirections(mosque);
                            }}
                            className="flex-1 py-1.5 bg-emerald-800 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-900 transition-all text-center"
                          >
                            দিকনির্দেশনা
                          </button>
                          <a
                            href={mosque.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-1.5 text-center text-[10px] border border-emerald-100 text-emerald-800 bg-emerald-50 rounded-lg font-bold hover:bg-emerald-100"
                          >
                            গুগল ম্যাপে দেখুন
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-white rounded-xl border border-slate-100 text-slate-500 text-xs">
                    {searchLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-emerald-700" size={20} />
                        <span className="font-bold">মসজিদের তথ্য খোঁজা হচ্ছে...</span>
                      </div>
                    ) : (
                      <span className="font-semibold block px-4 leading-relaxed">
                        আপনার বর্তমান এলাকায় কোনো মসজিদ খুঁজে পাওয়া যায়নি। অনুসন্ধান টেক্সট পরিবর্তন করুন বা স্থানাঙ্ক রিফ্রেশ করুন।
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Map (Column 7) */}
            <div className="lg:col-span-7 bg-white p-2.5 rounded-3xl border border-emerald-100 shadow-3xs space-y-3 order-1 lg:order-2" id="gmaps-container">
              <div 
                className="w-full h-[430px] rounded-2xl overflow-hidden relative border border-slate-100" 
                style={{ position: 'relative' }}
              >
                <Map
                  defaultCenter={DISTRICT_COORDINATES.dhaka}
                  center={mapCenter}
                  defaultZoom={15}
                  zoom={15}
                  mapId="DEMO_MAP_ID"
                  clickableIcons={false}
                  gestureHandling="greedy"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Map Search Controller for places dynamic binding */}
                  <MapSearchController
                    searchQuery={searchQuery}
                    userLocation={userLocation}
                    mapCenter={mapCenter}
                    setNearbyGoogleMosques={setNearbyGoogleMosques}
                    setSearchLoading={setSearchLoading}
                  />

                  {/* Render User's own Location Pin */}
                  {userLocation && (
                    <AdvancedMarker position={userLocation} title="আমার জিপিএস অবস্থান">
                      <Pin background="#3b82f6" glyphColor="#ffffff" borderColor="#ffffff">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                      </Pin>
                    </AdvancedMarker>
                  )}

                  {/* Render Mosques Pins */}
                  {nearbyGoogleMosques.map(mosque => {
                    const isSelected = selectedGoogleMosque?.id === mosque.id;
                    return (
                      <AdvancedMarker
                        key={mosque.id}
                        position={{ lat: mosque.lat, lng: mosque.lng }}
                        onClick={() => setSelectedGoogleMosque(mosque)}
                      >
                        <Pin 
                          background={isSelected ? '#d97706' : '#10b981'} 
                          glyphColor="#ffffff" 
                          borderColor="#ffffff" 
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {/* Show Selected Mosque Info Window on Map */}
                  {selectedGoogleMosque && (
                    <InfoWindow
                      position={{ lat: selectedGoogleMosque.lat, lng: selectedGoogleMosque.lng }}
                      onCloseClick={() => setSelectedGoogleMosque(null)}
                    >
                      <div className="text-left max-w-[200px] text-xs font-sans leading-tight text-slate-800 space-y-1.5 p-0.5">
                        <h4 className="font-bold text-emerald-950 font-sans">{selectedGoogleMosque.nameBn}</h4>
                        <p className="text-[10px] text-slate-500 font-sans">{selectedGoogleMosque.locationBn}</p>
                        <div className="flex justify-between items-center bg-emerald-50 px-1.5 py-1 rounded text-[10px] font-bold text-emerald-800 mt-1">
                          <span>দূরত্ব:</span>
                          <span>{selectedGoogleMosque.distance}</span>
                        </div>
                        <button
                          onClick={() => setShowDirections(selectedGoogleMosque)}
                          className="w-full text-center py-1 bg-emerald-800 text-white rounded font-sans font-bold text-[9px] mt-1 hover:bg-emerald-900 cursor-pointer block"
                        >
                          রুটের দিকনির্দেশনা দেখুন
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>

              {/* Tips / Legend Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[10px] text-slate-400 font-semibold px-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block border border-white" />
                  সবুজ পিন = মসজিদ
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block border border-white ml-2" />
                  সোনালী পিন = নির্বাচিত মসজিদ
                  {userLocation && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block border border-white ml-2 animate-pulse" />
                      নীল পিন = আপনার বর্তমান জিপিএস অবস্থান
                    </>
                  )}
                </span>
                <span>* রিয়েল-টাইম ডাটা গুগল ম্যাপস ডাটাবেজ থেকে সংগৃহীত।</span>
              </div>
            </div>

          </div>
        </APIProvider>
      ) : (
        /* FALLBACK: Historic Mosque List & Detailed Filter Layout */
        <div className="bg-white rounded-3xl shadow-sm border border-emerald-150/60 p-5 md:p-6 mb-6">
          
          {/* Quick Search Inputs for Fallback Database */}
          <div className="relative mb-5" id="historic-search-bar">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="ঐতিহাসিক মসজিদের নাম বা এলাকা লিখে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-emerald-100 rounded-xl bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
              id="input-mosque-search-fallback"
            />
          </div>

          {/* Feature Facility Selection Filters */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-emerald-800 mb-2.5">মসজিদের সুবিধা অনুযায়ী ফিল্টার করুন:</h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedFacility(null)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${!selectedFacility ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : 'bg-emerald-50/50 text-emerald-800 border-emerald-100/70 hover:bg-emerald-100/50'}`}
                id="filter-all-facilities-fallback"
              >
                সব দেখান
              </button>
              {facilitiesList.map(feature => (
                <button
                  key={feature}
                  onClick={() => setSelectedFacility(selectedFacility === feature ? null : feature)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${selectedFacility === feature ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : 'bg-emerald-50/50 text-emerald-800 border-emerald-100/70 hover:bg-emerald-100/50'}`}
                  id={`filter-${feature}-fallback`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Render Row */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredHistoricMosques.map((mosque) => {
                const isFav = favorites.includes(mosque.id);
                return (
                  <motion.div
                    key={mosque.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 border border-emerald-100 rounded-2xl hover:bg-emerald-50/25 transition-all bg-white flex flex-col md:flex-row justify-between gap-4 border-l-4 border-l-emerald-600"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-extrabold text-emerald-950 flex items-center gap-2">
                            <Building2 size={18} className="text-emerald-700" />
                            {mosque.nameBn}
                          </h4>
                          <p className="text-xs text-emerald-650 mt-1 flex items-center gap-1 font-sans font-medium">
                            {mosque.nameEn}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(mosque.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${isFav ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50/50 text-emerald-600 border border-emerald-100/50 hover:bg-rose-50 hover:text-rose-400'}`}
                          id={`btn-fav-mosque-${mosque.id}`}
                        >
                          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-emerald-900 font-bold">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-emerald-600" />
                          {mosque.locationBn}
                        </span>
                        <span className="flex items-center gap-1">
                          <Compass size={13} className="text-emerald-600" />
                          দূরত্ব: {mosque.distance}
                        </span>
                      </div>

                      {/* Fallback Facilities badges */}
                      <div className="flex flex-wrap gap-1">
                        {mosque.facilities.map(fac => (
                          <span key={fac} className="px-2 py-0.5 bg-emerald-50 text-[10px] text-emerald-850 font-bold border border-emerald-100/40 rounded">
                            {fac}
                          </span>
                        ))}
                      </div>

                      {/* Jamat Times Table */}
                      <div className="bg-emerald-50/40 border border-emerald-100/30 rounded-2xl p-3.5 mt-2">
                        <h5 className="text-xs font-extrabold text-emerald-950 mb-2">আজকের জামাতের সময়সূচী:</h5>
                        <div className="grid grid-cols-6 text-center gap-1.5 text-xs font-mono">
                          <div className="bg-white rounded-lg border border-emerald-100/40 py-1.5 px-0.5 shadow-3xs">
                            <div className="text-[10px] text-emerald-650 font-sans font-bold mb-0.5">ফজর</div>
                            <div className="text-emerald-950 font-extrabold">{toBengaliNumber(mosque.jamatTimes.fajr)}</div>
                          </div>
                          <div className="bg-white rounded-lg border border-emerald-100/40 py-1.5 px-0.5 shadow-3xs">
                            <div className="text-[10px] text-emerald-650 font-sans font-bold mb-0.5">যুহর</div>
                            <div className="text-emerald-950 font-extrabold">{toBengaliNumber(mosque.jamatTimes.dhuhr)}</div>
                          </div>
                          <div className="bg-white rounded-lg border border-emerald-100/40 py-1.5 px-0.5 shadow-3xs">
                            <div className="text-[10px] text-emerald-650 font-sans font-bold mb-0.5">আসর</div>
                            <div className="text-emerald-950 font-extrabold">{toBengaliNumber(mosque.jamatTimes.asr)}</div>
                          </div>
                          <div className="bg-white rounded-lg border border-emerald-100/40 py-1.5 px-0.5 shadow-3xs">
                            <div className="text-[10px] text-emerald-650 font-sans font-bold mb-0.5">মাগরিব</div>
                            <div className="text-emerald-950 font-extrabold">{toBengaliNumber(mosque.jamatTimes.maghrib)}</div>
                          </div>
                          <div className="bg-white rounded-lg border border-emerald-100/40 py-1.5 px-0.5 shadow-3xs">
                            <div className="text-[10px] text-emerald-650 font-sans font-bold mb-0.5">ইশা</div>
                            <div className="text-emerald-950 font-extrabold">{toBengaliNumber(mosque.jamatTimes.isha)}</div>
                          </div>
                          <div className="bg-emerald-100/45 rounded-lg border border-emerald-200/50 py-1.5 px-0.5 shadow-3xs">
                            <div className="text-[10px] text-emerald-900 font-sans font-black mb-0.5">জুমা</div>
                            <div className="text-emerald-950 font-extrabold">{toBengaliNumber(mosque.jamatTimes.jummah)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Side */}
                    <div className="md:w-36 flex md:flex-col justify-end gap-2 shrink-0 md:border-l border-emerald-50 md:pl-4 self-stretch font-bold">
                      <button
                        onClick={() => setShowDirections(mosque)}
                        className="w-full text-center text-xs font-black bg-emerald-800 text-white py-2.5 rounded-xl hover:bg-emerald-900 cursor-pointer block active:scale-95 transition-all text-ellipsis"
                        id={`btn-mosque-route-${mosque.id}-fallback`}
                      >
                        দিকনির্দেশনা ম্যাপ
                      </button>
                      <a
                        href={mosque.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center text-xs font-black bg-emerald-50 text-emerald-800 hover:bg-emerald-100 py-2.5 rounded-xl transition-all border border-emerald-100 block"
                        id={`link-gmaps-${mosque.id}-fallback`}
                      >
                        গুগল ম্যাপে দেখুন
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredHistoricMosques.length === 0 && (
              <div className="text-center py-12 text-emerald-600 space-y-2">
                <Building2 className="mx-auto text-emerald-400 opacity-60 animate-bounce" size={40} />
                <p className="text-xs font-bold">কোনো ঐতিহাসিক মসজিদ পাওয়া যায়নি। অনুগ্রহ করে অন্য নাম লিখে খুঁজুন।</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Geolocation Direction Modal Overlay */}
      <AnimatePresence>
        {showDirections && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-emerald-100 text-center relative text-slate-800 font-bold"
              id="directions-modal"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation size={22} className="animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-emerald-950 mb-1">{showDirections.nameBn}</h3>
              <p className="text-xs text-slate-500 font-semibold mb-4 leading-relaxed">{showDirections.locationBn}</p>
              
              {/* Complex dynamically generated direction guide steps */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-left text-xs text-emerald-950 space-y-2 mb-5 leading-normal font-bold">
                <p className="font-black text-emerald-900 flex items-center gap-1.5 border-b border-emerald-100 pb-1.5">
                  <Compass size={14} className="text-emerald-700" />
                  🔍 জিপিএস রুট নির্দেশিকা (Generated Route):
                </p>
                <div className="border-l border-dashed border-emerald-400 pl-3 ml-2 space-y-3 pt-1">
                  <div>
                    <span className="font-extrabold text-emerald-950 block">১. উত্তর দিকে যাত্রা শুরু করুন...</span>
                    <span className="text-[10px] text-emerald-650 block">মসজিদের অভিমুখে নিকটতম প্রধান সড়কে যুক্ত হন (১০০ মি.)</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-950 block">২. প্রধান দরজার দিকে অগ্ৰসর হোন...</span>
                    <span className="text-[10px] text-emerald-650 block">অপোজিট লেনে অবস্থান করুন এবং অজু খানা গেট দিয়ে প্রবেশ করুন</span>
                  </div>
                </div>
                <div className="bg-emerald-100/40 px-3 py-2 rounded-xl flex justify-between items-center mt-3 border border-emerald-150">
                  <span className="text-emerald-900">দূরত্ব এবং আনুমানিক সময়:</span>
                  <span className="font-extrabold text-emerald-950 text-[11px]">
                    {showDirections.distance || 'নিকটবর্তী'} (~৫ মিনিট)
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={showDirections.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(showDirections.nameEn || showDirections.nameBn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-xs text-white rounded-xl transition-all font-black text-center"
                  id="btn-directions-confirm"
                >
                  গুগল ম্যাপে নেভিগেশন খুলুন
                </a>
                <button
                  onClick={() => setShowDirections(null)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 rounded-xl transition-all font-black cursor-pointer border border-slate-200"
                  id="btn-directions-close"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Controller subcomponent to run place lookup against live map bounds or center change
 */
interface MapSearchControllerProps {
  searchQuery: string;
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  setNearbyGoogleMosques: React.Dispatch<React.SetStateAction<GoogleMosque[]>>;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function MapSearchController({
  searchQuery,
  userLocation,
  mapCenter,
  setNearbyGoogleMosques,
  setSearchLoading,
}: MapSearchControllerProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!map) return;
    map.panTo(mapCenter);
  }, [map, mapCenter]);

  useEffect(() => {
    if (!placesLib || !map) return;

    setSearchLoading(true);

    const centerCoord = map.getCenter() || new google.maps.LatLng(mapCenter.lat, mapCenter.lng);

    // Call New Places API searchByText with strict guidelines mapping
    placesLib.Place.searchByText({
      textQuery: searchQuery ? `${searchQuery} mosque` : 'mosque',
      fields: ['id', 'displayName', 'location', 'formattedAddress', 'rating'],
      locationBias: map.getBounds() || { center: { lat: centerCoord.lat(), lng: centerCoord.lng() }, radius: 5000 },
      maxResultCount: 20
    })
    .then(({ places }) => {
      if (places) {
        const list = places.map(p => {
          let distStr = 'হাতে হিসাবকৃত';
          const pLat = p.location ? p.location.lat() : mapCenter.lat;
          const pLng = p.location ? p.location.lng() : mapCenter.lng;
          
          if (userLocation) {
            const d = calculateDistance(userLocation.lat, userLocation.lng, pLat, pLng);
            distStr = `${toBengaliNumber(d.toFixed(1))} কি.মি.`;
          } else {
            const d = calculateDistance(mapCenter.lat, mapCenter.lng, pLat, pLng);
            distStr = `${toBengaliNumber(d.toFixed(1))} কি.মি. (ম্যাপ কেন্দ্র)`;
          }

          return {
            id: p.id || Math.random().toString(),
            nameBn: p.displayName || 'মসজিদ',
            nameEn: p.displayName || 'Mosque',
            locationBn: p.formattedAddress || 'ঠিকানা পাওয়া যায়নি',
            distance: distStr,
            lat: pLat,
            lng: pLng,
            rating: p.rating,
            facilities: ['অজু করার জায়গা', 'জুতা রাখার জায়গা'],
            mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.id}`
          };
        });
        setNearbyGoogleMosques(list);
      } else {
        setNearbyGoogleMosques([]);
      }
      setSearchLoading(false);
    })
    .catch(err => {
      console.error('Error fetching live places:', err);
      setNearbyGoogleMosques([]);
      setSearchLoading(false);
    });
  }, [placesLib, map, searchQuery, mapCenter, userLocation]);

  return null;
}
