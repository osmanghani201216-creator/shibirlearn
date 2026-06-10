import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  FileText, 
  Bookmark, 
  ArrowLeft,
  Sparkles,
  Award,
  BookCheck,
  Building,
  GraduationCap,
  ArrowUpRight,
  Download,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface BoardBook {
  id: string;
  title: string;
  classBn: string;
  category: 'primary' | 'secondary'; // primary points to pre-primary & primary, secondary to secondary & higher secondary
  subjectBn: string;
  descriptionBn: string;
  pdfUrl?: string; // specific link or general portal
}

export default function BoardBooksView({ onBack }: { onBack: () => void }) {
  const [levelTab, setLevelTab] = useState<'primary' | 'secondary'>('primary');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Links provided by client
  const PRIMARY_NCTB_URL = 'https://nctb.gov.bd/pages/static-pages/695b9b7cc4774958d7b70a12';
  const SECONDARY_NCTB_URL = 'https://nctb.gov.bd/pages/static-pages/695b98afc4774958d7b7044c';

  // Core national textbooks catalog
  const TEXTBOOKS: BoardBook[] = [
    // Pre-Primary & Primary
    {
      id: 'p-pre-1',
      title: 'আমার বই (প্রাক-প্রাথমিক)',
      classBn: 'প্রাক-প্রাথমিক',
      category: 'primary',
      subjectBn: 'সমন্বিত শিক্ষণ',
      descriptionBn: 'প্রাক-প্রাথমিক শিশুদের চারপাশের পরিবেশ, সংখ্যা ও বর্ণমালা চেনার ছবিভিত্তিক আনন্দময় পাঠ্যবই।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-1-bangla',
      title: 'আমার বাংলা বই (১ম শ্রেণী)',
      classBn: '১ম শ্রেণী',
      category: 'primary',
      subjectBn: 'বাংলা ভাষা ও সাহিত্য',
      descriptionBn: 'সহজ শব্দ, ছড়া ও ছবির মাধ্যমে শিশুদের বাংলা বর্ণ এবং বাক্য গঠনে পারদর্শী করার জাতীয় বই।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-1-math',
      title: 'প্রাথমিক গণিত (১ম শ্রেণী)',
      classBn: '১ম শ্রেণী',
      category: 'primary',
      subjectBn: 'গণিত',
      descriptionBn: 'বাস্তব উপকরণ ও আকর্ষণীয় রঙের মাধ্যমে প্রাথমিক স্তরের সংখ্যা, গণনা এবং সাধারণ যোগ-বিয়োগ শিক্ষা।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-1-english',
      title: 'English for Today (Class 1)',
      classBn: '১ম শ্রেণী',
      category: 'primary',
      subjectBn: 'English',
      descriptionBn: 'Interactive English learning book with rich actions, simple phonics, animations stories, and colorful drawings.',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-2-bangla',
      title: 'আমার বাংলা বই (২য় শ্রেণী)',
      classBn: '২য় শ্রেণী',
      category: 'primary',
      subjectBn: 'বাংলা ভাষা ও সাহিত্য',
      descriptionBn: 'বাচ্চাদের নীতিশিক্ষা এবং বাংলা সাবলীল পঠন বিকাশে গল্প ও ছড়ার চমৎকার সংমিশ্রণ।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-2-math',
      title: 'প্রাথমিক গণিত (২য় শ্রেণী)',
      classBn: '২য় শ্রেণী',
      category: 'primary',
      subjectBn: 'গণিত',
      descriptionBn: 'যোগ, বিয়োগের গভীর ধারণা এবং সাধারণ গুণের নামতা ও জ্যামিতিক নকশা চেনার প্রাথমিক গাইড।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-2-english',
      title: 'English for Today (Class 2)',
      classBn: '২য় শ্রেণী',
      category: 'primary',
      subjectBn: 'English',
      descriptionBn: 'Builds vital communication skills in young learners through action rhymes, standard dialogue practice, and games.',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-3-bangla',
      title: 'আমার বাংলা বই (৩য় শ্রেণী)',
      classBn: '৩য় শ্রেণী',
      category: 'primary',
      subjectBn: 'বাংলা ভাষা ও সাহিত্য',
      descriptionBn: 'জাতীয় ঐতিহ্য, বীরগাথা এবং কবি-সাহিত্যিকদের কালজয়ী শিশুতোষ রচনার প্রারম্ভিক সংকলন।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-3-science',
      title: 'প্রাথমিক বিজ্ঞান (৩য় শ্রেণী)',
      classBn: '৩য় শ্রেণী',
      category: 'primary',
      subjectBn: 'বিজ্ঞান',
      descriptionBn: 'উদ্ভিদ, প্রাণী এবং আমাদের চারপাশের জলবায়ু নিয়ে গঠিত প্রাথমিক বৈজ্ঞানিক কৌতূহল ও তথ্যাদি।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-3-bgs',
      title: 'বাংলাদেশ ও বিশ্বপরিচয় (৩য় শ্রেণী)',
      classBn: '৩য় শ্রেণী',
      category: 'primary',
      subjectBn: 'সমাজ ও রাষ্ট্র',
      descriptionBn: 'আমাদের মহান মুক্তিযুদ্ধ, সামাজিক দায়িত্ববোধ এবং ভৌগোলিক পরিবেশ বিষয়ক আবশ্যক ধারণা।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-4-math',
      title: 'প্রাথমিক গণিত (৪র্থ শ্রেণী)',
      classBn: '৪র্থ শ্রেণী',
      category: 'primary',
      subjectBn: 'গণিত',
      descriptionBn: 'ভগ্নাংশ, গড়, লসাগু, গসাগু এবং ক্ষেত্রফলের মত মৌলিক গণিত সূত্রের প্রথম প্রামাণ্য কাঠামো।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-5-math',
      title: 'প্রাথমিক গণিত (৫ম শ্রেণী)',
      classBn: '৫ম শ্রেণী',
      category: 'primary',
      subjectBn: 'গণিত',
      descriptionBn: 'ঐকিক নিয়ম, শতকরের হিসাব এবং জ্যামিতির ক্ষেত্রফল ও কোণ সংক্রান্ত প্রাথমিক সমাপনী প্রস্তুতির বই।',
      pdfUrl: PRIMARY_NCTB_URL
    },
    {
      id: 'p-5-islam',
      title: 'ইসলাম ও নৈতিক শিক্ষা (৫ম শ্রেণী)',
      classBn: '৫ম শ্রেণী',
      category: 'primary',
      subjectBn: 'ধর্ম ও নৈতিক শিক্ষা',
      descriptionBn: 'তাওহীদ, আখলাকে হাসানা এবং দৈনন্দিন জীবনে রাসূলুল্লাহর সুন্নাহ পালনের নৈতিক ধারণা ও শিষ্টাচার।',
      pdfUrl: PRIMARY_NCTB_URL
    },

    // Secondary & Higher Secondary
    {
      id: 's-6-bangla',
      title: 'বাংলা (৬ষ্ঠ শ্রেণী)',
      classBn: '৬ষ্ঠ শ্রেণী',
      category: 'secondary',
      subjectBn: 'বাংলা ভাষা ও সাহিত্য',
      descriptionBn: 'নতুন জাতীয় কারিকুলাম অনুযায়ী রচিত সমৃদ্ধ ভাষাচর্চা ও সাহিত্য রসাস্বাদনের শিক্ষাক্রম সংস্করণ।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-6-english',
      title: 'English (Class 6)',
      classBn: '৬ষ্ঠ শ্রেণী',
      category: 'secondary',
      subjectBn: 'English',
      descriptionBn: 'Based on the experiential learning model to develop practical communicative competencies in diverse contexts.',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-6-math',
      title: 'গণিত (৬ষ্ঠ শ্রেণী)',
      classBn: '৬ষ্ঠ শ্রেণী',
      category: 'secondary',
      subjectBn: 'গণিত',
      descriptionBn: 'সরল সমীকরণ, জ্যামিতির মৌলিক ধারণা এবং সংখ্যার গল্প দিয়ে সায়েন্টিফিক পন্থায় সাজানো গণিত প্রকাশন।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-7-science',
      title: 'বিজ্ঞান - অনুসন্ধানী পাঠ (৭ম শ্রেণী)',
      classBn: '৭ম শ্রেণী',
      category: 'secondary',
      subjectBn: 'বিজ্ঞান',
      descriptionBn: 'মহাবিশ্ব, জীবজগৎ এবং পদার্থের গাঠনিক রূপ নিয়ে অত্যন্ত আকর্ষণীয় ও বাস্তবধর্মী বিজ্ঞান গ্রন্থ।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-8-history',
      title: 'ইতিহাস ও সামাজিক বিজ্ঞান (৮ম শ্রেণী)',
      classBn: '৮ম শ্রেণী',
      category: 'secondary',
      subjectBn: 'সমাজবিজ্ঞান ও ইতিহাস',
      descriptionBn: 'বাঙালি সংস্কৃতি, প্রাচীন সভ্যতার অগ্রগতি এবং আধুনিক সমাজ বিনির্মাণে শিক্ষার্থীদের নাগরিক সচেতনতা বৃদ্ধির ইতিহাস পাঠ।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-9-bangla',
      title: 'বাংলা (৯ম শ্রেণী)',
      classBn: '৯ম শ্রেণী',
      category: 'secondary',
      subjectBn: 'বাংলা',
      descriptionBn: 'উন্নত সৃজনশীল মনন গঠন এবং বাংলা ব্যাকরণ ও প্রায়োগিক প্রমিত উচ্চারণের আধুনিকতম নির্দেশনা বই।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-9-math',
      title: 'গণিত (৯ম শ্রেণী)',
      classBn: '৯ম শ্রেণী',
      category: 'secondary',
      subjectBn: 'গণিত',
      descriptionBn: 'সেট ও অনুপাত, বাস্তব সমস্যা সমাধানে বীজগণিত এবং কেলকুলাসের সূচনা সম্বন্ধীয় যুগান্তকারী কন্টেন্ট।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-10-physics',
      title: 'পদার্থবিজ্ঞান (১০ম শ্রেণী)',
      classBn: '১০ম শ্রেণী',
      category: 'secondary',
      subjectBn: 'পদার্থবিজ্ঞান',
      descriptionBn: 'বল, বেগ, স্থিতিবিদ্যা এবং শক্তির রূপান্তরের বৈজ্ঞানিক সূত্রাবলির সুস্পষ্ট আধুনিকতম রূপায়ণ।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-10-chem',
      title: 'রসায়ন (১০ম শ্রেণী)',
      classBn: '১০ম শ্রেণী',
      category: 'secondary',
      subjectBn: 'রসায়ন',
      descriptionBn: 'পর্যায় সারণী, বিক্রিয়া বিন্যাস ও খনিজ লবণের রাসায়নিক গঠনের প্রামাণ্য এসএসসি স্তরের সেরা বই।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-11-bangla',
      title: 'সাহিত্যপাঠ (একাদশ-দ্বাদশ শ্রেণী)',
      classBn: 'একাদশ-দ্বাদশ শ্রেণী',
      category: 'secondary',
      subjectBn: 'বাংলা সাহিত্য',
      descriptionBn: 'এইচএসসি শিক্ষার্থীদের মনন বিকাশে কাজী নজরুল, রবীন্দ্রনাথসহ বাংলা সাহিত্যের অনন্য কালজয়ী গল্প ও কবিতার প্রামাণ্য সম্ভার।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-12-english',
      title: 'English for Today (HSC)',
      classBn: 'একাদশ-দ্বাদশ শ্রেণী',
      category: 'secondary',
      subjectBn: 'English for Today',
      descriptionBn: 'The nationwide textbook crafted to foster higher-level language critical comprehension, vocabulary and discourse abilities.',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-11-physics',
      title: 'পদার্থবিজ্ঞান ১ম ও ২য় পত্র (HSC)',
      classBn: 'একাদশ-দ্বাদশ শ্রেণী',
      category: 'secondary',
      subjectBn: 'পদার্থবিজ্ঞান',
      descriptionBn: 'ভেক্টর, গতিবিদ্যা, তাপগতিবিজ্ঞান এবং আধুনিক নিউক্লিয়ার ফিজিক্সের উন্নত তত্ত্ব ও প্রয়োগ সম্বলিত গ্রন্থ।',
      pdfUrl: SECONDARY_NCTB_URL
    },
    {
      id: 's-11-ict',
      title: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT - HSC)',
      classBn: 'একাদশ-দ্বাদশ শ্রেণী',
      category: 'secondary',
      subjectBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',
      descriptionBn: 'নেটওয়ার্কিং, এইচটিএমএল ডিজাইন, সংখ্যা পদ্ধতি এবং সি-প্রোগ্রামিং ভাষার সহজ ও আকর্ষণীয় রূপরেখা।',
      pdfUrl: SECONDARY_NCTB_URL
    }
  ];

  // Dynamic filter lists based on tab
  const primaryClasses = ['all', 'প্রাক-প্রাথমিক', '১ম শ্রেণী', '২য় শ্রেণী', '৩য় শ্রেণী', '৪র্থ শ্রেণী', '৫ম শ্রেণী'];
  const secondaryClasses = ['all', '৬ষ্ঠ শ্রেণী', '৭ম শ্রেণী', '৮ম শ্রেণী', '৯ম শ্রেণী', '১০ম শ্রেণী', 'একাদশ-দ্বাদশ শ্রেণী'];
  const currentClassOptions = levelTab === 'primary' ? primaryClasses : secondaryClasses;

  const getFilteredBooks = () => {
    return TEXTBOOKS.filter(book => {
      // Filter level category
      if (book.category !== levelTab) return false;

      // Filter query search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          book.title.toLowerCase().includes(query) ||
          book.subjectBn.toLowerCase().includes(query) ||
          book.descriptionBn.toLowerCase().includes(query) ||
          book.classBn.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Filter Selected Class
      if (selectedClass !== 'all' && book.classBn !== selectedClass) return false;

      return true;
    });
  };

  const filteredBooks = getFilteredBooks();

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2500);
    });
  };

  const currentNctbUrl = levelTab === 'primary' ? PRIMARY_NCTB_URL : SECONDARY_NCTB_URL;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="nctb-board-books-root">
      
      {/* HEADER SECTION WITH NAVIGATION */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer shrink-0"
            id="board-books-back-btn"
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
                এনসিটিবি বোর্ড বই (NCTB)
              </h1>
              <p className="text-xs text-emerald-700 font-semibold leading-normal mt-0.5">
                জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড অনুমোদিত সব স্তরের ফ্রি পাঠ্যবই নির্দেশিকা ও রিডিং সুবিধা
              </p>
            </div>
          </div>
        </div>

        {/* Global NCTB portal redirect button */}
        <a 
          href={currentNctbUrl}
          target="_blank"
          rel="no_referrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer hover:bg-emerald-900 active:bg-emerald-950 transition-all group"
        >
          <Building size={14} className="text-emerald-300" />
          <span>অফিশিয়াল এনসিটিবি পোর্টাল</span>
          <ArrowUpRight size={13} className="text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* DUAL LEVEL MODE SWITCHER (প্রাক-প্রাথমিক ও প্রাথমিক বনাম মাধ্যমিক স্তর) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* PRE-PRIMARY & PRIMARY TAB BUTTON */}
        <button
          onClick={() => {
            setLevelTab('primary');
            setSelectedClass('all');
            setSearchQuery('');
          }}
          className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer relative overflow-hidden group ${
            levelTab === 'primary' 
              ? 'bg-white border-emerald-700 shadow-md ring-1 ring-emerald-500/20' 
              : 'bg-white/60 border-slate-200/80 hover:border-slate-300/90 hover:bg-slate-50'
          }`}
          id="btn-level-primary"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1 z-10">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${levelTab === 'primary' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                ১ম অংশ
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                প্রাক-প্রাথমিক ও প্রাথমিক স্তর
              </h3>
              <p className="text-xs text-slate-500 leading-snug max-w-sm mt-1">
                শিশু একাডেমি ও প্রাথমিক বিদ্যালয়ের শিক্ষার্থীদের জন্য নির্ধারিত আনন্দপাঠ বইসমূহ।
              </p>
            </div>
            
            <div className={`p-3 rounded-xl transition-all ${levelTab === 'primary' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:scale-105'}`}>
              <Sparkles size={20} />
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mt-4 underline group-hover:text-emerald-950">
            <span>এনসিটিবি লিংক: nctb.gov.bd</span>
            <ExternalLink size={10} />
          </div>
        </button>

        {/* SECONDARY & HIGHER SECONDARY TAB BUTTON */}
        <button
          onClick={() => {
            setLevelTab('secondary');
            setSelectedClass('all');
            setSearchQuery('');
          }}
          className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer relative overflow-hidden group ${
            levelTab === 'secondary' 
              ? 'bg-white border-emerald-700 shadow-md ring-1 ring-emerald-500/20' 
              : 'bg-white/60 border-slate-200/80 hover:border-slate-300/90 hover:bg-slate-50'
          }`}
          id="btn-level-secondary"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1 z-10">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${levelTab === 'secondary' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                ২য় অংশ
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                মাধ্যমিক স্তর ও উচ্চ মাধ্যমিক স্তর
              </h3>
              <p className="text-xs text-slate-500 leading-snug max-w-sm mt-1">
                হাইস্কুল, ভোকেশনাল এবং কলেজ শিক্ষার্থীদের জন্য সুবিন্যস্ত জাতীয় পাঠ্যবইসমূহ।
              </p>
            </div>
            
            <div className={`p-3 rounded-xl transition-all ${levelTab === 'secondary' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:scale-105'}`}>
              <GraduationCap size={20} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mt-4 underline group-hover:text-emerald-950">
            <span>এনসিটিবি লিংক: nctb.gov.bd</span>
            <ExternalLink size={10} />
          </div>
        </button>

      </div>

      {/* FILTER CONTROLS & DYNAMIC SEARCH BAR */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Dynamic Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-emerald-700 size-4.5" />
            <input
              type="text"
              placeholder={`বর্তমান স্তর থেকে বই বা বিষয় যেমন: বাংলা, English, Math দিয়ে খুঁজুন...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-emerald-50/10 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl text-xs sm:text-sm text-slate-800 font-sans"
              id="board-books-search-input"
            />
          </div>

          {/* Core Level NCTB direct warning info card */}
          <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-100/70 p-3 rounded-xl max-w-sm shrink-0">
            <Clock size={16} className="text-amber-600 shrink-0" />
            <p className="font-sans font-medium leading-normal">
              এনসিটিবি সার্ভারের নিয়মিত আপডেটের কারণে সরাসরি বোর্ড লিঙ্কে মাঝে মাঝে পরিবর্তন ঘটতে পারে।
            </p>
          </div>
        </div>

        {/* Quick Class filter badges */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 shrink-0">
            <Layers size={12} />
            শ্রেণী ফিল্টার:
          </span>
          
          <div className="flex flex-wrap gap-1.5">
            {currentClassOptions.map((className) => {
              const count = className === 'all' 
                ? TEXTBOOKS.filter(b => b.category === levelTab).length 
                : TEXTBOOKS.filter(b => b.category === levelTab && b.classBn === className).length;

              const isSelected = selectedClass === className;
              return (
                <button
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'bg-slate-50 hover:bg-emerald-50/50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                  }`}
                  id={`class-badge-${className}`}
                >
                  {className === 'all' ? 'সব বই একত্রে' : className} ({toBengaliNumber(count)})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOOKS LISTING CONTAINER GRID */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="board-books-grid-renderer">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                {/* Badge Category and Class */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md tracking-wide">
                    {book.classBn}
                  </span>
                  <span className="text-[10px] font-sans font-bold text-slate-400">
                    বিষয়: {book.subjectBn}
                  </span>
                </div>

                {/* Cover & Title representation */}
                <div className="flex gap-4">
                  {/* Decorative book cover design layout */}
                  <div className={`w-14 h-18 rounded-lg ${levelTab === 'primary' ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-[#024e8e] to-[#013562]'} flex flex-col justify-between p-1.5 text-[7px] text-white/90 shrink-0 shadow-xs relative overflow-hidden group-hover:scale-103 transition-transform duration-300`}>
                    <div className="border border-white/25 h-full rounded flex flex-col justify-between p-1">
                      <span className="font-extrabold text-[5px] uppercase tracking-wider block border-b border-white/10 pb-0.5">NCTB</span>
                      <span className="text-[8px] font-black line-clamp-2 leading-tight hyphens-auto">{book.title.replace(/\([^)]+\)/, '')}</span>
                      <span className="text-[5px] text-white/50 text-right">২০২৬</span>
                    </div>
                  </div>

                  {/* Main text metadata */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans line-clamp-3 mt-1">
                      {book.descriptionBn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Download / Open Action Bar */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 justify-end">
                {/* Direct copy reference link */}
                <button
                  onClick={(e) => handleCopyLink(book.pdfUrl || currentNctbUrl, e)}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    copiedLink === (book.pdfUrl || currentNctbUrl)
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                  }`}
                  title="বইয়ের সোর্স লিঙ্ক কপি করুন"
                >
                  {copiedLink === (book.pdfUrl || currentNctbUrl) ? 'কপি হয়েছে' : 'লিঙ্ক কপি'}
                </button>

                {/* Primary Read/Download Button */}
                <a
                  href={book.pdfUrl || currentNctbUrl}
                  target="_blank"
                  rel="no_referrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-800 hover:bg-emerald-950 text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors group-hover:shadow-sm"
                >
                  <span>অনলাইনে পড়ুন</span>
                  <ExternalLink size={11} className="opacity-80" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200/70 p-12 text-center rounded-3xl" id="board-books-not-found">
          <BookCheck className="size-10 text-emerald-800/40 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800">কোনো বই খুঁজে পাওয়া যায়নি!</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">দয়া করে ভিন্ন কী-ওয়ার্ড বা শ্রেণী ফিল্টার নির্বাচন করে পুনরায় চেষ্টা করুন।</p>
          <button
            onClick={() => { setSelectedClass('all'); setSearchQuery(''); }}
            className="text-xs font-bold text-emerald-800 bg-white hover:bg-slate-100 px-4 py-2 mt-4 rounded-xl shadow-xs border border-slate-200 cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* FOOTER GENERAL ASSISTANCE CARD */}
      <div className="mt-8 bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
          <Award size={14} className="text-emerald-700" />
          এনসিটিবি অনলাইন লাইব্রেরি ব্যবহারের সুবিধা
        </h3>
        <p className="text-[11px] text-emerald-900/80 leading-relaxed font-sans">
          ১. আপনি যেকোনো কম্পিউটার বা মোবাইল ডিভাইস থেকে সরাসরি এই লিংকের মাধ্যমে কোনো ফি ছাড়াই বিনামূল্যে অফিসিয়াল বইয়ের ফাইল অ্যাক্সেস করতে পারবেন।  
          ২. প্রাক-প্রাথমিক ও প্রাথমিক স্তরের সরাসরি উৎস: <a href={PRIMARY_NCTB_URL} className="underline text-emerald-950 font-bold hover:text-emerald-800" target="_blank" rel="no_referrer">{PRIMARY_NCTB_URL}</a>  
          ৩. মাধ্যমিক স্তর ও উচ্চ মাধ্যমিক স্তরের সরাসরি উৎস: <a href={SECONDARY_NCTB_URL} className="underline text-emerald-950 font-bold hover:text-emerald-800" target="_blank" rel="no_referrer">{SECONDARY_NCTB_URL}</a>
        </p>
      </div>

    </div>
  );
}
