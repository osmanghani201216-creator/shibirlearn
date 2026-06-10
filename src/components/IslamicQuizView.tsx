import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  Flame, 
  HelpCircle as QuestionIcon, 
  RefreshCw, 
  Sparkles,
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  question: string;
  category: 'namaz' | 'history';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "পবিত্র কুরআনুল কারীমে কোন সূরাটি সালাত বা নামাজের প্রতি রাকাআতেই পাঠ করা বাধ্যতামূলক?",
    category: "namaz",
    options: [
      "সূরা আল-ইখলাস",
      "সূরা আল-ফাতিহা",
      "সূরা আল-বাকারা",
      "সূরা আন-নাস"
    ],
    correctAnswerIndex: 1,
    explanation: "রাসূলুল্লাহ (সা.) বলেছেন, 'যে ব্যক্তি সালাতে সূরা আল-ফাতিহা পাঠ করল না, তার সালাত অপূর্ণাঙ্গ।' (সহীহ বুখারী)"
  },
  {
    id: 2,
    question: "সালাতের চাবি বা প্রথম প্রধান শর্ত কোনটি?",
    category: "namaz",
    options: [
      "অজু বা পবিত্রতা অর্জন",
      "উত্তম পোশাক পরা",
      "মসজিদে উপস্থিত হওয়া",
      "রুকু ঠিকভাবে করা"
    ],
    correctAnswerIndex: 0,
    explanation: "রাসূলুল্লাহ (সা.) ইরশাদ করেন, 'সালাতের চাবি হচ্ছে পবিত্রতা (অজু)।' (জামে তিরমিযী)"
  },
  {
    id: 3,
    question: "ইসলামি শরীয়তে সালাত বা নামাজ সর্বপ্রথম কোন বিশেষ ঘটনার মাধ্যমে ফরজ হয়েছিল?",
    category: "namaz",
    options: [
      "মদিনার সনদের মাধ্যমে",
      "মিরাজ (ঊর্ধ্বগমন) এর রাতে",
      "বদর যুদ্ধের ময়দানে",
      "নবুওয়াত প্রাপ্তির প্রথম দিনে"
    ],
    correctAnswerIndex: 1,
    explanation: "রাসূলুল্লাহ (সা.) পাঁচ ওয়াক্ত সালাত উপহার বা বিধান হিসেবে লাভ করেছিলেন মিরাজের মহিমান্বিত রজনীতে।"
  },
  {
    id: 4,
    question: "ইসলামি ইতিহাসে সর্বপ্রথম আজান দেয়ার গৌরবধারী সাহাবী কে ছিলেন?",
    category: "history",
    options: [
      "হযরত আবু বকর (রা.)",
      "হযরত উমর ইবনুল খাত্তাব (রা.)",
      "হযরত বিলাল ইবনে রাবাহ (রা.)",
      "হযরত আলী ইবনে আবী তালিব (রা.)"
    ],
    correctAnswerIndex: 2,
    explanation: "রাসূলুল্লাহ (সা.) এর নির্দেশনায় হযরত বিলাল (রা.) ইসলামে সর্ব প্রথম সুমধুর কণ্ঠে আজান প্রচার করেন।"
  },
  {
    id: 5,
    question: "কিয়ামত বা শেষ বিচারের দিন বান্দার আমলনামা থেকে সর্বপ্রথম কিসের হিসাব নেওয়া হবে?",
    category: "namaz",
    options: [
      "দান-সদকার হিসাব",
      "রমজানের রোজার হিসাব",
      "সালাত বা নামাজের হিসাব",
      "হজ্জের হিসাব"
    ],
    correctAnswerIndex: 2,
    explanation: "রাসূলুল্লাহ (সা.) বলেছেন, 'কিয়ামতের দিন বান্দার আমলের মধ্যে সর্বপ্রথম সালাতের হিসাব নেওয়া হবে।' (সুনানে আবু দাউদ)"
  },
  {
    id: 6,
    question: "ইসলামের প্রথম প্রকাশ্য ও বিজয়ী যুদ্ধ কোনটি এবং এটি কোন হিজরি সনে সংঘটিত হয়েছিল?",
    category: "history",
    options: [
      "উহুদের যুদ্ধ (৩ হিজরি)",
      "খন্দকের যুদ্ধ (৫ হিজরি)",
      "বদর যুদ্ধ (২ হিজরি)",
      "খায়বার বিজয় (৭ হিজরি)"
    ],
    correctAnswerIndex: 2,
    explanation: "২য় হিজরি সনের ১৭ই রমজান ঐতিহাসিক বদরের যুদ্ধ সংঘটিত হয়, যেখানে ৩১৩ জন ঈমানদার বিজয়ী হন।"
  },
  {
    id: 7,
    question: "পবিত্র কুরআনুল কারীমে সালাত বা নামাজ কায়েমের নির্দেশ সরাসরি কতবার এসেছে?",
    category: "namaz",
    options: [
      "৫০টির বেশি স্থানে",
      "৮২ বার বা তার বেশি",
      "১০ বার",
      "১০০ বার"
    ],
    correctAnswerIndex: 1,
    explanation: "পবিত্র কুরআনে বিভিন্ন স্থানে নামাজ বা সালাত প্রত্যক্ষভাবে ও সম্পর্কিত শব্দের মাধ্যমে ৮২ বার বা তার অধিক তাগিদ সহকারে বর্ণিত হয়েছে।"
  },
  {
    id: 8,
    question: "রাসূলুল্লাহ (সা.) কোন হিজরি সনে মক্কা থেকে পবিত্র মদিনা মুনাওয়ারায় হিজরত করেছিলেন?",
    category: "history",
    options: [
      "১ হিজরি (৬২২ খ্রিষ্টাব্দ)",
      "২ হিজরি (৬২৩ খ্রিষ্টাব্দ)",
      "৩ হিজরি (৬২৪ খ্রিষ্টাব্দ)",
      "৫ হিজরি (৬২৬ খ্রিষ্টাব্দ)"
    ],
    correctAnswerIndex: 0,
    explanation: "৬২২ খ্রিষ্টাব্দে আল্লাহর নির্দেশে মক্কা থেকে মদিনায় হিজরতের ঐতিহাসিক সূচনাকাল থেকেই হিজরি সনের গণনা শুরু হয়।"
  }
];

interface IslamicQuizViewProps {
  onBack: () => void;
}

export default function IslamicQuizView({ onBack }: IslamicQuizViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  // Statistics state persistence
  const [quizStats, setQuizStats] = useState({
    totalQuizzesPlayed: 0,
    totalCorrectAnswers: 0,
    streak: 0,
    lastPlayedDate: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('islamic_quiz_statistics');
    if (saved) {
      try {
        setQuizStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse statistics", e);
      }
    }
  }, []);

  const saveStats = (updated: typeof quizStats) => {
    localStorage.setItem('islamic_quiz_statistics', JSON.stringify(updated));
    setQuizStats(updated);
  };

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;
    
    const isCorrect = selectedAnswer === QUIZ_QUESTIONS[currentIdx].correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);

    const todayStr = new Date().toDateString();
    let newStreak = quizStats.streak;

    if (quizStats.lastPlayedDate) {
      const lastDate = new Date(quizStats.lastPlayedDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate.toDateString() === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastDate.toDateString() !== todayStr) {
        newStreak = 1; // broken streak, restart
      }
    } else {
      newStreak = 1; // first time playing
    }

    const updated = {
      totalQuizzesPlayed: quizStats.totalQuizzesPlayed + 1,
      totalCorrectAnswers: quizStats.totalCorrectAnswers + score + (selectedAnswer === QUIZ_QUESTIONS[currentIdx].correctAnswerIndex ? 1 : 0),
      streak: newStreak,
      lastPlayedDate: todayStr
    };
    saveStats(updated);
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getPercentage = () => {
    return Math.round((score / QUIZ_QUESTIONS.length) * 100);
  };

  const handleShareResult = () => {
    const total = QUIZ_QUESTIONS.length;
    const textToCopy = `🕌 দ্বীনি জিজ্ঞাসা ও উত্তর (Islamic Knowledge Quiz) রেজাল্ট:

আমার স্কোর: ${score}/${total} (${getPercentage()}%)।
সঠিক উত্তর দেওয়ার ধারাবাহিকতা (Streak): 🔥 ${quizStats.streak} দিন।

সালাত সূচী, ট্র্যাকার এবং আধুনিক ইসলামি জ্ঞানকোষ অ্যাপ আজই ডাউনলোড করুন ও আপনার ঈমান মজবুত রাখুন। 😊
লিংক: ${window.location.origin}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const activeQuestion = QUIZ_QUESTIONS[currentIdx];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8" id="quiz-main-container">
      {/* 1. Header with back button */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer transition-colors"
          id="btn-quiz-back"
        >
          <ArrowLeft size={18} />
          <span>অনলাইন ড্যাশবোর্ড</span>
        </button>

        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full border border-amber-100 text-xs font-bold shadow-2xs">
          <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
          <span>ডেইলি স্ট্রিক: {quizStats.streak} দিন</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key="quiz-body"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Display progress stats */}
            <div className="bg-white border border-emerald-100 p-5 rounded-3xl shadow-2xs">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <BookOpen size={14} />
                  প্রশ্ন: {currentIdx + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
                  ক্যাটাগরি: {activeQuestion.category === 'namaz' ? 'সালাত ও ফরজিয়াত' : 'ইসলামী ইতিহাস'}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-relaxed mt-6">
                {activeQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3.5">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === activeQuestion.correctAnswerIndex;
                
                let optionStyle = "border-slate-200 bg-white text-slate-700 hover:bg-emerald-50/20";
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs";
                  } else if (isSelected) {
                    optionStyle = "border-rose-300 bg-rose-50 text-rose-950 shadow-2xs";
                  } else {
                    optionStyle = "border-slate-100 bg-gray-50/50 text-slate-400 opacity-75";
                  }
                } else if (isSelected) {
                  optionStyle = "border-emerald-600 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-500/20";
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                    whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    disabled={isSubmitted}
                    id={`quiz-option-${idx}`}
                  >
                    <span className="flex-1 pr-3">{opt}</span>
                    <span className="shrink-0">
                      {isSubmitted && isCorrect && <CheckCircle2 size={18} className="text-emerald-600" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle size={18} className="text-rose-600" />}
                      {!isSubmitted && (
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${isSelected ? 'border-emerald-605 bg-emerald-700 text-white' : 'border-slate-300'}`}>
                          {isSelected ? '✓' : ''}
                        </div>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation card after submit */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-2 mt-4"
                >
                  <span className="text-xs font-black text-sky-905 block uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                    ব্যাখ্যা ও রেফারেন্স (Explanation):
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-sky-950 leading-relaxed">
                    {activeQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex justify-end pt-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-3 rounded-full text-xs font-black tracking-wider shadow-sm transition-all cursor-pointer ${
                    selectedAnswer === null 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                      : 'bg-emerald-750 text-white hover:bg-emerald-800'
                  }`}
                  id="quiz-submit-btn"
                >
                  উত্তর জমা দিন
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-emerald-750 text-white rounded-full text-xs font-black tracking-wider hover:bg-emerald-800 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  id="quiz-next-btn"
                >
                  <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Finished Screen */
          <motion.div
            key="quiz-finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-emerald-100 p-8 rounded-3xl text-center space-y-6 shadow-sm"
          >
            <div className="mx-auto bg-amber-50 text-amber-700 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-amber-100">
              <Award size={36} className="text-amber-600 shrink-0" />
            </div>

            <div className="space-y-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">মা-শা-আল্লাহ! আপনাকে শুভকামনা</h1>
              <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
                আপনি আজকের কুইজ পর্বটি সফলভাবে সমাপ্ত করেছেন। সঠিক উত্তরের সঠিক তথ্য দেখে আপনার আমল বাড়াতে থাকুন।
              </p>
            </div>

            {/* Score display circle */}
            <div className="w-32 h-32 rounded-full border-4 border-emerald-100 bg-emerald-50/30 flex flex-col items-center justify-center mx-auto shadow-2xs">
              <span className="text-3xl font-black text-emerald-800">{score} / {QUIZ_QUESTIONS.length}</span>
              <span className="text-[10px] text-emerald-750 font-black tracking-widest mt-1">সঠিক উত্তর</span>
            </div>

            {/* Visual Feedback text based on score */}
            <div className="text-sm font-bold text-slate-700 bg-slate-50 py-2.5 px-4 rounded-xl inline-block">
              {getPercentage() === 100 ? '🎉 অসাধারণ! সব প্রশ্নের উত্তর সঠিক হয়েছে।' : 
               getPercentage() >= 70 ? '★ চমৎকার পারফরম্যান্স! আপনার ইসলামি জ্ঞান বেশ সমৃদ্ধ।' :
               '✓ মা-শা-আল্লাহ! সঠিক ব্যাখ্যা ও রেফারেন্স থেকে শিখতে থাকুন।'}
            </div>

            {/* Overall stats list */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-4 border-t border-slate-100">
              <div className="bg-emerald-50/20 p-3 rounded-2xl border border-emerald-50 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500">মোট সম্পন্ন কুইজ</span>
                <span className="text-base font-black text-slate-800">{quizStats.totalQuizzesPlayed} বার</span>
              </div>
              <div className="bg-emerald-50/20 p-3 rounded-2xl border border-emerald-50 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500">চলতি স্ট্রিক (Streak)</span>
                <span className="text-base font-black text-emerald-805 flex items-center gap-1">
                  <Flame size={14} className="text-orange-500 fill-orange-500" />
                  {quizStats.streak} দিন
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-6">
              <button
                onClick={handleShareResult}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-750 text-white hover:bg-emerald-800 font-black rounded-full text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                id="quiz-share-btn"
              >
                <Share2 size={14} />
                <span>ফলাফল কপি বা শেয়ার করুন</span>
              </button>

              <button
                onClick={handleResetQuiz}
                className="w-full sm:w-auto px-6 py-3 bg-[#f8fafc] text-slate-700 hover:bg-slate-100 border border-slate-200/80 font-semibold rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                id="quiz-retry-btn"
              >
                <RefreshCw size={14} />
                <span>আবার খেলুন (Retry)</span>
              </button>
            </div>

            {/* Instant notification alert */}
            <AnimatePresence>
              {showShareNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50 font-sans"
                >
                  <Check size={16} className="text-emerald-500" />
                  <span>ফলাফল সম্পূর্ণ মেসেজ সহ ক্লিপবোর্ডে কপি হয়েছে!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
