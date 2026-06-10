import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Coins, 
  HelpCircle, 
  Check, 
  Info, 
  Calculator, 
  FileText, 
  Scale, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface ZakatInputs {
  goldVori: number;
  goldPricePerVori: number;
  silverVori: number;
  silverPricePerVori: number;
  cashInHand: number;
  cashInBank: number;
  businessGoods: number;
  otherInvestments: number;
  debtsToPay: number;
}

const DEFAULT_INPUTS: ZakatInputs = {
  goldVori: 0,
  goldPricePerVori: 115000, // Predefined approx price per bhori/vori in BDT (2025/2026 average)
  silverVori: 0,
  silverPricePerVori: 1800,  // Predefined approx price per bhori/vori in BDT
  cashInHand: 0,
  cashInBank: 0,
  businessGoods: 0,
  otherInvestments: 0,
  debtsToPay: 0,
};

// Nisab thresholds: 
// Gold: 7.5 Tolas/Vori
// Silver: 52.5 Tolas/Vori
const NISAB_GOLD_VORI = 7.5;
const NISAB_SILVER_VORI = 52.5;

interface FaqItem {
  q: string;
  a: string;
}

const ZAKAT_FAQS: FaqItem[] = [
  {
    q: "জাকাত কার উপর ফরজ বা বাধ্যতামূলক?",
    a: "প্রত্যেক প্রাপ্তবয়স্ক, সুস্থ মস্তিস্কসম্পন্ন মুসলিম নর-নারী যিনি নেসাব পরিমাণ (সোনাই বা রূপা পরিমাণের সমতুল্য নগদ বা সম্পদ) মালের মালিক এবং তা এক বছর মেয়াদে অতিবাহিত হয়েছে, তার উপর জাকাত ফরজ।"
  },
  {
    q: "নেসাব বা সর্বনিম্ন সম্পদের সীমা কতটুকু?",
    a: "ইসলামি শরিয়তের নিয়ম অনুযায়ী, সোনা হলে ৭.৫ ভরি (প্রায় ৮৭.৪৮ গ্রাম) এবং রূপা হলে ৫২.৫ ভরি (প্রায় ৬১২.৩৬ গ্রাম)। নগদ টাকা, ব্যবসার মালামাল বা অন্যান্য সঞ্চিত সম্পদের ক্ষেত্রে সাধারণত রূপার নেসাব (৫২.৫ ভরির বাজারমূল্য) অনুযায়ী জাকাত ফরজ হওয়ার সর্বনিম্ন সীমা হিসাব করা হয়, যাতে গরিব বা অভাবী মানুষ বেশি উপকৃত হতে পারে।"
  },
  {
    q: "কত শতাংশ জাকাত হিসেব করে দেয়া লাগে?",
    a: "জাকাতযোগ্য মোট উদ্বৃত্ত সম্পদের ২.৫% বা ৪০ ভাগের ১ ভাগ অংশ আল্লাহ-নির্ধারিত খাতসমূহে দরিদ্রদের মাঝে বিতরণ করা ফরজ বা বাধ্যতামূলক।"
  },
  {
    q: "কোন কোন সম্পদের উপর জাকাত দিতে হয় না?",
    a: "ব্যবহার্য বাড়ি, ব্যক্তিগত ব্যবহারের গাড়ি, নিত্যপ্রয়োজনীয় ঘরের আসবাবপত্র, পরিধেয় সাধারণ পোশাক এবং কৃষি বা কলকারখানার স্থায়ী যন্ত্রপাতি বা উৎপাদন উপকরণের ওপর কোনো জাকাত নেই।"
  },
  {
    q: "ঋণগ্রস্ত ব্যক্তিদের ক্ষেত্রে জাকাত কীভাবে হিসাব করা হয়?",
    a: "যে পরিমাণ ঋণ অবিলম্বে আদায় করতে হবে (যা স্থগিত করার সুযোগ নেই বা তাৎক্ষণিক প্রদেয়), তা আপনার মোট জাকাতযোগ্য সম্পদ থেকে বাদ দিয়ে নেট অবশিষ্ট মূল্য যদি নেছাব পরিমাণ হয়, তবেই তাকে জাকাত দিতে হবে।"
  }
];

interface ZakatCalculatorViewProps {
  onBack: () => void;
}

export default function ZakatCalculatorView({ onBack }: ZakatCalculatorViewProps) {
  const [inputs, setInputs] = useState<ZakatInputs>(DEFAULT_INPUTS);
  const [nisabStandard, setNisabStandard] = useState<'silver' | 'gold'>('silver'); 
  const [customGoldPrice, setCustomGoldPrice] = useState(false);
  const [customSilverPrice, setCustomSilverPrice] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form input changer helper
  const updateInput = (key: keyof ZakatInputs, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [key]: isNaN(numericValue) ? 0 : numericValue
    }));
  };

  // Calculations
  const goldValue = inputs.goldVori * inputs.goldPricePerVori;
  const silverValue = inputs.silverVori * inputs.silverPricePerVori;
  const cashValue = inputs.cashInHand + inputs.cashInBank;
  const otherAssets = inputs.businessGoods + inputs.otherInvestments;
  
  const totalAssets = goldValue + silverValue + cashValue + otherAssets;
  const netWealth = Math.max(0, totalAssets - inputs.debtsToPay);

  // Nisab threshold values in BDT
  const nisabGoldLimitBDT = NISAB_GOLD_VORI * inputs.goldPricePerVori;
  const nisabSilverLimitBDT = NISAB_SILVER_VORI * inputs.silverPricePerVori;
  
  const selectedNisabLimitBDT = nisabStandard === 'gold' ? nisabGoldLimitBDT : nisabSilverLimitBDT;
  const isEligibleForZakat = netWealth >= selectedNisabLimitBDT;
  
  const calculatedZakat = isEligibleForZakat ? Math.round(netWealth * 0.025) : 0;

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setNisabStandard('silver');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="zakat-calculator-root">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-emerald-50 pb-5">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer transition-colors"
          id="btn-zakat-back"
        >
          <ArrowLeft size={18} />
          <span>অনলাইন ড্যাশবোর্ড</span>
        </button>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <Coins size={16} className="text-emerald-700 shrink-0" />
          <span>ইসলামের পঞ্চস্তম্ভ: জাকাত ক্যালকুলেটর</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="zakat-parent-grid">
        
        {/* Left Side: Inputs Form (Column span 7) */}
        <div className="lg:col-span-7 space-y-6" id="zakat-inputs-column">
          
          {/* Card 1: Gold & Silver Standards */}
          <div className="bg-white border border-emerald-100 p-5 rounded-3xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <Scale size={16} className="text-emerald-700" />
              ১. স্বর্ণ ও রৌপ্য মান নির্ধারণ (Gold & Silver BDT Rates)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gold Rate Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600">স্বর্ণের প্রতি ভরি মূল্য (BDT):</label>
                  <button 
                    onClick={() => setCustomGoldPrice(!customGoldPrice)}
                    className="text-[9px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {customGoldPrice ? "ডিফল্ট ব্যবহার" : "পরিবর্তন করুন"}
                  </button>
                </div>
                <input
                  type="number"
                  disabled={!customGoldPrice}
                  value={inputs.goldPricePerVori}
                  onChange={(e) => updateInput('goldPricePerVori', e.target.value)}
                  className={`w-full text-xs font-semibold border ${customGoldPrice ? 'border-emerald-200 focus:ring-emerald-600 bg-white' : 'border-slate-100 bg-slate-50 text-slate-500'} rounded-xl px-3 py-2 focus:outline-none`}
                  placeholder="স্বর্ণ দর প্রতি ভরি"
                  id="input-gold-price"
                />
              </div>

              {/* Silver Rate Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600">রৌপ্যের প্রতি ভরি মূল্য (BDT):</label>
                  <button 
                    onClick={() => setCustomSilverPrice(!customSilverPrice)}
                    className="text-[9px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {customSilverPrice ? "ডিফল্ট ব্যবহার" : "পরিবর্তন করুন"}
                  </button>
                </div>
                <input
                  type="number"
                  disabled={!customSilverPrice}
                  value={inputs.silverPricePerVori}
                  onChange={(e) => updateInput('silverPricePerVori', e.target.value)}
                  className={`w-full text-xs font-semibold border ${customSilverPrice ? 'border-emerald-200 focus:ring-emerald-600 bg-white' : 'border-slate-100 bg-slate-50 text-slate-500'} rounded-xl px-3 py-2 focus:outline-none`}
                  placeholder="রুপা দর প্রতি ভরি"
                  id="input-silver-price"
                />
              </div>
            </div>

            {/* Nisab Basis Standard Selector */}
            <div className="pt-3 border-t border-emerald-50">
              <span className="block text-[11px] font-bold text-slate-600 mb-2">জাকাত হারের প্রারম্ভিক সীমা (Nisab Limit Standard):</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNisabStandard('silver')}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-black tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    nisabStandard === 'silver'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  id="btn-nisab-silver"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  রুপার নেসাব (৫২.৫ ভরি - {toBengaliNumber(nisabSilverLimitBDT.toLocaleString('bn-BD'))} BDT)
                </button>
                <button
                  type="button"
                  onClick={() => setNisabStandard('gold')}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-black tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    nisabStandard === 'gold'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  id="btn-nisab-gold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  স্বর্ণের নেসাব (৭.৫ ভরি - {toBengaliNumber(nisabGoldLimitBDT.toLocaleString('bn-BD'))} BDT)
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed italic">
                * পরামর্শ: নগদ অর্থ ও অন্যান্য তরল সম্পদের সুবিধার্থে রূপার নেসাবের উপর ভিত্তি করে জাকাত নির্ধারণ করা উত্তম, এতে সুবিধাবঞ্চিত মানুষদের সুযোগ বাড়ে।
              </p>
            </div>
          </div>

          {/* Card 2: Asset Inputs */}
          <div className="bg-white border border-emerald-100 p-5 rounded-3xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <Coins size={16} className="text-emerald-700" />
              ২. আপনার মালিকানাধীন সঞ্চিত সম্পদ (Your Assets)
            </h3>

            <div className="space-y-4">
              {/* Gold Vori */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">সঞ্চয়কৃত স্বর্ণের পরিমাণ (ভরিতে):</label>
                  <span className="text-[10px] text-slate-400 block">৭.৫ ভরি বা তদূর্ধ্ব হলে জাকাতযোগ্য</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={inputs.goldVori || ''}
                    onChange={(e) => updateInput('goldVori', e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                    placeholder="যেমন- ৮.৫"
                    id="input-assets-gold"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold block">ভরি (Tola)</span>
                </div>
              </div>

              {/* Silver Vori */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2 pt-2 border-t border-slate-50">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">সঞ্চয়কৃত রৌপ্যের পরিমাণ (ভরিতে):</label>
                  <span className="text-[10px] text-slate-400 block">৫২.৫ ভরি বা তদূর্ধ্ব হলে জাকাতযোগ্য</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={inputs.silverVori || ''}
                    onChange={(e) => updateInput('silverVori', e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                    placeholder="যেমন- ৫৫"
                    id="input-assets-silver"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold block">ভরি (Tola)</span>
                </div>
              </div>

              {/* Cash in Hand */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2 pt-2 border-t border-slate-50">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">হাতে ও ঘরে সঞ্চিত নগদ অর্থ (BDT):</label>
                  <span className="text-[10px] text-slate-400 block">আপনার কাছে জমা রাখা সমস্ত নগদ টাকা</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.cashInHand || ''}
                    onChange={(e) => updateInput('cashInHand', e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                    placeholder="যেমন- ৫০,০০০"
                    id="input-assets-cash"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold block">BDT</span>
                </div>
              </div>

              {/* Cash in Bank */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2 pt-2 border-t border-slate-50">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">ব্যাংক বা ডিপিএস-এ জমাকৃত টাকা (BDT):</label>
                  <span className="text-[10px] text-slate-400 block">সঞ্চয়ী হিসাব, চলতি হিসাব ও ফিক্সড ডিপোজিট</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.cashInBank || ''}
                    onChange={(e) => updateInput('cashInBank', e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                    placeholder="যেমন- ৩,৫০,০০০"
                    id="input-assets-bank"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold block">BDT</span>
                </div>
              </div>

              {/* Business Goods */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2 pt-2 border-t border-slate-50">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">ব্যবসায়িক পণ্যের বর্তমান বাজারমূল্য (BDT):</label>
                  <span className="text-[10px] text-slate-400 block">বিক্রয়ের উদ্দেশ্যে মজুদ মালপত্রের সর্বমোট মূল্য</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.businessGoods || ''}
                    onChange={(e) => updateInput('businessGoods', e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                    placeholder="যেমন- ২,০০,০০০"
                    id="input-assets-goods"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold block">BDT</span>
                </div>
              </div>

              {/* Other Investments */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2 pt-2 border-t border-slate-50">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">শেয়ার বাজার, সঞ্চয়পত্র বা অন্যান্য বিনিয়োগ (BDT):</label>
                  <span className="text-[10px] text-slate-400 block">অন্যান্য উৎস থেকে প্রাপ্তি বা পরিশোধযোগ্য পাওনা</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.otherInvestments || ''}
                    onChange={(e) => updateInput('otherInvestments', e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                    placeholder="যেমন- ১,২৫,০০০"
                    id="input-assets-invest"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold block">BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Debts and Liabilities (Deductions) */}
          <div className="bg-white border border-rose-100 p-5 rounded-3xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              ৩. বিয়োগযোগ্য ঋণ বা পারিবারিক দেনা (Deductions & Debts)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-2">
              <div>
                <label className="text-xs font-bold text-slate-800 block">তাৎক্ষণিকভাবে পরিশোধযোগ্য ঋণ (BDT):</label>
                <span className="text-[10px] text-slate-400 block">ব্যক্তিগত বা বাণিজ্যিক অবিলম্বে আদায়যোগ্য ঋণ বা বিল</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={inputs.debtsToPay || ''}
                  onChange={(e) => updateInput('debtsToPay', e.target.value)}
                  className="w-full text-xs font-semibold border border-rose-200 focus:border-rose-500 focus:ring-rose-500/10 rounded-xl px-3 py-2 bg-white focus:outline-none pr-10"
                  placeholder="যেমন- ৫০,০০০"
                  id="input-debts-deduct"
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-rose-500 font-bold block">BDT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Calculation & Results (Column span 5) */}
        <div className="lg:col-span-5 space-y-6" id="zakat-results-column">
          
          {/* Card: Calculation Statement */}
          <div className="bg-emerald-950 text-white p-6 rounded-3xl shadow-md space-y-6 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-emerald-800/15" />
            <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-emerald-900/10" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400 fill-amber-400" />
                পূর্ণাঙ্গ জাকাত বিবরণী (Statement)
              </span>
              <button
                onClick={handleReset}
                className="text-[10px] hover:underline font-bold text-emerald-305 flex items-center gap-0.5 cursor-pointer bg-none border-none outline-none"
                id="btn-zakat-reset"
              >
                <RefreshCw size={10} className="animate-spin duration-3000" />
                পুনরায় হিসাব
              </button>
            </div>

            {/* Main Calculated Zakat Amount */}
            <div className="space-y-1.5 pt-4 border-t border-emerald-900/60">
              <span className="text-[11px] font-bold text-emerald-250 block">আপনার দেয় বা প্রদেয় বাৎসরিক জাকাত:</span>
              <div className="flex items-baseline gap-1" id="zakat-showcase-amount">
                <span className="text-3xl md:text-4xl font-extrabold text-amber-300 leading-none">
                  ৳ {toBengaliNumber(calculatedZakat.toLocaleString('bn-BD'))}
                </span>
                <span className="text-[10px] font-black text-emerald-300">BDT (টাকা)</span>
              </div>
              <p className="text-[10px] font-semibold text-emerald-100 italic">
                {isEligibleForZakat 
                  ? `* আপনার নিট উদ্বৃত্ত সম্পদ ২.৫% হরে জাকাত হিসেব হয়েছে।` 
                  : `* আপনার নেট সম্পদ নেছাব অতিক্রম করেনি। জাকাত ফরজ হওয়ার জন্য সম্পদের নূন্যতম প্রয়োজনীয় স্তর অনুপস্থিত।`}
              </p>
            </div>

            {/* Calculations items list */}
            <div className="space-y-3 pt-4 border-t border-emerald-900/60 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-300">১. মোট সোনা ও রুপার মূল্য:</span>
                <span className="font-mono text-white text-[11px]">৳ {toBengaliNumber((goldValue + silverValue).toLocaleString('bn-BD'))}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-emerald-300">২. মোট নগদ ও ব্যাংক ব্যালেন্স:</span>
                <span className="font-mono text-white text-[11px]">৳ {toBengaliNumber(cashValue.toLocaleString('bn-BD'))}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-emerald-300">৩. ব্যবসায়িক পণ্য ও বিনিয়োগ:</span>
                <span className="font-mono text-white text-[11px]">৳ {toBengaliNumber(otherAssets.toLocaleString('bn-BD'))}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-300 pb-2 border-b border-emerald-900/40">
                <span>(-) পরিশোধযোগ্য মোট ঋণ:</span>
                <span className="font-mono text-[11px]">৳ {toBengaliNumber(inputs.debtsToPay.toLocaleString('bn-BD'))}</span>
              </div>
              <div className="flex justify-between font-black text-amber-250 text-xs sm:text-sm pt-1">
                <span>নিট বা উদ্বৃত্ত নেট সম্পদ (Net):</span>
                <span className="font-mono">৳ {toBengaliNumber(netWealth.toLocaleString('bn-BD'))}</span>
              </div>
            </div>

            {/* Status alerts */}
            <div className="pt-2">
              {isEligibleForZakat ? (
                <div className="bg-emerald-900/45 border border-emerald-800 p-3 rounded-2xl flex items-start gap-2 text-[11px] font-bold text-emerald-100">
                  <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-emerald-100 block font-black">আলহামদুলিল্লাহ! আপনার জাকাত পরিশোধ করা ফরজ।</span>
                     আপনার নিট সম্পদ ({toBengaliNumber(netWealth.toLocaleString('bn-BD'))} BDT) চলমান মানদণ্ড অনুযায়ী নেসাবসীমার ({toBengaliNumber(selectedNisabLimitBDT.toLocaleString('bn-BD'))} BDT) চেয়ে বেশি রয়েছে।
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/45 border border-amber-900/70 p-3 rounded-2xl flex items-start gap-2 text-[11px] font-bold text-amber-100">
                  <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-200 block font-black">আপনার জাকাত প্রদান করা ফরজ নয়।</span>
                    আপনার জাকাতযোগ্য নিট সম্পদ ({toBengaliNumber(netWealth.toLocaleString('bn-BD'))} BDT) নেসাবসীমা ({toBengaliNumber(selectedNisabLimitBDT.toLocaleString('bn-BD'))} BDT) স্পর্শ করেনি বা তুলনামূলক কম রয়েছে।
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Info & FAQ section */}
          <div className="bg-white border border-emerald-100 p-5 rounded-3xl shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-50 pb-3">
              <HelpCircle size={16} className="text-emerald-700" />
              জাকাত সংক্রান্ত প্রয়োজনীয় জিজ্ঞাসা (FAQ Guide)
            </h3>

            <div className="space-y-3" id="zakat-faq-accordion">
              {ZAKAT_FAQS.map((faq, idx) => {
                const isActive = activeFaq === idx;
                return (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isActive ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-800 leading-normal">{faq.q}</span>
                      <span className="shrink-0 text-slate-400">
                        {isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-white"
                        >
                          <p className="p-3 text-xs font-semibold text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
