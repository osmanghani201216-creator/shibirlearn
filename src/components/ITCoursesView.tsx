import React, { useState } from 'react';
import { 
  Laptop, 
  Search, 
  ExternalLink, 
  ArrowLeft,
  Sparkles,
  Code2,
  Brush,
  FileSpreadsheet,
  Terminal,
  Database,
  Megaphone,
  MonitorPlay,
  ArrowUpRight,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Clock,
  PlayCircle,
  Heart,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface CourseItem {
  id: string;
  title: string;
  provider: string;
  platform: '10ms' | 'onlinelivecourse' | 'bohubrihi';
  category: 'programming' | 'design' | 'office' | 'marketing' | 'creative';
  durationBn: string;
  lessonsBn: string;
  descriptionBn: string;
  courseUrl: string;
  badge?: string;
}

export default function ITCoursesView({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('it_courses_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const TEN_MS_FREE_URL = 'https://10minuteschool.com/categories/free/';

  // High quality list of free IT Courses with 10ms-style structured topics + onlinelivecourse & bohubrihi courses
  const COURSES: CourseItem[] = [
    {
      id: 'it-web-dev',
      title: 'বেসিক ওয়েব ডেভেলপমেন্ট (HTML, CSS)',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'programming',
      durationBn: '৭ ঘণ্টা',
      lessonsBn: '২৫টি ক্লাস',
      descriptionBn: 'শুরু থেকে ওয়েবসাইট ডিজাইন করার কলাকৌশল। কোডিং জ্ঞানের পূর্ব অভিজ্ঞতা ছাড়াই নিজের চমৎকার পেইজ তৈরি শিখুন।',
      courseUrl: TEN_MS_FREE_URL,
      badge: 'জনপ্রিয়'
    },
    {
      id: 'it-excel',
      title: 'মাইক্রোসফট এক্সেল ফর বিগিনার্স (Excel)',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'office',
      durationBn: '৫ ঘণ্টা',
      lessonsBn: '১৮টি ক্লাস',
      descriptionBn: 'চাকরি এবং পড়াশোনার ক্ষেত্রে দরকারি ডেটা শিট প্রস্তুত, চমৎকার ফর্মুলা এবং চার্ট তৈরির বাস্তব মুখী টিউটোরিয়াল।',
      courseUrl: TEN_MS_FREE_URL,
      badge: 'প্রয়োজনীয়'
    },
    {
      id: 'it-ppt',
      title: 'মাইক্রোসফট পাওয়ারপয়েন্ট স্লাইড ডিজাইন',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'office',
      durationBn: '৪ ঘণ্টা',
      lessonsBn: '১৫টি ক্লাস',
      descriptionBn: 'আকর্ষণীয় প্রেজেন্টেশন স্লাইড ডিজাইন, অ্যানিমেশন এবং সুন্দর ইনফোগ্রাফিক্স ব্যবহারের সহজ কোর্স।',
      courseUrl: TEN_MS_FREE_URL
    },
    {
      id: 'it-python',
      title: 'পাইথন প্রোগ্রামিং জিরো থেকে হিরো',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'programming',
      durationBn: '১০ ঘণ্টা',
      lessonsBn: '৩০টি ক্লাস',
      descriptionBn: 'বিশ্বের সবচেয়ে জনপ্রিয় রিডিং ল্যাঙ্গুয়েজ পাইথনের একদম শুরু থেকে স্ট্রাকচার্ড কন্ডিশন, লুপ ও কাজ শেখার ক্লাস।',
      courseUrl: TEN_MS_FREE_URL,
      badge: 'প্রফেশনাল'
    },
    {
      id: 'it-word',
      title: 'মাইক্রোসফট ওয়ার্ড ও রিপোর্টিং স্কিল',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'office',
      durationBn: '৩.৫ ঘণ্টা',
      lessonsBn: '১২টি ক্লাস',
      descriptionBn: 'অফিসের অ্যাসাইনমেন্ট, আবেদনপত্র এবং সুন্দর প্রফেশনাল সিভি তৈরি করার জন্য সম্পূর্ণ ওয়ার্ড গাইডবুক।',
      courseUrl: TEN_MS_FREE_URL
    },
    {
      id: 'it-photoshop',
      title: 'অ্যাডোবি ফটোশপ বেসিক টু অ্যাডভান্সড',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'design',
      durationBn: '৮ ঘণ্টা',
      lessonsBn: '২২টি ক্লাস',
      descriptionBn: 'ছবি রিটাচিং, ব্যাকগ্রাউন্ড রিমুভ, দারুণ পোস্টার ডিজাইন এবং ফ্রি ফ্রিল্যান্সিং করার জন্য বেসিক গ্রাফিক গাইড।',
      courseUrl: TEN_MS_FREE_URL,
      badge: 'ক্যারিয়ার'
    },
    {
      id: 'it-illustrator',
      title: 'অ্যাডোবি ইলাস্ট্রেটর ভেক্টর আর্ট ডিজাইন',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'design',
      durationBn: '৬ ঘণ্টা',
      lessonsBn: '১৬টি ক্লাস',
      descriptionBn: 'লোগো ডিজাইন, বিজনেস কার্ড এবং সুন্দর ভেক্টর কার্টুন ইলাস্ট্রেশন শেখার জন্য চমৎকার সব টিপস ও ট্রিকস।',
      courseUrl: TEN_MS_FREE_URL
    },
    {
      id: 'it-digital-marketing',
      title: 'ডিজিটাল মার্কেটিং অ্যান্ড ব্রান্ডিং ফেস বুক প্রমোশন',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'marketing',
      durationBn: '৫.৫ ঘণ্টা',
      lessonsBn: '২০টি ক্লাস',
      descriptionBn: 'সোশ্যাল মিডিয়া অ্যাকাউন্ট বৃদ্ধি, ফেসবুক পেজ অপ্টিমাইজড করার মাধ্যমে চমৎকার ডিজিটাল ক্রিয়েটর ও ব্যবসায়ের কৌশল।',
      courseUrl: TEN_MS_FREE_URL,
      badge: 'হট'
    },
    {
      id: 'it-canva',
      title: 'ক্যানভা দিয়ে সম্পূর্ণ গ্রাফিক্স ডিজাইন',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'design',
      durationBn: '৩ ঘণ্টা',
      lessonsBn: '১০টি ক্লাস',
      descriptionBn: 'কোনো জটিল সফটওয়্যার ছাড়াই দ্রুত চমৎকার ব্যানার, ফেসবুক পোস্ট ও প্রেজেন্টেশন তৈরির অনলাইন গাইড।',
      courseUrl: TEN_MS_FREE_URL
    },
    {
      id: 'it-video-edit',
      title: 'ক্যাপকাট ও মোবাইল দিয়ে চমৎকার ভিডিও এডিটিং',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'creative',
      durationBn: '৫ ঘণ্টা',
      lessonsBn: '১৪টি ক্লাস',
      descriptionBn: 'মোবাইল ব্যবহার করে চমৎকার সিনেমাটিক ভিডিও ইফেক্ট, সুন্দর সাউন্ড ডিজাইন এবং রিলস/ইউটিউব কন্টেন্ট মেকিং।',
      courseUrl: TEN_MS_FREE_URL
    },
    {
      id: 'it-seo',
      title: 'সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO Basics)',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'marketing',
      durationBn: '৬.৫ ঘণ্টা',
      lessonsBn: '১৫টি ক্লাস',
      descriptionBn: 'গুগল সার্চে নিজের ওয়েবসাইট বা ব্লগ সর্বপ্রথম নিয়ে আসার জন্য প্রফেশনাল ট্রাফিক কৌশল ও কিওয়ার্ড রিসার্চ।',
      courseUrl: TEN_MS_FREE_URL
    },
    {
      id: 'it-typing',
      title: 'টাইপিং স্কিল ও স্পিড ডেভলপমেন্ট',
      provider: '10 Minute School',
      platform: '10ms',
      category: 'office',
      durationBn: '২ ঘণ্টা',
      lessonsBn: '৮টি ক্লাস',
      descriptionBn: 'বাংলা ও ইংরেজি কিবোর্ড না দেখে অবিশ্বাস্য দ্রুত গতিতে সঠিক নিয়মে টাইপিং শেখার স্পেশাল গাইডলাইন।',
      courseUrl: TEN_MS_FREE_URL
    },
    // ONLINE LIVE COURSE (3 courses requested)
    {
      id: 'it-premiere-pro',
      title: 'Video Editing with Premiere Pro Free Course',
      provider: 'Online Live Course',
      platform: 'onlinelivecourse',
      category: 'creative',
      durationBn: '১৮ ঘণ্টা',
      lessonsBn: '৩৪টি ক্লাস',
      descriptionBn: 'অ্যাডোবি প্রিমিয়ার প্রো দিয়ে প্রফেশনাল ভিডিও এডিটিং, মোশন গ্রাফিক্স, কালার গ্রেডিং এবং অডিও মিক্সিং এর এ-টু-জেড প্র্যাক্টিক্যাল কোর্স। লিংক থেকে ফ্রি অ্যাক্সেস করুন।',
      courseUrl: 'https://onlinelivecourse.com/courses/video-editing-with-premiere-pro-free-course/',
      badge: 'প্রিমিয়ার প্রো'
    },
    {
      id: 'it-graphic-basic',
      title: 'Graphic Design Free Course (Basic)',
      provider: 'Online Live Course',
      platform: 'onlinelivecourse',
      category: 'design',
      durationBn: '১২ ঘণ্টা',
      lessonsBn: '২৫টি ক্লাস',
      descriptionBn: 'গ্রাফিক্স ডিজাইনের মৌলিক নীতিমালা, কালার থিওরি এবং ফটোশপ ও ইলাস্ট্রেটরের সাহায্যে ডিজাইন প্রজেক্ট তৈরির হাতে-কলমে ক্লাস।',
      courseUrl: 'https://onlinelivecourse.com/courses/graphic-design-free-course-basic/',
      badge: 'ডিজাইন'
    },
    {
      id: 'it-youtube-pro',
      title: 'FREE YouTube Professional Course',
      provider: 'Online Live Course',
      platform: 'onlinelivecourse',
      category: 'marketing',
      durationBn: '১০ ঘণ্টা',
      lessonsBn: '১৮টি ক্লাস',
      descriptionBn: 'ইউটিউবিং শুরু করার সম্পূর্ণ রোডম্যাপ। চ্যানেল সেটআপ, ভিডিও এসইও, থাম্বনেইল স্ট্র্যাটেজি ও অর্গানিক মনিটাইজেশন সিক্রেট গাইড।',
      courseUrl: 'https://onlinelivecourse.com/courses/youtube-free-course/',
      badge: 'ইউটিউব'
    },
    // BOHUBRIHI (13 courses requested)
    {
      id: 'it-job-hunting',
      title: 'Art of Job Searching & Applications',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'office',
      durationBn: '৪ ঘণ্টা',
      lessonsBn: '১২টি ক্লাস',
      descriptionBn: 'আজকের প্রতিযোগিতামূলক বাজারে সঠিক উপায়ে চাকরি খোঁজা, নিখুঁত রেজুমে/সিভি এবং কভার লেটার রাইটিং ও ইন্টারভিউ টেকনিক।',
      courseUrl: 'https://bohubrihi.com/courses/job-hunting',
      badge: 'ক্যারিয়ার'
    },
    {
      id: 'it-public-speaking',
      title: 'Elevate Your Public Speaking',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'creative',
      durationBn: '৫ ঘণ্টা',
      lessonsBn: '১০টি ক্লাস',
      descriptionBn: 'যোগাযোগ দক্ষতা ও স্টেজে কথা বলার জড়তা দূর করার কৌশল। বডি ল্যাঙ্গুয়েজ এবং প্রভাবশালী বাচনভঙ্গি অর্জনের উপায়।',
      courseUrl: 'https://bohubrihi.com/courses/public-speaking',
      badge: 'যোগাযোগ'
    },
    {
      id: 'it-data-analytics',
      title: 'ইন্ট্রোডাকশন টু ডেটা অ্যানালিটিক্স',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'programming',
      durationBn: '৬ ঘণ্টা',
      lessonsBn: '১৫টি ক্লাস',
      descriptionBn: 'ডেটা সায়েন্স ও অ্যানালিটিক্সের মূল ভিত্তি, ডেটা কালেকশন, ক্লিনিং এবং রিপোর্ট তৈরির জন্য প্রয়োজনীয় টেকনিক্যাল জ্ঞান।',
      courseUrl: 'https://bohubrihi.com/courses/introduction-to-data-analytics',
      badge: 'ডেটা'
    },
    {
      id: 'it-product-management',
      title: 'Pathway to Digital Product Management',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'office',
      durationBn: '৪.৫ ঘণ্টা',
      lessonsBn: '১৪টি ক্লাস',
      descriptionBn: 'ডিজিটাল প্রোডাক্ট রোডম্যাপ, ইউজার জার্নি ম্যাপিং এবং দক্ষ প্রোডাক্ট টিমের সাথে আইডিয়া বাস্তবায়নের কলাকৌশল।',
      courseUrl: 'https://bohubrihi.com/courses/product-management-pathway',
      badge: 'প্রোডাক্ট'
    },
    {
      id: 'it-software-eng-pathway',
      title: 'Software Engineering Pathway',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'programming',
      durationBn: '৮ ঘণ্টা',
      lessonsBn: '২৩টি ক্লাস',
      descriptionBn: 'সফটওয়্যার ডেভেলপমেন্ট ইন্ডাস্ট্রিতে প্রবেশের পূর্ণাঙ্গ রোডম্যাপ। কোডিং প্র্যাকটিস এবং ক্যারিয়ার ট্র্যাকিং গাইড।',
      courseUrl: 'https://bohubrihi.com/courses/software-engineering-pathway',
      badge: 'সফটওয়্যার'
    },
    {
      id: 'it-ulab-mooc',
      title: 'Diversity, Tolerance & Pluralism',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'creative',
      durationBn: '৩ ঘণ্টা',
      lessonsBn: '৮টি ক্লাস',
      descriptionBn: 'ইউলাব (ULAB) এর সহযোগিতায় সামাজিক সম্প্রীতি, বহুত্ববাদ এবং মানুষের ভিন্ন মতের প্রতি সহনশীলতার গুরুত্ব ও চেতনা পাঠ।',
      courseUrl: 'https://bohubrihi.com/courses/ulab-mooc'
    },
    {
      id: 'it-powerpoint-fundamentals',
      title: 'PowerPoint Fundamentals',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'office',
      durationBn: '৩.৫ ঘণ্টা',
      lessonsBn: '১১টি ক্লাস',
      descriptionBn: 'বেসিক স্লাইড ডিজাইন থেকে শুরু করে চমৎকার অ্যানিমেশন ও ট্রানজিশন ব্যবহারের মাধ্যমে প্রফেশনাল প্রেজেন্টেশনের গাইড।',
      courseUrl: 'https://bohubrihi.com/courses/powerpoint-fundamentals'
    },
    {
      id: 'it-dm-basics',
      title: 'Introduction to Digital Marketing',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'marketing',
      durationBn: '৭ ঘণ্টা',
      lessonsBn: '২০টি ক্লাস',
      descriptionBn: 'ডিজিটাল প্রচারণার মৌলিক ভিত্তি। সোশ্যাল মিডিয়া ক্যাম্পেইন, কিওয়ার্ড রিসার্চ ও অর্গানিক কন্টেন্ট মার্কেটিং স্ট্র্যাটেজি।',
      courseUrl: 'https://bohubrihi.com/courses/dm-basics',
      badge: 'মার্কেটিং'
    },
    {
      id: 'it-intro-to-js',
      title: 'Introduction to JavaScript',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'programming',
      durationBn: '৯ ঘণ্টা',
      lessonsBn: '২৬টি ক্লাস',
      descriptionBn: 'ওয়েবের সবচাইতে জনপ্রিয় ডাইনামিক ল্যাঙ্গুয়েজ জাভাস্ক্রিপ্ট এর ভেরিয়েবল, অ্যারে, লুপ ও ডম কন্ট্রোল শেখার প্র্যাক্টিক্যাল ল্যাব।',
      courseUrl: 'https://bohubrihi.com/courses/intro-to-js',
      badge: 'জাভাস্ক্রিপ্ট'
    },
    {
      id: 'it-python-basics',
      title: 'Introduction to Python Programming',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'programming',
      durationBn: '৮ ঘণ্টা',
      lessonsBn: '২২টি ক্লাস',
      descriptionBn: 'পাইথন প্রোগ্রামিং দিয়ে কোডিং ক্যারিয়ার শুরুর সেরা পথচলা। ডেটা আর্কিটেকচার এবং কন্ডিশনাল লজিকের সহজ ব্যাখ্যা।',
      courseUrl: 'https://bohubrihi.com/courses/python-basics'
    },
    {
      id: 'it-html5-css3-bootstrap',
      title: 'HTML5, CSS3 & Bootstrap 4 For Web Development',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'programming',
      durationBn: '১০ ঘণ্টা',
      lessonsBn: '২৮টি ক্লাস',
      descriptionBn: 'এইচটিএমএল৫ ও সিএসএস৩ দিয়ে ওয়েবসাইট কাঠামো এবং বুটস্ট্র্যাপ ৪ ব্যবহার করে চমৎকার রেসপনসিভ ওয়েব ডিজাইন মেক করার সহজ কোর্স।',
      courseUrl: 'https://bohubrihi.com/courses/html5-css3-and-bootstrap-4',
      badge: 'ওয়েবডিজাইন'
    },
    {
      id: 'it-youtube-marketing-organic',
      title: 'YouTube Marketing for Organic Reach',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'marketing',
      durationBn: '৪.৫ ঘণ্টা',
      lessonsBn: '১৩টি ক্লাস',
      descriptionBn: 'ইউটিউব চ্যানেল বৃদ্ধি, কন্টেন্ট এসইও এবং অর্গানিক উপায়ে সাবস্ক্রাইবার ও রিচ বৃদ্ধির অ্যাডভান্স কৌশল সমূহ।',
      courseUrl: 'https://bohubrihi.com/courses/youtube-marketing-for-organic-reach'
    },
    {
      id: 'it-facebook-organic-tools',
      title: 'Facebook Marketing Tools (Organic)',
      provider: 'Bohubrihi',
      platform: 'bohubrihi',
      category: 'marketing',
      durationBn: '৫ ঘণ্টা',
      lessonsBn: '১৪টি ক্লাস',
      descriptionBn: 'ফেসবুক অ্যালগরিদম হ্যাক এবং প্রফেশনাল পেজ গ্রোথের জন্য বিনামূল্যে ব্যবহারযোগ্য অর্গানিক টুলস ও ড্যাশবোর্ড ব্যবহারের রিয়েল টিপস।',
      courseUrl: 'https://bohubrihi.com/courses/facebook-marketing-tools-organic'
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
    localStorage.setItem('it_courses_favorites', JSON.stringify(updated));
  };

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2500);
    });
  };

  const filteredCourses = COURSES.filter(course => {
    if (activePlatform !== 'all' && course.platform !== activePlatform) {
      return false;
    }

    if (activeCategory !== 'all' && course.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.descriptionBn.toLowerCase().includes(query) ||
        course.provider.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#fafdfb]" id="it-courses-root">
      
      {/* HEADER BAR AND BRANDING NAVIGATION */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all cursor-pointer shrink-0"
            id="it-courses-back-btn"
            title="ফিরে যান"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-white p-2.5 rounded-2xl shadow-sm">
              <Laptop size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                আইটি ও ফ্রিল্যান্সিং কোর্স (IT Course)
              </h1>
              <p className="text-xs text-emerald-700 font-semibold leading-normal mt-0.5">
                টেন মিনিট স্কুল, বহুব্রীহি ও অনলাইন লাইভ কোর্স-এর ফ্রিতে সম্পূর্ণ ক্যারিয়ার ও তথ্যপ্রযুক্তি কোর্স
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic global Redirect button based on active platform */}
        <a 
          href={activePlatform === '10ms' ? TEN_MS_FREE_URL : 
                activePlatform === 'onlinelivecourse' ? 'https://onlinelivecourse.com/' : 
                activePlatform === 'bohubrihi' ? 'https://bohubrihi.com/courses/' : 'https://10minuteschool.com/categories/free/'}
          target="_blank"
          rel="no_referrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all group"
        >
          <MonitorPlay size={14} className="text-amber-950" />
          <span>{activePlatform === 'all' ? 'সব প্ল্যাটফর্ম দেখুন' : 'ইউটিউব/ক্লাস লিংক দেখুন'}</span>
          <ArrowUpRight size={13} className="text-amber-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* SUB-PAGES NAVIGATION BAR */}
      <div className="bg-emerald-800 text-white rounded-3xl p-5 mb-6 shadow-sm">
        <h2 className="text-xs font-black tracking-widest uppercase text-emerald-200 mb-3 flex items-center gap-1.5">
          <Bookmark size={13} />
          ফ্রি লার্নিং প্ল্যাটফর্ম সাব-পেইজ সমূহ (Learning Hub Subpages)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { id: 'all', nameBn: 'সব কোর্স সাব-পেইজ', desc: 'আইটি কোর্সের সকল কালেকশন একত্রে', icon: Laptop, count: 28 },
            { id: '10ms', nameBn: '১০ মিনিট স্কুল ফ্রি', desc: '১০০% ফ্রি আইটি ও ক্যারিয়ার স্কিলস', icon: MonitorPlay, count: 12 },
            { id: 'onlinelivecourse', nameBn: 'অনলাইন লাইভ ফ্রি কোর্স', desc: 'প্রিমিয়ার প্রো ও গ্রাফিক্স সিরিজ', icon: Video, count: 3 },
            { id: 'bohubrihi', nameBn: 'বহুব্রীহি সম্পূর্ণ ফ্রি সিরিজ', desc: 'ডেটা, জাভাস্ক্রিপ্ট ও ক্যারিয়ার গাইড', icon: Code2, count: 13 }
          ].map((platformTab) => {
            const isTabActive = activePlatform === platformTab.id;
            const TabIcon = platformTab.icon;
            return (
              <button
                key={platformTab.id}
                onClick={() => {
                  setActivePlatform(platformTab.id);
                  setActiveCategory('all');
                }}
                className={`text-left p-3 rounded-2xl transition-all border cursor-pointer ${
                  isTabActive
                    ? 'bg-white text-emerald-950 border-white shadow-md'
                    : 'bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900 border-emerald-700/60'
                }`}
                id={`subpage-tab-${platformTab.id}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${isTabActive ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-900 text-white'}`}>
                      <TabIcon size={14} />
                    </div>
                    <span className="text-[11px] font-black leading-tight">{platformTab.nameBn}</span>
                  </div>
                  <span className={`text-[10px] font-sans font-black px-1.5 py-0.5 rounded-full ${isTabActive ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-900 text-emerald-200'}`}>
                    {toBengaliNumber(platformTab.count)}
                  </span>
                </div>
                <p className={`text-[10px] mt-1.5 font-sans leading-normal ${isTabActive ? 'text-slate-500' : 'text-emerald-200/70'}`}>
                  {platformTab.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC PLATFORM HERO BANNER */}
      {activePlatform !== 'all' && (
        <div className="bg-amber-50 border border-amber-200/60 p-5 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-wider text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded-md">
              সক্রিয় সাব-পেইজ
            </span>
            <h3 className="text-sm font-black text-slate-800">
              {activePlatform === '10ms' ? 'টেন মিনিট স্কুল (10 Minute School) ফ্রি সেশন' :
               activePlatform === 'onlinelivecourse' ? 'অনলাইন লাইভ কোর্স (Online Live Course) পোর্টাল' :
               'বহুব্রীহি (Bohubrihi) ক্যারিয়ার অ্যান্ড আইটি রিসোর্স'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-2xl">
              {activePlatform === '10ms' ? 'টেন মিনিট স্কুল বাংলাদেশের অন্যতম বৃহত্তম লার্নিং স্টেজ। এখানে প্রফেশনাল মেন্টরদের ভিডিও ক্লাস আপনি কোনো রেজিস্ট্রেশন ছাড়াই সরাসরি সম্পন্ন করতে পারবেন।' :
               activePlatform === 'onlinelivecourse' ? 'অনলাইন লাইভ কোর্স (onlinelivecourse.com) এ দক্ষ মেন্টরদের দ্বারা পরিচালিত গ্রাফিক্স ডিজাইন, ইউটিউব মার্কেটিং এবং প্রিমিয়ার প্রো ভিডিও এডিটিং এর দারুণ প্রফেশনাল কোর্সসমূহ।' :
               'বহুব্রীহি বাংলাদেশের অত্যন্ত স্বনামধন্য ও গুণগত অনলাইন লার্নিং হাফ। এখানে এইচটিএমএল, বুটস্ট্র্যাপ ৪, পাইথন প্রোগ্রামিং, জাভাস্ক্রিপ্ট কোডিং কোর্স ছাড়াও জব হান্টিং, সোশ্যাল মিডিয়া মার্কেটিং ও পাবলিক স্পিকিং কোর্স সম্পুর্ণ বিনামূল্যে শিখুন।'}
            </p>
          </div>
          <a
            href={activePlatform === '10ms' ? TEN_MS_FREE_URL : 
                  activePlatform === 'onlinelivecourse' ? 'https://onlinelivecourse.com/' : 
                  'https://bohubrihi.com/'}
            target="_blank"
            rel="no_referrer"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-[11px] rounded-xl shadow-sm transition-all"
          >
            <span>প্লাটফর্ম ভিজিট করুন</span>
            <ExternalLink size={12} className="text-slate-300" />
          </a>
        </div>
      )}

      {/* THREE BANNER SUMMARY OF POPULAR SKILLS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Card 1: programming */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800">
            <Code2 size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">কোডিং ও প্রোগ্রামিং</h4>
            <p className="text-[11px] text-slate-500 font-sans">জাভাস্ক্রিপ্ট, ওয়েবসাইট ও পাইথনের জ্ঞানার্জন</p>
          </div>
        </div>

        {/* Card 2: design */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-sky-50 rounded-2xl text-sky-700">
            <Brush size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">ডিজাইন ও এডিটিং</h4>
            <p className="text-[11px] text-slate-500 font-sans">প্রিমিয়ার প্রো, ফটোশপ ও ক্যানভা ডিজাইন</p>
          </div>
        </div>

        {/* Card 3: office */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">মাইক্রোসফট ও সফটস্কিল</h4>
            <p className="text-[11px] text-slate-500 font-sans">এক্সেল, পাওয়ারপয়েন্ট ও পাবলিক স্পিকিং</p>
          </div>
        </div>

      </div>

      {/* FILTER SEARCH AND CATEGORY FILTER BADGES */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Dynamic Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-emerald-700 size-4.5" />
            <input
              type="text"
              placeholder={`আইটি কোর্স খুঁজুন যেমন: Premiere Pro, Javascript, Python, Digital Marketing...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-emerald-50/10 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl text-xs sm:text-sm text-slate-800 font-sans"
              id="it-courses-search-input"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-100/70 p-3 rounded-xl max-w-sm shrink-0">
            <Sparkles size={16} className="text-amber-600 shrink-0" />
            <p className="font-sans font-medium leading-normal">
              এই কোর্সের কন্টেন্টগুলো সম্পুর্ণ ফ্রি ও কোনো লগইন ব্যতিরেকে সরাসরি অফিশিয়াল সোর্সে ব্রাউজ করতে পারবেন।
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 shrink-0">
            <Clock size={12} />
            কোর্স ক্যাটাগরি:
          </span>
          
          <div className="flex flex-wrap gap-1.5 font-sans">
            {[
              { id: 'all', titleBn: 'সব কোর্স একত্রে' },
              { id: 'programming', titleBn: 'প্রোগ্রামিং ও ডেটা' },
              { id: 'office', titleBn: 'এমএস অফিস ও প্রোডাক্টিভিটি' },
              { id: 'design', titleBn: 'গ্রাফিক্স অ্যান্ড ভেক্টর ডিজাইন' },
              { id: 'marketing', titleBn: 'ডিজিটাল মার্কেটিং ও ইউটিউব' },
              { id: 'creative', titleBn: 'ভিডিও ও কমিউনিকেশন' }
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
                  id={`course-cat-badge-${cat.id}`}
                >
                  {cat.titleBn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DYNAMIC LISTING RENDERER */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="it-courses-grid">
          {filteredCourses.map((course) => {
            const isFav = favorites.includes(course.id);
            return (
              <div 
                key={course.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-250 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Visual Top Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-50 opacity-0 group-hover:opacity-60 rounded-bl-full transition-all" />

                <div className="space-y-3">
                  {/* Category Pill Badge and Favorite Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md tracking-wider">
                      {course.category === 'programming' ? 'প্রোগ্রামিং ও ডেটা' : 
                       course.category === 'office' ? 'প্রোডাক্টিভিটি' :
                       course.category === 'design' ? 'গ্রাফিক্স ডিজাইন' :
                       course.category === 'marketing' ? 'মার্কেটিং' : 'ভিডিও ও স্পিকিং'}
                    </span>
                    
                    <button
                      onClick={(e) => handleFavoriteToggle(course.id, e)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        isFav 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-slate-350 hover:text-red-500 hover:bg-slate-50'
                      }`}
                      title={isFav ? 'পছন্দ তালিকাভুক্ত' : 'পছন্দ তালিকায় যুক্ত করুন'}
                    >
                      <Heart size={14} className={isFav ? 'fill-red-500' : ''} />
                    </button>
                  </div>

                  {/* Title & Metadata Details */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium line-clamp-3">
                      {course.descriptionBn}
                    </p>
                  </div>

                  {/* Lessons Count and Duration badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5 font-sans">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      ⏳ মেয়াদ: {course.durationBn}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      📚 {course.lessonsBn}
                    </span>
                    {course.badge && (
                      <span className="text-[9px] font-extrabold bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md animate-pulse">
                        {course.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Learn/Open Action buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 justify-between">
                  <div className="text-[10px] text-slate-400 font-bold flex flex-col">
                    <span className="text-slate-300 text-[8px] uppercase">প্ল্যাটফর্ম</span>
                    <span>{course.provider}</span>
                  </div>

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
                      className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <span>ভিডিও ক্লাস</span>
                      <Video size={11} className="text-amber-950" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200/70 p-12 text-center rounded-3xl" id="it-courses-not-found">
          <HelpCircle className="size-10 text-emerald-800/40 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800">কোনো কোর্স খুঁজে পাওয়া যায়নি!</h3>
          <p className="text-xs text-slate-500 font-sans mt-1">অনুগ্রহ করে বিকল্প কি-ওয়ার্ড বা প্ল্যাটফর্ম সাব-পেইজ চুজ করে পুনরায় চেষ্টা করুন।</p>
          <button
            onClick={() => { setActivePlatform('all'); setActiveCategory('all'); setSearchQuery(''); }}
            className="text-xs font-bold text-emerald-800 bg-white hover:bg-slate-100 px-4 py-2 mt-4 rounded-xl shadow-xs border border-slate-200 cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* EXTRA LEARNING ASSISTANCE FOOTER */}
      <div className="mt-8 bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
          <CheckCircle size={14} className="text-emerald-700" />
          আইটি কোর্স ব্যবহারের নীতিমালা ও রিসোর্স গাইড
        </h3>
        <p className="text-[11px] text-emerald-900/80 leading-relaxed font-sans">
          ১. এই ফ্রি কোর্সগুলো দেখার সময় আপনার ইন্টারনেট সংযোগ প্রয়োজন হবে। আপনি ফ্রিতে কোনো সাইন-আপ ব্যতিরেকে সরাসরি ভিডিও ক্লাসগুলি সম্পন্ন করতে পারবেন।<br />
          ২. কোর্সগুলোর লিংক অফিশিয়াল সাইট তথা টেন মিনিট স্কুল, বহুব্রীহি এবং অনলাইভ লাইভ কোর্সের মূল প্ল্যাটফর্মের সাথে সংযুক্ত।<br />
          ৩. ভবিষ্যতে যেকোনো গুরুত্বপূর্ণ নতুন ফ্রি আইটি কোর্স সংযোজন বা কোনো লিংকে ত্রুটি দেখা দিলে আমাদের কমেন্ট বক্স এবং রিভিউ সেকশন মারফত রিপোর্ট সাবমিট করতে পারেন।
        </p>
      </div>

    </div>
  );
}
