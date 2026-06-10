import React, { useState } from 'react';
import { 
  Languages, 
  Search, 
  ExternalLink, 
  ArrowLeft,
  Sparkles,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Clock,
  Video,
  BookmarkCheck,
  Heart,
  Presentation,
  Cpu,
  Coins,
  BrainCircuit,
  MessageSquare,
  Sparkle
} from 'lucide-react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface SpokenCourseItem {
  id: string;
  title: string;
  category: 'spoken_english' | 'skills_ai' | 'academics_finance';
  categoryBn: string;
  descriptionBn: string;
  durationBn: string;
  lessonsBn: string;
  courseUrl: string;
  badge?: string;
  badgeType?: 'live' | 'free' | 'hot' | 'super';
}

export default function SpokenEnglishView({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('spoken_courses_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Core high-value course links requested by client
  const COURSES: SpokenCourseItem[] = [
    {
      id: 'course-spoken-live',
      title: 'Spoken English LIVE Course 🗣️',
      category: 'spoken_english',
      categoryBn: 'স্পোকেন ইংরেজি',
      descriptionBn: 'সরাসরি লাইভ ক্লাসে অংশ নিয়ে সবার সাথে ঘরোয়া পরিবেশে অনর্গল ইংরেজি বলা ও কথা বলার ভয় দূর করার সেরা কোর্স।',
      durationBn: '১২ সপ্তাহ',
      lessonsBn: '২৪+ লাইভ সেশন',
      courseUrl: 'https://10minuteschool.com/product/spoken-english-live-course/',
      badge: 'LIVE কোর্স',
      badgeType: 'live'
    },
    {
      id: 'course-ai-students',
      title: 'AI Course for Super Students 🤖',
      category: 'skills_ai',
      categoryBn: 'আইটি ও এআই প্রযুক্তি',
      descriptionBn: 'ভবিষ্যতের জন্য প্রস্তুত হতে কৃত্রিম বুদ্ধিমত্তা (AI) ও চ্যাটজিপিটি টুলস ব্যবহার করে পড়াশোনা ও অ্যাসাইনমেন্টে অনন্য প্রতিভা অর্জনের গাইড।',
      durationBn: '৬ ঘণ্টা',
      lessonsBn: '১৮টি মডিউল',
      courseUrl: 'https://10minuteschool.com/product/ai-for-super-students/',
      badge: 'Super AI',
      badgeType: 'super'
    },
    {
      id: 'course-money-gyani',
      title: 'Money জ্ঞানী: Digital Financial Mastery 💰',
      category: 'academics_finance',
      categoryBn: 'অর্থ ও ক্যারিয়ার',
      descriptionBn: 'ছোটবেলা থেকেই টাকা জমানো, বাজেট তৈরি, স্মার্ট বিনিয়োগ এবং অর্থনৈতিক স্বাবলম্বিতা অর্জনের আধুনিক ডিজিটাল জ্ঞান।',
      durationBn: '৪ ঘণ্টা',
      lessonsBn: '১২টি ক্লাস',
      courseUrl: 'https://10minuteschool.com/product/digital-financial-mastery/',
      badge: 'অর্থনৈতিক শিক্ষা',
      badgeType: 'hot'
    },
    {
      id: 'course-class6-math',
      title: 'ষষ্ঠ শ্রেণি - গণিত কোর্স (ফ্রি) 📐',
      category: 'academics_finance',
      categoryBn: 'অ্যাকাডেমিক শিক্ষা',
      descriptionBn: 'নতুন জাতীয় শিক্ষাক্রম অনুযায়ী ষষ্ঠ শ্রেণীর পুরো গণিত সিলেবাসের প্রতিটি অধ্যায়ের একদম সহজ ও চমৎকার ভিডিও বিশ্লেষণ।',
      durationBn: 'ফ্রি কোর্স',
      lessonsBn: 'সম্পূর্ণ প্লেলিস্ট',
      courseUrl: 'https://10minuteschool.com/product/class-6-math-free-course/',
      badge: '১০০% ফ্রি',
      badgeType: 'free'
    },
    {
      id: 'course-poster-prep',
      title: 'পোস্টার প্রেজেন্টেশন সুপার কোর্স 🎨',
      category: 'skills_ai',
      categoryBn: 'ডিজাইন ও প্রেজেন্টেশন',
      descriptionBn: 'স্কুল, কলেজ অথবা ভার্সিটির যেকোনো প্রজেক্টের জন্য আকর্ষণীয় রুল ও অসাধারণ ডিজাইন নিয়ে পোস্টার প্রেজেন্টেশন করার বৈজ্ঞানিক নিয়মসমূহ।',
      durationBn: '৩ ঘণ্টা',
      lessonsBn: '১০টি স্পেশাল ভিডিও',
      courseUrl: 'https://10minuteschool.com/product/poster-presentation-super-course/',
      badge: 'সুপার হিট',
      badgeType: 'hot'
    },
    {
      id: 'course-spoken-junior',
      title: 'Spoken English Junior 🧒',
      category: 'spoken_english',
      categoryBn: 'স্পোকেন ইংরেজি',
      descriptionBn: 'কোমলমতি শিশুদের স্কুল ও দৈনন্দিন জীবনে ইংরেজিতে সাবলীল কথোপকথন এবং সুন্দর উচ্চারণে কথা বলা শেখার ঘরোয়া হাসিখুশি গাইড।',
      durationBn: '৮ ঘণ্টা',
      lessonsBn: '৩০টি ভিডিও ক্লাস',
      courseUrl: 'https://10minuteschool.com/product/spoken-english-junior/',
      badge: 'জুনিয়র স্পেশাল',
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
    localStorage.setItem('spoken_courses_favorites', JSON.stringify(updated));
  };

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2500);
    });
  };

  const filteredCourses = COURSES.filter(course => {
    if (activeCategory !== 'all' && course.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.descriptionBn.toLowerCase().includes(query) ||
        course.categoryBn.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="spoken-english-courses-root">
      
      {/* BRANDING HEADER WITH NAVIGATION TAB BAR */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer shrink-0"
            id="spoken-back-btn"
            title="ফিরে যান"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-white p-2.5 rounded-2xl shadow-sm">
              <Languages size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                ক্লাস এবং স্পোকেন ইংরেজি
              </h1>
              <p className="text-xs text-emerald-700 font-semibold leading-normal mt-0.5">
                টেন মিনিট স্কুল (10 Minute School) এর স্পেশাল স্পোকেন ইংলিশ, এআই কোর্স এবং একাডেমি ক্লাস প্লেলিস্ট
              </p>
            </div>
          </div>
        </div>

        {/* Global Redirect Button to 10MS Product Catalog */}
        <a 
          href="https://10minuteschool.com/"
          target="_blank"
          rel="no_referrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all group"
        >
          <GraduationCap size={14} className="text-emerald-300" />
          <span>মূল ওয়েবসাইট ভিজিট করুন</span>
          <ArrowUpRight size={13} className="text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* THREE INTERACTIVE HIGHLIGHT FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Highlight 1: Spoken English */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-red-50 rounded-2xl text-red-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">স্পোকেন ইংলিশ (English)</h4>
            <p className="text-[11px] text-slate-500 font-sans">লাইভ এন্ড জুনিয়র স্পিকিং ডেভেলপমেন্ট</p>
          </div>
        </div>

        {/* Highlight 2: AI Course */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-700">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">ফিউচার স্কিল ও AI</h4>
            <p className="text-[11px] text-slate-500 font-sans">সুপার স্টুডেন্টদের জন্য এআই গাইডেন্স</p>
          </div>
        </div>

        {/* Highlight 3: Finance & Class */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
            <Coins size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">স্মার্ট ফাইনান্স ও ক্লাস</h4>
            <p className="text-[11px] text-slate-500 font-sans">মানি জ্ঞানী অ্যান্ড ক্লাস ৬ ডেমো কোর্স</p>
          </div>
        </div>

      </div>

      {/* FILTER SEARCH AND CATEGORIES TAB GROUP */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Dynamic Interactive Input Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-emerald-700 size-4.5" />
            <input
              type="text"
              placeholder={`মাস্টার কোর্স খুঁজুন যেমন: Spoken English, AI, Money জ্ঞানী, Math...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-emerald-50/10 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl text-xs sm:text-sm text-slate-800 font-sans"
              id="spoken-courses-search-input"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-100/70 p-3 rounded-xl max-w-sm shrink-0">
            <Sparkle size={16} className="text-amber-600 shrink-0" />
            <p className="font-sans font-medium leading-normal animate-pulse">
              লাইভ ব্যাচে সিট ও প্রমোশন পেতে সরাসরি অফিশিয়াল ১০এমএস পোর্টালে ভিজিট করুন।
            </p>
          </div>
        </div>

        {/* Category Filters row */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 shrink-0">
            <Clock size={12} />
            বিষয়ভিত্তিক ফিল্টার:
          </span>
          
          <div className="flex flex-wrap gap-1.5 font-sans">
            {[
              { id: 'all', titleBn: 'সব কোর্স একত্রে' },
              { id: 'spoken_english', titleBn: 'স্পোকেন ইংলিশ (English)' },
              { id: 'skills_ai', titleBn: 'এআই ও সৃজনশীল স্কিল' },
              { id: 'academics_finance', titleBn: 'একাডেমিক ও স্মার্ট ফাইনান্স' }
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
                  id={`spoken-cat-badge-${cat.id}`}
                >
                  {cat.titleBn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MASTER COURSES GRID VIEW */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="spoken-courses-grid">
          {filteredCourses.map((course) => {
            const isFav = favorites.includes(course.id);
            
            // Get color properties based on badge type
            let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-100';
            if (course.badgeType === 'live') badgeBg = 'bg-red-500 text-white border-red-500';
            if (course.badgeType === 'super') badgeBg = 'bg-indigo-600 text-white border-indigo-600';
            if (course.badgeType === 'hot') badgeBg = 'bg-amber-550 bg-amber-500 text-slate-950 border-amber-300';
            if (course.badgeType === 'free') badgeBg = 'bg-teal-50 text-teal-800 border-teal-100';

            return (
              <div 
                key={course.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-250 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Visual Accent Top Right corner hover border decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-50 opacity-0 group-hover:opacity-40 rounded-bl-full transition-all" />

                <div className="space-y-3">
                  {/* Category and Love/favorite Icon Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md tracking-wider">
                      {course.categoryBn}
                    </span>
                    
                    <button
                      onClick={(e) => handleFavoriteToggle(course.id, e)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        isFav 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-slate-350 hover:text-red-500 hover:bg-slate-50'
                      }`}
                      title={isFav ? 'পছন্দ তালিকায় যুক্ত' : 'পছন্দ তালিকায় যুক্ত করুন'}
                    >
                      <Heart size={14} className={isFav ? 'fill-red-500' : ''} />
                    </button>
                  </div>

                  {/* Title & Metadata details card info */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-slate-950 group-hover:text-emerald-950 transition-colors flex items-center gap-1">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium line-clamp-3">
                      {course.descriptionBn}
                    </p>
                  </div>

                  {/* Specific Video Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5 font-sans">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      ⏱️ মেয়াদ: {course.durationBn}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      📖 {course.lessonsBn}
                    </span>
                    {course.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${badgeBg} border`}>
                        {course.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Open/Join Actions Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 justify-between">
                  <span className="text-[9px] text-emerald-800 font-bold block">
                    10MS Premium
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyLink(course.courseUrl, e)}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        copiedLink === course.courseUrl
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                      }`}
                    >
                      {copiedLink === course.courseUrl ? 'কপি হয়েছে' : 'লিঙ্ক কপি'}
                    </button>

                    <a 
                      href={course.courseUrl}
                      target="_blank"
                      rel="no_referrer"
                      className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-800 hover:bg-emerald-950 text-white px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <span>বিস্তারিত জানুন</span>
                      <ExternalLink size={11} className="text-white/80" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200/70 p-12 text-center rounded-3xl" id="spoken-not-found">
          <HelpCircle className="size-10 text-emerald-800/40 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800">কোনো কোর্স খুঁজে পাওয়া যায়নি!</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">অনুগ্রহ করে ভিন্ন কি-ওয়ার্ড বা ক্যাটাগরি ফিল্টার চুজ করে পুনরায় চেষ্টা করুন।</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="text-xs font-bold text-emerald-800 bg-white hover:bg-slate-100 px-4 py-2 mt-4 rounded-xl shadow-xs border border-slate-200 cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* FOOTER USER GUIDELINE AND SUPPORT CARD */}
      <div className="mt-8 bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
          <CheckCircle size={14} className="text-emerald-700" />
          ক্লাস এবং স্পোকেন ইংরেজি নির্দেশিকা
        </h3>
        <p className="text-[11px] text-emerald-900/80 leading-relaxed font-sans">
          ১. আপনি যেকোনো মোবাইল বা ল্যাপটপ ব্রাউজার থেকে সরাসরি এই লিংকগুলির সাহায্যে ১০ মিনিট স্কুলের প্রিমিয়াম ল্যান্ডিং পেজ ও ফ্রি প্লেলিস্টগুলি উপভোগ করতে পারবেন। <br />
          ২. কোর্সগুলি নিয়মিত পরিবর্তন অথবা নতুন ব্যাচের অফার জানতে সরাসরি তাদের পোর্টালে চোখ রাখুন। <br />
          ৩. কোর্সটি বন্ধুদের সাথে শেয়ার করার জন্য প্রতিটির সাথে যুক্ত `লিঙ্ক কপি` বাটন প্রেস করুন।
        </p>
      </div>

    </div>
  );
}
