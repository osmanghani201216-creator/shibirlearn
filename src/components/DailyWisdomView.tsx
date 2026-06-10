import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  RefreshCcw, 
  Volume2, 
  VolumeX, 
  Moon, 
  CornerDownRight, 
  MessageSquare, 
  Facebook, 
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AyahInfo {
  number: number;
  text: string;
  translation: string;
  surahName: string;
  surahEnglish: string;
  ayahInSurah: number;
  audioUrl?: string;
}

interface HadithInfo {
  text: string;
  translation: string;
  source: string;
  chapter: string;
}

// Beautifully selected fallback Quran verses (in case API is offline or slow)
const FALLBACK_VERSES: AyahInfo[] = [
  {
    number: 255,
    text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ",
    translation: "আল্লাহ, তিনি ছাড়া অন্য কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আকাশ ও পৃথিবীতে যা কিছু আছে সবই তাঁর।",
    surahName: "সূরা আল-বাকারা",
    surahEnglish: "Al-Baqarah",
    ayahInSurah: 255
  },
  {
    number: 186,
    text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ",
    translation: "আর আমার বান্দারা যখন আপনার কাছে আমার সম্পর্কে জিজ্ঞেস করে, আমি তো নিকটেই আছি। কোনো আহ্বানকারী যখন আমাকে ডাকে, আমি তার ডাকে সাড়া দেই।",
    surahName: "সূরা আল-বাকারা",
    surahEnglish: "Al-Baqarah",
    ayahInSurah: 186
  },
  {
    number: 6226,
    text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে। অবশ্যই কষ্টের সাথেই স্বস্তি রয়েছে।",
    surahName: "সূরা আলাম নাশরাহ (আল-ইনশিরাহ)",
    surahEnglish: "Al-Inshirah",
    ayahInSurah: 5
  },
  {
    number: 3412,
    text: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ",
    translation: "বলুন, হে আমার বান্দাগণ! যারা নিজেদের প্রতি অবিচার করেছ, তোমরা আল্লাহর অনুগ্রহ থেকে হতাশ হয়ো না; নিশ্চয়ই আল্লাহ সমস্ত পাপ ক্ষমা করে দেন।",
    surahName: "সূরা আজ-জুমার",
    surahEnglish: "Az-Zumar",
    ayahInSurah: 53
  },
  {
    number: 40,
    text: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    translation: "হে আমাদের প্রতিপালক! আমাদের পক্ষ থেকে কবুল করুন; নিশ্চয়ই আপনি সর্বশ্রোতা, সর্বজ্ঞাতা।",
    surahName: "সূরা আল-বাকারা",
    surahEnglish: "Al-Baqarah",
    ayahInSurah: 127
  },
  {
    number: 3290,
    text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "হে মুমিনগণ! তোমরা ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো। নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।",
    surahName: "সূরা আল-বাকারা",
    surahEnglish: "Al-Baqarah",
    ayahInSurah: 153
  }
];

// Beautifully selected Hadiths for rotating "Hadith of the Day"
const HADITHS: HadithInfo[] = [
  {
    text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation: "সমস্ত কাজ নিয়ত বা সংকল্পের উপর নির্ভরশীল। আর প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ীই প্রতিফল পাবে।",
    source: "সহীহ বুখারী, হাদিস নং ১",
    chapter: "ঈমান ও নিয়তের অধ্যায়"
  },
  {
    text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation: "তোমাদের মধ্যে সর্বোত্তম বা সেরা সেই ব্যক্তি, যে নিজে কুরআন শেখে এবং অন্যকে তা শিক্ষা দেয়।",
    source: "সহীহ বুখারী, হাদিস নং ৫০২৭",
    chapter: "কুরআনের ফযীলত অধ্যায়"
  },
  {
    text: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translation: "প্রকৃত মুসলিম বা আত্মসমর্পণকারী তো সেই ব্যক্তি, যার জবান বা মুখ এবং হাত থেকে অন্য মুসলিম বা মানুষ নিরাপদ থাকে।",
    source: "সহীহ বুখারী ও মুসলিম",
    chapter: "ইসলামের সৌহার্দ্য ও চরিত্র অধ্যায়"
  },
  {
    text: "يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا",
    translation: "তোমরা দ্বীনের পথে মানুষের জন্য সহজ করো, কঠিন করো না; আশার বাণী শোনাও বা সুসংবাদ দাও এবং মানুষকে দূরে সরিয়ে দিও না।",
    source: "সহীহ বুখারী, হাদিস নং ৬১২৫",
    chapter: "আখলাক ও শিক্ষা অধ্যায়"
  },
  {
    text: "الدِّينُ النَّصِيحَةُ",
    translation: "ইসলাম বা দ্বীন হলো মূলত কল্যাণকামিতা ও আন্তরিক হিতাকাঙ্ক্ষা।",
    source: "সহীহ মুসলিম, হাদিস নং ৫৫",
    chapter: "নসীহত ও ওয়াজ অধ্যায়"
  },
  {
    text: "لاَ يَرْحَمُ اللَّهُ مَنْ لاَ يَرْحَمُ النَّاسَ",
    translation: "যে ব্যক্তি মানুষের প্রতি দয়া প্রদর্শন করে না, পরম দয়ালু আল্লাহও তার প্রতি দয়া বা করুণা করেন না।",
    source: "সহীহ মুসলিম, হাদিস নং ২৩১৯",
    chapter: "দয়া ও শিষ্টাচার অধ্যায়"
  },
  {
    text: "سَبَابُ الْمُسْلِمِ فُسُوقٌ، وَقِتَالُهُ كُفْرٌ",
    translation: "কোনো মুসলিম বা মানুষকে গালি দেওয়া পাপাচার ও ফাসেকী কাজ, আর তার সাথে রক্তক্ষয়ী লড়াই বা খুনোখুনিতে জড়ানো কুফরি কাজ।",
    source: "সহীহ বুখারী, হাদিস নং ৪৮",
    chapter: "পারস্পরিক অধিকার অধ্যায়"
  },
  {
    text: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا",
    translation: "তুমি যেখানেই থাকো না কেন আল্লাহকে ভয় করো (তাকওয়া অবলম্বন করো), আর প্রতিটি মন্দের পেছনে সাথে সাথে একটি ভালো কাজ করো, তাহলে ভালো কাজটি মন্দ কাজটিকে মিটিয়ে দেবে।",
    source: "সুনানে তিরমিযী, হাদিস নং ১৯৮৭",
    chapter: "উত্তম স্বভাব ও সামাজিকতা অধ্যায়"
  }
];

export default function DailyWisdomView() {
  const [activeTab, setActiveTab] = useState<'verse' | 'hadith'>('verse');
  
  // Quran states
  const [ayah, setAyah] = useState<AyahInfo>(FALLBACK_VERSES[0]);
  const [isAyahLoading, setIsAyahLoading] = useState<boolean>(false);
  const [ayahError, setAyahError] = useState<string | null>(null);

  // Hadith states
  const [hadith, setHadith] = useState<HadithInfo>(HADITHS[0]);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Clipboard share states
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Calculate deterministic item index based on the day of the year
  const getDayOfYearIndex = (listLength: number) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day % listLength;
  };

  // On mount, load deterministic verse and hadith for the calendar day
  useEffect(() => {
    const dailyHadithIndex = getDayOfYearIndex(HADITHS.length);
    setHadith(HADITHS[dailyHadithIndex]);

    const dailyVerseIndex = getDayOfYearIndex(FALLBACK_VERSES.length);
    setAyah(FALLBACK_VERSES[dailyVerseIndex]);

    // Promptly perform live api load for the daily verse to satisfy the requested dynamic nature
    fetchDailyAyahFromAPI();
  }, []);

  // Fetch from official public API: alquran.cloud
  const fetchDailyAyahFromAPI = async (forceRandomId?: number) => {
    setIsAyahLoading(true);
    setAyahError(null);
    try {
      // Get a safe randomized ayah number or deterministically calculated
      let ayahId = forceRandomId;
      if (!ayahId) {
        // Safe core devotional ayah numbers
        const selectedSafeIds = [
          262, 110, 193, 216, 222, 255, 256, 285, 286, 382,
          773, 1150, 1314, 1800, 2030, 2201, 3010, 3105, 3412,
          4000, 4210, 4322, 5060, 5200, 6000, 6105, 6226, 6230
        ];
        // Select deterministically or randomly from our list of high impact verses
        const dayIdx = getDayOfYearIndex(selectedSafeIds.length);
        ayahId = selectedSafeIds[dayIdx];
      }

      // We fetch both 'quran-uthmani' (Arabic text) and 'bn.bengali' translation using the multi-edition endpoint
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahId}/editions/quran-uthmani,bn.bengali`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Quran API');
      }

      const json = await response.json();
      
      if (json && json.code === 200 && Array.isArray(json.data)) {
        const arabicData = json.data[0];
        const bengaliData = json.data[1];

        const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahId}.mp3`;

        setAyah({
          number: ayahId,
          text: arabicData.text,
          translation: bengaliData.text,
          surahName: bengaliData.surah.name,
          surahEnglish: `${bengaliData.surah.englishName} (${bengaliData.surah.englishNameTranslation})`,
          ayahInSurah: bengaliData.numberInSurah,
          audioUrl: audioUrl
        });
      } else {
        throw new Error('Invalid JSON structure returned by Quran API');
      }
    } catch (err: any) {
      console.warn("Quran API failed, staying on localized fallback: ", err.message);
      // Fail gracefully: Pick a solid fallback from the offline dataset randomly
      const randomFallbackIdx = Math.floor(Math.random() * FALLBACK_VERSES.length);
      setAyah(FALLBACK_VERSES[randomFallbackIdx]);
      setAyahError("ইন্টারনেট বা সার্ভারের কারণে লাইভ আয়াত লোড করা যায়নি, কিন্তু অফলাইন ডেটাবেজ থেকে সুন্দর আয়াত যুক্ত করা হয়েছে।");
    } finally {
      setIsAyahLoading(false);
    }
  };

  // Trigger loading a completely random fresh Ayah from Quran API
  const handleLoadNewAyah = () => {
    // Generate a beautiful, completely random ayah id (1 to 6236)
    const randomAyahNumber = Math.floor(Math.random() * 6235) + 1;
    // Stop currently running audio if any
    if (audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
    }
    fetchDailyAyahFromAPI(randomAyahNumber);
  };

  // Rotate Hadith of the day randomly
  const handleRotateHadith = () => {
    const randomHadithes = HADITHS.filter(h => h.text !== hadith.text);
    const randomIdx = Math.floor(Math.random() * randomHadithes.length);
    setHadith(randomHadithes[randomIdx]);
  };

  // Format content for sharing
  const getShareText = () => {
    if (activeTab === 'verse') {
      return `আজকের পবিত্র কুরআনের বার্তা ✨\n\n📖 সূরা: ${ayah.surahName}\n🔢 আয়াত নং: ${ayah.ayahInSurah}\n\nعربي (আরবি): \n"${ayah.text}"\n\nঅনুবাদ (\nবাংলা): \n"${ayah.translation}"\n\nসংগৃহীত: বাংলাদেশ সালাত সময়ের অনলাইন উইজেট`;
    } else {
      return `আজকের হাদীস সম্ভার 🌸\n\n📌 হাদিস সূত্র: ${hadith.source}\n📖 অধ্যায়: ${hadith.chapter}\n\nعربي (আরবি): \n"${hadith.text}"\n\nঅনুবাদ: \n"${hadith.translation}"\n\nসংগৃহীত: বাংলাদেশ সালাত সময়ের অনলাইন উইজেট`;
    }
  };

  // Share text handler
  const handleShare = async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: activeTab === 'verse' ? 'আজকের কুরআনের বাণী' : 'আজকের হাদীস',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Native share failed', err);
        fallbackCopyToClipboard(shareText);
      }
    } else {
      fallbackCopyToClipboard(shareText);
    }
  };

  // Copy to clipboard helper
  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }).catch(err => {
      console.error('Copy to clipboard failed: ', err);
    });
  };

  // Share direct to WhatsApp helper
  const handleShareToWhatsApp = () => {
    const shareText = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank', 'referrerPolicy=no-referrer');
  };

  // Audio recitation toggle
  const handleToggleRecitation = () => {
    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
    } else if (ayah.audioUrl) {
      if (audioObj) {
        audioObj.play();
        setIsPlayingAudio(true);
      } else {
        const audio = new Audio(ayah.audioUrl);
        // Add referrer policy to ensure it passes sandbox requests nicely
        audio.preload = "auto";
        audio.onended = () => {
          setIsPlayingAudio(false);
        };
        audio.oncanplaythrough = () => {
          audio.play();
          setIsPlayingAudio(true);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          alert("সরাসরি অনলাইন থেকে তিলাওয়াত প্লে করা যায়নি। পুনরায় চেষ্টা করুন বা অডিও সোর্স চেক করুন।");
        };
        setAudioObj(audio);
      }
    }
  };

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, [audioObj]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mt-4 text-slate-800 transition-all duration-300" id="daily-wisdom-card">
      
      {/* HEADER SECTION WITH ICON */}
      <div className="flex items-center justify-between border-b border-emerald-50 pb-3 mb-4">
        <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
          <Sparkles className="text-amber-500 animate-pulse shrink-0" size={17} />
          <span>আজকের সুন্দর দ্বীনি বার্তা (Daily Wisdom)</span>
        </h3>
        
        {/* Toggle between Quran Verse and Hadith */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/50">
          <button
            onClick={() => {
              setActiveTab('verse');
              // Pause audio when switching
              if (audioObj) {
                audioObj.pause();
                setIsPlayingAudio(false);
              }
            }}
            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'verse'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="btn-wisdom-verse"
          >
            কুরআনের আয়াত
          </button>
          
          <button
            onClick={() => {
              setActiveTab('hadith');
              // Pause audio when switching
              if (audioObj) {
                audioObj.pause();
                setIsPlayingAudio(false);
              }
            }}
            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'hadith'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="btn-wisdom-hadith"
          >
            আল-হাদিস
          </button>
        </div>
      </div>

      {/* CONTENT COMPONENT */}
      <div className="relative min-h-[190px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          {activeTab === 'verse' ? (
            <motion.div
              key="verse-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Surah Reference Banner info */}
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-100/30">
                <span className="flex items-center gap-1">
                  <BookOpen size={13} className="text-emerald-700" />
                  {ayah.surahName} : আয়াত {ayah.ayahInSurah}
                </span>
                <span className="text-[10px] text-emerald-650 font-sans italic opacity-90 hidden sm:inline">
                  {ayah.surahEnglish}
                </span>
              </div>

              {/* Loader */}
              {isAyahLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <RefreshCcw className="size-6 text-emerald-700 animate-spin" />
                  <span className="text-xs text-slate-500 font-sans">পাবলিক এপিআই থেকে নতুন আয়াত লোড হচ্ছে...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Arabic text with beautiful font styling */}
                  <div className="bg-[#fcfdfa] border border-emerald-50/50 p-4 rounded-xl shadow-inner relative group">
                    <p 
                      dir="rtl" 
                      className="text-right font-serif text-lg md:text-xl font-bold leading-loose text-slate-800 font-sans tracking-wide py-1 selection:bg-emerald-200"
                    >
                      {ayah.text}
                    </p>
                  </div>

                  {/* Bengali Translation */}
                  <div className="pl-3 border-l-2 border-emerald-600">
                    <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed font-sans">
                      {ayah.translation}
                    </p>
                  </div>

                  {/* Play audio button if audioUrl matches */}
                  {ayah.audioUrl && (
                    <div className="flex items-center">
                      <button
                        onClick={handleToggleRecitation}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                          isPlayingAudio 
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/70' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50'
                        } cursor-pointer`}
                        title="শায়খ মিশারি রশিদ আল-আফাসি এর তিলাওয়াত শুনুন"
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX size={12} className="animate-pulse" />
                            <span>তিলাওয়াত বন্ধ করুন</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} />
                            <span>আয়াত তিলাওয়াত শুনুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* API Warning or info indicator */}
                  {ayahError && (
                    <p className="text-[10px] text-amber-700 font-sans leading-tight italic bg-amber-50 p-2 rounded-lg border border-amber-100">
                      ⚠️ {ayahError}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hadith-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Hadith source metadata indicator */}
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-100/30">
                <span className="flex items-center gap-1 block">
                  📂 {hadith.source}
                </span>
                <span className="text-[10px] text-emerald-650 font-sans italic opacity-90">
                  {hadith.chapter}
                </span>
              </div>

              {/* Hadith Arabic and Bangla representations */}
              <div className="space-y-3">
                <div className="bg-[#fcfdfa] border border-emerald-50/50 p-4 rounded-xl shadow-inner text-right">
                  <p 
                    dir="rtl" 
                    className="font-serif text-lg font-bold leading-loose text-slate-850 tracking-wide selection:bg-emerald-200"
                  >
                    {hadith.text}
                  </p>
                </div>

                <div className="pl-3 border-l-2 border-emerald-600">
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed font-sans">
                    {hadith.translation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTION ACTION FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-6">
          
          {/* Refresh / Load Button */}
          <div>
            {activeTab === 'verse' ? (
              <button
                onClick={handleLoadNewAyah}
                disabled={isAyahLoading}
                className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-emerald-800 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-xl transition-all disabled:opacity-60 cursor-pointer"
                id="library-reload-ayah"
              >
                <RefreshCcw size={11} className={`text-emerald-700 ${isAyahLoading ? 'animate-spin' : ''}`} />
                <span>অন্য আয়াত লোড করুন (API)</span>
              </button>
            ) : (
              <button
                onClick={handleRotateHadith}
                className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-emerald-800 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                id="library-reload-hadith"
              >
                <RefreshCcw size={11} className="text-emerald-700 hover:rotate-45" />
                <span>নতুন হাদীস পরিবর্তন করুন</span>
              </button>
            )}
          </div>

          {/* Share Action Panel */}
          <div className="flex items-center gap-2">
            
            {/* Copy Button */}
            <button
              onClick={() => fallbackCopyToClipboard(getShareText())}
              className={`p-2 rounded-xl border transition-all ${
                isCopied 
                  ? 'bg-emerald-800 text-white border-emerald-800' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-800'
              } cursor-pointer relative group`}
              id="btn-wisdom-copy"
              title="বার্তা কপি করুন"
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
              
              {/* Copy prompt toast fallback inside the UI */}
              {isCopied && (
                <span className="absolute bottom-full mb-1 right-0 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                  কপি হয়েছে!
                </span>
              )}
            </button>

            {/* General Native Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:text-indigo-700 hover:border-indigo-100 transition-all cursor-pointer"
              id="btn-wisdom-native-share"
              title="প্রিয়জনদের সাথে শেয়ার করুন"
            >
              <Share2 size={14} />
            </button>

            {/* Dedicated WhatsApp Share */}
            <button
              onClick={handleShareToWhatsApp}
              className="p-2 rounded-xl bg-[#e6fcf2] hover:bg-[#25d366]/10 text-[#25d366] hover:text-[#128c7e] border border-[#25d366]/20 hover:border-[#25d366]/40 transition-all cursor-pointer flex items-center justify-center"
              id="btn-wisdom-whatsapp-share"
              title="হোয়াটসঅ্যাপে শেয়ার করুন"
            >
              <MessageSquare size={14} className="fill-[#25d366] stroke-none" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
