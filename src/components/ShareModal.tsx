/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Share2, Copy, Download, X, Check, FileText, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';
import { getHijriDate } from '../utils/hijriDate';
import { getBengaliDate } from '../utils/bengaliDate';
import { formatTimeBn } from '../utils/prayerTimes';
import { District, PrayerTimes } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: Date;
  pTimes: PrayerTimes;
  activeDistrict: District;
  settings: any;
}

export default function ShareModal({
  isOpen,
  onClose,
  currentTime,
  pTimes,
  activeDistrict,
  settings,
}: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [sharingError, setSharingError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('image');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  const hijriStr = getHijriDate(currentTime, settings.hijriOffset ?? 0).fullString;
  const bengaliStr = getBengaliDate(currentTime).fullString;
  
  // Format Gregorian Date in Bengali
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const gregDateBn = toBengaliNumber(currentTime.toLocaleDateString('bn-BD', options));

  // 1. Generate text snippet
  const formattedText = `🕌 আজকের সালাতের সময়সূচী 🕌
📍 স্থান: ${activeDistrict.nameBn}, বাংলাদেশ
📅 তারিখ: ${gregDateBn}
🌙 হিজরি: ${hijriStr}
🌾 বাংলা: ${bengaliStr}
----------------------------------
Sahri End / Fajr Start (সাহরী শেষ): ${formatTimeBn(pTimes.fajr)}
Sunrise (সূর্যোদয়): ${formatTimeBn(pTimes.sunrise)}
Dhuhr (যুহর): ${formatTimeBn(pTimes.dhuhr)}
Asr (আসর): ${formatTimeBn(pTimes.asr)}
Maghrib / Iftar (মাগরিব / ইফতার): ${formatTimeBn(pTimes.maghrib)}
Isha (ইশা): ${formatTimeBn(pTimes.isha)}
Tahajjud (তাহাজ্জুদ): ${formatTimeBn(pTimes.tahajjudStart)} - ${formatTimeBn(pTimes.tahajjudEnd)}
----------------------------------
নামাজ কায়েম করুন। নিয়মিত জামাতে নামাজ পড়ুন।
— শিবির ডট কম BD - আপনার প্রতিদিনের দ্বীনি সঙ্গী (https://shibir.com)
`;

  // Draw the image onto canvas
  useEffect(() => {
    if (!isOpen) return;
    setIsGenerating(true);
    setSharingError('');

    // Small timeout to allow canvas to be fully ready in memory
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (balanced 2x resolution for High-DPI crisp rendering)
      const baseWidth = 600;
      const baseHeight = 780;
      canvas.width = baseWidth * 2;
      canvas.height = baseHeight * 2;
      ctx.scale(2, 2);

      // --- Draw Background Gradient ---
      const gradient = ctx.createLinearGradient(0, 0, 0, baseHeight);
      gradient.addColorStop(0, '#047857'); // Emerald-700
      gradient.addColorStop(0.5, '#064e3b'); // Emerald-900
      gradient.addColorStop(1, '#022c22'); // Emerald-950
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      // --- Draw Sub-geometric Accents ---
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // Emerald Outline Accent
      ctx.lineWidth = 1;
      // Draw concentric elegant border circles
      ctx.beginPath();
      ctx.arc(baseWidth / 2, -150, 400, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(baseWidth / 2, baseHeight + 150, 420, 0, Math.PI * 2);
      ctx.stroke();

      // Outer Card border
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)'; // Amber/Gold tone line
      ctx.lineWidth = 1.5;
      ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);

      // Inner thin header border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeRect(19, 19, baseWidth - 38, baseHeight - 38);

      // --- Draw Header Text ---
      // Brand Header
      ctx.fillStyle = '#fdba74'; // Warm Gold / Orange-300
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('শিবির ডট কম BD', baseWidth / 2, 45);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 24px 'Inter', 'SolaimanLipi', sans-serif";
      ctx.fillText('আজকের সালাতের সময়সূচী', baseWidth / 2, 85);

      // Location Pill Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      const locText = `${activeDistrict.nameBn} জেলা`;
      ctx.font = "bold 14px 'Inter', 'SolaimanLipi', sans-serif";
      const locWidth = ctx.measureText(locText).width + 30;
      // Draw rounded location box
      drawRoundedRect(ctx, baseWidth / 2 - locWidth / 2, 110, locWidth, 28, 14);
      ctx.fill();

      // Location Pill Text
      ctx.fillStyle = '#34d399'; // Emerald-400
      ctx.fillText(locText, baseWidth / 2, 128);

      // Dates Layout
      ctx.fillStyle = '#f3f4f6';
      ctx.font = "bold 15px 'Inter', 'SolaimanLipi', sans-serif";
      ctx.fillText(gregDateBn, baseWidth / 2, 175);

      ctx.fillStyle = '#a7f3d0'; // Emerald-200
      ctx.font = "12px 'Inter', 'SolaimanLipi', sans-serif";
      ctx.fillText(`${hijriStr}   |   ${bengaliStr}`, baseWidth / 2, 202);

      // --- Group Obligatory and Auxiliary Prayers into clean Rows ---
      const items = [
        { name: 'সাহরীর শেষ সময়', time: formatTimeBn(pTimes.fajr), desc: 'ফজর ওয়াক্ত শুরু' },
        { name: 'ফজর', time: formatTimeBn(pTimes.fajr) + ' - ' + formatTimeBn(pTimes.sunrise), desc: 'ফজর ওয়াক্ত' },
        { name: 'সূর্যোদয়', time: formatTimeBn(pTimes.sunrise), desc: 'ইশরাক শুরু' },
        { name: 'যুহর', time: formatTimeBn(pTimes.dhuhr) + ' - ' + formatTimeBn(pTimes.asr), desc: 'যুহর ওয়াক্ত' },
        { name: 'আসর', time: formatTimeBn(pTimes.asr) + ' - ' + formatTimeBn(pTimes.maghrib), desc: 'আসর ওয়াক্ত' },
        { name: 'মাগরিব ও ইফতার', time: formatTimeBn(pTimes.maghrib) + ' - ' + formatTimeBn(pTimes.isha), desc: 'ইফতারের সময়' },
        { name: 'ইশা', time: formatTimeBn(pTimes.isha) + ' - ' + formatTimeBn(pTimes.fajr), desc: 'ইশা ওয়াক্ত' },
        { name: 'তাহাজ্জুদ', time: formatTimeBn(pTimes.tahajjudStart) + ' - ' + formatTimeBn(pTimes.tahajjudEnd), desc: 'শেষ রাতের সালাত' },
      ];

      let rowY = 230;
      ctx.textAlign = 'left';

      items.forEach((item, index) => {
        // Alternating translucent row backgrounds for pristine hierarchy
        ctx.fillStyle = index % 2 === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.08)';
        drawRoundedRect(ctx, 40, rowY, baseWidth - 80, 48, 12);
        ctx.fill();

        // Left Label
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 14px 'Inter', 'SolaimanLipi', sans-serif";
        ctx.fillText(item.name, 60, rowY + 28);

        // Sub description
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = "10px 'Inter', 'SolaimanLipi', sans-serif";
        ctx.fillText(item.desc, 60, rowY + 41);

        // Right Time Value
        ctx.fillStyle = '#fbbf24'; // Beautiful golden yellow
        ctx.font = "bold 15px 'Inter', sans-serif";
        ctx.textAlign = 'right';
        ctx.fillText(item.time, baseWidth - 60, rowY + 29);

        // Reset alignment
        ctx.textAlign = 'left';
        rowY += 56;
      });

      // --- Footer Branding Block ---
      ctx.textAlign = 'center';
      
      // Beautiful separating dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.font = "14px 'Inter', sans-serif";
      ctx.fillText('•   •   •   •   •', baseWidth / 2, rowY + 25);

      // Quote / Message
      ctx.fillStyle = '#d1fae5'; // Emerald-100
      ctx.font = "italic 13px 'Inter', 'SolaimanLipi', sans-serif";
      ctx.fillText('“রাসূলুল্লাহ (সাঃ) বলেন, মানুষের মাঝে সালাত ও কুফরের মাঝে পার্থক্য হলো সালাত।”', baseWidth / 2, rowY + 50);

      // Tech-Aesthetic Citation (Minimal & Clean)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = "11px 'Inter', 'SolaimanLipi', sans-serif";
      ctx.fillText('নামাজ কায়েম করুন। জামাতে নামাজ আপনার মর্যাদা বৃদ্ধি করে।', baseWidth / 2, rowY + 75);

      // Save URI
      try {
        const urlList = canvas.toDataURL('image/png');
        setImageSrc(urlList);
      } catch (err) {
        console.error('Error rendering image canvas data URI', err);
      } finally {
        setIsGenerating(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isOpen, settings.selectedDistrictId, settings.juristicSchool, currentTime]);

  // Round rectangle drawing helper
  function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Handle Text Copying Function
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Convert Base64 dataURL to File Blob
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Web Share API Action
  const handleShare = async () => {
    setSharingError('');
    setShared(false);

    try {
      if (!navigator.share) {
        throw new Error('আপনার ব্রাউজার বা ডিভাইসে সরাসরি শেয়ার করার সুবিধাটি নেই। আপনি নীচের কপি বা ডাউনলোড বাটন ব্যবহার করতে পারেন।');
      }

      const shareData: ShareData = {};

      if (activeTab === 'image' && imageSrc) {
        const file = dataURLtoFile(imageSrc, `prayer_times_${activeDistrict.id}.png`);
        
        // Formulate request
        const fileData = {
          files: [file],
          title: `আজকের সালাতের সময়সূচী - ${activeDistrict.nameBn}`,
          text: `স্থান: ${activeDistrict.nameBn}, হিজরি: ${hijriStr}, বাংলা: ${bengaliStr}`,
        };

        if (navigator.canShare && navigator.canShare(fileData)) {
          await navigator.share(fileData);
          setShared(true);
          setTimeout(() => setShared(false), 2000);
          return;
        } else {
          // If browser cannot share files directly, try sharing text about it
          shareData.title = `আজকের সালাতের সময়সূচী - ${activeDistrict.nameBn}`;
          shareData.text = formattedText;
        }
      } else {
        shareData.title = `আজকের সালাতের সময়সূচী - ${activeDistrict.nameBn}`;
        shareData.text = formattedText;
      }

      await navigator.share(shareData);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled, which is fine
        return;
      }
      console.warn('Sharing error:', err);
      // Give a clean message
      setSharingError(err.message || 'শেয়ারিং সম্পন্ন করা যায়নি। অনুগ্রহ করে কপি বা ডাউনলোড বাটন ব্যবহার করুন।');
    }
  };

  // Download Trigger
  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.download = `shibir_com_prayer_times_${activeDistrict.id}.png`;
    link.href = imageSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Offscreen rendering element */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        id="share-modal-root"
      >
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-emerald-50 bg-emerald-50/20 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-emerald-950 flex items-center gap-1.5">
              <Share2 size={18} className="text-emerald-700" />
              সময়সূচী শেয়ার করুন
            </h3>
            <p className="text-[10px] text-emerald-700 font-bold leading-none mt-0.5">
              ${activeDistrict.nameBn} জেলা • ${hijriStr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-full transition-all cursor-pointer"
            id="btn-close-share-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-emerald-50 bg-slate-50/50 p-1 m-3 gap-1 rounded-xl">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="tab-share-image"
          >
            <ImageIcon size={14} />
            ছবি কার্ড (PNG Image)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'text'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            id="tab-share-text"
          >
            <FileText size={14} />
            টেক্সট মেসেজ (Formatted message)
          </button>
        </div>

        {/* Middle Canvas / Text Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col items-center justify-center">
          {activeTab === 'image' ? (
            <div className="flex flex-col items-center gap-2.5 w-full">
              {isGenerating ? (
                <div className="w-full aspect-[6/7.8] max-w-sm bg-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 border border-dashed border-slate-200">
                  <div className="size-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-500">আপনার সালাতের ছবি কার্ড তৈরি হচ্ছে...</p>
                </div>
              ) : (
                <div className="relative group max-w-sm rounded-2xl overflow-hidden shadow-md border border-emerald-150 bg-[#064e3b]">
                  <img
                    src={imageSrc}
                    alt="Prayer Times Card"
                    className="w-full object-contain pointer-events-auto max-h-[50vh]"
                    referrerPolicy="no-referrer"
                    id="shared-image-preview"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <p className="text-white text-xs font-extrabold bg-emerald-900/90 py-1.5 px-3.5 rounded-full border border-emerald-500/20">
                      মোবাইলে চাপ দিয়ে ধরে শেয়ার বা সেভ করুন
                    </p>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-center text-slate-500 font-semibold px-4">
                💡 ছবিটির উপর স্পর্শ করে ধরের রাখলে সরাসরি কপি বা গ্যালারিতে সংরক্ষণ করতে পারবেন।
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <textarea
                readOnly
                value={formattedText}
                className="w-full h-[50vh] text-left text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono leading-relaxed outline-none focus:ring-1 focus:ring-emerald-700 select-all"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                id="shared-text-preview"
              />
              <p className="text-[10px] text-center text-slate-500 font-semibold">
                💡 টেক্সট ফিল্ডের যেকোনো জায়গায় ক্লিক করলে সমগ্র বার্তাটি সিলেক্ট হয়ে যাবে।
              </p>
            </div>
          )}

          {sharingError && (
            <div className="mt-3 text-center text-[10px] bg-amber-50 text-amber-850 p-2.5 rounded-xl border border-amber-200 w-full font-semibold">
              {sharingError}
            </div>
          )}
        </div>

        {/* Bottom Panel Actions */}
        <div className="px-6 py-4 border-t border-emerald-50 bg-slate-50/50 flex flex-wrap gap-2.5 items-center justify-end">
          {activeTab === 'image' && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all shadow-3xs cursor-pointer"
              disabled={isGenerating}
              id="btn-download-image"
            >
              <Download size={14} />
              ডাউনলোড করুন
            </button>
          )}

          <button
            onClick={activeTab === 'image' ? handleCopyText : handleCopyText}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-3xs cursor-pointer"
            id="btn-copy-content"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600 animate-pulse" />
                কপি হয়েছে!
              </>
            ) : (
              <>
                <Copy size={14} />
                টেক্সট কপি করুন
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-emerald-800 hover:bg-emerald-900 shadow-sm rounded-xl transition-all cursor-pointer"
            id="btn-perform-api-share"
          >
            {shared ? (
              <>
                <Check size={14} className="animate-pulse" />
                শেয়ার সম্পন্ন
              </>
            ) : (
              <>
                <Share2 size={14} />
                সরাসরি শেয়ার করুন
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
