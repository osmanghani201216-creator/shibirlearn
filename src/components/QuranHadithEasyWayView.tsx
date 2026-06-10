import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  ArrowLeft,
  Sparkles,
  Youtube,
  GraduationCap,
  ArrowUpRight,
  Heart,
  HelpCircle,
  Clock,
  PlayCircle,
  Sparkle,
  BookMarked,
  Languages,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface ResourceItem {
  id: string;
  title: string;
  category: 'quran_learn' | 'quran_meaning' | 'arabic_lang';
  categoryBn: string;
  descriptionBn: string;
  durationBn: string;
  lessonsBn: string;
  courseUrl: string;
  badge?: string;
  badgeType?: 'youtube' | 'free' | 'premium' | 'hot';
}

export default function QuranHadithEasyWayView({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('quran_hadith_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Five high-value course links specified in client request
  const RESOURCES: ResourceItem[] = [
    {
      id: 'quran-shikkha',
      title: 'কুরআন শিক্ষা (সহজ নিয়মে) 📖',
      category: 'quran_learn',
      categoryBn: 'কুরআন শিক্ষা',
      descriptionBn: 'পবিত্র কুরআন সহীহ-শুদ্ধভাবে হরফ উচ্চারণ, হরকত ও তাজবীদের যাবতীয় নিয়ম কানুনসহ অত্যন্ত চমৎকার ও প্রাঞ্জলভাবে শেখার ধারাবাহিক টিউটোরিয়াল প্লেলিস্ট।',
      durationBn: 'ধারাবাহিক',
      lessonsBn: 'ইউটিউব প্লেলিস্ট',
      courseUrl: 'https://youtube.com/playlist?list=PLDPHd_U0ECxG3wMEgA--fdZpG9SJEGAQQ&si=tx5LLhUoHO4ncWIf',
      badge: 'কুরআন শিক্ষা',
      badgeType: 'youtube'
    },
    {
      id: 'surah-telawat',
      title: 'সুরা তেলাওয়াত শিক্ষা ও মাখরাজ 🎙️',
      category: 'quran_learn',
      categoryBn: 'কুরআন শিক্ষা',
      descriptionBn: 'নামাজের জন্য প্রয়োজনীয় ছোট ছোট সূরাগুলোর বিশুদ্ধ উচ্চারণ, সঠিক মাখরাজ ও প্রমিত সুর তাল মিলিয়ে তেলাওয়াত অনুশীলনের আকর্ষণীয় প্লেলিস্ট।',
      durationBn: 'বিশুদ্ধ তেলাওয়াত',
      lessonsBn: 'ইউটিউব প্লেলিস্ট',
      courseUrl: 'https://youtube.com/playlist?list=PLDPHd_U0ECxE7GOaRDsCObxCJXDX3zmQm&si=NDLBf41WhM_zHL18',
      badge: 'তেলাওয়াত গাইড',
      badgeType: 'youtube'
    },
    {
      id: 'quran-shikhi',
      title: 'সহজ উপায়ে কুরআন শিখি ✨',
      category: 'quran_learn',
      categoryBn: 'কুরআন শিক্ষা',
      descriptionBn: 'একদম শুরু থেকে সহজ ও প্রাতিষ্ঠানিক নিয়মের বাইরে অত্যন্ত সাবলীল পদ্ধতিতে কুরআনের হরফ চেনা ও শব্দের বিশুদ্ধ আরবি রিডিং আয়ত্ত করার বিশেষ প্লেলিস্ট।',
      durationBn: 'বেসিক টু এডভান্স',
      lessonsBn: 'ইউটিউব প্লেলিস্ট',
      courseUrl: 'https://youtube.com/playlist?list=PLDPHd_U0ECxEiy6xKruB01TztWHsw2K5H&si=MC0OrCZW3caSItLV',
      badge: 'কুরআন শিখুন',
      badgeType: 'youtube'
    },
    {
      id: 'spoken-arabic',
      title: 'সহজে Spoken আরবি ভাষা কোর্স 🗣️',
      category: 'arabic_lang',
      categoryBn: 'আরবি ভাষা শিক্ষা',
      descriptionBn: 'টেন মিনিট স্কুল (10 Minute School) এর স্পেশাল স্পোকেন ক্যারিয়ার কোর্স। মধ্যপ্রাচ্য ভ্রমণ বা পড়াশোনা ও পেশাগত প্রয়োজনে সাবলীল আরবি কথ্য ভাষা সহজে আয়ত্ত করার সেরা মডিউল।',
      durationBn: '১০এমএস প্রিমিয়াম',
      lessonsBn: 'ভার্চুয়াল কোর্স',
      courseUrl: 'https://10minuteschool.com/product/spoken-arabic-language-course/',
      badge: 'Spoken Arabic',
      badgeType: 'premium'
    },
    {
      id: 'quran-ortho',
      title: 'কুরআন অর্থ ও তাফসীর শিক্ষা কোর্স 📘',
      category: 'quran_meaning',
      categoryBn: 'কুরআনের অর্থ',
      descriptionBn: 'কুরআন বোঝার হাতেখড়ি - ১০ মিনিট স্কুলের ফ্রি কোর্স। পবিত্র কুরআনের প্রধান সূরাসমূহের আধুনিক সরল বাংলা অনুবাদ, শব্দার্থ এবং বাস্তবিক জিন্দেগিতে তার চমৎকার উপদেশাবলি বোঝার গাইডলাইন।',
      durationBn: '১০০% ফ্রি',
      lessonsBn: '১০এমএস কোর্স',
      courseUrl: 'https://10minuteschool.com/product/quran-bojhar-hatekhori-free-online-course/',
      badge: 'অর্থ শিক্ষা',
      badgeType: 'free'
    }
  ];

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('quran_hadith_favorites', JSON.stringify(updated));
  };

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const filteredResources = RESOURCES.filter(res => {
    if (activeCategory !== 'all' && res.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(query) ||
        res.descriptionBn.toLowerCase().includes(query) ||
        res.categoryBn.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="quran-hadith-learn-root">
      
      {/* BRANDING HEADER WITH NAVIGATION */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer shrink-0"
            id="quran-back-btn"
            title="ফিরে যান"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-white p-2.5 rounded-2xl shadow-sm">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                কুরআন ও হাদিস সহজ উপায়
              </h1>
              <p className="text-xs text-emerald-700 font-semibold leading-normal mt-0.5">
                সহজে সহীহ-শুদ্ধ কুরআন তেলাওয়াত, তাজবীদ, সূরা শিক্ষা এবং বাস্তবসম্মত আরবি ভাষায় কথা বলা শেখার প্রামাণ্য উৎসসমূহ
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic quote/hadith indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl text-[11px] font-bold border border-emerald-100 shrink-0">
          <Sparkles size={13} className="text-amber-500 animate-pulse" />
          <span>রাসূল (সা.) বলেন: "তোমাদের মধ্যে সর্বোত্তম সে, যে নিজে কুরআন শেখে ও অন্যকে শেখায়।"</span>
        </div>
      </div>

      {/* THREE VALUE INTERACTIVE HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Highlight 1 */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-red-50 rounded-2xl text-red-600 shrink-0">
            <Youtube size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">সহজ কুরআন হরফ ও বানান</h4>
            <p className="text-[11px] text-slate-500 font-sans">তাজবীদ ও তিন স্তরের আধুনিক প্লেলিস্ট</p>
          </div>
        </div>

        {/* Highlight 2 */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-700 shrink-0">
            <Languages size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">স্পোকেন আরবি কথক</h4>
            <p className="text-[11px] text-slate-500 font-sans">১০এমএস স্পেশাল আরবি ভাষার দৈনন্দিন গাইড</p>
          </div>
        </div>

        {/* Highlight 3 */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-emerald-555 bg-emerald-50 rounded-2xl text-emerald-800 shrink-0">
            <BookMarked size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">সহজ অর্থ ও হাতেখড়ি</h4>
            <p className="text-[11px] text-slate-500 font-sans">সূরাসমূহের শাব্দিক ও ভাবার্থ শিক্ষা কোর্স</p>
          </div>
        </div>

      </div>

      {/* FILTER SEARCH AND CATEGORIES TAB GROUP */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-emerald-700 size-4.5" />
            <input
              type="text"
              placeholder="কোর্স অথবা প্লেলিস্ট খুঁজুন যেমন: কুরআন শিক্ষা, সুরা তেলাওয়াত, Spoken আরবি..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-emerald-50/10 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl text-xs sm:text-sm text-slate-800 font-sans"
              id="quran-res-search-input"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-900 bg-emerald-50 border border-emerald-100/70 p-3 rounded-xl max-w-sm shrink-0">
            <Sparkle size={16} className="text-emerald-700 shrink-0 animate-spin-slow" />
            <p className="font-sans font-medium leading-normal">
              প্লেলিস্টের প্রতিটি ভিডিও মনোযোগ সহকারে অনুশীলন করুন এবং আপনার সালাতে বাস্তবায়ন করুন।
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 shrink-0">
            <Clock size={12} />
            বিষয়ভিত্তিক রিসোর্স ফিল্টার:
          </span>
          
          <div className="flex flex-wrap gap-1.5 font-sans">
            {[
              { id: 'all', titleBn: 'সবগুলো একত্রে' },
              { id: 'quran_learn', titleBn: 'কুরআন ও সূরা শিক্ষা' },
              { id: 'arabic_lang', titleBn: 'আরবি ভাষা ও স্পোকেন' },
              { id: 'quran_meaning', titleBn: 'কুরআনের অর্থ ও তাফসীর' }
            ].map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'bg-slate-50 hover:bg-emerald-50/50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                  }`}
                  id={`quran-cat-badge-${cat.id}`}
                >
                  {cat.titleBn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DYNAMIC LIST GRID */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="quran-res-grid">
          {filteredResources.map((res) => {
            const isFav = favorites.includes(res.id);
            
            // Stylized badges matching source types
            let badgeBg = 'bg-slate-50 text-slate-700 border-slate-200';
            let mediaIcon = <PlayCircle size={14} className="text-slate-500" />;

            if (res.badgeType === 'youtube') {
              badgeBg = 'bg-red-50 text-red-700 border-red-100';
              mediaIcon = <Youtube size={14} className="text-red-600" />;
            } else if (res.badgeType === 'premium') {
              badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-100';
              mediaIcon = <GraduationCap size={14} className="text-indigo-600" />;
            } else if (res.badgeType === 'free') {
              badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-100';
              mediaIcon = <Sparkles size={14} className="text-emerald-700" />;
            }

            return (
              <div 
                key={res.id}
                className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-md hover:border-emerald-200/80 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Visual Accent Hover Border decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-50/40 opacity-0 group-hover:opacity-100 rounded-bl-full transition-all" />

                <div className="space-y-3">
                  {/* Category and Favorite Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-50/50 px-2.5 py-1 rounded-md tracking-wider">
                      {res.categoryBn}
                    </span>
                    
                    <button
                      onClick={(e) => handleFavoriteToggle(res.id, e)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        isFav 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-slate-350 hover:text-red-500 hover:bg-slate-50'
                      }`}
                      title={isFav ? 'পছন্দ তালিকা হতে বাদ দিন' : 'পছন্দ তালিকায় যুক্ত করুন'}
                    >
                      <Heart size={14} className={isFav ? 'fill-red-500' : ''} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-slate-950 group-hover:text-emerald-900 transition-colors flex items-center gap-1.5">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium line-clamp-3">
                      {res.descriptionBn}
                    </p>
                  </div>

                  {/* Metadata labels */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5 font-sans">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      ⏱️ {res.durationBn}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                      {mediaIcon} {res.lessonsBn}
                    </span>
                    {res.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${badgeBg} border`}>
                        {res.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 justify-between">
                  <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
                    {res.badgeType === 'youtube' ? 'YouTube Free' : '10MS Course'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyLink(res.courseUrl, e)}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        copiedLink === res.courseUrl
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                      }`}
                    >
                      {copiedLink === res.courseUrl ? 'কপি হয়েছে' : 'লিঙ্ক কপি'}
                    </button>

                    <a 
                      href={res.courseUrl}
                      target="_blank"
                      rel="no_referrer"
                      className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-800 hover:bg-emerald-950 text-white px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <span>ভিডিও শুরু করুন</span>
                      <ExternalLink size={11} className="text-white/80" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200/70 p-12 text-center rounded-3xl" id="quran-res-not-found">
          <HelpCircle className="size-10 text-emerald-800/40 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800">কোনো রিসোর্স পাওয়া যায়নি!</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">অনুগ্রহ করে ভিন্ন কি-ওয়ার্ড বা ফিল্টার চুজ করে পুনরায় চেষ্টা করুন।</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="text-xs font-bold text-emerald-800 bg-white hover:bg-slate-100 px-4 py-2 mt-4 rounded-xl shadow-xs border border-slate-200 cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* USER INSTRUCTION GUIDE */}
      <div className="mt-8 bg-emerald-50/45 border border-emerald-100 p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-black text-emerald-950 flex items-center gap-2 uppercase tracking-wider">
          <CheckCircle2 size={16} className="text-emerald-700" />
          সহজ উপায়ে কুরআন ও ভাষা শিক্ষার নির্দেশিকা (Guidelines)
        </h3>
        <div className="text-[11px] text-emerald-950 leading-relaxed font-sans space-y-2">
          <p>
            ১. <strong>কুরআন হরকত ও উচ্চারণ প্লেলিস্ট:</strong> কুরআন শিক্ষা এবং সুরা তেলাওয়াত সিরিজের প্লেলিস্টগুলো চমৎকার শিক্ষকের দ্বারা পরিচালিত। প্রতিদিন ১৫-২০ মিনিট সময় দিয়ে প্রতিটি পর্ব ক্রমানুসারে চর্চা করুন।
          </p>
          <p>
            ২. <strong>সহজে স্পোকেন আরবি:</strong> মধ্যপ্রাচ্যের কথ্য আরবি ভাষা শেখার জন্য এবং প্রাত্যহিক বাক্য গঠন বা প্রয়োজনীয় কথোপকথন আত্মস্থ করতে ১০ মিনিট স্কুলের এই প্রিমিয়াম মডিউলটি অত্যন্ত কার্যকরী।
          </p>
          <p>
            ৩. <strong>কুরআন অর্থ ও হাতেখড়ি কোর্স:</strong> কুরআন পাঠের পাশাপাশি এর প্রতিটি আয়াতের সুগভীর ও মধুর ভাবার্থ সহজে বুঝতে এই ফ্রি কোর্সটিতে অংশ নিন। সফলভাবে কোর্স সমাপ্তিতে রয়েছে ফ্রি সার্টিফিকেশন!
          </p>
          <p>
            ৪. <strong>শেয়ার এবং গ্রুপ স্টাডি:</strong> প্রতিটি কার্ডের সাথে যুক্ত `লিঙ্ক কপি` বাটন ব্যবহার করে আপনার বন্ধুবান্ধব ও প্রিয়জনদের সাথে রিসোর্সগুলো শেয়ার করতে পারেন।
          </p>
        </div>
      </div>

    </div>
  );
}
