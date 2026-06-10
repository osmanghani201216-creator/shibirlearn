import React, { useState } from 'react';
import { toBengaliNumber } from '../utils/bengaliDate';
import { 
  Book, 
  BookOpen, 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  Volume2, 
  Bookmark, 
  Folder, 
  Layers, 
  Share2,
  Clock,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  BookMarked,
  Layers2,
  Compass,
  ArrowUpRight,
  Info,
  HelpCircle,
  FileCheck2,
  Users,
  Award,
  BookCopy,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Customized circular green logo for Bangladesh Jamaat-e-Islami Online Library
export function JamaatLogo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" referrerPolicy="no-referrer">
      <circle cx="50" cy="50" r="48" fill="#097945" stroke="#ecc94b" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M 40 32 C 43 30, 48 28, 52 29 C 58 31, 62 27, 66 32 C 68 36, 60 41, 62 46 C 63 50, 68 53, 65 58 C 62 61, 58 58, 54 62 C 51 66, 53 72, 48 74 C 44 76, 42 70, 39 67 C 36 63, 31 66, 29 60 C 27 55, 33 50, 31 43 C 29 38, 34 35, 40 32 Z" fill="#0c9c57" opacity="0.6" />
      <path d="M 42 63 A 18 18 0 1 0 71 42 A 15 15 0 1 1 42 63" fill="#ecc94b" />
      <polygon points="66,31 68,35 73,35 69,38 71,43 66,40 61,43 63,38 59,35 64,35" fill="#f6e05e" />
      <path d="M 38 68 L 50 56 L 62 68 Z" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 32 68 Q 50 52 68 68 Z" fill="none" stroke="#ecc94b" strokeWidth="2" />
    </svg>
  );
}

// Customized badge/logo representation for Bangladesh Islami Chhatra Shibir Online Library
export function ShibirLibLogo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" referrerPolicy="no-referrer">
      <polygon points="50,5 95,38 78,92 22,92 5,38" fill="#024e8e" stroke="#ffffff" strokeWidth="1" />
      <polygon points="50,12 87,39 74,84 26,84 13,39" stroke="#991b1b" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="30" fill="#026ab3" />
      <path d="M 40 59 A 17 17 0 1 0 70 51 A 14 14 0 1 1 40 59" fill="#ffffff" />
      <path d="M 41 33 L 42.5 37 L 46.5 37 L 43.5 39.5 L 44.5 43.5 L 41 41 L 37.5 43.5 L 38.5 39.5 L 35.5 37 L 39.5 37 Z" fill="#facc15" />
      <text x="50" y="58" fill="#ffffff" fontSize="9" fontWeight="950" textAnchor="middle" fontFamily="sans-serif">
        الله أكبر
      </text>
    </svg>
  );
}

interface ExternalSubpage {
  id: string;
  nameBn: string;
  url: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface SyllabusItem {
  id: string;
  nameBn: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface CategoryItem {
  id: string;
  nameBn: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface OtherDocItem {
  id: string;
  nameBn: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string; // references cat ID or syllabus ID
  description: string;
  rating?: string;
  pages?: string;
  externalUrl: string;
  isAudio?: boolean;
}

interface OnlineLibraryViewProps {
  onBack: () => void;
}

export default function OnlineLibraryView({ onBack }: OnlineLibraryViewProps) {
  // Toggle between 'shibir' and 'jamayat'
  const [libraryMode, setLibraryMode] = useState<'shibir' | 'jamayat'>('shibir');
  const [selectedMainTab, setSelectedMainTab] = useState<'all' | 'syllabus' | 'departments' | 'others'>('all');
  const [selectedSubTabId, setSelectedSubTabId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  
  const [bookmarkedList, setBookmarkedList] = useState<string[]>(() => {
    const savedJ = localStorage.getItem('jamaat_library_bookmarks');
    const savedS = localStorage.getItem('shibir_library_bookmarks');
    const listJ = savedJ ? JSON.parse(savedJ) : [];
    const listS = savedS ? JSON.parse(savedS) : [];
    return [...listJ, ...listS];
  });

  // ----------------------------------------------------
  // DATA: BANGLADESH JAMAAT-E-ISLAMI ONLINE LIBRARY (bjilibrary.com)
  // ----------------------------------------------------
  const jamaatTopNavigation: ExternalSubpage[] = [
    { id: 'home', nameBn: 'নীড়', url: 'https://bjilibrary.com/', description: 'জামায়াত অনলাইন লাইব্রেরি এর হোমপেজ ও রিসোর্স সেন্টার', icon: Compass },
    { id: 'intro', nameBn: 'সংক্ষিপ্ত পরিচিতি', url: 'https://bjilibrary.com/introduction', description: 'অনলাইন লাইব্রেরি এবং জামায়াতে ইসলামীর সাহিত্য পরিচিতি', icon: Info },
    { id: 'categorized', nameBn: 'বিভাগ ভিত্তিক', url: 'https://bjilibrary.com/books-category', description: 'বিষয় ও বিষয়ভিত্তিক সাজানো ক্যাটাগরির বইসমূহ', icon: Layers2 },
    { id: 'worker', nameBn: 'কর্মী সিলেবাস', url: 'https://bjilibrary.com/worker-syllabus', description: 'কর্মী সিলেবাসভুক্ত মৌলিক এবং সাংগঠনিক কালজয়ী বইসমূহ', icon: Users },
    { id: 'member', nameBn: 'রুকন সিলেবাস', url: 'https://bjilibrary.com/member-syllabus', description: 'রুকন বা সদস্য সিলেবাসের গভীর গবেষণামূলক গ্রন্থসমূহ', icon: Award },
    { id: 'yearly-gen', nameBn: 'বাৎসরিক পাঠ্যসূচি', url: 'https://bjilibrary.com/yearly-syllabus/yearly-syllabus-general', description: 'সকল স্তরের কর্মীদের জন্য সুনির্দিষ্ট বার্ষিক পাঠ পরিকল্পনা', icon: Clock },
    { id: 'higher', nameBn: 'উচ্চতর অধ্যয়ন', url: 'https://bjilibrary.com/higher-study', description: 'উচ্চতর ইসলামী জ্ঞান, সমকালীন দাওয়াহ এবং উন্নত রাষ্ট্রনীতি', icon: BookOpen },
    { id: 'audio-list', nameBn: 'অডিও বই', url: 'https://bjilibrary.com/audio-books', description: 'গুরুত্বপূর্ণ ইসলামিক বইয়ের আকর্ষণীয় অডিও সংস্করণ', icon: Volume2 },
    { id: 'others-cat', nameBn: 'অন্যান্য', url: 'https://bjilibrary.com/books/others-category', description: 'প্রবন্ধ, ম্যাগাজিন, সেমিনার আলোচনা নোট এবং বুলেটিন', icon: BookCopy },
    { id: 'kishor-kantho', nameBn: 'কিশোর কণ্ঠ বই', url: 'https://www.kishorkanthabd.com/e-paper', description: 'নতুন কিশোর কণ্ঠ অনলাইন সংস্করণ ও ই-পেপার', icon: BookOpen },
  ];

  const jamaatSyllabus: SyllabusItem[] = [
    { id: 'member-gen', nameBn: 'রুকন সিলেবাস (স্বল্প শিক্ষিত)', url: 'https://bjilibrary.com/member-syllabus/general-member-syllabus', icon: Award },
    { id: 'member-edu', nameBn: 'রুকন সিলেবাস (শিক্ষিত)', url: 'https://bjilibrary.com/member-syllabus/educated-member-syllabus', icon: BookmarkCheck },
    { id: 'worker-syllabus', nameBn: 'কর্মী সিলেবাস', url: 'https://bjilibrary.com/worker-syllabus', icon: Users },
    { id: 'audio-books', nameBn: 'অডিও বই', url: 'https://bjilibrary.com/audio-books', icon: Volume2 },
    { id: 'yearly-edu', nameBn: 'বাৎসরিক পাঠ্যসূচি (শিক্ষিত)', url: 'https://bjilibrary.com/yearly-syllabus/yearly-syllabus-educated', icon: Clock },
    { id: 'yearly-general', nameBn: 'বাৎসরিক পাঠ্যসূচি (স্বল্প শিক্ষিত)', url: 'https://bjilibrary.com/yearly-syllabus/yearly-syllabus-general', icon: BookMarked },
    { id: 'higher-study', nameBn: 'উচ্চতর অধ্যয়ন', url: 'https://bjilibrary.com/higher-study', icon: BookOpen },
    { id: 'report-books', nameBn: 'রিপোর্ট বই', url: 'https://bjilibrary.com/report', icon: FileCheck2 },
  ];

  const jamaatDepartments: CategoryItem[] = [
    { id: 'al-quran', nameBn: 'আল কুরআন', url: 'https://bjilibrary.com/books/books-category/al-quran', icon: BookOpen },
    { id: 'al-hadith', nameBn: 'আল হাদিস', url: 'https://bjilibrary.com/books/books-category/al-hadith', icon: BookMarked },
    { id: 'al-fiqh', nameBn: 'ফিকাহ', url: 'https://bjilibrary.com/books/books-category/al-fiqh', icon: Layers },
    { id: 'imaan', nameBn: 'ঈমান ও আকীদাহ', url: 'https://bjilibrary.com/books/books-category/imaan', icon: BookmarkCheck },
    { id: 'islam', nameBn: 'ইসলাম ও ইবাদাত', url: 'https://bjilibrary.com/books/books-category/islam', icon: CheckCircle2 },
    { id: 'family-life', nameBn: 'পারিবারিক ও সামাজিক জীবন', url: 'https://bjilibrary.com/books/books-category/family-life', icon: Users },
    { id: 'islamic-movement', nameBn: 'ইসলামী আন্দোলন ও সংগঠন', url: 'https://bjilibrary.com/books/books-category/islamic-movement-and-organization', icon: Award },
    { id: 'sirat', nameBn: 'সীরাত ও ইতিহাস', url: 'https://bjilibrary.com/books/books-category/sirat', icon: BookOpen },
    { id: 'sirate-sahaba', nameBn: 'সীরাতে সাহাবা', url: 'https://bjilibrary.com/books/books-category/sirate-sahaba', icon: Users },
    { id: 'women', nameBn: 'নারী', url: 'https://bjilibrary.com/books/books-category/women', icon: CheckCircle2 },
    { id: 'dawah', nameBn: 'দাওয়াত ও তাবলিগ', url: 'https://bjilibrary.com/books/books-category/dawah', icon: Compass },
    { id: 'akhlakh', nameBn: 'আমল-আখলাক ও মুয়ামালাত', url: 'https://bjilibrary.com/books/books-category/akhlakh', icon: Bookmark },
    { id: 'politics', nameBn: 'রাজনীতি', url: 'https://bjilibrary.com/books/books-category/politics', icon: HelpCircle },
    { id: 'economics', nameBn: 'অর্থনীতি', url: 'https://bjilibrary.com/books/books-category/economics', icon: Layers2 },
    { id: 'miscellaneous', nameBn: 'বিবিধ', url: 'https://bjilibrary.com/books/books-category/miscellaneous', icon: BookCopy },
  ];

  const jamaatOtherDocs: OtherDocItem[] = [
    { id: 'darsul-quran', nameBn: 'দারসুল কুরআন', url: 'https://bjilibrary.com/books/others-category/darsul-quran', icon: BookOpen },
    { id: 'darsul-hadith', nameBn: 'দারসুল হাদিস', url: 'https://bjilibrary.com/books/others-category/darsul-hadith', icon: BookMarked },
    { id: 'discussion-note', nameBn: 'আলোচনা নোট', url: 'https://bjilibrary.com/books/others-category/discussion-note', icon: FileText },
    { id: 'books-note', nameBn: 'বইনোট', url: 'https://bjilibrary.com/books/others-category/books-note', icon: Book },
    { id: 'article', nameBn: 'প্রবন্ধ', url: 'https://bjilibrary.com/books/others-category/article', icon: FileText },
    { id: 'magazine', nameBn: 'ম্যাগাজিন', url: 'https://bjilibrary.com/books/others-category/magazine', icon: BookCopy },
    { id: 'bulletin', nameBn: 'বুলেটিন', url: 'https://bjilibrary.com/books/others-category/bulletin', icon: Layers },
    { id: 'souvenir', nameBn: 'স্মারক', url: 'https://bjilibrary.com/books/others-category/souvenir', icon: Award },
  ];

  const jamaatBooks: BookItem[] = [
    {
      id: "bji-q1",
      title: "তাফহীমুল কুরআন (১ম থেকে ১৯শ খণ্ড)",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "al-quran",
      description: "কুরআন মাজীদের আধুনিক যুগের অন্যতম শ্রেষ্ঠ তাফসীর ও অনুবাদ গ্রন্থ। বর্তমান মুসলিম যুবসমাজের চিন্তা চেতনা পরিবর্তনে ব্যাপক ভূমিকা রেখেছে এটি।",
      pages: "১১৫০",
      rating: "৪.৯",
      externalUrl: "https://bjilibrary.com/books/books-category/al-quran"
    },
    {
      id: "bji-q2",
      title: "কুরআনের চিরন্তন আহ্বান",
      author: "উস্তাদ খুররম মুরাদ",
      category: "al-quran",
      description: "কুরআনের শিক্ষাকে বাস্তব জীবনে প্রয়োগ করার মূলনীতি এবং সাধারণ মানুষের কাছে তা সহজভাবে পৌঁছে দেওয়ার কলাকৌশল ও গাইডলাইন।",
      pages: "২২০",
      rating: "৪.৮",
      externalUrl: "https://bjilibrary.com/books/books-category/al-quran"
    },
    {
      id: "bji-h1",
      title: "রাহে আমল (১ম ও ২য় খণ্ড একত্রে)",
      author: "মওলানা মুহাম্মদ মনযুর নোমানী",
      category: "al-hadith",
      description: "ঈমান, আখলাক, ইবাদাত ও দৈনন্দিন শিষ্টাচার সংক্রান্ত অত্যন্ত জনপ্রিয় সহীহ হাদীস সংকলন ও জীবন ঘনিষ্ঠ চমৎকার ব্যাখ্যা।",
      pages: "৪২০",
      rating: "৪.৯",
      externalUrl: "https://bjilibrary.com/books/books-category/al-hadith"
    },
    {
      id: "bji-h2",
      title: "মাআরিফুল হাদীস (নির্বাচিত অধ্যায়)",
      author: "হযরত মওলানা মনযূর নু'মানী",
      category: "al-hadith",
      description: "সহজ সরল ভাষায় মুসলিম উম্মাহর জন্য প্রয়োজনীয় হাদীস সমূহের এমন এক প্রামাণ্য অনুবাদ ও বিশ্লেষণ যা অন্তরে আল্লাহর ভয় সৃষ্টি করে।",
      pages: "৩১০",
      rating: "৪.৮",
      externalUrl: "https://bjilibrary.com/books/books-category/al-hadith"
    },
    {
      id: "bji-w1",
      title: "ইসলামের বুনিয়াদী শিক্ষা",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "worker-syllabus",
      description: "ঈমান, ইসলাম, নামায, রোযা, হজ্জ ও যাকাতের তাত্পর্য এবং বাস্তব ও সমাজ জীবনে তা প্রতিষ্ঠার অপরিহার্যতা নিয়ে অত্যন্ত যুগান্তকারী রচনা।",
      pages: "১৮০",
      rating: "৪.৯",
      externalUrl: "https://bjilibrary.com/worker-syllabus"
    },
    {
      id: "bji-w2",
      title: "ইসলামী আন্দোলনের নৈতিক ভিত্তি",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "worker-syllabus",
      description: "একটি সুন্দর ও সার্থক সমাজ বিনির্মাণ আন্দোলনের কর্মীদের ব্যক্তিগত ও সামষ্টিক নৈতিক চরিত্রের সুবর্ণ গুণাবলীসমূহ।",
      pages: "১২৮",
      rating: "৪.৭",
      externalUrl: "https://bjilibrary.com/worker-syllabus"
    },
    {
      id: "bji-r1",
      title: "খিলাফত ও রাজতন্ত্র",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "member-syllabus",
      description: "খিলাফতে রাশেদার আদর্শ রূপ ও কিভাবে তা কালক্রমে রাজতন্ত্রে অবনমিত হলো তার এক প্রামাণিক, নিরপেক্ষ ঐতিহাসিক ও রাজনৈতিক চমৎকার বিশ্লেষণ।",
      pages: "৩৬০",
      rating: "৪.৯৫",
      externalUrl: "https://bjilibrary.com/member-syllabus"
    },
    {
      id: "bji-r2",
      title: "ইসলামী রাষ্ট্র ও সংবিধান",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "member-edu",
      description: "আধুনিক বিশ্বে পূর্ণাঙ্গ ইসলামী আইন প্রণয়ন ও শাসনব্যবস্থা চালুর মূল রূপরেখা ও বিশ্বজনীন সংবিধানের মূলনীতি।",
      pages: "৩০০",
      rating: "৪.৮",
      externalUrl: "https://bjilibrary.com/member-syllabus/educated-member-syllabus"
    },
    {
      id: "bji-r3",
      title: "দ্বীন প্রতিষ্ঠার গুরুত্ব (সহজ সংস্করণ)",
      author: "সংগঠন ও প্রকাশনা বিভাগ",
      category: "member-gen",
      description: "আল্লাহর যমীনে আল্লাহর দ্বীন তথা কুরআন-সুন্নাহর আইন প্রতিষ্ঠার গুরুত্ব ও কর্মীদের সহজ ভাষায় বুঝানোর মত নির্দেশিকা।",
      pages: "১৬০",
      rating: "৪.৭",
      externalUrl: "https://bjilibrary.com/member-syllabus/general-member-syllabus"
    },
    {
      id: "bji-im1",
      title: "ঈমানের হাকীকত",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "imaan",
      description: "প্রকৃত ও খাঁটি ঈমানের সংজ্ঞা, মোনাফেকী ও দুর্বল ঈমানের লক্ষণ এবং অন্তরে ঈমানের জ্যোতি জ্বালানোর তাত্ত্বিক বিশ্লেষণ।",
      pages: "৯৬",
      rating: "৪.৯",
      externalUrl: "https://bjilibrary.com/books/books-category/imaan"
    },
    {
      id: "bji-dq1",
      title: "নির্বাচিত দারসুল কুরআন (১ম খণ্ড)",
      author: "মাওলানা আবদুর রহীম একাডেমী",
      category: "darsul-quran",
      description: "কুরআন মাজীদের গুরুত্বপূর্ণ সূরা ও অধ্যায় সমূহের প্রাঞ্জল ও পদ্ধতিগত উপস্থাপনা, যা দাঈগণের জন্য অত্যন্ত কার্যকরী।",
      pages: "২০০",
      rating: "৪.৮",
      externalUrl: "https://bjilibrary.com/books/others-category/darsul-quran"
    },
    {
      id: "bji-dh1",
      title: "দারসুল হাদীস সংকলন",
      author: "মোকাদ্দাস আলী গবেষক দল",
      category: "darsul-hadith",
      description: "সমাজ সংস্কার, সংগঠন ও ইবাদতের গুরুত্ব নিয়ে গঠিত রাসুলুল্লাহ (সা)-এর নির্বাচিত সহীহ হাদিস ও এর প্রামাণ্য লেকচার শিট।",
      pages: "১৫০",
      rating: "৪.৭",
      externalUrl: "https://bjilibrary.com/books/others-category/darsul-hadith"
    },
    {
      id: "bji-au1",
      title: "চরিত্র গঠনের বুনিয়াদী উপাদান (অডিও লেকচার)",
      author: "নঈম সিদ্দিকী (পাঠক)",
      category: "audio-books",
      description: "ইসলামী আদর্শে নিজের অন্তরের রিপুসমূহকে দমন করে উন্নত স্বভাব অর্জনের অডিও লেকচার সিরিজ।",
      isAudio: true,
      rating: "৪.৮",
      externalUrl: "https://bjilibrary.com/audio-books"
    },
    {
      id: "bji-rp1",
      title: "বার্ষিক সাংগঠনিক রিপোর্ট বুক",
      author: "কেন্দ্রীয় সাধারণ সম্পাদক",
      category: "report-books",
      description: "জামায়াতে ইসলামীর কেন্দ্রীয় সাহিত্য, দাওয়াত এবং বিভিন্ন বিভাগীয় কাজের বিস্তারিত বার্ষিক প্রতিবেদন গাইড বই।",
      pages: "১২০",
      rating: "৪.৬",
      externalUrl: "https://bjilibrary.com/report"
    }
  ];

  // ----------------------------------------------------
  // DATA: BANGLADESH ISLAMI CHHATRA SHIBIR ONLINE LIBRARY (shibirlibrary.com)
  // ----------------------------------------------------
  const shibirTopNavigation: ExternalSubpage[] = [
    { id: 'sh-home', nameBn: 'নীড়', url: 'https://shibirlibrary.com/', description: 'শিবির অনলাইন লাইব্রেরি হোমপেজ ও সাহিত্য সম্ভার', icon: Compass },
    { id: 'sh-intro', nameBn: 'পরিচিতি', url: 'https://shibirlibrary.com/introduction', description: 'ইসলামী ছাত্র শিবিরের সাহিত্য ও জ্ঞানচর্চা পরিচিতি', icon: Info },
    { id: 'sh-cats', nameBn: 'বিভাগসমূহ', url: 'https://shibirlibrary.com/books-category', description: 'বিষয়ভিত্তিক সুবিন্যস্ত বইয়ের তালিকা', icon: Layers2 },
    { id: 'sh-worker', nameBn: 'কর্মী সিলেবাস', url: 'https://shibirlibrary.com/worker-syllabus', description: 'কর্মী বা সাধারণ ছাত্রদের আদর্শ গঠনমূলক বইসমূহ', icon: Users },
    { id: 'sh-sathi', nameBn: 'সাথী সিলেবাস', url: 'https://shibirlibrary.com/associate-syllabus', description: 'সাথী স্তরের বৈপ্লবিক ও তাত্ত্বিক গবেষণার সাহিত্য', icon: BookmarkCheck },
    { id: 'sh-member', nameBn: 'সদস্য সিলেবাস', url: 'https://shibirlibrary.com/member-syllabus', description: 'সদস্য স্তরের প্রজ্ঞাপূর্ণ এবং দিকনির্দেশনামূলক গ্রন্থসমূহ', icon: Award },
    { id: 'sh-yearly', nameBn: 'বাৎসরিক সিলেবাস', url: 'https://shibirlibrary.com/yearly-syllabus', description: 'বার্ষিক পড়াশোনার নিয়মতান্ত্রিক বইয়ের দিকনির্দেশ', icon: Clock },
    { id: 'sh-higher', nameBn: 'উচ্চতর অধ্যয়ন', url: 'https://shibirlibrary.com/higher-study', description: 'উচ্চতর পাঠ্যসূচি ও বুদ্ধিভিত্তিক জ্ঞানচর্চার গ্রন্থসমূহ', icon: BookOpen },
    { id: 'sh-audio', nameBn: 'অডিও গ্রন্থ', url: 'https://shibirlibrary.com/audio-books', description: 'গুরুত্বপূর্ণ বইয়ের সুললিত অডিও ফাইল সংস্করণ', icon: Volume2 },
    { id: 'kishor-kantho-sh', nameBn: 'কিশোর কণ্ঠ বই', url: 'https://www.kishorkanthabd.com/e-paper', description: 'নতুন কিশোর কণ্ঠ অনলাইন সংস্করণ ও ই-পেপার', icon: BookOpen },
  ];

  const shibirSyllabus: SyllabusItem[] = [
    { id: 'sh-worker-syllabus', nameBn: 'কর্মী সিলেবাস', url: 'https://shibirlibrary.com/worker-syllabus', icon: Users },
    { id: 'sh-sathi-gen', nameBn: 'সাথী সিলেবাস (সাধারণ)', url: 'https://shibirlibrary.com/associate-syllabus/general-associate-syllabus', icon: BookmarkCheck },
    { id: 'sh-sathi-edu', nameBn: 'সাথী সিলেবাস (উচ্চশিক্ষিত)', url: 'https://shibirlibrary.com/associate-syllabus/educated-associate-syllabus', icon: BookMarked },
    { id: 'sh-member-syllabus', nameBn: 'সদস্য সিলেবাস (রুকন)', url: 'https://shibirlibrary.com/member-syllabus', icon: Award },
    { id: 'sh-yearly-syllabus', nameBn: 'বাৎসরিক পাঠ্যসূচি', url: 'https://shibirlibrary.com/yearly-syllabus', icon: Clock },
    { id: 'sh-higher-study', nameBn: 'উচ্চতর ইসলামী অধ্যয়ন', url: 'https://shibirlibrary.com/higher-study', icon: BookOpen },
    { id: 'sh-audio-books', nameBn: 'অডিও বইসমূহ', url: 'https://shibirlibrary.com/audio-books', icon: Volume2 },
    { id: 'sh-report', nameBn: 'সাংগঠনিক রিপোর্ট বই', url: 'https://shibirlibrary.com/report', icon: FileCheck2 },
  ];

  const shibirDepartments: CategoryItem[] = [
    { id: 'sh-al-quran', nameBn: 'আল কুরআন ও তাফসীর', url: 'https://shibirlibrary.com/books/books-category/al-quran', icon: BookOpen },
    { id: 'sh-al-hadith', nameBn: 'আল হাদীস চর্চা', url: 'https://shibirlibrary.com/books/books-category/al-hadith', icon: BookMarked },
    { id: 'sh-movement', nameBn: 'ইসলামী আন্দোলন ও বিপ্লব', url: 'https://shibirlibrary.com/books/books-category/islamic-movement', icon: Award },
    { id: 'sh-sirat', nameBn: 'সীরাত ও ইসলামী ইতিহাস', url: 'https://shibirlibrary.com/books/books-category/sirat', icon: Compass },
    { id: 'sh-life', nameBn: 'জীবন গঠন ও চরিত্র সংশোধন', url: 'https://shibirlibrary.com/books/books-category/life-building', icon: CheckCircle2 },
    { id: 'sh-politics', nameBn: 'রাজনীতি ও ইসলাম রাষ্ট্রব্যবস্থা', url: 'https://shibirlibrary.com/books/books-category/politics', icon: HelpCircle },
    { id: 'sh-economics', nameBn: 'অর্থনীতি ও সমাজকল্যাণ', url: 'https://shibirlibrary.com/books/books-category/economics', icon: Layers2 },
    { id: 'sh-literature', nameBn: 'সাংস্কৃতিক সাহিত্য ও সায়েন্স', url: 'https://shibirlibrary.com/books/books-category/literature', icon: BookCopy },
  ];

  const shibirOtherDocs: OtherDocItem[] = [
    { id: 'sh-dars-quran', nameBn: 'দারসুল কুরআন রূপরেখা', url: 'https://shibirlibrary.com/books/others-category/darsul-quran', icon: BookOpen },
    { id: 'sh-dars-hadith', nameBn: 'দারসুল হাদিস নির্দেশিকা', url: 'https://shibirlibrary.com/books/others-category/darsul-hadith', icon: BookMarked },
    { id: 'sh-disc-notes', nameBn: 'আলোচনা ও সেমিনার নোটস', url: 'https://shibirlibrary.com/books/others-category/discussion-note', icon: FileText },
    { id: 'sh-summaries', nameBn: 'বইয়ের সারসংক্ষেপ', url: 'https://shibirlibrary.com/books/others-category/books-note', icon: Book },
  ];

  const shibirBooks: BookItem[] = [
    {
      id: "shb-w1",
      title: "চরিত্র গঠনের বুনিয়াদী উপাদান",
      author: "নঈম সিদ্দিকী",
      category: "sh-worker-syllabus",
      description: "ছাত্র শিবিরের কর্মীদের ব্যক্তিগত সংশোধন, চরিত্র গঠন এবং নৈতিক মান উন্নয়নে একটি অনবদ্য ও আবশ্যিক নির্দেশিকা।",
      pages: "১৪০",
      rating: "৪.৯",
      externalUrl: "https://shibirlibrary.com/worker-syllabus"
    },
    {
      id: "shb-w2",
      title: "ইসলামের বুনিয়াদী শিক্ষা",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "sh-worker-syllabus",
      description: "কালেমা, সালাত, সাওম, হজ এবং জাকাতের আধ্যাত্মিক ও সামাজিক গুরুত্ব বিশ্লেষণ করে সহজ ভাষায় রচিত মাস্টারপিস গ্রন্থ।",
      pages: "১৮০",
      rating: "৪.৯",
      externalUrl: "https://shibirlibrary.com/worker-syllabus"
    },
    {
      id: "shb-s1",
      title: "এসো হেদায়েতের পথে",
      author: "উস্তাদ খুররম মুরাদ",
      category: "sh-sathi-edu",
      description: "তরুণ ছাত্র ও যুবসমাজকে তাওহীদের পথে ডাকার আহ্বান, হিকমত এবং দাওয়াতের মূল কলাকৌশল ও নিজের ঈমান বৃদ্ধির গাইডবুক।",
      pages: "১১৫",
      rating: "৪.৮",
      externalUrl: "https://shibirlibrary.com/associate-syllabus"
    },
    {
      id: "shb-s2",
      title: "জীবন গঠন সহায়িকা",
      author: "কেন্দ্রীয় সাহিত্য ও পাঠ্যসূচি উপ-পরিষদ",
      category: "sh-sathi-gen",
      description: "ছাত্রজীবনে সময় সচেতনতা, পড়াশোনার সুসংগঠিত পরিকল্পনা এবং দৈনিক ইবাদতের শিডিউল প্রস্তুত নিয়ে বাস্তব গাইডবুক।",
      pages: "১৫০",
      rating: "৪.৭",
      externalUrl: "https://shibirlibrary.com/associate-syllabus"
    },
    {
      id: "shb-m1",
      title: "ইসলামী সমাজ বিপ্লবের ধারা",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "sh-member-syllabus",
      description: "পৃথিবীতে আদর্শ ভিত্তিক সমাজ বিনির্মাণ বা বিপ্লব সাধনের জন্য কর্মী ও নেতাদের মৌলিক চরিত্র এবং বিপ্লবী কর্মপন্থার দিকনির্দেশ।",
      pages: "১৯০",
      rating: "৪.৯৫",
      externalUrl: "https://shibirlibrary.com/member-syllabus"
    },
    {
      id: "shb-m2",
      title: "আদর্শ মানব",
      author: "মাওলানা মুহাম্মদ জাফর ইকবাল",
      category: "sh-member-syllabus",
      description: "রাসূল সাল্লাল্লাহু আলাইহি ওয়া সাল্লামের মানবীয় শ্রেষ্ঠত্ব, চারিত্রিক মাধুর্য ও জীবন পরিচালনার সেরা দিকসমূহের একটি প্রাণবন্ত উপস্থাপন।",
      pages: "১৪৫",
      rating: "৪.৮",
      externalUrl: "https://shibirlibrary.com/member-syllabus"
    },
    {
      id: "shb-q1",
      title: "তাফহীমুল কুরআন (বাংলা অনুবাদ)",
      author: "সায়্যিদ আবুল আ’লা মওদূদী",
      category: "sh-al-quran",
      description: "সহজ আধুনিক ও যুগোপযোগী বাংলা তাফসির। ইসলামের সমাজ ও অর্থনৈতিক দর্শনের আলোকে আContextual ব্যাখ্যাসম্বলিত শ্রেষ্ঠ তাফসির।",
      pages: "১২৫০",
      rating: "৪.৯",
      externalUrl: "https://shibirlibrary.com/books/books-category/al-quran"
    },
    {
      id: "shb-sh1",
      title: "দারসুল হাদীস সংকলন (ছাত্রদের জন্য)",
      author: "কেন্দ্রীয় পরিষদ",
      category: "sh-dars-hadith",
      description: "রাসূল (সা:)-এর ছাত্র জীবন, ইলম ও জিহাদ বিষয়ক নির্বাচিত হাদিস সমূহের প্রাঞ্জল লেকচার নোট শিট ও উপস্থাপনা।",
      pages: "১২০",
      rating: "৪.৭",
      externalUrl: "https://shibirlibrary.com/books/others-category/darsul-hadith"
    }
  ];

  const handleToggleBookmark = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    const isShbBook = bookId.startsWith('shb-');
    const storageKey = isShbBook ? 'shibir_library_bookmarks' : 'jamaat_library_bookmarks';

    if (bookmarkedList.includes(bookId)) {
      updated = bookmarkedList.filter(id => id !== bookId);
    } else {
      updated = [...bookmarkedList, bookId];
    }
    
    setBookmarkedList(updated);

    // Save separately to preserve partition integrity
    const savedJ = updated.filter(id => id.startsWith('bji-'));
    const savedS = updated.filter(id => id.startsWith('shb-'));
    localStorage.setItem('jamaat_library_bookmarks', JSON.stringify(savedJ));
    localStorage.setItem('shibir_library_bookmarks', JSON.stringify(savedS));
  };

  const isShibirMode = libraryMode === 'shibir';

  // Dynamic Theme Configuration
  const theme = {
    primaryBg: isShibirMode ? 'bg-[#f0f9ff]' : 'bg-[#fdfefe]',
    primaryText: isShibirMode ? 'text-sky-950' : 'text-emerald-950',
    hoverBgLight: isShibirMode ? 'hover:bg-sky-50/50' : 'hover:bg-emerald-50/70',
    hoverBgSub: isShibirMode ? 'hover:bg-sky-50/30' : 'hover:bg-emerald-50/30',
    borderLight: isShibirMode ? 'border-sky-100' : 'border-emerald-100',
    borderSub: isShibirMode ? 'border-sky-50' : 'border-emerald-50',
    btnBg: isShibirMode ? 'bg-[#024e8e]' : 'bg-emerald-800',
    btnText: 'text-white',
    btnBgHover: isShibirMode ? 'hover:bg-sky-900' : 'hover:bg-emerald-900',
    btnBgActive: isShibirMode ? 'active:bg-sky-950' : 'active:bg-emerald-950',
    btnBorder: isShibirMode ? 'border-sky-200' : 'border-[#ecc94b]',
    textSub: isShibirMode ? 'text-sky-800/90' : 'text-emerald-700/90',
    pillBg: isShibirMode ? 'bg-sky-50' : 'bg-emerald-50',
    pillText: isShibirMode ? 'text-sky-800' : 'text-emerald-800',
    searchBg: isShibirMode ? 'bg-sky-50/20' : 'bg-emerald-50/20',
    searchFocus: isShibirMode ? 'focus:ring-sky-700' : 'focus:ring-emerald-700',
    searchInputPlaceholder: isShibirMode ? 'শিবির লাইব্রেরী থেকে বই বা লেখক খুঁজুন...' : 'জামায়াত লাইব্রেরী থেকে বই বা লেখক খুঁজুন...',
    siteBannerTitle: isShibirMode ? 'শিবির অনলাইন লাইব্রেরি' : 'জামায়াত অনলাইন লাইব্রেরি',
    siteBannerSub: isShibirMode ? 'ইসলামী ছাত্রসমাজের জ্ঞান অর্জনের দিগন্ত উন্মোচনে একটি পূর্ণাঙ্গ অনলাইন লাইব্রেরি ও সিলেবাস নির্দেশিকা (shibirlibrary.com)' : 'দ্বীনের সঠিক জ্ঞান এবং আদর্শ জীবন গঠনে একটি কালজয়ী অনলাইন গ্রন্থাগার ও সিলেবাস ডিরেক্টরি (bjilibrary.com)',
    navBarHeader: isShibirMode ? 'shibirlibrary.com এর মূল উপপাতা লিঙ্কসমূহ (সরাসরি অনলাইনে পড়তে ক্লিক করুন)' : 'bjilibrary.com এর মূল উপপাতা লিংকসমূহ (সরাসরি অনলাইনে পড়তে ক্লিক করুন)',
    navBarBg: isShibirMode ? 'bg-[#024e8e] border-sky-900/40 text-teal-50' : 'bg-emerald-800 border-emerald-900/40 text-emerald-100',
    navBarBtnBg: isShibirMode ? 'bg-sky-800/40 hover:bg-sky-900 border-sky-700 hover:border-sky-550' : 'bg-emerald-700/40 hover:bg-emerald-900 border-emerald-700 hover:border-emerald-500',
    logoIcon: isShibirMode ? <ShibirLibLogo className="size-14 md:size-16 drop-shadow-xs" /> : <JamaatLogo className="size-14 md:size-16 drop-shadow-sm" />,
    sidebarHeading: isShibirMode ? 'শিবির লাইব্রেরি ফিল্টার' : 'জামায়াত লাইব্রেরি ফিল্টার',
  };

  // Switch data based on the mode
  const topNavigationSubpages = isShibirMode ? shibirTopNavigation : jamaatTopNavigation;
  const syllabusGuides = isShibirMode ? shibirSyllabus : jamaatSyllabus;
  const departments = isShibirMode ? shibirDepartments : jamaatDepartments;
  const otherDocs = isShibirMode ? shibirOtherDocs : jamaatOtherDocs;
  const activeBookDatabase = isShibirMode ? shibirBooks : jamaatBooks;

  // Filter books matching queries and active tab categories
  const getFilteredBooks = () => {
    return activeBookDatabase.filter(book => {
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
        );
      }

      if (selectedSubTabId !== 'all') {
        return book.category === selectedSubTabId;
      }

      if (selectedMainTab === 'syllabus') {
        return [
          'member-gen', 'member-edu', 'worker-syllabus', 'audio-books', 'yearly-edu', 'yearly-general', 'higher-study', 'report-books',
          'sh-worker-syllabus', 'sh-sathi-edu', 'sh-sathi-gen', 'sh-member-syllabus', 'sh-yearly-syllabus', 'sh-higher-study', 'sh-audio-books', 'sh-report'
        ].includes(book.category);
      } else if (selectedMainTab === 'departments') {
        return [
          'al-quran', 'al-hadith', 'al-fiqh', 'imaan', 'islam', 'family-life', 'islamic-movement', 'sirat', 'sirate-sahaba', 'women', 'dawah', 'akhlakh', 'politics', 'economics', 'miscellaneous',
          'sh-al-quran', 'sh-al-hadith', 'sh-movement', 'sh-sirat', 'sh-life', 'sh-politics', 'sh-economics', 'sh-literature'
        ].includes(book.category);
      } else if (selectedMainTab === 'others') {
        return [
          'darsul-quran', 'darsul-hadith', 'discussion-note', 'books-note', 'article', 'magazine', 'bulletin', 'souvenir',
          'sh-dars-quran', 'sh-dars-hadith', 'sh-disc-notes', 'sh-summaries'
        ].includes(book.category);
      }

      return true;
    });
  };

  const currentFilteredBooks = getFilteredBooks();

  const handleResetFilters = () => {
    setSelectedMainTab('all');
    setSelectedSubTabId('all');
    setSearchQuery('');
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-8 ${theme.primaryBg} transition-colors duration-300`} id="online-library-root-component">
      
      {/* 🔄 DUAL LIBRARY SELECTOR TOGGLE (AT THE VERY TOP) */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            onClick={() => {
              setLibraryMode('shibir');
              handleResetFilters();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isShibirMode
                ? 'bg-[#024e8e] text-white shadow-md ring-1 ring-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="switch-to-shibir-lib"
          >
            <ShibirLibLogo className="size-5" />
            <span>শিবির অনলাইন লাইব্রেরি</span>
          </button>
          
          <button
            onClick={() => {
              setLibraryMode('jamayat');
              handleResetFilters();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              !isShibirMode
                ? 'bg-emerald-800 text-white shadow-md ring-1 ring-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="switch-to-jamaat-lib"
          >
            <JamaatLogo className="size-5" />
            <span>জামায়াত অনলাইন লাইব্রেরি</span>
          </button>
        </div>
      </div>

      {/* 🟢/🔵 DYNAMIC BRANDING HEADER BANNER */}
      <div className={`bg-white border-b ${theme.borderLight} pb-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2.5 ${isShibirMode ? 'hover:bg-sky-50 text-sky-800' : 'hover:bg-emerald-50 text-emerald-800'} rounded-xl border ${theme.borderLight} transition-colors cursor-pointer shrink-0`}
            id="library-back-btn"
            title="ফিরে যান"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            {theme.logoIcon}
            <div>
              <h1 className={`text-xl md:text-2xl font-black ${theme.primaryText} flex items-center gap-2 tracking-tight`}>
                {theme.siteBannerTitle}
              </h1>
              <p className={`text-xs ${theme.textSub} font-medium leading-normal mt-1 max-w-2xl`}>
                {theme.siteBannerSub}
              </p>
            </div>
          </div>
        </div>

        {/* Real Dynamic Interactive Search Bar */}
        <div className="relative w-full md:w-80 self-stretch md:self-auto">
          <Search className={`absolute left-3 top-3 size-4 ${isShibirMode ? 'text-sky-600' : 'text-emerald-600'}`} />
          <input
            type="text"
            placeholder={theme.searchInputPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedSubTabId !== 'all') setSelectedSubTabId('all');
            }}
            className={`w-full pl-9 pr-4 py-2.5 ${theme.searchBg} text-xs text-slate-800 border ${theme.borderLight} rounded-xl focus:outline-none focus:ring-2 ${theme.searchFocus} font-sans`}
            id="library-search-input"
          />
        </div>
      </div>

      {/* 🌐 TOP SUBPAGES INDEX (NAVBAR WITH EXTERNAL WEB LINKS) */}
      <div className={`${theme.navBarBg} text-white rounded-2xl shadow-sm p-3 mb-8 overflow-hidden transition-colors duration-300`}>
        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3">
          <Sparkles size={14} className="text-amber-300 animate-pulse" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">
            {theme.navBarHeader}
          </span>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin">
          {topNavigationSubpages.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <a
                key={tab.id}
                href={tab.url}
                target="_blank"
                rel="no_referrer"
                className={`flex items-center gap-2 px-3 py-2 ${theme.navBarBtnBg} border rounded-xl transition-all text-xs font-bold whitespace-nowrap shrink-0 text-white shadow-xs group`}
              >
                <TabIcon size={13} className="text-amber-200 group-hover:scale-110 transition-transform" />
                <span>{tab.nameBn}</span>
                <ArrowUpRight size={10} className="opacity-70 group-hover:opacity-100" />
              </a>
            );
          })}
        </div>
      </div>

      {/* THREE COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COMPONENT: Filters menu browser */}
        <div className="lg:col-span-1 space-y-5">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-2.5">
            <h3 className={`text-xs font-black ${theme.primaryText} border-b ${theme.borderLight} pb-2 mb-1 uppercase tracking-wider flex items-center gap-2`}>
              <Layers2 size={13} />
              {theme.sidebarHeading}
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 font-sans">
              <button
                onClick={() => { setSelectedMainTab('all'); setSelectedSubTabId('all'); }}
                className={`py-2 px-3 text-xs text-left font-bold rounded-xl transition-all cursor-pointer ${
                  selectedMainTab === 'all' && selectedSubTabId === 'all'
                    ? `${theme.btnBg} text-white`
                    : `${isShibirMode ? 'text-sky-800 hover:bg-sky-50/50' : 'text-emerald-800 hover:bg-emerald-50/70'}`
                }`}
              >
                সব বই একত্রে ({toBengaliNumber(activeBookDatabase.length)})
              </button>

              <button
                onClick={() => { setSelectedMainTab('syllabus'); setSelectedSubTabId('all'); }}
                className={`py-2 px-3 text-xs text-left font-bold rounded-xl transition-all cursor-pointer ${
                  selectedMainTab === 'syllabus'
                    ? `${theme.btnBg} text-white`
                    : `${isShibirMode ? 'text-sky-800 hover:bg-sky-50/50' : 'text-emerald-800 hover:bg-emerald-50/70'}`
                }`}
              >
                সিলেবাস বিষয়াবলি
              </button>

              <button
                onClick={() => { setSelectedMainTab('departments'); setSelectedSubTabId('all'); }}
                className={`py-2 px-3 text-xs text-left font-bold rounded-xl transition-all cursor-pointer ${
                  selectedMainTab === 'departments'
                    ? `${theme.btnBg} text-white`
                    : `${isShibirMode ? 'text-sky-800 hover:bg-sky-50/50' : 'text-emerald-800 hover:bg-emerald-50/70'}`
                }`}
              >
                বিভাগ ভিত্তিক বই
              </button>

              <button
                onClick={() => { setSelectedMainTab('others'); setSelectedSubTabId('all'); }}
                className={`py-2 px-3 text-xs text-left font-bold rounded-xl transition-all cursor-pointer ${
                  selectedMainTab === 'others'
                    ? `${theme.btnBg} text-white`
                    : `${isShibirMode ? 'text-sky-800 hover:bg-sky-50/50' : 'text-emerald-800 hover:bg-emerald-50/70'}`
                }`}
              >
                অন্যান্য নোট ও প্রবন্ধ
              </button>
            </div>
          </div>

          {/* Quick Notice card info */}
          <div className="bg-amber-50/40 border border-amber-255 border-amber-150 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600 px-0.5" />
              অনলাইন লাইব্রেরি গাইড
            </h4>
            <p className="text-[10px] text-amber-900/90 leading-relaxed font-sans">
              এই লাইব্রেরির প্রতিটি লিংকে ক্লিক করলে আপনি সরাসরি {isShibirMode ? '**shibirlibrary.com**' : '**bjilibrary.com**'} এর অফিশিয়াল ডেটাবেজ যুক্ত পাবেন। যেকোনো প্রয়োজনীয় বই বা প্রবন্ধ সহজে পড়ে জ্ঞান অর্জন করুন।
            </p>
          </div>
        </div>

        {/* MIDDLE & RIGHT COMBINED AREA RENDERER */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* SEARCH TRIGGERED STATISTICS */}
          {searchQuery !== '' && (
            <div className={`flex items-center justify-between ${theme.pillBg} p-3.5 rounded-xl border ${theme.borderLight}`}>
              <span className={`text-xs ${isShibirMode ? 'text-sky-900' : 'text-emerald-900'} font-bold`}>
                অনুসন্ধান ফলাফল: "<span className="text-amber-800">{searchQuery}</span>" দিয়ে {toBengaliNumber(currentFilteredBooks.length)} টি বই পাওয়া গেছে
              </span>
              <button onClick={handleResetFilters} className="text-xs text-slate-500 hover:underline font-bold">
                ফিল্টার মুছুন
              </button>
            </div>
          )}

          {/* SECTION 1: SYLLABUS SCHEMAS GUIDES */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3.5 mb-5">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BookmarkCheck size={16} className={isShibirMode ? 'text-sky-700' : 'text-emerald-700'} />
                কর্মী ও রুকন সিলেবাস নির্দেশিকা (Syllabus)
              </h3>
              <span className={`text-[10px] ${theme.pillText} ${theme.pillBg} py-0.5 px-2.5 rounded-full font-sans font-bold`}>
                {toBengaliNumber(syllabusGuides.length)} টি উপপাতা
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {syllabusGuides.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedSubTabId === item.id;
                return (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedSubTabId(item.id);
                      setSearchQuery('');
                    }}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between items-start gap-3 cursor-pointer group hover:shadow-xs ${
                      isSelected 
                        ? `${theme.btnBg} border-transparent text-white` 
                        : `bg-white hover:bg-slate-50 border-slate-100 text-slate-800`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/20 text-white' : `${theme.pillBg} ${theme.pillText}`}`}>
                        <ItemIcon size={14} />
                      </div>
                      <span className="text-[11px] font-black leading-tight line-clamp-1 group-hover:underline">
                        {item.nameBn}
                      </span>
                    </div>

                    <div className="w-full flex items-center justify-between border-t mt-1 pt-2 border-slate-100">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="no_referrer" 
                        className={`text-[9px] font-black flex items-center gap-1.5 transition-colors ${isSelected ? 'text-amber-305 text-amber-200' : 'text-slate-500 group-hover:text-amber-600'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>সরাসরি লিঙ্ক</span>
                        <ArrowUpRight size={10} />
                      </a>
                      <span className={`text-[9px] ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                        ফিল্টার
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SUBJECT DEPARTMENTS CLASSIFICATION */}
          {departments.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3.5 mb-5">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers size={16} className={isShibirMode ? 'text-sky-700' : 'text-emerald-700'} />
                  বিভাগসমূহ (বিষয়ভিত্তিক ক্যাটাগরি)
                </h3>
                <span className={`text-[10px] ${theme.pillText} ${theme.pillBg} py-0.5 px-2.5 rounded-full font-sans font-bold`}>
                  {toBengaliNumber(departments.length)} টি ক্যাটাগরি
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {departments.map((dept) => {
                  const ItemIcon = dept.icon;
                  const isSelected = selectedSubTabId === dept.id;
                  return (
                    <div 
                      key={dept.id}
                      onClick={() => {
                        setSelectedSubTabId(dept.id);
                        setSearchQuery('');
                      }}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between items-start gap-2.5 cursor-pointer group hover:shadow-xs ${
                        isSelected 
                          ? `${theme.btnBg} border-transparent text-white` 
                          : `bg-slate-50/50 hover:bg-slate-100/50 border-slate-100 text-slate-800`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/20 text-white' : `${theme.pillBg} ${theme.pillText}`}`}>
                          <ItemIcon size={12} />
                        </div>
                        <span className="text-[11px] font-black leading-tight line-clamp-1">
                          {dept.nameBn}
                        </span>
                      </div>

                      <div className="w-full flex items-center justify-between border-t mt-1 pt-2 border-slate-100">
                        <a 
                          href={dept.url} 
                          target="_blank" 
                          rel="no_referrer" 
                          className={`text-[9px] font-black flex items-center gap-1 transition-colors ${isSelected ? 'text-amber-200' : 'text-slate-550 text-slate-500 group-hover:text-amber-600'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>লিঙ্ক ফাইল</span>
                          <ArrowUpRight size={9} />
                        </a>
                        <span className={`text-[9px] ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                          ফিল্টার
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: OTHER DOCUMENTS / NOTES */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3.5 mb-5">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BookCopy size={16} className={isShibirMode ? 'text-sky-700' : 'text-emerald-700'} />
                অন্যান্য বিষয়সমূহ (আলোচনা নোট ও ম্যাগাজিন)
              </h3>
              <span className={`text-[10px] ${theme.pillText} ${theme.pillBg} py-0.5 px-2.5 rounded-full font-sans font-bold`}>
                {toBengaliNumber(otherDocs.length)} টি ক্যাটাগরি
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {otherDocs.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedSubTabId === item.id;
                return (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedSubTabId(item.id);
                      setSearchQuery('');
                    }}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between items-start gap-2.5 cursor-pointer group hover:shadow-xs ${
                      isSelected 
                        ? `${theme.btnBg} border-transparent text-white` 
                        : `bg-white hover:bg-slate-50 border-slate-100 text-slate-800`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/20 text-white' : `${theme.pillBg} ${theme.pillText}`}`}>
                        <ItemIcon size={12} />
                      </div>
                      <span className="text-[11px] font-black leading-tight line-clamp-1">
                        {item.nameBn}
                      </span>
                    </div>

                    <div className="w-full flex items-center justify-between border-t mt-1 pt-2 border-slate-100">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="no_referrer" 
                        className={`text-[9px] font-black flex items-center gap-1 transition-colors ${isSelected ? 'text-amber-200' : 'text-slate-500 group-hover:text-amber-600'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>ফাইল লিংক</span>
                        <ArrowUpRight size={9} />
                      </a>
                      <span className={`text-[9px] ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                        ফিল্টার
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED BOOKS LISTING PREVIEW */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <BookOpen size={16} className={isShibirMode ? 'text-sky-800' : 'text-emerald-800'} />
              <span>ইসলামী সহায়ক সাহিত্য ও বইয়ের সূচী তালিকা</span>
              {selectedSubTabId !== 'all' && (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 py-0.5 px-2 rounded-lg">
                  ফিল্টার আইডি: {selectedSubTabId}
                </span>
              )}
            </h3>

            {currentFilteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentFilteredBooks.map((book) => {
                  const isBookmarked = bookmarkedList.includes(book.id);
                  return (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedBook(book)}
                      className="bg-white rounded-2xl border border-slate-150 p-4 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase ${theme.pillText} ${theme.pillBg} px-2 py-0.5 rounded-full font-sans`}>
                            {book.category}
                          </span>
                          <button
                            onClick={(e) => handleToggleBookmark(book.id, e)}
                            className={`p-1 hover:bg-slate-50 rounded-full cursor-pointer ${isShibirMode ? 'text-sky-600' : 'text-emerald-600'}`}
                          >
                            <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} className={isBookmarked ? (isShibirMode ? "text-sky-850 text-sky-800" : "text-emerald-800") : "text-slate-300"} />
                          </button>
                        </div>
                        <h4 className={`text-xs font-black text-slate-900 leading-snug ${isShibirMode ? 'group-hover:text-sky-700' : 'group-hover:text-emerald-700'}`}>
                          {book.title}
                        </h4>
                        <p className={`text-[10px] font-semibold ${isShibirMode ? 'text-sky-700' : 'text-emerald-700'}`}>
                          {book.author}
                        </p>
                        <p className="text-[10px] font-sans text-slate-600 leading-relaxed line-clamp-2">
                          {book.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-50 pt-2.5 mt-3 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">
                          {book.isAudio ? "অডিও সংস্করণ" : `${toBengaliNumber(book.pages || '১২০')} পৃষ্ঠা`}
                        </span>
                        <span className={`font-black flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ${isShibirMode ? 'text-sky-800' : 'text-emerald-800'}`}>
                          <span>পড়ুন</span>
                          <ChevronRight size={11} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-8 text-center max-w-md mx-auto space-y-3">
                <Book className="size-10 text-slate-300 mx-auto animate-pulse" />
                <h4 className="text-xs font-black text-slate-900">এই ফিল্টারে নমুনা বই রেন্ডার করা নেই</h4>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  উপরের ফাইল লিংকে ক্লিক করে সরাসরি অফিশিয়াল মূল ওয়েবসাইট থেকে সংশ্লিষ্ট বই বা সিলেবাসটি পড়ে নিন।
                </p>
                <button
                  onClick={handleResetFilters}
                  className={`py-1.5 px-4 ${theme.btnBg} text-white rounded-lg text-[10px] font-black cursor-pointer`}
                >
                  সব ফিল্টার মুছুন
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* DYNAMIC DETAILS DIALOG MODAL */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden"
              id="library-book-modal"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[9px] font-black uppercase ${theme.pillText} ${theme.pillBg} px-2 py-0.5 rounded-full font-sans`}>
                      {selectedBook.category}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug mt-1.5">
                      {selectedBook.title}
                    </h3>
                    <p className={`text-xs ${isShibirMode ? 'text-sky-700' : 'text-emerald-700'} font-bold mt-1`}>
                      লেখক: {selectedBook.author}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="p-1 rounded-full hover:bg-slate-50 text-slate-500 text-xs font-bold font-sans cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50/50 p-3 rounded-xl space-y-1.5">
                  <h4 className="text-[11px] font-black text-slate-800">পুস্তক পরিচিতি বা সংক্ষেপ:</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {selectedBook.description}
                  </p>
                </div>

                <div className="flex justify-between text-xs font-sans border-t pt-3 border-slate-100">
                  <span className="text-slate-500">রেটিং: <span className="font-bold text-slate-900">{selectedBook.rating || '৪.৮'}</span></span>
                  <span className="text-slate-550 text-slate-600 font-mono">{selectedBook.isAudio ? "অডিও সংস্করণ" : `${toBengaliNumber(selectedBook.pages || '১২০')} পৃষ্ঠা`}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      handleToggleBookmark(selectedBook.id, e);
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                      bookmarkedList.includes(selectedBook.id)
                        ? `${theme.pillBg} ${theme.pillText} ${theme.borderLight}`
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    <Bookmark size={12} fill={bookmarkedList.includes(selectedBook.id) ? "currentColor" : "none"} />
                    <span>{bookmarkedList.includes(selectedBook.id) ? "বুকমার্কড" : "বুকমার্ক করুন"}</span>
                  </button>

                  <a
                    href={selectedBook.externalUrl}
                    target="_blank"
                    rel="no_referrer"
                    className={`py-2 px-3 text-xs font-bold ${theme.btnBg} text-white rounded-xl text-center flex items-center justify-center gap-1 ${theme.btnBgHover} transition-colors shadow-xs`}
                  >
                    <span>অনলাইনে পড়ুন</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
