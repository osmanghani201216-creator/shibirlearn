import React, { useState } from 'react';
import { 
  History, 
  ArrowLeft, 
  BookOpen, 
  ArrowUpRight, 
  Compass, 
  FileText, 
  Search, 
  ExternalLink, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  Bookmark, 
  Globe, 
  Award, 
  Users, 
  Milestone,
  Library,
  Feather
} from 'lucide-react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface HistoryTopic {
  id: string;
  title: string;
  subTitle: string;
  wikipediaUrl: string;
  establishedBn: string;
  logoChar: string;
  colorTheme: 'green' | 'blue' | 'amber';
  summaryBn: string;
  keyTimelines: { date: string; event: string }[];
  objectivesBn: string[];
  keyDetails: { label: string; value: string }[];
}

export default function HistoryView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const TOPICS: HistoryTopic[] = [
    {
      id: 'shibir',
      title: 'বাংলাদেশ ইসলামী ছাত্রশিবির',
      subTitle: 'একটি সুশৃঙ্খল ও ঐতিহ্যবাহী ছাত্র সংগঠন',
      wikipediaUrl: 'https://bn.wikipedia.org/wiki/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6_%E0%A6%87%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%80_%E0%A6%9B%E0%A6%BE%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%B6%E0%A6%BF%E0%A6%B0',
      establishedBn: '৬ই ফেব্রুয়ারি ১৯৭৭ইং',
      logoChar: 'চা',
      colorTheme: 'green',
      summaryBn: 'বাংলাদেশ ইসলামী ছাত্রশিবির বাংলাদেশের একটি নেতৃত্বস্থানীয় ইসলামী ছাত্র সংগঠন। সুস্থ ও নৈতিকতাসম্পন্ন ছাত্রসমাজ গঠনে এবং চারিত্রিক সংশোধনের মাধ্যমে সৎ ও যোগ্য নেতৃত্ব বিনির্মাণে এটি কাজ করে। সাধারণ শিক্ষার্থীদের মধ্যে ধর্মীয় অনুশাসন ও জ্ঞানভিত্তিক চেতনার বিকাশ ঘটানো ঐতিহ্যগতভাবে এই সংগঠনের প্রধান অন্যতম মূল লক্ষ্য।',
      keyTimelines: [
        { date: '১৯৭৭ (৬ ফেব্রুয়ারি)', event: 'ঢাকা বিশ্ববিদ্যালয়ের কেন্দ্রীয় জামে মসজিদ থেকে যাত্রা শুরু।' },
        { date: '১৯৭৮-১৯৮০', event: 'সারা দেশের কলেজ ও বিশ্ববিদ্যালয়গুলোতে সাংগঠনিক বিস্তৃতি অর্জন।' },
        { date: 'পরবর্তী দশকসমূহ', event: 'মানবসম্পদ উন্নয়ন, সমাজকল্যাণমূলক কর্মসূচি এবং তরুণদের ক্যারিয়ার ও আইটি দক্ষতা প্রসারে গুরুত্বপূর্ণ প্রকল্প ও উদ্যোগ পরিচালনা।' }
      ],
      objectivesBn: [
        'তরুণ শিক্ষার্থীদের মাঝে ইসলামের শাশ্বত জ্ঞান ও জীবনবিধানের দাওয়াত পৌঁছানো।',
        'লেখাপড়ার পাশাপাশি উন্নত চরিত্র গঠন, আত্মশুদ্ধি অর্জন ও নিয়মানুবর্তিতা সৃষ্টি করা।',
        'সমাজের সকল স্তরে নৈতিক মূল্যবোধ পুনপ্রতিষ্ঠার প্রয়োজনীয় যোগ্য নেতৃত্ব গড়ে তোলা।',
        'দেশ ও জনগণের কল্যাণে আর্তমানবতার সেবা এবং গঠনমূলক কার্যক্রমে অংশগ্রহণ।'
      ],
      keyDetails: [
        { label: 'প্রতিষ্ঠা', value: '৬ ফেব্রুয়ারি ১৯৭৭' },
        { label: 'স্লোগান', value: 'আল্লাহ আমাদের প্রভু, রাসুল আমাদের নেতা' },
        { label: 'মূল কর্মসূচি', value: 'দাওয়াত, সংগঠন, প্রশিক্ষণ, সমাজসেবা' },
        { label: 'প্রধান কার্যালয়', value: 'ঢাকা, বাংলাদেশ' }
      ]
    },
    {
      id: 'jamaat',
      title: 'বাংলাদেশ জামায়াতে ইসলামী',
      subTitle: 'ইসলামী মূল্যবোধ ভিত্তিক একটি রাজনৈতিক দল',
      wikipediaUrl: 'https://bn.wikipedia.org/wiki/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6_%E0%A6%9C%E0%A6%BE%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A4%E0%A7%87_%E0%A6%87%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%80',
      establishedBn: '১৯৪১ইং (উপমহাদেশে)',
      logoChar: 'জা',
      colorTheme: 'blue',
      summaryBn: 'বাংলাদেশ জামায়াতে ইসলামী বাংলাদেশের অন্যতম প্রাচীন ও সুসংগঠিত রাজনৈতিক দল। এটি মূলত ইসলামী সমাজ বিনির্মাণ, নিয়মতান্ত্রিক সমাজ সংস্কার এবং কল্যাণ রাষ্ট্র প্রতিষ্ঠার প্রত্যয় নিয়ে কাজ করে। শিক্ষা, ব্যাংকিং, হাসপাতালসহ বিভিন্ন সামাজিক সেবামূলক প্রকল্প পরিচালনায় এই দলের নেতাকর্মীদের সক্রিয় ভূমিকা অনস্বীকার্য।',
      keyTimelines: [
        { date: '১৯৪১ (২৬ আগস্ট)', event: 'উপমহাদেশে সাইয়্যেদ আবুল আ’লা মওদুদী (র.) এর নেতৃত্বে যাত্রা শুরু।' },
        { date: '১৯৭৯', event: 'স্বাধীন বাংলাদেশে প্রথম সাধারণ নির্বাচনে প্রতিদ্বন্দ্বী শক্তিরূপে আত্মপ্রকাশ।' },
        { date: '১৯৯১ ও ২০০১', event: 'বাংলাদেশ সরকারের অংশ হিসেবে দেশ পরিচালনায় এবং আইনসভায় নিয়মতান্ত্রিক ভূমিকা পালন।' }
      ],
      objectivesBn: [
        'সমাজ ও রাষ্ট্র ব্যবস্থার যাবতীয় পর্যায় থেকে অবিচার দূর করে সুবিচার নিশ্চিত করা।',
        'ইসলামী আদর্শের ভিত্তিতে সৎ, সৎকর্মশীল এবং যোগ্য সৎ নাগরি সমাজ গঠন করা।',
        'অর্থনৈতিক শোষণ ও সুদভিত্তিক ব্যবস্থার বিলুপ্তি ঘটিয়ে ইনসাফভিত্তিক অর্থনৈতিক কাঠামো গড়ন।',
        'শান্তিপূর্ণ গণতান্তিক উপায়ে জনমত গঠন ও নির্বাচনী অংশগ্রহণ।'
      ],
      keyDetails: [
        { label: 'প্রতিষ্ঠা', value: '১৯৪১ (উপমহাদেশীয় প্রেক্ষাপট)' },
        { label: 'লক্ষ্য', value: 'ইক্বামাতে দ্বীন বা আল্লাহর জমিনে খেলাফত প্রতিষ্ঠা' },
        { label: 'কাজ', value: 'সমাজ সংস্কার, রাজনৈতিক নিয়মতান্ত্রিকতা ও পরোপকার' },
        { label: 'প্রচারণা মাধ্যম', value: 'বইপত্র, সাহিত্য ও প্রত্যক্ষ জনসেবা' }
      ]
    },
    {
      id: 'islam_history',
      title: 'ইসলামের ইতিহাস',
      subTitle: 'ঐতিহাসিক খিলাফত ও স্বর্ণালী সভ্যতার ইতিহাস',
      wikipediaUrl: 'https://bn.wikipedia.org/wiki/%E0%A6%87%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%87%E0%A6%A4%E0%A6%BF%E0%A6%B9%E0%A6%BE%E0%A6%B8',
      establishedBn: '৭ম শতাব্দী (৬১০ খ্রিষ্টাব্দ)',
      logoChar: 'ই',
      colorTheme: 'amber',
      summaryBn: 'ইসলামের ইতিহাস ৭ম শতকে মক্কা নগরীতে প্রিয় নবী হযরত মুহাম্মদ (সা.) এর উপর পবিত্র কুরআন নাজিলের মাধ্যমে শুরু হয়। পরবর্তীতে মদিনা সনদের মাধ্যমে প্রথম ইসলামী রাষ্ট্র এবং খোলাফায়ে রাশেদীনের হাত ধরে এটি বৈশ্বিক রূপ লাভ করে। পরবর্তী সময়ে উমাইয়্যা, আব্বাসীয় ও উসমানীয় খিলাফতের মাধ্যমে বিজ্ঞান, জ্যোতির্বিজ্ঞান এবং চিকিৎসাবিজ্ঞানের সোনালী যুগে বিশ্বসভ্যতাকে নেতৃত্ব দিয়েছিল।',
      keyTimelines: [
        { date: '৬১০ খ্রিষ্টাব্দ', event: 'হেরা গুহায় ওহী নাজিলের মাধ্যমে ইসলামের শুভ সূচনা।' },
        { date: '৬২২ খ্রিষ্টাব্দ', event: 'মদিনায় হিজরত ও বিশ্বের প্রথম লিখিত সংবিধান মদিনা সনদ প্রবর্তন।' },
        { date: '৭৫০-১২৫৮ খ্রিষ্টাব্দ', event: 'আব্বাসীয় খিলাফতের বাগদাদ "হাউস অব উইজডম" প্রতিষ্ঠার মাধ্যমে জ্ঞান-বিজ্ঞানের সোনালী যুগ।' }
      ],
      objectivesBn: [
        'তাওহীদের শাশ্বত বাণী সারা বিশ্বে ছড়িয়ে দেওয়া ও ন্যায়পরায়ণতার প্রসার।',
        'বিজ্ঞান, চিকিৎসা, স্থাপত্য ও শিল্পে মুসলিম পণ্ডিতদের অভূতপূর্ব নেতৃত্ব প্রধান।',
        'মানবাধিকার রক্ষা, দাসপ্রথা বিলোপীকরণ এবং শিক্ষার অবাধ বৈশ্বিক সুযোগ সৃষ্টি।',
        'পাশ্চাত্য ও প্রাচ্যের মধ্যবর্তী সংস্কৃতির সেতু তৈরি করে আধুনিক জ্ঞানভিত্তিক যুগ বিনির্মাণ।'
      ],
      keyDetails: [
        { label: 'উৎস কাল', value: '৭ম শতাব্দী' },
        { label: 'প্রধান কেন্দ্র', value: 'মক্কা, মদিনা, বাগদাদ, কর্ডোবা, কুস্তুনতুনিয়া' },
        { label: 'সোনালী অবদান', value: 'বীজগণিত, চিকিৎসাবিজ্ঞান, রসায়ন ও আধুনিক মানচিত্র অঙ্কন' },
        { label: 'মূল দর্শন', value: 'জ্ঞানার্জন প্রত্যেক নর-নারীর ওপর পরম ফরজ দায়িত্ব' }
      ]
    },
    {
      id: 'arafat',
      title: 'মুহাম্মদ ইয়াছিন আরাফাত',
      subTitle: 'সাবেক কেন্দ্রীয় সভাপতি, বাংলাদেশ ইসলামী ছাত্রশিবির ও মনোনীত সংসদ সদস্য প্রার্থী',
      wikipediaUrl: 'https://commons.wikimedia.org/wiki/File:%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%9B%E0%A7%8D%E0%A6%AE%E0%A6%A6_%E0%A6%87%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%9B%E0%A6%BF%E0%A6%A8_%E0%A6%86%E0%A6%B0%E0%A6%AB%E0%A6%BE%E0%A6%A4_%E2%80%93_%E0%A6%B8%E0%A6%BE%E0%A6%AC%E0%A7%87%E0%A6%95_%E0%A6%95%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%A6%E0%A7%8D%E0%A6%B0%E0%A7%80%E0%A6%AF%E0%A6%BC_%E0%A6%B8%E0%A6%AD%E0%A6%BE%E0%A6%AA%E0%A6%A4%E0%A6%BF_%E0%A6%BC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6_%E0%A6%87%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%80_%E0%A6%9B%E0%A6%BE%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%B6%E0%A6%BF%E0%A6%B0.png?uselang=bn',
      establishedBn: '১৯৮৭ইং',
      logoChar: 'আ',
      colorTheme: 'green',
      summaryBn: 'মুহাম্মদ ইয়াছিন আরাফাত বাংলাদেশ ইসলামী ছাত্রশিবিরের সাবেক দুই মেয়াদের কেন্দ্রীয় সভাপতি (২০১৭-২০১৮) এবং বর্তমানে বাংলাদেশ জামায়াতে ইসলামীর একজন বিশিষ্ট তরুণ নেতা ও কুমিল্লা-১০ (নাঙ্গলকোট-লালমাই) সংসদীয় আসনের মনোনীত পদপ্রার্থী। তিনি একজন অত্যন্ত প্রতিভাবান ছাত্রনেতা, শিক্ষাবিদ, প্রগতিশীল চিন্তাবিদ, সমাজসেবক ও বহু গ্রন্থপ্রণেতা লেখক।',
      keyTimelines: [
        { date: '২০১৭-২০১৮', event: 'দুই মেয়াদে বাংলাদেশ ইসলামী ছাত্রশিবিরের কেন্দ্রীয় সভাপতির দায়িত্ব পালন করেন।' },
        { date: '২০১৯ (১১ জানুয়ারি)', event: 'বাংলাদেশ জামায়াতে ইসলামীতে যোগদান এবং ২০১৯ সালের ১১ই এপ্রিল রোকন শপথ গ্রহণ।' },
        { date: '২০২৬', event: 'কুমিল্লা-১০ (নাঙ্গলকোট-লালমাই-লালমাই) সংসদীয় আসনের মনোনয়নপত্র দাখিলপূর্বক মনোনীত প্রার্থী হিসেবে শীর্ষ স্থানীয় নেতৃত্ব।' }
      ],
      objectivesBn: [
        'উন্নত হোক গ্রামীণ জনপদ, সুখ শান্তি সমৃদ্ধি আসুক ঘরে ঘরে।',
        'সৎ, দক্ষ ও দেশপ্রেমিক নাগরিকের সমন্বয়ে একটি ইনসাফভিত্তিক সমৃদ্ধ স্বপ্নের সোনার বাংলাদেশ নির্মাণ।',
        'সন্ত্রাস, চাঁদাবাজি, দখলবাজি, টেন্ডারবাজি, ইভটিজিং ও কিশোর গ্যাংমুক্ত সবুজ সুরক্ষিত কুমিলা বিনির্মাণ।'
      ],
      keyDetails: [
        { label: 'জন্ম তারিখ', value: '২ জানুয়ারি ১৯৮৭ (কুমিল্লা)' },
        { label: 'মূল ভূমিকা', value: 'কুমিল্লা-১০ আসনে জামায়াত প্রার্থী' },
        { label: 'বার্ষিক আয়', value: '৫,২১,৭৮৯ টাকা' },
        { label: 'মোট সম্পদ', value: '৫৯,৮৯,৭৯৯ টাকা' }
      ]
    }
  ];

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const filteredTopics = TOPICS.filter(topic => {
    if (activeTab !== 'all') {
      if (activeTab === 'shibir') {
        return topic.id === 'shibir' || topic.id === 'arafat';
      }
      if (activeTab === 'jamaat') {
        return topic.id === 'jamaat' || topic.id === 'arafat';
      }
      if (topic.id !== activeTab) {
        return false;
      }
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.subTitle.toLowerCase().includes(q) ||
        topic.summaryBn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="history-view-root">
      
      {/* HEADER ROW WITH HOME NAVIGATION */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer shrink-0"
            id="history-back-btn"
            title="হোম পেজে ফিরে যান"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-white p-2.5 rounded-2xl shadow-sm">
              <History size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                ইতিহাস ও ঐতিহ্য লাইব্রেরি
              </h1>
              <p className="text-xs text-emerald-700 font-semibold leading-normal mt-0.5">
                ইসলামের ইতিহাস ও ঐতিহ্যবাহী ইসলামী সংগঠনসমূহের প্রামাণ্য ইতিহাস ও উইকিপিডিয়া রিসোর্স সংকলন 
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 border border-emerald-100/70 p-3 rounded-xl max-w-sm">
          <Compass size={16} className="text-emerald-700 shrink-0" />
          <p className="font-sans font-medium leading-normal">
            সঠিক তথ্যভিত্তিক ইতিহাস পড়ে আমাদের চেতনা ও আগামী দিনের কর্মপন্থা শাণিত করুন।
          </p>
        </div>
      </div>

      {/* QUICK STATS / HIGHLIGHT BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: ইসলামী ছাত্রশিবির */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow cursor-pointer" onClick={() => setActiveTab('shibir')}>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-850 font-black">
            ছাত্র
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">ইসলামী ছাত্রশিবির</h4>
            <p className="text-[10px] text-slate-500 font-sans">প্রতিষ্ঠা: ৬ই ফেব্রুয়ারি ১৯৭৭</p>
          </div>
        </div>

        {/* Card 2: জামায়াতে ইসলামী */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow cursor-pointer" onClick={() => setActiveTab('jamaat')}>
          <div className="p-3 bg-sky-50 rounded-2xl text-sky-800 font-black">
            জামায়াত
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">জামায়াতে ইসলামী</h4>
            <p className="text-[10px] text-slate-500 font-sans">প্রতিষ্ঠা: ২৬ আগস্ট ১৯৪১</p>
          </div>
        </div>

        {/* Card 3: ইসলামের সোনালী ইতিহাস */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow cursor-pointer" onClick={() => setActiveTab('islam_history')}>
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-850 font-black">
            ইতিহাস
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">ইসলামের ইতিহাস</h4>
            <p className="text-[10px] text-slate-500 font-sans">শতাব্দী: ৭ম খ্রিষ্টাব্দ (৬১০ খ্রি.)</p>
          </div>
        </div>

        {/* Card 4: মুহাম্মদ ইয়াছিন আরাফাত */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow cursor-pointer" onClick={() => setActiveTab('arafat')}>
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-800 font-black">
            নেতৃত্ব
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">ইয়াছিন আরাফাত</h4>
            <p className="text-[10px] text-slate-500 font-sans">সাবেক কেন্দ্রীয় সভাপতি</p>
          </div>
        </div>

      </div>

      {/* TABS SELECTOR AND SEARCH ROW */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Dynamic Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-emerald-700 size-4.5" />
            <input
              type="text"
              placeholder={`ইতিহাস ও গুরুত্বপূর্ণ কি-ওয়ার্ড খুজুন...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-emerald-50/10 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl text-xs sm:text-sm text-slate-800 font-sans"
              id="history-search-input"
            />
          </div>

          <div className="flex items-center gap-1.5 font-sans justify-end md:justify-start flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 mr-2">পেজ ফিল্টার:</span>
            <button
              onClick={() => setActiveTab('all')}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-emerald-850 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-600'
              }`}
            >
              সবগুলো একত্রে
            </button>
            <button
              onClick={() => setActiveTab('shibir')}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'shibir' 
                  ? 'bg-emerald-805 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-emerald-50 text-emerald-800'
              }`}
            >
              ছাত্রশিবির
            </button>
            <button
              onClick={() => setActiveTab('jamaat')}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'jamaat' 
                  ? 'bg-sky-800 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-sky-50 text-sky-800'
              }`}
            >
              জামায়াতে ইসলামী
            </button>
            <button
              onClick={() => setActiveTab('islam_history')}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'islam_history' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-amber-50 text-amber-800'
              }`}
            >
              ইসলামের ইতিহাস
            </button>
            <button
              onClick={() => setActiveTab('arafat')}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'arafat' 
                  ? 'bg-teal-700 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-teal-50 text-teal-805'
              }`}
            >
              মুহাম্মদ ইয়াছিন আরাফাত
            </button>
          </div>
        </div>
      </div>

      {/* RENDER LIST OF DETAILED HISTORY PAGES */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-10" id="history-topics-container">
          {filteredTopics.map((topic) => {
            
            if (topic.id === 'arafat') {
              return (
                <div 
                  key={topic.id}
                  className="bg-white border border-teal-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all space-y-6"
                  id={`topic-block-${topic.id}`}
                >
                  {/* HERO BANNER GRADIENT */}
                  <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-900 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      {/* Interactive Avatar Image with custom error loading placeholder fallback */}
                      <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-teal-50 shrink-0">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/e/ec/%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%A6_%E0%A6%87%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%9B%E0%A6%BF%E0%A6%A8_%E0%A6%86%E0%A6%B0%E0%A6%AB%E0%A6%BE%E0%A6%A4_%E2%80%93_%E0%A6%B8%E0%A6%BE%E0%A6%AC%E0%A7%87%E0%A6%95_%E0%A6%95%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%A6%E0%A7%8D%E0%A6%B0%E0%A7%80%E0%A6%AF%E0%A6%BC_%E0%A6%B8%E0%A6%AD%E0%A6%BE%E0%A6%AA%E0%A6%A4%E0%A6%BF_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6_%E0%A6%87%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%80_%E0%A6%9B%E0%A6%BE%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%B6%E0%A6%BF%E0%A6%B0.png"
                          alt="মুহাম্মদ ইয়াছিন আরাফাত"
                          className="h-full w-full object-cover relative z-10"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            // Hide the image if blocked/broken and show the initials
                            (e.currentTarget as HTMLImageElement).style.opacity = '0';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-teal-900 bg-teal-100/90 leading-none select-none z-0">
                          আ
                        </div>
                      </div>
                      <div>
                        <span className="inline-block bg-teal-900/40 text-teal-300 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 border border-teal-500/20">
                          ব্যক্তিত্ব প্রোফাইল ও জীবনী
                        </span>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">{topic.title}</h2>
                        <p className="text-xs text-teal-100 font-medium leading-normal mt-1 max-w-xl">
                          বাংলাদেশ ইসলামী ছাত্রশিবিরের সাবেক দুই মেয়াদের কেন্দ্রীয় সভাপতি ও সংসদীয় আসন কুমিল্লা-১০ এ বাংলাদেশ জামায়াতে ইসলামীর মনোনীত প্রার্থী।
                        </p>
                      </div>
                    </div>

                    {/* Copy Link & Action Buttons */}
                    <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                      <button
                        onClick={() => handleCopyLink(topic.wikipediaUrl)}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-[10px] font-extrabold rounded-xl cursor-pointer transition-all"
                      >
                        {copiedLink === topic.wikipediaUrl ? 'সংযুক্ত লিংক কপিড' : 'বায়োডাটা লিংক কপি'}
                      </button>

                      <a
                        href={topic.wikipediaUrl}
                        target="_blank"
                        rel="no_referrer"
                        className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-[11px] rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5 transition-all border border-emerald-800"
                      >
                        <span>ফটো সুত্র দেখুন</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>

                  {/* MAIN MULTI-DIMENSIONAL CONTAINER */}
                  <div className="p-6 md:p-8 space-y-8">
                    
                    {/* 1. VISUAL CORE VALUE SLOGAN CARD */}
                    <div className="bg-teal-50/40 border border-teal-100/50 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="flex items-start gap-3">
                        <Feather className="text-teal-700 shrink-0 mt-1 size-5" />
                        <div>
                          <p className="text-xs text-teal-800 font-black tracking-wider uppercase">মূল স্লোগান ও চেতনা</p>
                          <p className="text-sm md:text-base text-teal-950 font-black font-sans leading-relaxed mt-1">
                            "উন্নত হোক গ্রামীণ জনপদ, সুখ শান্তি সমৃদ্ধি আসুক ঘরে ঘরে"
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-teal-200/50 pt-4 sm:pt-0 sm:pl-6 shrink-0">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">জরিপ ও বয়স ২০২৬</span>
                          <span className="text-sm font-black text-slate-800 font-sans">৩৮ বছর (জন্ম '৮৭)</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">পেশাগত পরিচিতি</span>
                          <span className="text-sm font-black text-teal-800 font-sans">ব্যবসা</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. THE GRID BENTO REGION */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* CARD BENTO 1: পারিবারিক পরিচিতি */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-130 transition-all flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                            <User size={13} className="text-teal-700" />
                            জন্ম ও পারিবারিক পরিচিতি
                          </h3>
                          <div className="space-y-3.5 text-xs font-sans">
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-500 font-medium">পূর্ণ জন্ম তারিখ:</span>
                              <span className="text-slate-950 font-extrabold text-right">২ জানুয়ারি ১৯৮৭ ইংরেজি</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-500 font-medium">জন্ম লগ্নস্থান:</span>
                              <span className="text-slate-950 font-extrabold text-right">রায়কোট দক্ষিণ ইউনিয়ন, নাঙ্গলকোট, কুমিল্লা</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-500 font-medium">ভৌগোলিক অববাহিকা:</span>
                              <span className="text-slate-800 font-medium text-right">ডাকাতিয়া নদীর অববাহিকায় পূর্ব বামপাড়া গ্রাম</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-500 font-medium">পিতার মহামূল্য নাম:</span>
                              <span className="text-slate-950 font-extrabold text-right">আলহাজ্জ ডাঃ আবদুস সোবহান</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-800 text-[10px]">পিতার পেশা:</span>
                              <span className="text-slate-650 font-medium text-right">পল্লী চিকিৎসক ও প্রথিতযশা ব্যবসায়ী</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-500 font-medium">মাতার মহামূল্য নাম:</span>
                              <span className="text-slate-950 font-extrabold text-right">আলহাজ্জ রওশন আরা বেগম (গৃহিণী)</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/30 text-[11px] text-emerald-900 mt-4 flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                          <p className="font-medium leading-tight">৪ ভাই ও ৩ বোনের বিশাল সুখময় পরিবারের মধ্যে তিনি ষষ্ঠ এবং ভাইদের মধ্যে সর্বকনিষ্ঠ।</p>
                        </div>
                      </div>

                      {/* CARD BENTO 2: সংগ্রামী জীবন ও আইনি ট্র্যাকার (METRICS CARD) */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-100 pb-3 mb-4">
                            <Clock size={13} className="text-rose-700" />
                            কঠিন রাজনৈতিক সংগ্রাম, মামলা ও আত্মত্যাগ
                          </h3>
                          <p className="text-[11px] text-slate-600 leading-relaxed mb-4 font-sans">
                            ছাত্রশিবিরের কেন্দ্রীয় সভাপতির গুরুদায়িত্ব পালনের কারণে শাসকদলের রোষানলে পড়ে বহু হয়রানি ও মিথ্যা মামলার মুখোমুখি হয়েছেন।
                          </p>

                          {/* Stat Grid counters */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white border border-slate-205 p-3 rounded-xl text-center shadow-xs">
                              <p className="text-[10px] text-slate-500 font-black">মোট মামলা</p>
                              <p className="text-xl font-black text-rose-700 mt-1">৪৪টি</p>
                            </div>
                            <div className="bg-white border border-slate-205 p-3 rounded-xl text-center shadow-xs">
                              <p className="text-[10px] text-slate-500 font-black">চলমান মামলা</p>
                              <p className="text-xl font-black text-emerald-700 mt-1">০টি</p>
                            </div>
                            <div className="bg-white border border-slate-205 p-3 rounded-xl text-center shadow-xs">
                              <p className="text-[10px] text-slate-500 font-black">খালাস ও নিষ্পত্তি</p>
                              <p className="text-xs font-black text-slate-800 mt-1">পূর্ণ খালাস</p>
                            </div>
                            <div className="bg-white border border-slate-205 p-3 rounded-xl text-center shadow-xs">
                              <p className="text-[10px] text-slate-500 font-black">নির্মম রিমান্ড</p>
                              <p className="text-sm font-black text-rose-600 mt-1">১৭ দিন</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-rose-50/50 border border-rose-100/60 p-3.5 rounded-xl text-[11px] text-rose-950 font-sans leading-relaxed space-y-1.5">
                          <p className="font-extrabold flex items-center gap-1 text-rose-900">
                            <span>● ৩ বার কারাবরণ ও ২+ বছর বন্দীত্ব</span>
                          </p>
                          <p className="font-medium text-slate-700">
                            ২০২৪ সালে রংপুরে দ্রুত বিচার আইনে দীর্ঘ ১১ বছর ট্রায়াল শেষে আদালত কর্তৃক নির্দোষ প্রমাণিত হয়ে বেকসুর খালাস পেয়েছেন।
                          </p>
                        </div>
                      </div>

                      {/* CARD BENTO 3: শিক্ষাজীবন ও ডিগ্রিসমূহ */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-130 transition-all lg:col-span-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                          <BookOpen size={13} className="text-teal-700" />
                          শিক্ষা প্রতিষ্ঠান ও অর্জিত শিক্ষাগত যোগ্যতা
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3 font-sans text-xs">
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-100">
                              <div>
                                <p className="font-bold text-[11px]">প্রাথমিক শিক্ষা</p>
                                <p className="text-[10px] text-slate-500">বেলটা সরকারি প্রাথমিক বিদ্যালয় (৪র্থ শ্রেণি)</p>
                              </div>
                              <span className="bg-slate-200/50 text-slate-700 text-[9px] font-black px-1.5 py-0.5 rounded">সমাপ্ত</span>
                            </div>
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-100">
                              <div>
                                <p className="font-bold text-[11px]">দাখিল মাদরাসা শিক্ষা</p>
                                <p className="text-[10px] text-slate-500">পূর্ব বামপাড়া মাদানীয়া দাখিল মাদরাসা (৪র্থ শ্রেণি মক্তব)</p>
                              </div>
                              <span className="bg-slate-200/50 text-slate-700 text-[9px] font-black px-1.5 py-0.5 rounded">মক্তব</span>
                            </div>
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-100">
                              <div>
                                <p className="font-bold text-[11px]">মাদরাসা শিক্ষা</p>
                                <p className="text-[10px] text-slate-500">মনতলী রহমানিয়া সিনিয়র ফাযিল মাদরাসা (৪র্থ-৮ম শ্রেণি)</p>
                              </div>
                              <span className="bg-slate-200/50 text-slate-700 text-[9px] font-black px-1.5 py-0.5 rounded">২য় স্তর</span>
                            </div>
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-100">
                              <div>
                                <p className="font-bold text-[11px]">দাখিল ও আলিম ডিগ্রী (২০০১, ২০০৩)</p>
                                <p className="text-[10px] text-slate-500">আল জামেয়াতুল ফালাহিয়া কামিল মাদরাসা, ফেনী</p>
                              </div>
                              <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">কৃতিত্ব</span>
                            </div>
                          </div>

                          <div className="space-y-3 font-sans text-xs">
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-100">
                              <div>
                                <p className="font-bold text-[11px]">ফাজিল ও কামিল ডিগ্রী (২০০৫, ২০০৭ - হাদীস)</p>
                                <p className="text-[10px] text-slate-500">সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা</p>
                              </div>
                              <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">১ম শ্রেণী</span>
                            </div>
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-100">
                              <div>
                                <p className="font-bold text-[11px]">অনার্স ও মাস্টার্স (২০০৪-২০০৫ সেশন)</p>
                                <p className="text-[10px] text-slate-500">ঢাকা বিশ্ববিদ্যালয় (আরবী সাহিত্য বিভাগ)</p>
                              </div>
                              <span className="bg-teal-50 text-teal-800 text-[9px] font-black px-1.5 py-0.5 rounded">ঢাবি গ্রাজুয়েট</span>
                            </div>
                            <div className="bg-slate-50/40 p-2.5 rounded-lg flex items-center justify-between border border-slate-105">
                              <div>
                                <p className="font-bold text-[11px]">এমফিল (M.Phil - ২০১৬-২০১৭)</p>
                                <p className="text-[10px] text-slate-500">ইসলামী বিশ্ববিদ্যালয় (কুষ্টিয়া)</p>
                              </div>
                              <span className="bg-emerald-100 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded font-sans">ডিগ্রী অর্জন</span>
                            </div>
                            <div className="bg-teal-50/50 p-2.5 rounded-lg flex items-center justify-between border border-teal-100">
                              <div>
                                <p className="font-bold text-teal-900 text-[11px]">পিএইচডি (Ph.D)</p>
                                <p className="text-[10px] text-teal-750">বর্তমানে পিএইচডি গবেষণার সার্বিক প্রস্তুতি নিচ্ছেন।</p>
                              </div>
                              <span className="bg-teal-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded">চলমান</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD BENTO 4: সাংগঠনিক ও রাজনৈতিক পথচলা */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-130 transition-all flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                            <Users size={13} className="text-teal-700" />
                            সাংগঠনিক ও রাজনৈতিক পথচলা
                          </h3>
                          <div className="relative pl-5 border-l border-emerald-100 space-y-4 font-sans text-xs">
                            <div className="relative">
                              <span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-emerald-600" />
                              <p className="font-black text-emerald-850">২০১৭ - ২০১৮</p>
                              <p className="text-slate-750 font-bold leading-normal text-[11px] mt-0.5">বাংলাদেশ ইসলামী ছাত্রশিবিরের কেন্দ্রীয় সভাপতি</p>
                              <p className="text-[10px] text-slate-500">দুই মেয়াদে সততা ও দক্ষতার সাথে ছাত্রশিবির সামলান।</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-slate-500" />
                              <p className="font-black text-slate-800">১১ জানুয়ারি ২০১৯</p>
                              <p className="text-slate-750 font-bold leading-normal text-[11px] mt-0.5">বাংলাদেশ জামায়াতে ইসলামীতে যোগদান</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-slate-500" />
                              <p className="font-black text-slate-800">১১ এপ্রিল ২০১৯</p>
                              <p className="text-slate-750 font-bold leading-normal text-[11px] mt-0.5">জামায়াতে ইসলামীর রোকন শপথ গ্রহণ</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl mt-5 space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">বর্তমানে দায়িত্বসমূহ:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                            <div className="bg-white p-2 border border-slate-100 rounded-md">
                              <p className="font-bold text-slate-500">প্রধান সেবামূলক শাখা</p>
                              <p className="font-extrabold text-slate-900 mt-0.5">উত্তর বসুন্ধরা থানা সেক্রেটারি</p>
                            </div>
                            <div className="bg-white p-2 border border-slate-100 rounded-md">
                              <p className="font-bold text-slate-500">অন্যান্য গুরুদায়িত্ব</p>
                              <p className="font-extrabold text-slate-900 mt-0.5">গুলশান থামা আমীর ও মহানগর উত্তর কর্মপরিষদ সদস্য</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-emerald-900 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/30 text-center font-bold">
                            ২০২০ সালে বাংলাদেশ জামায়াতে ইসলামীর ৪ষ্ঠ ব্যক্তি হিসেবে কেন্দ্রীয় মজলিসে শূরা সদস্য নির্বাচিত হন।
                          </p>
                        </div>
                      </div>

                      {/* CARD BENTO 5: নির্বাচনী অবস্থান - কুমিল্লা ১০ */}
                      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-green-950 text-white rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="bg-emerald-500/35 text-emerald-300 font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded border border-emerald-400/20">
                            জাতীয় নির্বাচন ২০২৬
                          </span>
                          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3 mt-3 mb-4">
                            <Compass size={13} className="text-emerald-400" />
                            নির্বাচনী অবস্থান - কুমিল্লা-১০
                          </h3>
                          
                          <div className="space-y-3.5 text-xs font-sans">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-emerald-250">সংসদীয় আসন বিভাগ / এলাকা:</span>
                              <span className="font-extrabold text-white text-right">কুমিল্লা-১০ (নাঙ্গলকোট-লালমাই-সদর দক্ষিণ)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-emerald-250">মনোনয়নপত্র জমাদান:</span>
                              <span className="font-extrabold text-white text-right">২৯ ডিসেম্বর ২০২৫</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-emerald-250">মনোনীত রাজনৈতিক দল:</span>
                              <span className="font-extrabold text-white text-right flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                                বাংলাদেশ জামায়াতে ইসলামী
                              </span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-emerald-250 shrink-0">প্রতিদ্বন্দ্বীর পরিস্থিতি:</span>
                              <span className="font-extrabold text-red-200 text-right text-[11px] leading-tight">
                                বিএনপি প্রার্থী আব্দুল গফুর ভূঁইয়ার মনোনয়নপত্র বাতিল হওয়ায় জামায়াত প্রার্থীর সম্ভাবনা তুঙ্গে।
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 border border-white/15 p-3.5 rounded-xl text-[11px] text-teal-100 font-sans mt-5">
                          <p className="font-black text-emerald-300">★ অত্যন্ত জনপ্রিয় যুবসমাজ প্রিয় নেতা:</p>
                          <p className="leading-relaxed mt-1 font-medium text-slate-200">
                            তরুণ প্রজন্মের মাঝে এবং অববাহিত এলাকায় তাঁর সততা, এমফিল ডিগ্রিধারী পাণ্ডিত্য ও সাংগঠনিক দক্ষতার কারণে তিনি বিপুল সাড়াশব্দ সমাদৃত হয়েছেন।
                          </p>
                        </div>
                      </div>

                      {/* CARD BENTO 6: সাহিত্যকর্ম ও প্রকাশনা (PROUD FEATHER CARD) */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-130 transition-all flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                            <Feather size={13} className="text-teal-700" />
                            গবেষণা, সাহিত্যকর্ম ও প্রকাশনা সমূহ
                          </h3>
                          <div className="space-y-4 font-sans text-xs">
                            <div className="p-3 bg-teal-50/30 rounded-xl border border-teal-100/50">
                              <p className="font-black text-teal-900 leading-none">প্রথম কবিতা প্রকাশনা:</p>
                              <p className="text-[11px] text-slate-700 font-medium leading-relaxed mt-1.5">
                                ২০০৩ সালে প্রখ্যাত 'মাসিক কিশোর পত্র' ম্যাগাজিনে তাঁর প্রথম কবিতা প্রকাশিত হওয়ার মধ্য দিয়ে সাহিত্য অঙ্গনে পদার্পণ।
                              </p>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">প্রকাশিত জনপ্রিয় বইসমূহ:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="p-2.5 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-2 items-start">
                                  <span className="h-5 w-5 bg-teal-900 text-white rounded-full flex items-center justify-center font-bold font-mono text-[10px]">১</span>
                                  <div>
                                    <p className="font-black text-slate-900 text-[11px]">"জীবন বদলে যাবে"</p>
                                    <p className="text-[9px] text-slate-500">প্রেরণামূলক রচনাগ্রন্থ</p>
                                  </div>
                                </div>
                                <div className="p-2.5 border border-slate-100 rounded-lg bg-slate-50/50 flex gap-2 items-start">
                                  <span className="h-5 w-5 bg-teal-900 text-white rounded-full flex items-center justify-center font-bold font-mono text-[10px]">২</span>
                                  <div>
                                    <p className="font-black text-slate-900 text-[11px]">"শিকল পরা হাতের পরশ"</p>
                                    <p className="text-[9px] text-slate-500">কারাগারের স্মৃতিচারণ গ্রন্থ</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-500 leading-normal font-sans">
                          <span className="font-bold text-slate-700">প্রকাশিত প্রখ্যাত পত্রিকাসমূহ:</span> নয়াদিগন্ত, যুগান্তর, সংগ্রাম, যায়যায়দিন, ইনকিলাব, সাপ্তাহিক সোনার বাংলা এবং 'মাসিক রেনেসাঁ'।
                        </div>
                      </div>

                      {/* CARD BENTO 7: অন্যান্য সামাজিক দায়িত্ব ও যুব সংগঠন */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-teal-130 transition-all flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                            <Library size={13} className="text-teal-700" />
                            অন্যান্য সামাজিক ও কল্যাণমূলক সংগঠন
                          </h3>
                          <div className="space-y-2.5 text-xs font-sans">
                            <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                              <span className="text-emerald-700 shrink-0">✔</span>
                              <div>
                                <p className="font-black text-slate-800">বাংলাদেশ মাদরাসা ছাত্র আন্দোলন পরিষদ</p>
                                <p className="text-[10px] text-slate-500">২০০৮ সালের প্রথিতযশা আহবায়ক হিসেবে নেতৃত্ব প্রদান।</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                              <span className="text-emerald-700 shrink-0">✔</span>
                              <div>
                                <p className="font-black text-slate-800">বাংলাদেশ যুবকল্যাণ পরিষদ</p>
                                <p className="text-[10px] text-slate-500">প্রশাসনিক সাধারণ সম্পাদক হিসেবে যুবকদের কর্মমুখী দক্ষতা উন্নয়ন ও সেবা দান।</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                              <span className="text-emerald-700 shrink-0">✔</span>
                              <div>
                                <p className="font-black text-slate-800">South Asian Youth Society (SAYS)</p>
                                <p className="text-[10px] text-slate-500">Chief Advisor (প্রধান উপদেষ্টা) হিসেবে আন্তর্জাতিক যুবা প্রকল্পে পরামর্শ দান।</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 border-b border-slate-50 pb-2">
                              <span className="text-emerald-700 shrink-0">✔</span>
                              <div>
                                <p className="font-black text-slate-800">নাঙ্গলকোট, সদর দক্ষিণ, লালমাই উন্নয়ন পরিষদ</p>
                                <p className="text-[10px] text-slate-550">চেয়ারম্যান (এলাকার সার্বিক অবকাঠামোগত ও শিক্ষা উন্নয়ন উন্নয়ন বোর্ড)</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 bg-teal-50/30 p-2.5 rounded-lg border border-teal-100/50 text-[10px] text-slate-650 leading-relaxed font-sans font-medium">
                          <span className="font-bold text-teal-900 block mb-0.5">অন্যান্য উপদেষ্টা দায়িত্ব:</span>
                          নাঙ্গলকোট ছাত্র ফোরাম ঢাকা (প্রধান উপদেষ্টা), চট্টগ্রামস্থ নাঙ্গলকোট ছাত্র ফোরাম (প্রধান উপদেষ্টা), এবং ঢাকাস্থ নাঙ্গলকোট ফোরামের অন্যতম প্রধান উপদেষ্টা।
                        </div>
                      </div>

                    </div>

                    {/* 3. FINAL VISION STATEMENT WALLQUOTE WITH ASSET SUMMARY */}
                    <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl space-y-4">
                      <div className="flex items-start gap-3.5">
                        <Feather size={20} className="text-teal-700 shrink-0 mt-1" />
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">ভিশন ও আগামীর বাংলাদেশ বিনির্মাণে বিশ্বাস</p>
                          <p className="text-xs md:text-sm text-slate-700 font-medium italic leading-relaxed mt-2 font-sans">
                            "সন্ত্রাস, চাঁদাবাজি, দখলবাজি, টেন্ডারবাজি, ইভটিজিং ও কিশোর গ্যাংয়ের বিপক্ষে দেশ প্রেমিক জনতা সৎ ও দক্ষ নেতৃত্বের মাধ্যমে আগামীর বাংলাদেশ বিনির্মাণে আমাদের দাঁড়িপাল্লার প্রতিককে বিপুল ভোটে বিজয়ী করবে এবং উন্নত, সৎ ও দক্ষ নেতৃত্ব উপহার দিবে।"
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/80 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                        <div className="bg-white p-3 border border-slate-200 rounded-xl text-center">
                          <span className="text-slate-500 block text-[10px] font-bold">বার্ষিক নির্বাচনী আয়</span>
                          <span className="text-sm font-extrabold text-slate-900 block mt-1">৫,২১,৭৮৯ টাকা</span>
                        </div>
                        <div className="bg-white p-3 border border-slate-200 rounded-xl text-center">
                          <span className="text-slate-500 block text-[10px] font-bold">মোট নির্বাচনী ঘোষিত সম্পদ</span>
                          <span className="text-sm font-extrabold text-[#115e59] block mt-1">৫৯,৮৯,৭৯৯ টাকা</span>
                        </div>
                        <div className="bg-white p-3 border border-slate-200 rounded-xl text-center">
                          <span className="text-slate-500 block text-[10px] font-bold">মেধাগত যোগ্যতা</span>
                          <span className="text-sm font-extrabold text-slate-900 block mt-1">এমফিল গবেষক</span>
                        </div>
                        <div className="bg-white p-3 border border-slate-250 rounded-xl text-center">
                          <span className="text-slate-500 block text-[10px] font-bold">সংসদীয় আসন অবস্থান</span>
                          <span className="text-sm font-extrabold text-emerald-850 block mt-1">কুমিল্লা-১০ (জামায়াত)</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            }

            // Layout theme configurations
            let borderClass = 'border-emerald-100';
            let headerBg = 'from-emerald-800 to-teal-900 text-white';
            let iconText = 'bg-white text-emerald-900';
            let timelineDot = 'bg-emerald-600 ring-emerald-100';

            if (topic.colorTheme === 'blue') {
              borderClass = 'border-sky-100';
              headerBg = 'from-sky-700 to-indigo-900 text-white';
              iconText = 'bg-white text-sky-900';
              timelineDot = 'bg-sky-650 bg-sky-600 ring-sky-150';
            } else if (topic.colorTheme === 'amber') {
              borderClass = 'border-amber-100';
              headerBg = 'from-amber-600 to-yellow-800 text-white';
              iconText = 'bg-white text-amber-900';
              timelineDot = 'bg-amber-600 ring-amber-100';
            }

            return (
              <div 
                key={topic.id}
                className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all ${borderClass}`}
                id={`topic-block-${topic.id}`}
              >
                {/* 1. TOP HERO REGION OF EACH TOPIC */}
                <div className={`bg-gradient-to-r ${headerBg} p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl text-center shadow-lg uppercase leading-none ${iconText}`}>
                      {topic.logoChar}
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-black tracking-tight">{topic.title}</h2>
                      <p className="text-xs text-white/90 font-medium leading-none mt-1">{topic.subTitle}</p>
                    </div>
                  </div>

                  {/* Dynamic Copy & External Wikipedia redirect tool bar */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyLink(topic.wikipediaUrl)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                    >
                      {copiedLink === topic.wikipediaUrl ? 'পপআপ কপি হয়েছে' : 'উইকিপিডিয়া লিংক কপি'}
                    </button>

                    <a
                      href={topic.wikipediaUrl}
                      target="_blank"
                      rel="no_referrer"
                      className="px-3.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-[11px] rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                    >
                      <span>উইকিপিডিয়া পড়ুন</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>

                {/* 2. BODY REGION (GRID FORMAT) */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Side (2 Columns): Detail text descriptions, Timelines & Objective lists */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Summary Paragraph */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FileText size={13} />
                        সংক্ষিপ্ত বিবরণ ও পরিচিতি
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
                        {topic.summaryBn}
                      </p>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Basic Mission Objectives */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Award size={13} />
                        মূল আদর্শ, লক্ষ্য ও স্লোগানসমূহ
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topic.objectivesBn.map((obj, i) => (
                          <div key={i} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2.5 transition-colors">
                            <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-600 font-sans font-medium leading-relaxed">{obj}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Historical Timeline Points */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Milestone size={13} />
                        ইতিহাসের উল্লেখযোগ্য গুরুত্বপূর্ণ সাল ও ঘটনাপুঞ্জী
                      </h3>
                      <div className="relative pl-6 border-l-2 border-slate-100 space-y-5">
                        {topic.keyTimelines.map((time, idx) => (
                          <div key={idx} className="relative group">
                            {/* Bullet outer ring */}
                            <span className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full ring-4 transition-all ${timelineDot}`} />
                            
                            <div>
                              <span className="inline-block text-[10px] font-black text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded-md font-sans">
                                {time.date}
                              </span>
                              <p className="text-xs text-slate-700 font-sans font-medium leading-relaxed mt-1">
                                {time.event}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Side (1 Column): Core Meta Box Information Panel */}
                  <div className="space-y-4">
                    
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2.5">
                        <Library size={13} className="text-slate-500" />
                        একনজরে গুরুত্বপূর্ণ তথ্য
                      </h4>

                      <div className="divide-y divide-slate-150 text-[11px] font-sans">
                        {topic.keyDetails.map((det, i) => (
                          <div key={i} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                            <span className="text-slate-500 font-bold">{det.label}</span>
                            <span className="text-slate-900 font-extrabold text-right">{det.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decorative quote/motivational reminder box */}
                    <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl">
                      <div className="flex gap-2">
                        <Feather size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-emerald-950 font-sans font-medium italic leading-relaxed">
                          আমাদের অতীত ইতিহাস নতুন প্রজন্মের নিকট যথাযথভাবে তুলে ধরে দেশপ্রেম এবং ত্যাগের মহিমা পুনরুজ্জীবিত করা সম্ভব। ৫ ওয়াক্ত নামাজ এবং দ্বীনি জ্ঞানার্জন হোক আমাদের প্রাত্যহিক মূল চালিকাশক্তি।
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200/70 p-12 text-center rounded-3xl" id="history-not-found">
          <BookOpen className="size-10 text-emerald-800/40 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800">কোনো তথ্য বা ক্যাটাগরি মিলছে না!</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">অনুগ্রহ করে ভিন্ন কোনো কি-ওয়ার্ড দিয়ে পুনশ্চ অনুসন্ধান করুন।</p>
        </div>
      )}

      {/* FINAL EXTRA EDUCATIONAL FOOTER NOTES */}
      <div className="mt-8 bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl space-y-2">
        <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 tracking-wider uppercase">
          <Globe size={13} className="text-emerald-700" />
          উইকিপিডিয়া ও রেফারেন্স গাইডলাইন
        </h4>
        <p className="text-[11px] text-emerald-900/80 leading-relaxed font-sans">
          এখানে উপস্থাপিত সকল তথ্য ও বিবরণ বিশ্বকোষ উইকিপিডিয়া (Wikipedia) এর অফিশিয়াল বাংলা সংস্করণের রেফারেন্সের সূত্র ধরে প্রস্তুত করা হয়েছে। যেকোনো তথ্যের আরও বিস্তারিত প্রামাণিক সংস্করণ ও গভীর ঐতিহাসিক তথ্য বিশ্লেষণ পেতে সরাসরি উইকিপিডিয়া পোর্টালে যুক্ত হতে উপরে প্রদত্ত নীল ‘উইকিপিডিয়া পড়ুন’ বাটনটি ক্লিক করুন।
        </p>
      </div>

    </div>
  );
}
