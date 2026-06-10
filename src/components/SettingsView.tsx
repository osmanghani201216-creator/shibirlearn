/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppSettings } from '../types';
import { BANGLADESH_DISTRICTS } from '../utils/prayerTimes';
import { toBengaliNumber } from '../utils/bengaliDate';
import { Volume2, VolumeX, HelpCircle, ArrowLeft, Save, MapPin, Sliders, Bell, Check, HelpCircle as Help, Moon, Database, FileJson, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import { audioSynth } from '../utils/audioSynth';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

export default function SettingsView({ settings, onUpdateSettings, onBack }: SettingsViewProps) {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>({ ...settings });
  const [showSavedToast, setShowSavedToast] = React.useState(false);

  // Group districts by division
  const divisions = Array.from(new Set(BANGLADESH_DISTRICTS.map((d) => d.division)));

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings({
      ...localSettings,
      selectedDistrictId: e.target.value
    });
  };

  const handleJuristicChange = (school: 'hanafi' | 'shafi') => {
    setLocalSettings({
      ...localSettings,
      juristicSchool: school
    });
  };

  const handleOffsetChange = (prayer: keyof AppSettings['offsets'], val: number) => {
    setLocalSettings({
      ...localSettings,
      offsets: {
        ...localSettings.offsets,
        [prayer]: val
      }
    });
  };

  const handleNotificationToggle = (prayer: keyof AppSettings['enabledNotifications']) => {
    setLocalSettings({
      ...localSettings,
      enabledNotifications: {
        ...localSettings.enabledNotifications,
        [prayer]: !localSettings.enabledNotifications[prayer]
      }
    });
  };

  const handleSoundTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sound = e.target.value as AppSettings['alarmSoundType'];
    setLocalSettings({
      ...localSettings,
      alarmSoundType: sound
    });
    // preview the selected sound
    audioSynth.play(sound, localSettings.alarmVolume, localSettings.selectedAdhanSample, localSettings.customAdhanBase64);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setLocalSettings({
      ...localSettings,
      alarmVolume: vol,
      isMuted: vol === 0 ? true : false
    });
  };

  const toggleMute = () => {
    setLocalSettings({
      ...localSettings,
      isMuted: !localSettings.isMuted
    });
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  const getHijriOffset = () => {
    // We can extract/store Hijri offset in settings as well
    const offset = (localSettings as any).hijriOffset ?? 0;
    return offset;
  };

  const handleHijriOffsetChange = (val: number) => {
    setLocalSettings({
      ...localSettings,
      ...{ hijriOffset: val } as any
    });
  };

  const STATUS_LABELS_BN: Record<string, string> = {
    pending: 'অপেক্ষমাণ',
    performed_jamat: 'জামায়াতে আদায়কৃত',
    performed_alone: 'একাকী আদায়কৃত',
    missed: 'ছুটে গেছে',
    qaza_done: 'কাযা আদায়কৃত',
    excused: 'অব্যাহতিপ্রাপ্ত',
  };

  const handleExportJSON = () => {
    const rawData = localStorage.getItem('prayer_tracker_logs_db_v1');
    if (!rawData) {
      alert("এক্সপোর্ট করার মতো কোনো সালাত ট্র্যাকার রেকর্ড এখনো তৈরি করা হয়নি!");
      return;
    }
    
    try {
      const parsed = JSON.parse(rawData);
      const dataStr = JSON.stringify(parsed, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `prayer_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch(e) {
      alert("দুঃখিত, ডাটা এক্সপোর্ট করার সময় একটি ত্রুটি ঘটেছে।");
    }
  };

  const handleExportCSV = () => {
    const rawData = localStorage.getItem('prayer_tracker_logs_db_v1');
    if (!rawData) {
      alert("এক্সপোর্ট করার মতো কোনো সালাত ট্র্যাকার রেকর্ড এখনো তৈরি করা হয়নি!");
      return;
    }

    try {
      const parsed = JSON.parse(rawData);
      const dates = Object.keys(parsed).sort((a, b) => b.localeCompare(a));
      
      if (dates.length === 0) {
        alert("এক্সপোর্ট করার মতো কোনো সালাত ট্র্যাকার রেকর্ড এখনো তৈরি করা হয়নি!");
        return;
      }

      const headers = ['তারিখ (Date)', 'ফজর (Fajr)', 'যুহর (Dhuhr)', 'আসর (Asr)', 'মাগরিব (Maghrib)', 'ইশা (Isha)', 'তাহাজ্জুদ (Tahajjud)', 'বিতর (Witr)', 'মন্তব্য (Notes)'];
      const csvRows = [headers.join(',')];

      for (const date of dates) {
        const log = parsed[date] || {};
        
        const getStatusText = (item: any) => {
          const status = item?.status || 'pending';
          return STATUS_LABELS_BN[status] || status;
        };

        const fajr = getStatusText(log.fajr);
        const dhuhr = getStatusText(log.dhuhr);
        const asr = getStatusText(log.asr);
        const maghrib = getStatusText(log.maghrib);
        const isha = getStatusText(log.isha);
        const tahajjud = getStatusText(log.tahajjud);
        const witr = getStatusText(log.witr);
        
        let notesText = log.notes || '';
        if (notesText.includes(',') || notesText.includes('"') || notesText.includes('\n')) {
          notesText = `"${notesText.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        }

        const row = [
          date,
          fajr,
          dhuhr,
          asr,
          maghrib,
          isha,
          tahajjud,
          witr,
          notesText
        ];

        csvRows.push(row.join(','));
      }

      // Add a UTF-8 Byte Order Mark (BOM) so Excel can read Bengali characters seamlessly
      const csvContent = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const exportFileDefaultName = `prayer_history_${new Date().toISOString().split('T')[0]}.csv`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      URL.revokeObjectURL(url);
    } catch(e) {
      alert("দুঃখিত, ডাটা এক্সপোর্ট করার সময় একটি ত্রুটি ঘটেছে।");
    }
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
          onClick={() => {
            audioSynth.stopActiveAudio();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer transition-colors"
          id="btn-settings-back"
        >
          <ArrowLeft size={18} />
          <span>মূল পাতায় ফিরে যান</span>
        </button>
        <span className="text-xl font-bold text-emerald-900 border-l-4 border-emerald-600 pl-3">
          সেটিংস এবং নিয়ন্ত্রণ
        </span>
      </div>

      <div className="space-y-6">
        {/* District & Calculations */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
          <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
            <MapPin size={18} className="text-emerald-700" />
            জেলা ও অবস্থান নির্বাচন
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">আপনার জেলা:</label>
              <select
                value={localSettings.selectedDistrictId}
                onChange={handleDistrictChange}
                className="w-full text-xs font-medium border border-emerald-100 rounded-xl px-3 py-2 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition-all"
                id="select-district"
              >
                {divisions.map(div => (
                  <optgroup key={div} label={`${div} বিভাগ`}>
                    {BANGLADESH_DISTRICTS.filter(d => d.division === div).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.nameBn} ({d.nameEn})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">মাযহাব / আসরের নামাজ কোণ নির্ধারণ:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleJuristicChange('hanafi')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${localSettings.juristicSchool === 'hanafi' ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : 'bg-emerald-50/50 text-emerald-800 border-emerald-100 hover:bg-emerald-100'}`}
                  id="btn-school-hanafi"
                >
                  হানাফী (দ্বিগুণ ছায়া)
                </button>
                <button
                  type="button"
                  onClick={() => handleJuristicChange('shafi')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${localSettings.juristicSchool === 'shafi' ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : 'bg-emerald-50/50 text-emerald-800 border-emerald-100 hover:bg-emerald-100'}`}
                  id="btn-school-shafi"
                >
                  শাফেয়ী, মালেকী, হাম্বলী (একগুণ ছায়া)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alarm Sound & Speaker Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
          <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
            <Volume2 size={18} className="text-emerald-700" />
            আজান ও এলার্ম সাউন্ড সেটিংস
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">এলার্ম সাউন্ড নির্বাচন:</label>
                <select
                  value={localSettings.alarmSoundType}
                  onChange={handleSoundTypeChange}
                  className="w-full text-xs font-medium border border-emerald-100 rounded-xl px-3 py-2 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition-all"
                  id="select-alarm-sound"
                >
                  <option value="adhan_short">ক্ষুদ্র আজান মেলোডি (Adhan Short)</option>
                  <option value="melody">সুরময় ঘণ্টা (Melody Chime)</option>
                  <option value="beep_soft">নরম মিউজিক্যাল বিপ (Beep Soft)</option>
                  <option value="beep_digital">ডিজিটাল বিপ বিপ (Electronic Beep)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">ভলিউম লেভেল:</label>
                <div className="flex items-center gap-3 py-1 bg-emerald-50/20 border border-emerald-100 rounded-xl px-3">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-emerald-800 hover:text-emerald-900 cursor-pointer"
                    id="btn-settings-mute"
                  >
                    {localSettings.isMuted || localSettings.alarmVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localSettings.isMuted ? 0 : localSettings.alarmVolume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 bg-emerald-100 accent-emerald-850 rounded-lg cursor-pointer"
                    id="range-volume"
                  />
                  <span className="text-xs font-mono font-bold text-emerald-950 w-8 text-right">
                    {localSettings.isMuted ? '০' : toBengaliNumber(Math.round(localSettings.alarmVolume * 100))}%
                  </span>
                </div>
              </div>
            </div>

            {/* Adhan sample & custom upload section */}
            {localSettings.alarmSoundType === 'adhan_short' && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50/20 p-4 border border-emerald-100 rounded-2xl mt-2 space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-black text-emerald-900 mb-1.5 flex items-center gap-1.5">
                    আজান সুরের নমুনা নির্বাচন (Adhan Style Preset):
                  </label>
                  <select
                    value={localSettings.selectedAdhanSample || 'synth_classic'}
                    onChange={(e) => {
                      const sample = e.target.value as any;
                      const updated = {
                        ...localSettings,
                        selectedAdhanSample: sample
                      };
                      setLocalSettings(updated);
                      // preview immediately
                      audioSynth.play('adhan_short', localSettings.alarmVolume, sample, localSettings.customAdhanBase64);
                    }}
                    className="w-full text-xs font-semibold border border-emerald-100 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer transition-all text-slate-800"
                    id="select-adhan-sample"
                  >
                    <optgroup label="সিন্থেসাইজার টিউন (Synthesizer Chimes - Offline/Saves Data)" className="text-emerald-900 font-bold text-xs">
                      <option value="synth_classic">ট্রেডিশনাল আজান সিন্থ (Traditional Synth)</option>
                      <option value="synth_makkah">মক্কা আজান স্টাইল সিন্থ (Makkah Style Synth)</option>
                      <option value="synth_madinah">মদীনা আজান স্টাইল সিন্থ (Madinah Style Synth)</option>
                      <option value="synth_aqsa">আকসা আজান স্টাইল সিন্থ (Al-Aqsa Style Synth)</option>
                    </optgroup>
                    <optgroup label="হাই-ফিডেলিটি আজান রেকর্ড (High-Fidelity MP3 - Requires Internet)" className="text-emerald-900 font-bold text-xs">
                      <option value="mp3_makkah">মহিমান্বিত হারামাইন আজান - মক্কা (Makkah MP3)</option>
                      <option value="mp3_madinah">প্রশান্তিময় মসজিদে নববী আজান - মদীনা (Madinah MP3)</option>
                      <option value="mp3_egypt">ঐতিহ্যবাহী কায়রো আজান - মিসর (Egypt MP3)</option>
                    </optgroup>
                    {localSettings.customAdhanBase64 && (
                      <optgroup label="আপনার আপলোডকৃত সাউন্ড (User Uploaded)" className="text-emerald-900 font-bold text-xs">
                        <option value="custom_uploaded">
                          {localSettings.customAdhanName || 'আমার কাস্টম আজান ফাইল'} (কাস্টম ফাইল)
                        </option>
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* File picker for custom adhan audio */}
                <div className="border border-dashed border-emerald-250 p-4 rounded-xl bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">কাস্টম আজান বা রিমাইন্ডার অডিও ফাইল</span>
                      <span className="text-[10px] text-slate-500 block">MP3 / WAV/ OGG সাপোর্ট করে (সর্বোচ্চ ২.৫ মেগাবাইট)</span>
                    </div>
                    {localSettings.customAdhanBase64 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localSettings,
                            customAdhanBase64: '',
                            customAdhanName: '',
                            selectedAdhanSample: 'synth_classic' as const
                          };
                          setLocalSettings(updated);
                        }}
                        className="text-[10px] font-black text-rose-600 hover:underline cursor-pointer bg-none border-none outline-none"
                        id="btn-remove-custom-adhan"
                      >
                        ফাইল মুছুন
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2.5 * 1024 * 1024) {
                            alert("ফাইল সাইজ ২.৫ মেগাবাইটের বেশি হতে পারবে না। অনুগ্রহ করে ছোট অডিও বা আজান ক্লিপ উর্ধ্বমুখী চেক করুন।");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            const updated = {
                              ...localSettings,
                              customAdhanBase64: base64,
                              customAdhanName: file.name,
                              selectedAdhanSample: 'custom_uploaded' as const
                            };
                            setLocalSettings(updated);
                            // preview immediately
                            audioSynth.play('adhan_short', localSettings.alarmVolume, 'custom_uploaded', base64);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-emerald-805 hover:file:bg-emerald-100 cursor-pointer w-full"
                      id="file-adhan-picker"
                    />
                  </div>

                  {localSettings.customAdhanBase64 && (
                    <div className="flex items-center gap-1.5 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100 text-[10px] text-emerald-900 font-bold">
                      <span className="shrink-0 text-emerald-700">✓ সংযুক্ত ফাইল:</span>
                      <span className="truncate flex-1 text-slate-600 font-mono text-[9px] font-normal">{localSettings.customAdhanName}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Notification triggers toggle */}
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-2">ওয়াক্তভিত্তিক এলার্ম অ্যালার্ট অন/অফ:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(localSettings.enabledNotifications).map((pKey) => {
                  const label = pKey === 'fajr' ? 'ফজর' : pKey === 'sunrise' ? 'সূর্যোদয়' : pKey === 'dhuhr' ? 'যুহর' : pKey === 'asr' ? 'আসর' : pKey === 'maghrib' ? 'মাগরিব' : 'ইশা';
                  const isEnabled = localSettings.enabledNotifications[pKey as keyof AppSettings['enabledNotifications']];
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => handleNotificationToggle(pKey as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${isEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm' : 'bg-gray-50/50 text-gray-400 border-gray-100'}`}
                      id={`btn-toggle-notif-${pKey}`}
                    >
                      <span>{label}</span>
                      <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-gray-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Time Fine Tuning Offsets */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
          <h3 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
            <Sliders size={18} className="text-emerald-700" />
            নামাজের সময়সূচী সূক্ষ্ম সমন্বয় (Fine-tuning)
          </h3>
          <p className="text-[11px] text-emerald-600 leading-relaxed mb-4">
            যদি আপনার স্থানীয় মসজিদের ঘড়ি বা ইসলামিক ফাউন্ডেশনের বার্ষিক ক্যালেন্ডারের সাথে সামান্য অমিল পাওয়া যায়, তবে এখান থেকে মিনিট যোগ/বিয়োগ করে সংশোধন করে নিতে পারেন।
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(localSettings.offsets).map((pKey) => {
              const label = pKey === 'fajr' ? 'ফজর' : pKey === 'sunrise' ? 'সূর্যোদয়' : pKey === 'dhuhr' ? 'যুহর' : pKey === 'asr' ? 'আসর' : pKey === 'maghrib' ? 'মাগরিব' : 'ইশা';
              const offsetVal = localSettings.offsets[pKey as keyof AppSettings['offsets']];

              return (
                <div key={pKey} className="border border-emerald-50 p-3 rounded-xl bg-emerald-50/5/10 flex flex-col items-center">
                  <span className="text-xs font-bold text-emerald-950 mb-1">{label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOffsetChange(pKey as any, offsetVal - 1)}
                      className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-100 flex items-center justify-center text-xs cursor-pointer"
                      id={`btn-offset-decrease-${pKey}`}
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-emerald-950 w-8 text-center bg-white border border-emerald-50 py-0.5 rounded shadow-inner">
                      {offsetVal >= 0 ? '+' : ''}{toBengaliNumber(offsetVal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOffsetChange(pKey as any, offsetVal + 1)}
                      className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-100 flex items-center justify-center text-xs cursor-pointer"
                      id={`btn-offset-increase-${pKey}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Hijri Date Adjustment */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
          <h3 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
            <Help size={18} className="text-emerald-700" />
            ইসলামিক হিজরী তারিখ সমন্বয় (Moon sighting offset)
          </h3>
          <p className="text-[11px] text-emerald-600 leading-relaxed mb-4">
            বাংলাদেশে প্রতি মাসে চাঁদ দেখা কমিটির ঘোষণার উপর ভিত্তি করে হিজরি তারিখ ১-২ দিন আগুপিছু হতে পারে। ক্যালেন্ডারের হিজরি দিন সঠিক করতে এখান থেকে পরিবর্তন করুন।
          </p>

          <div className="flex items-center justify-center gap-3 bg-emerald-50/40 p-4 border border-emerald-100 rounded-2xl max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => handleHijriOffsetChange(getHijriOffset() - 1)}
              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 flex items-center justify-center text-sm cursor-pointer"
              id="btn-hijri-decrease"
            >
              -
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-emerald-950 block">হিজরী তারিখ</span>
              <span className="text-xs font-mono font-extrabold text-emerald-800">
                {getHijriOffset() >= 0 ? '+' : ''}{toBengaliNumber(getHijriOffset())} দিন সংশোধন
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleHijriOffsetChange(getHijriOffset() + 1)}
              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 flex items-center justify-center text-sm cursor-pointer"
              id="btn-hijri-increase"
            >
              +
            </button>
          </div>
        </div>

        {/* Global Dark Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
          <h3 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
            <Moon size={18} className="text-emerald-700 animate-pulse" />
            গ্লোবাল ডার্ক মোড (Night Mode Theme)
          </h3>
          <p className="text-[11px] text-emerald-600 leading-relaxed mb-4">
            রাতের বেলা চোখের ক্লান্তি এড়াতে এবং সহজে সালাত ট্র্যাকিং করার জন্য পুরো অ্যাপ্লিকেশনটিকে সুন্দর ডার্ক থিমে নিয়ে যান।
          </p>

          <div className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl max-w-sm mx-auto">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-950">ডার্ক মোড সক্রিয় করুন</span>
              <span className="text-[9px] text-slate-500 font-sans mt-0.5">High-contrast nocturnal theme</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLocalSettings({
                  ...localSettings,
                  darkMode: !localSettings.darkMode
                });
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                localSettings.darkMode ? 'bg-emerald-800' : 'bg-gray-200'
              }`}
              id="btn-toggle-darkmode"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  localSettings.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Export Data Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6" id="settings-export-section">
          <h3 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-1.5 border-b border-emerald-50 pb-3">
            <Database size={18} className="text-emerald-700" />
            ডাটা এক্সপোর্ট এবং ব্যাকআপ (Data Export)
          </h3>
          <p className="text-[11px] text-emerald-600 leading-relaxed mb-4">
            আপনার সালাত ট্র্যাকিংয়ের সমস্ত তথ্য এবং ইতিহাস আপনার নিজস্ব ডিভাইসে ব্যাকআপ বা ব্যক্তিগত পর্যালোচনার জন্য ডাউনলোড করে সংরক্ষণ করতে পারেন।
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex-1 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/65 text-emerald-800 border border-emerald-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              id="btn-export-json"
            >
              <FileJson size={14} />
              JSON ব্যাকআপ ফাইল ডাউনলোড
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex-1 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/65 text-emerald-800 border border-emerald-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              id="btn-export-csv"
            >
              <FileSpreadsheet size={14} />
              Excel / CSV হিসেবে এক্সপোর্ট
            </button>
          </div>
        </div>

        {/* Global Save Button with Toast overlay */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            id="btn-settings-save"
          >
            <Save size={18} />
            সকল সেটিংস সংরক্ষণ করুন
          </button>

          {showSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-850 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Check size={16} className="text-emerald-300" />
              <span>আপনার সেটিংস সফলভাবে আপডেট ও রিলোড করা হয়েছে!</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
