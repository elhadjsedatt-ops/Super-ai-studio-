import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Image as ImageIcon,
  Film,
  Clapperboard,
  BookOpen,
  Wand2,
  Download,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Copy,
  Check,
  UploadCloud,
  X,
  Zap,
  Eye,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Share2,
  Info,
  Palette,
  ShieldAlert,
  User,
  Boxes,
  Cpu,
  PenTool,
  Brain,
  Lock,
  Video,
  RefreshCw,
  GitCompare,
  Layers,
  FileText,
  Music,
  Link2,
  Youtube,
} from 'lucide-react';

// Static assets
import cinematicImg from './assets/images/recent_gen_cinematic_1793281083135.jpg';
import cyberpunkImg from './assets/images/recent_gen_cyberpunk_1793281083747.jpg';
import animeImg from './assets/images/recent_gen_anime_1793281082444.jpg';
import photoImg from './assets/images/recent_gen_photorealistic_1793281083917.jpg';

type TabType =
  | 'templates'
  | 'dashboard'
  | 'video-transform'
  | 'text-to-image'
  | 'text-to-video'
  | 'image-to-video'
  | 'text-to-story';

interface VideoRecreationScene {
  sceneNumber: number;
  timestamp: string;
  originalSnippet: string;
  upgradedVisual: string;
  cameraMovement: string;
  lightingMood: string;
  upgradedVoiceover: string;
  soundDesign: string;
  previewAsset: string;
}

interface VideoRecreationResult {
  status: string;
  source: string;
  analysis: {
    summary: string;
    detectedStyle: string;
    characters: string[];
    keyPacing: string;
    cinematicWeaknesses: string[];
    enhancementPlan: string;
  };
  recreation: {
    title: string;
    style: string;
    scenes: VideoRecreationScene[];
  };
  metrics: {
    resolution: string;
    frameRate: string;
    cinematicIndex: string;
    productionValue: string;
  };
}

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  quality: string;
  seed: number;
  imageUrl: string;
  createdAt: string;
}

interface SceneItem {
  scene_number: number;
  title: string;
  mood_and_lighting?: string;
  visual_prompt: string;
  voiceover: string;
  sound_effects?: string;
}

interface SharePayload {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
  category?: string;
}

// Accent Color Presets
interface AccentTheme {
  id: string;
  name: string;
  primary: string;
  hover: string;
  rgb: string;
  gradient: string;
  glow: string;
}

const ACCENT_THEMES: Record<string, AccentTheme> = {
  blue: {
    id: 'blue',
    name: 'أزرق ملكي (Royal Blue)',
    primary: '#2563eb',
    hover: '#1d4ed8',
    rgb: '37, 99, 235',
    gradient: 'from-blue-600 to-indigo-600',
    glow: 'rgba(37, 99, 235, 0.35)',
  },
  purple: {
    id: 'purple',
    name: 'بنفسجي نيون (Neon Purple)',
    primary: '#8b5cf6',
    hover: '#7c3aed',
    rgb: '139, 92, 246',
    gradient: 'from-purple-600 to-pink-600',
    glow: 'rgba(139, 92, 246, 0.35)',
  },
  emerald: {
    id: 'emerald',
    name: 'أخضر زمردي (Emerald)',
    primary: '#10b981',
    hover: '#059669',
    rgb: '16, 185, 129',
    gradient: 'from-emerald-600 to-teal-600',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  pink: {
    id: 'pink',
    name: 'وردي سايبربانك (Cyber Pink)',
    primary: '#ec4899',
    hover: '#db2777',
    rgb: '236, 72, 153',
    gradient: 'from-pink-600 to-rose-600',
    glow: 'rgba(236, 72, 153, 0.35)',
  },
  amber: {
    id: 'amber',
    name: 'ذهبي برّاق (Golden Amber)',
    primary: '#f59e0b',
    hover: '#d97706',
    rgb: '245, 158, 11',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  cyan: {
    id: 'cyan',
    name: 'سماوي كهربائي (Electric Cyan)',
    primary: '#06b6d4',
    hover: '#0891b2',
    rgb: '6, 182, 212',
    gradient: 'from-cyan-600 to-blue-600',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ----------------------------------------------------
  // BRANDING & ENGINE CUSTOMIZATION
  // ----------------------------------------------------
  const [brandName, setBrandName] = useState<string>(() => localStorage.getItem('app_brand_name') || 'SuperAI Studio');
  const [aiEngine, setAiEngine] = useState<string>(() => localStorage.getItem('app_ai_engine') || 'Gemini Ultra Pro v3');
  const [brandIcon, setBrandIcon] = useState<string>('sparkles');

  // Modals for engine & branding & auth
  const [showEngineModal, setShowEngineModal] = useState<boolean>(false);
  const [showLogoModal, setShowLogoModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showWatermarkProModal, setShowWatermarkProModal] = useState<boolean>(false);
  const [showAccentPickerModal, setShowAccentPickerModal] = useState<boolean>(false);

  // ----------------------------------------------------
  // ACCENT COLOR STATE
  // ----------------------------------------------------
  const [accentKey, setAccentKey] = useState<string>(() => localStorage.getItem('app_accent_color') || 'blue');
  const activeAccent = ACCENT_THEMES[accentKey] || ACCENT_THEMES.blue;

  const changeAccentColor = (key: string) => {
    if (ACCENT_THEMES[key]) {
      setAccentKey(key);
      localStorage.setItem('app_accent_color', key);
      showToast(`تم تغيير لون التمييز إلى: ${ACCENT_THEMES[key].name}`);
    }
  };

  // ----------------------------------------------------
  // POINT & CREDITS SYSTEM (1000 Daily Free Points)
  // ----------------------------------------------------
  const [userCredits, setUserCredits] = useState<number>(() => {
    const saved = localStorage.getItem('app_user_credits');
    return saved ? parseInt(saved, 10) : 1000;
  });
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('app_user_name') || 'مستكشف الذكاء الاصطناعي');

  const deductCredits = (cost: number): boolean => {
    if (userCredits < cost) {
      showToast(`عفواً، رصيدك غير كافٍ (${userCredits} نقطة). تكلفة العملية: ${cost} نقطة!`);
      setShowAuthModal(true);
      return false;
    }
    const updated = userCredits - cost;
    setUserCredits(updated);
    localStorage.setItem('app_user_credits', updated.toString());
    return true;
  };

  const rechargeCredits = (amount = 1000) => {
    const updated = userCredits + amount;
    setUserCredits(updated);
    localStorage.setItem('app_user_credits', updated.toString());
    showToast(`تمت إضافة ${amount} نقطة مجانية إلى حسابك بنجاح! الرصيد: ${updated}`);
  };

  // ----------------------------------------------------
  // WATERMARK CONFIG
  // ----------------------------------------------------
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const watermarkText = `✨ Generated by ${brandName}`;

  const handleWatermarkToggle = () => {
    // When clicked, inform the user that removing watermark is a PRO upcoming feature
    setShowWatermarkProModal(true);
  };

  // Helper to draw watermark on any canvas
  const stampWatermarkOnCanvas = (canvas: HTMLCanvasElement) => {
    if (!watermarkEnabled) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    const padding = 12;
    const fontSize = Math.max(12, Math.floor(canvas.width * 0.024));
    ctx.font = `600 ${fontSize}px 'Cairo', sans-serif`;

    const textMetrics = ctx.measureText(watermarkText);
    const boxWidth = textMetrics.width + 24;
    const boxHeight = fontSize + 16;
    const x = canvas.width - boxWidth - padding;
    const y = canvas.height - boxHeight - padding;

    // Draw dark glass background pill
    ctx.fillStyle = 'rgba(11, 15, 23, 0.78)';
    ctx.beginPath();
    ctx.roundRect(x, y, boxWidth, boxHeight, 8);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(watermarkText, x + 12, y + boxHeight / 2);
    ctx.restore();
  };

  // ----------------------------------------------------
  // SHARE SYSTEM & TOAST
  // ----------------------------------------------------
  const [shareData, setShareData] = useState<SharePayload | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerShare = async (payload: SharePayload, forceModal = false) => {
    if (!forceModal && navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url || window.location.href,
        });
        showToast('تمت مشاركة العمل بنجاح!');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }
    setShareData(payload);
    setCopiedLink(false);
  };

  const copyDirectShareLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('تم نسخ الرابط المباشر إلى الحافظة!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // ----------------------------------------------------
  // PRO TEMPLATES DATASET (Leonardo + CapCut + InstaSize)
  // ----------------------------------------------------
  const templatesList = [
    {
      id: 1,
      type: 'image',
      title: 'بورتريت سينمائي فوتوغرافي 8K',
      category: 'صور / InstaSize',
      desc: 'إضاءة سينمائية درامية وتركيز ضحل مع تفاصيل وجه فائقة الواقعية.',
      prompt: 'Cinematic dramatic portrait of an elegant Arab woman in traditional embroidered silk, golden hour desert lighting, bokeh background, 8k ultra realistic',
      badge: 'الأكثر طلباً',
      ratio: '4:5',
      style: 'Photorealistic',
    },
    {
      id: 2,
      type: 'image',
      title: 'شعار وهوية بصرية ثلاثية الأبعاد',
      category: 'تصميم / شعارات',
      desc: 'أيقونة متجهية عصرية لعلامة تقنية مع لمعان زجاجي وبلاستيكي احترافي.',
      prompt: 'Minimalist 3D vector logo icon of a digital brain interwoven with glowing circuit lines, glossy metallic octane render, dark background',
      badge: 'شعارات PRO',
      ratio: '1:1',
      style: '3D Render',
    },
    {
      id: 3,
      type: 'video',
      title: 'تريند TikTok وريلز متسارع (Hyperlapse)',
      category: 'فيديو / CapCut AI',
      desc: 'حركة كاميرا فائقة السرعة مع تأثيرات ضوئية متحركة بين ناطحات السحاب.',
      prompt: 'Fast paced hyperlapse drone flight through neon futuristic Dubai skyline, cyber aesthetic, glowing windows, smooth loop',
      badge: 'TikTok Trend',
      ratio: '9:16',
      style: 'Cyberpunk',
    },
    {
      id: 4,
      type: 'video',
      title: 'مقدمة سينمائية بالدرون (Drone Sweep)',
      category: 'فيديو / يوتيوب',
      desc: 'مسح جوي سينمائي بمسيرة طائرة على واحة طبيعية وجبال ساحرة عند الشروق.',
      prompt: 'Cinematic high altitude drone sweeping over a breathtaking mist covered oasis at sunrise, golden sunlight rays, 4k 60fps nature documentary',
      badge: 'مقدمة سينمائية',
      ratio: '16:9',
      style: 'Cinematic',
    },
    {
      id: 5,
      type: 'movie',
      title: 'ملحمة خيال علمي: كوكب البلورات المفقود',
      category: 'أفلام وقصص',
      desc: 'سيناريو متكامل من 3 مشاهد لرحلة استكشاف كوكب فضائي مليء بالطاقة البلورية.',
      prompt: 'في عام 2180، يكتشف طاقم سفينة فضاء عربية كوكباً نائياً تتلألأ بلوراته بترددات صوتية غامضة تتواصل مع العقول البشرية، ليخوضوا رحلة محفوفة بالأسرار لفك لغز الطاقة اللانهائية.',
      badge: 'قصة كاملة',
      ratio: '16:9',
      style: 'Cinematic',
    },
    {
      id: 6,
      type: 'movie',
      title: 'أسطورة الفارس وحارس البوابة الزمنية',
      category: 'أفلام وقصص',
      desc: 'سيناريو مغامرة تاريخية أسطورية تدور أحداثها حول قلعة قديمة وبوابة عبر العصور.',
      prompt: 'فارس عربي أسطوري يمتلك سيفاً مضيئاً بشحنات مغناطيسية قديمة، يقف أمام بوابة قلعة أثرية تفتح كل ألف عام لتنقله بين أزمنة الماضي والمستقبل لحماية حضارته.',
      badge: 'فيلم ملحمي',
      ratio: '16:9',
      style: 'Anime',
    },
    {
      id: 7,
      type: 'v2v',
      title: 'تحويل قصة دينية وتاريخية (سفينة النبي يونس)',
      category: 'تحويل فيديو / Video-to-Video',
      desc: 'إعادة إخراج فيديو قصة النبي يونس والحوت بأسلوب سينمائي هوليوودي 4K فائق الواقعية.',
      prompt: 'قصة النبي يونس في بطن الحوت وسفينة البحر الهائج',
      badge: 'Video-to-Video PRO',
      ratio: '16:9',
      style: 'Cinematic Hollywood',
    },
    {
      id: 8,
      type: 'v2v',
      title: 'ترقية وثائقي أسرار الحضارة الفرعونية وبناء الأهرامات',
      category: 'تحويل فيديو / Video-to-Video',
      desc: 'تحويل فيديو وثائقي قديم إلى لقطات درون سينمائية متطورة وإضاءة شمسية ذهبية.',
      prompt: 'ملحمة بناء الأهرامات وأسرار الحضارة المصرية والفرعونية القديمة',
      badge: 'وثائقي مهيب',
      ratio: '16:9',
      style: 'Historical Epic Documentary',
    },
  ];

  const [templateFilter, setTemplateFilter] = useState<string>('all');

  const handleApplyTemplate = (tpl: (typeof templatesList)[0]) => {
    if (tpl.type === 'image') {
      setImgPrompt(tpl.prompt);
      setImgAspectRatio(tpl.ratio);
      setImgStyle(tpl.style);
      setActiveTab('text-to-image');
    } else if (tpl.type === 'video') {
      setVideoPrompt(tpl.prompt);
      setActiveTab('text-to-video');
    } else if (tpl.type === 'movie') {
      setStoryInput(tpl.prompt);
      setActiveTab('text-to-story');
    } else if (tpl.type === 'v2v') {
      setVtTopic(tpl.prompt);
      setVtStyle(tpl.style);
      setActiveTab('video-transform');
    }
    showToast(`تم تطبيق قالب "${tpl.title}" بنجاح!`);
  };

  // ----------------------------------------------------
  // SECTION 2: Text-to-Image State
  // ----------------------------------------------------
  const [imgPrompt, setImgPrompt] = useState<string>('');
  const [imgAspectRatio, setImgAspectRatio] = useState<string>('16:9');
  const [imgStyle, setImgStyle] = useState<string>('Cinematic');
  const [imgQuality, setImgQuality] = useState<string>('HD');
  const [imgNegativePrompt, setImgNegativePrompt] = useState<string>('');
  const [showAdvancedImg, setShowAdvancedImg] = useState<boolean>(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState<boolean>(false);
  const [imgProgress, setImgProgress] = useState<number>(0);
  const [imgStatusStep, setImgStatusStep] = useState<string>('');
  const [selectedImgModal, setSelectedImgModal] = useState<GeneratedImage | null>(null);

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([
    {
      id: 'img-1',
      prompt: 'مدينة مستقبلية ذات عمارة انسيابية بين كثبان الصحراء الذهبية وقت الغسق، أضواء زرقاء ونوافذ دافئة',
      style: 'Cinematic',
      aspectRatio: '16:9',
      quality: 'HD',
      seed: 84920194,
      imageUrl: cinematicImg,
      createdAt: 'منذ 10 دقائق',
    },
    {
      id: 'img-2',
      prompt: 'فارس عربي بتقنيات سيبرانية متطورة ودرع معزز يقف على سطح برج شاهق يطل على مدينة مستقبلية مفعمة بالأضواء',
      style: 'Cyberpunk',
      aspectRatio: '16:9',
      quality: 'HD',
      seed: 39481902,
      imageUrl: cyberpunkImg,
      createdAt: 'منذ 35 دقيقة',
    },
    {
      id: 'img-3',
      prompt: 'قلعة أندلسية أسطورية عائمة في الفضاء محاطة بالنجوم وسحب السدم الملونة بأسلوب الأنمي الساحر',
      style: 'Anime',
      aspectRatio: '16:9',
      quality: 'HD',
      seed: 12048591,
      imageUrl: animeImg,
      createdAt: 'منذ ساعتين',
    },
    {
      id: 'img-4',
      prompt: 'جناح معماري فاخر ذو خطوط بارامترية منحنية في قلب واحة هادئة مع بركة عاكسة وإضاءة شمسية ذهبية',
      style: 'Photorealistic',
      aspectRatio: '16:9',
      quality: 'HD',
      seed: 58291043,
      imageUrl: photoImg,
      createdAt: 'منذ 4 ساعات',
    },
  ]);

  const handleGenerateImage = async () => {
    if (!imgPrompt.trim()) {
      showToast('يرجى كتابة وصف الصورة أولاً!');
      return;
    }

    // Deduct 10 points for Image
    if (!deductCredits(10)) return;

    setIsGeneratingImg(true);
    setImgProgress(15);
    setImgStatusStep('تحليل النص عبر محرك ' + aiEngine + '...');

    const timer1 = setTimeout(() => {
      setImgProgress(50);
      setImgStatusStep('توليد الإضاءة وحساب خريطة العمق...');
    }, 600);

    const timer2 = setTimeout(() => {
      setImgProgress(85);
      setImgStatusStep('إضافة العلامة المائية وتصيير البكسلات فائقة الدقة...');
    }, 1200);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imgPrompt,
          aspect_ratio: imgAspectRatio,
          style: imgStyle,
          quality: imgQuality,
          negative_prompt: imgNegativePrompt,
        }),
      });

      const data = await res.json();
      clearTimeout(timer1);
      clearTimeout(timer2);
      setImgProgress(100);
      setImgStatusStep('اكتمل التوليد بنجاح!');

      setTimeout(() => {
        const newImg: GeneratedImage = {
          id: `img-${Date.now()}`,
          prompt: data.prompt || imgPrompt,
          style: data.style || imgStyle,
          aspectRatio: data.aspect_ratio || imgAspectRatio,
          quality: data.quality || imgQuality,
          seed: data.seed || Math.floor(Math.random() * 90000000),
          imageUrl: data.image_url || cinematicImg,
          createdAt: 'الآن',
        };

        setGeneratedImages((prev) => [newImg, ...prev]);
        setIsGeneratingImg(false);
        showToast('تم توليد الصورة بنجاح وخصم 10 نقاط!');
      }, 400);
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGeneratingImg(false);
      showToast('تم استخدام المعاينة المحلية عالية الجودة.');
    }
  };

  // Watermarked Image Download using dynamic Canvas
  const downloadWatermarkedImage = (imageUrl: string, filename = 'generated-art.jpg') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1280;
      canvas.height = img.naturalHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Stamp watermark if enabled
      stampWatermarkOnCanvas(canvas);

      // Trigger download
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      showToast('تم تحميل الصورة مع العلامة المائية الرسمية!');
    };
    img.onerror = () => {
      // Fallback direct download
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = filename;
      a.click();
    };
  };

  // Enhance prompt with AI
  const handleEnhancePrompt = async (
    targetSetter: React.Dispatch<React.SetStateAction<string>>,
    currentPrompt: string
  ) => {
    if (!currentPrompt.trim()) {
      showToast('اكتب جملة أو فكرة بسيطة لتحسينها أولاً');
      return;
    }
    showToast('جاري تحسين الوصف عبر الذكاء الاصطناعي...');
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      const data = await res.json();
      if (data.enhanced) {
        targetSetter(data.enhanced);
        showToast('تم تحسين وتفصيل الوصف بنجاح!');
      }
    } catch {
      targetSetter(
        `${currentPrompt}، لقطة سينمائية ملحمية بزاوية تصوير عريضة وإضاءة طبيعية درامية مع تفاصيل بصرية دقيقة وعمق لوني متدرج.`
      );
      showToast('تم تعزيز الوصف بالأسلوب السينمائي');
    }
  };

  // ----------------------------------------------------
  // SECTION 3: Text-to-Video State
  // ----------------------------------------------------
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [videoMotion, setVideoMotion] = useState<number>(6);
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [videoCamera, setVideoCamera] = useState<string>('Drone Shot (تصوير درون جوي)');
  const [isVideoGenerating, setIsVideoGenerating] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoStatusStep, setVideoStatusStep] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      showToast('يرجى كتابة وصف المشهد السينمائي أولاً!');
      return;
    }

    // Deduct 50 points for Video
    if (!deductCredits(50)) return;

    setIsVideoGenerating(true);
    setVideoProgress(10);
    setVideoStatusStep('حساب المتجهات الحركية ومسار الكاميرا...');

    const t1 = setTimeout(() => {
      setVideoProgress(45);
      setVideoStatusStep('تصيير الإطارات المتتابعة وإضافة العلامة المائية...');
    }, 800);

    const t2 = setTimeout(() => {
      setVideoProgress(80);
      setVideoStatusStep('معالجة الإضاءة الحركية والتنعيم البصري...');
    }, 1600);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          duration: videoDuration,
          motion_intensity: videoMotion,
          camera_movement: videoCamera,
        }),
      });

      const data = await res.json();
      clearTimeout(t1);
      clearTimeout(t2);
      setVideoProgress(100);
      setVideoStatusStep('اكتمل إنتاج الفيديو!');

      setTimeout(() => {
        if (data.video_url) {
          setGeneratedVideoUrl(data.video_url);
        }
        setIsVideoGenerating(false);
        showToast('تم توليد مقطع الفيديو بنجاح وخصم 50 نقطة!');
        if (videoPlayerRef.current) {
          videoPlayerRef.current.currentTime = 0;
          videoPlayerRef.current.play();
          setIsVideoPlaying(true);
        }
      }, 400);
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsVideoGenerating(false);
      showToast('تم تحميل المقطع الاستعراضي.');
    }
  };

  // ----------------------------------------------------
  // SECTION 4: Image-to-Video State
  // ----------------------------------------------------
  const [i2vImage, setI2vImage] = useState<string | null>(cinematicImg);
  const [i2vPrompt, setI2vPrompt] = useState<string>('حركة انسيابية للسحب وحركة كاميرا أمامية سينمائية هادئة');
  const [i2vMotion, setI2vMotion] = useState<number>(6);
  const [isI2vGenerating, setIsI2vGenerating] = useState<boolean>(false);
  const [i2vProgress, setI2vProgress] = useState<number>(0);
  const [i2vStatusStep, setI2vStatusStep] = useState<string>('');
  const [i2vVideoUrl, setI2vVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  );
  const i2vVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setI2vImage(event.target.result as string);
          showToast(`تم رفع الصورة: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImageToVideo = async () => {
    if (!i2vImage) {
      showToast('يرجى تحديد أو رفع صورة أولاً!');
      return;
    }

    // Deduct 50 points
    if (!deductCredits(50)) return;

    setIsI2vGenerating(true);
    setI2vProgress(15);
    setI2vStatusStep('استنتاج خريطة العمق ثلاثية الأبعاد (3D Depth)...');

    const t1 = setTimeout(() => {
      setI2vProgress(50);
      setI2vStatusStep('استيفاء وتوليد الإطارات البينية (Frame Interpolation)...');
    }, 700);

    const t2 = setTimeout(() => {
      setI2vProgress(85);
      setI2vStatusStep('تطبيق العلامة المائية والتحسين النهائي...');
    }, 1400);

    try {
      const res = await fetch('/api/image-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: i2vPrompt,
          image_url: i2vImage,
          motion_intensity: i2vMotion,
        }),
      });
      const data = await res.json();
      clearTimeout(t1);
      clearTimeout(t2);
      setI2vProgress(100);
      setI2vStatusStep('تم تحريك الصورة بنجاح!');

      setTimeout(() => {
        if (data.video_url) {
          setI2vVideoUrl(data.video_url);
        }
        setIsI2vGenerating(false);
        showToast('تم توليد الفيديو المتحرك من الصورة وخصم 50 نقطة!');
        if (i2vVideoRef.current) {
          i2vVideoRef.current.currentTime = 0;
          i2vVideoRef.current.play();
        }
      }, 400);
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsI2vGenerating(false);
      showToast('تم إكمال المحاكاة بنجاح.');
    }
  };

  // ----------------------------------------------------
  // SECTION 5: Text-to-Movie & Story State
  // ----------------------------------------------------
  const [storyInput, setStoryInput] = useState<string>(
    'في قلب صحراء الربع الخالي عام 2090، يكتشف باحث جيولوجي شاب واحة تقنية خفية تحت الكثبان، تعمل بطاقة الاندماج النجمي. يجد في وسطها برجاً زجاجياً يتواصل بنبضات ضوئية مع مركبات فضائية قادمة من خارج المجموعة الشمسية، مما يضعه أمام خيار مصيري بين إبلاغ البشرية أو حماية سر الواحة المقدس.'
  );
  const [storyTitle, setStoryTitle] = useState<string>('واحة النجوم 2090');
  const [storyGenre, setStoryGenre] = useState<string>('خيال علمي وسرد سينمائي');
  const [isStoryGenerating, setIsStoryGenerating] = useState<boolean>(false);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [storyScenes, setStoryScenes] = useState<SceneItem[]>([
    {
      scene_number: 1,
      title: 'المشهد الأول: رمال الربع الخالي واكتشاف الأثر',
      mood_and_lighting: 'شمس ظهيرة ساطعة ذات وهج ذهبي وانعكاسات حرارية متموجة على الرمال',
      visual_prompt:
        'لقطة تأسيسية واسعة (Extreme Wide Angle) لكثبان رملية لا متناهية، يظهر في وسطها مستكشف شاب بزي وقائي متطور يتأمل فتحة دائرية تصدر منها أشعة نيون زرقاء خافتة تخترق الكثبان.',
      voiceover:
        'لم تكن الرمال صامتة كما يظن العابرون، بل كانت تخبئ في طياتها نبض حضارة تنتظر من يفك شفرتها.',
      sound_effects: 'هبوب رياح صحراوية ناعمة تعقبها نغمة رنين كهرومغناطيسية منخفضة التردد',
    },
    {
      scene_number: 2,
      title: 'المشهد الثاني: الولوج إلى قلب الواحة التكنولوجية',
      mood_and_lighting: 'إضاءة داخلية باردة مستوحاة من أضواء السيان النيلية مع ومضات طاقة بيضاء',
      visual_prompt:
        'لقطة سينمائية متحركة (Dolly In) تكشف نزول المستكشف في مدرج حلزوني عملاق تحيط به مزارع مائية مضيئة وبرج كريستالي شاهق ينبض بالطاقة الحيوية.',
      voiceover:
        'هنا، حيث انصهرت التكنولوجيا بالبقاء، أدرك الشاب أن المستقبل قد شُيد سراً تحت أقدامنا منذ قرون.',
      sound_effects: 'صوت اندفاع هواء مضغوط وأزيز طاقة اندماجية متناغم مثل دقات قلب معدنية',
    },
    {
      scene_number: 3,
      title: 'المشهد الثالث: إشارات النجوم والقرار الحاسم',
      mood_and_lighting: 'سماء ليلية صافية تملأها المجرات مع شعاع ليزري يرتفع عمودياً من قمة البرج نحو الفضاء',
      visual_prompt:
        'لقطة مقربة (Close-up) على عيني الباحث المنبهرتين بينما تنعكس في خوذته خريطة ملاحية كونية تتصل بمركبة غامضة في المدار، وإصبعه يتردد فوق زر الإرسال.',
      voiceover:
        'بين الصمت الكوني وصخب العالم الخارجي، كان عليه أن يختار: هل يوقظ العالم، أم يحرس المعجزة؟',
      sound_effects: 'تصاعد موسيقى أوركسترالية مهيبة مع تردد إشارات شفرة مورس فضائية نقية',
    },
  ]);

  const handleGenerateStory = async () => {
    if (!storyInput.trim()) {
      showToast('يرجى كتابة نص القصة أو السيناريو أولاً!');
      return;
    }

    // Deduct 100 points for Story
    if (!deductCredits(100)) return;

    setIsStoryGenerating(true);
    setStoryProgress(20);

    const t1 = setTimeout(() => setStoryProgress(60), 600);
    const t2 = setTimeout(() => setStoryProgress(85), 1200);

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: storyInput }),
      });

      const data = await res.json();
      clearTimeout(t1);
      clearTimeout(t2);
      setStoryProgress(100);

      setTimeout(() => {
        if (data.scenes && Array.isArray(data.scenes)) {
          setStoryScenes(data.scenes);
          if (data.title) setStoryTitle(data.title);
          if (data.genre) setStoryGenre(data.genre);
        }
        setIsStoryGenerating(false);
        showToast('تم تفكيك القصة بنجاح إلى مشاهد سينمائية مع العلامة المائية وخصم 100 نقطة!');
      }, 400);
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsStoryGenerating(false);
      showToast('تم تحليل القصة بالنموذج الداخلي.');
    }
  };

  // Browser Text-to-Speech (Arabic Voiceover playback)
  const [playingVoiceScene, setPlayingVoiceScene] = useState<number | null>(null);

  const handlePlayVoiceover = (sceneNum: number, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('المتصفح لا يدعم ميزة قراءة الصوت');
      return;
    }

    if (playingVoiceScene === sceneNum) {
      window.speechSynthesis.cancel();
      setPlayingVoiceScene(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => setPlayingVoiceScene(null);
    utterance.onerror = () => setPlayingVoiceScene(null);

    setPlayingVoiceScene(sceneNum);
    window.speechSynthesis.speak(utterance);
    showToast(`جاري تشغيل التعليق الصوتي للمشهد #${sceneNum}`);
  };

  const handleUseScenePrompt = (visualPrompt: string) => {
    setImgPrompt(visualPrompt);
    setActiveTab('text-to-image');
    showToast('تم نقل التوجيه البصري للمشهد إلى استوديو توليد الصور!');
  };

  // Quick preset stories
  const loadPresetStory = (type: 'oasis' | 'clock' | 'knight') => {
    if (type === 'oasis') {
      setStoryInput(
        'في قلب صحراء الربع الخالي عام 2090، يكتشف باحث جيولوجي شاب واحة تقنية خفية تحت الكثبان، تعمل بطاقة الاندماج النجمي. يجد في وسطها برجاً زجاجياً يتواصل بنبضات ضوئية مع مركبات فضائية قادمة من خارج المجموعة الشمسية، مما يضعه أمام خيار مصيري بين إبلاغ البشرية أو حماية سر الواحة المقدس.'
      );
    } else if (type === 'clock') {
      setStoryInput(
        'في مدينة أثرية عتيقة، يلاحظ ساعاتي عبقري أن ساعة البرج التاريخية تتوقف دائماً لمدة 60 ثانية كل ليلة عند الساعة 03:00 فجراً. حين يتسلق إلى قلب تروس الساعة، يكتشف بوابة زمنية بلورية تجمد الوقت وتتيح له السفر بين أبعاد الماضي والمستقبل لإنقاذ المدينة من زلزال وشيك.'
      );
    } else if (type === 'knight') {
      setStoryInput(
        'فارس عربي أسطوري في عصر التكنولوجيا المتقدمة يحمل سيفاً مدمجاً ببلورة طاقة كهرومغناطيسية. ينطلق في مهمة عبر مدن معلقة في السماء لاستعادة رمز العدالة المسروق، مواجهاً أسراب الطائرات المسيرة والتحديات الرقمية بشجاعة وفروسية عربية أصيلة.'
      );
    }
    showToast('تم تحميل السيناريو الجاهز!');
  };

  // ----------------------------------------------------
  // SECTION 6: Video Analysis & Video-to-Video Transformation
  // ----------------------------------------------------
  const [vtSourceMode, setVtSourceMode] = useState<'topic' | 'link' | 'upload'>('topic');
  const [vtTopic, setVtTopic] = useState<string>('قصة النبي يونس في بطن الحوت وسفينة البحر الهائج');
  const [vtUrl, setVtUrl] = useState<string>('https://www.youtube.com/watch?v=sample-prophetic-story');
  const [vtFileName, setVtFileName] = useState<string>('younus_sea_storm_original.mp4');
  const [vtStyle, setVtStyle] = useState<string>('Cinematic Hollywood');
  const [vtPacing, setVtPacing] = useState<string>('سينمائي متزن');
  const [vtVoiceMood, setVtVoiceMood] = useState<string>('سرد تاريخي وقور');

  const [isTransformingVideo, setIsTransformingVideo] = useState<boolean>(false);
  const [vtStep, setVtStep] = useState<number>(0);
  const [vtStepTitle, setVtStepTitle] = useState<string>('');
  const [vtProgress, setVtProgress] = useState<number>(0);

  const [vtResult, setVtResult] = useState<VideoRecreationResult | null>({
    status: 'success',
    source: 'superai-studio-recreation-core',
    analysis: {
      summary:
        'تحليل قصة النبي يونس في بطن الحوت: كشف عناصر السفينة التاريخية، موج البحر العاتي، وظلمة بطن الحوت مع نبرة دعاء وتضرع خاشعة.',
      detectedStyle: 'فيديو تسجيلي تقليدي منخفض الدقة (720p) وبإضاءة مسطحة',
      characters: ['النبي يونس (عليه السلام)', 'ركاب السفينة والملاحين', 'الحوت الأزرق العملاق'],
      keyPacing: 'الحركة الأصلية تفتقر للديناميكية مع ثبات زوايا الكاميرا وضعف تأثيرات المياه',
      cinematicWeaknesses: [
        'دقة تفاصيل المشاهد منخفضة والتباين ضعيف',
        'غياب فيزيائية حركة الأمواج ورذاذ الماء الواقعي',
        'التعليق الصوتي أحادي القناة مع غياب العمق المكاني',
        'الإضاءة غير موجهة ولا تعكس رهبة العاصفة وظلمة البحر',
      ],
      enhancementPlan:
        'إعادة بناء ملحمية 4K بمؤثرات إضاءة حجمية، دوران درون هوائي حول صواري السفينة، ومحاكاة محيطية مجسمة مع أوركسترا كورالية مهيبة.',
    },
    recreation: {
      title: 'الملحمة السينمائية المجددة: النبي يونس وظلمات البحر العاصف',
      style: 'Cinematic Hollywood',
      scenes: [
        {
          sceneNumber: 1,
          timestamp: '00:00 - 00:05',
          originalSnippet: 'لقطة عادية لسفينة خشبية صغيرة في مياه بحر ساكنة مع ألوان رمادية باهتة.',
          upgradedVisual:
            'لقطة درون هوائية فائقة الانخفاض (Extreme Low Drone) تندفع بين أمواج شاهقة تتلاطم بعنف مع هبوب رياح تجر أشرعة السفينة الممزقة، وبروق ساطعة تشق سواد السماء وتنعكس على مياه المحيط الداكنة بدقة 8K.',
          cameraMovement: 'انقضاض درون حلزوني يرتفع من مستوى الأمواج إلى قمة السارية الرئيسية (Spiral Dive to High Jib).',
          lightingMood: 'شفق رمادي عاصف مع لمعان برقي أزرق ثلجي يضيء قطرات الرذاذ المعلقة في الهواء.',
          upgradedVoiceover:
            'حين اظلمّت آفاق اليمّ، وتلاطمت أمواج كالجبال، وقفت السفينة تترنح بين صدمات القضاء وقدر مكتوب...',
          soundDesign: 'هدير بحر عاتي، صرير أخشاب السفينة تحت وطأة الموج، ودوي رعد عميق مع نبضات طبول ملحمية.',
          previewAsset: cinematicImg,
        },
        {
          sceneNumber: 2,
          timestamp: '00:05 - 00:10',
          originalSnippet: 'رسم ثابت للحوت في أعماق المياه دون عمق حركي أو إضاءة واقعية.',
          upgradedVisual:
            'لقطة غوص سينمائي مذهلة إلى أعماق المحيط السحيق، يُسلط فيها شعاع نوراني باهر يكشف الهيكل المهيب لحوت عملاق يسبح بوقار وسكون في ظلمات المياه، مع جزيئات عوالق بحرية متوهجة بيولوجياً (Bioluminescence).',
          cameraMovement:
            'تتبع بطيء انسيابي (Slow Cinematic Tracking) يتحرك بمحاذاة عين الحوت العملاق بانعكاسات ضوئية فائقة الدقة.',
          lightingMood: 'ظلمة محيطية زرقاء عميقة تخترقها حزم ضوء فيروزي وشعاع نوراني رباني مركز.',
          upgradedVoiceover:
            'وفي بطن الظلمة، حيث انقطع حبل الأسباب، تعالت أصدق كلمات التضرع: لا إله إلا أنت سبحانك إني كنت من الظالمين...',
          soundDesign: 'رنين تشيلو منفرد ينبض في سكون الأعماق، صدى ترددات صوتية مائية عميقة، ونبض قلب خافت يعبر عن الرجاء.',
          previewAsset: cyberpunkImg,
        },
        {
          sceneNumber: 3,
          timestamp: '00:10 - 00:15',
          originalSnippet: 'مشهد ختامي سريع لشاطئ رملي دون تفاصيل أشجار أو تفاعل الطبيعة.',
          upgradedVisual:
            'مشهد شروق شمس ذهبي دافئ وساحر يغمر شاطئاً عذرياً برمال بيضاء ناعمة، حيث تنبت شجرة اليقطين بأوراق عريضة تتلألأ عليها قطرات الندى في نسيم الصباح العليل، في تجسيد حي لرحمة الخالق وانفراج الكرب.',
          cameraMovement: 'تراجع سينمائي بطيء للأعلى (Smooth Crane Back) يكشف الأفق الممتد وسكون البحر بعد العاصفة.',
          lightingMood: 'إضاءة شمسية ذهبية ناعمة (Golden Hour Glow) تعكس الطمأنينة والسكينة.',
          upgradedVoiceover:
            'فأنجاه الله برحمته ولطفه، لتظل الآية نبراساً لكل مكروب أن فرج الله أقرب مما يظنون.',
          soundDesign: 'تصاعد أوركسترالي دافئ بنغمات الناي والكمان مع صوت تكسر أمواج هادئة وتغريد طيور النورس.',
          previewAsset: photoImg,
        },
      ],
    },
    metrics: {
      resolution: '4K Cinema HDR (3840x2160)',
      frameRate: '60 FPS Ultra-Smooth',
      cinematicIndex: '9.9 / 10',
      productionValue: '+480% Realism Boost',
    },
  });

  const [comparisonMode, setComparisonMode] = useState<'after' | 'before' | 'split'>('after');
  const [isPlayerPlaying, setIsPlayerPlaying] = useState<boolean>(false);
  const [playingVtVoiceScene, setPlayingVtVoiceScene] = useState<number | null>(null);

  const handleRunVideoTransformation = async () => {
    const topicToUse =
      vtSourceMode === 'topic'
        ? vtTopic
        : vtSourceMode === 'link'
        ? vtUrl
        : vtFileName || 'فيديو مرفوع من الجهاز';

    if (!topicToUse.trim()) {
      showToast('يرجى تحديد موضوع الفيديو أو الرابط أولاً!');
      return;
    }

    // Deduct 100 points for Video Analysis & Recreation
    if (!deductCredits(100)) return;

    setIsTransformingVideo(true);
    setVtStep(1);
    setVtStepTitle('المرحلة 1: تحليل الفيديو الأصلي وتفريغ النص والرموز...');
    setVtProgress(18);

    const t1 = setTimeout(() => {
      setVtStep(2);
      setVtStepTitle('المرحلة 2: صياغة السيناريو التوليدي والتعليق الصوتي المطور...');
      setVtProgress(40);
    }, 700);

    const t2 = setTimeout(() => {
      setVtStep(3);
      setVtStepTitle('المرحلة 3: هندسة الأوامر البصرية 8K وزوايا حركة الكاميرا...');
      setVtProgress(65);
    }, 1500);

    const t3 = setTimeout(() => {
      setVtStep(4);
      setVtStepTitle('المرحلة 4: التوليد والرندرة السينمائية متعددة الطبقات بمحرك ' + aiEngine + '...');
      setVtProgress(88);
    }, 2300);

    const t4 = setTimeout(() => {
      setVtStep(5);
      setVtStepTitle('المرحلة 5: المكساج النهائي، المؤثرات الصوتية وختم العلامة المائية...');
      setVtProgress(98);
    }, 3100);

    try {
      const res = await fetch('/api/analyze-and-recreate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoSource: vtUrl,
          videoTopic: topicToUse,
          recreationStyle: vtStyle,
          pacing: vtPacing,
          voiceoverMood: vtVoiceMood,
        }),
      });

      const data = await res.json();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);

      if (data.analysis && data.recreation) {
        setVtResult(data);
        setVtProgress(100);
        setTimeout(() => {
          setIsTransformingVideo(false);
          showToast('تمت إعادة هندسة وإنتاج الفيديو السينمائي بنجاح (خصم 100 نقطة)!');
        }, 500);
      } else {
        throw new Error('بيانات غير متوقعة');
      }
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setIsTransformingVideo(false);
      showToast('تم تطبيق التوليد السينمائي بالنموذج الداخلي.');
    }
  };

  const handlePlayVtVoiceover = (sceneNum: number, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('المتصفح لا يدعم ميزة قراءة الصوت');
      return;
    }
    if (playingVtVoiceScene === sceneNum) {
      window.speechSynthesis.cancel();
      setPlayingVtVoiceScene(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;
    utterance.onend = () => setPlayingVtVoiceScene(null);
    utterance.onerror = () => setPlayingVtVoiceScene(null);
    setPlayingVtVoiceScene(sceneNum);
    window.speechSynthesis.speak(utterance);
    showToast(`تشغيل التعليق الصوتي للمشهد #${sceneNum}`);
  };

  const loadPresetVt = (presetKey: 'younus' | 'pyramids' | 'tiktok_drone') => {
    if (presetKey === 'younus') {
      setVtTopic('قصة النبي يونس في بطن الحوت وسفينة البحر الهائج');
      setVtStyle('Cinematic Hollywood');
      setVtVoiceMood('سرد تاريخي وقور');
      setVtPacing('سينمائي متزن');
      setVtSourceMode('topic');
    } else if (presetKey === 'pyramids') {
      setVtTopic('ملحمة بناء الأهرامات وأسرار الحضارة المصرية والفرعونية القديمة');
      setVtStyle('Historical Epic Documentary');
      setVtVoiceMood('معلق وثائقي هوليوودي');
      setVtPacing('وثائقي ملحمي عميق');
      setVtSourceMode('topic');
    } else if (presetKey === 'tiktok_drone') {
      setVtTopic('تحويل ريلز تيك توك تصوير هاتف مهتز إلى درون سينمائي فائق الدقة 8K لمدينة دبي الحديثة');
      setVtStyle('Cyberpunk Hyperlapse');
      setVtVoiceMood('درامي ملحمي مشحون بالمشاعر');
      setVtPacing('سريع ومشوق (TikTok/Reels)');
      setVtSourceMode('topic');
    }
    showToast('تم تحميل القالب الجاهز لتحويل الفيديو!');
  };

  return (
    <div
      className="flex min-h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white"
      dir="rtl"
      style={
        {
          '--accent-color': activeAccent.primary,
          '--accent-hover': activeAccent.hover,
          '--accent-glow': activeAccent.glow,
        } as React.CSSProperties
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 shadow-2xl text-white px-5 py-3 rounded-xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <aside className="w-64 bg-[#0F172A]/95 border-l border-slate-800 flex flex-col fixed inset-y-0 right-0 z-40 backdrop-blur-md">
        {/* Brand Lockup with live Logo Designer Trigger */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowLogoModal(true)}
            title="انقر لتعديل اسم وشعار المنصة"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeAccent.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}
              style={{ boxShadow: `0 4px 14px ${activeAccent.glow}` }}
            >
              {brandIcon === 'brain' && <Brain className="w-5 h-5 text-white" />}
              {brandIcon === 'film' && <Film className="w-5 h-5 text-white" />}
              {brandIcon === 'sparkles' && <Sparkles className="w-5 h-5 text-white" />}
              {brandIcon === 'zap' && <Zap className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base text-white leading-tight tracking-tight">{brandName}</h1>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">استوديو الذكاء التوليدي</span>
            </div>
          </div>

          <button
            onClick={() => setShowLogoModal(true)}
            className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="تخصيص الشعار"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Engine Badge Quick Switcher */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span>المحرك:</span>
          </span>
          <button
            onClick={() => setShowEngineModal(true)}
            className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>{aiEngine}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'templates'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'templates' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <Boxes className="w-4 h-4 shrink-0 text-amber-300" />
            <span>القوالب الجاهزة (Templates)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'dashboard' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>لوحة التحكم الرئيسية</span>
          </button>

          <button
            onClick={() => setActiveTab('video-transform')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'video-transform'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'video-transform' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 shrink-0 text-amber-300" />
              <span>تحليل وتحويل الفيديو</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              PRO
            </span>
          </button>

          <button
            onClick={() => setActiveTab('text-to-image')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'text-to-image'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'text-to-image' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>توليد الصور من النصوص</span>
          </button>

          <button
            onClick={() => setActiveTab('text-to-video')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'text-to-video'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'text-to-video' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <Film className="w-4 h-4 shrink-0" />
            <span>توليد الفيديوهات من النصوص</span>
          </button>

          <button
            onClick={() => setActiveTab('image-to-video')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'image-to-video'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'image-to-video' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <Clapperboard className="w-4 h-4 shrink-0" />
            <span>تحويل الصور إلى فيديو</span>
          </button>

          <button
            onClick={() => setActiveTab('text-to-story')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'text-to-story'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={activeTab === 'text-to-story' ? { backgroundColor: activeAccent.primary } : {}}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>صانع الأفلام والقصص</span>
          </button>
        </nav>

        {/* Watermark Toggle & Credits Box */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Watermark Pro Switch */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>إزالة العلامة المائية</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                PRO
              </span>
            </div>
            <button
              onClick={handleWatermarkToggle}
              className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded-lg border border-slate-700 flex items-center justify-between transition"
            >
              <span>العلامة: مفعّلة تلقائياً</span>
              <span className="text-amber-400 font-semibold">ترقية لـ PRO</span>
            </button>
          </div>

          {/* User Credits Box */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">الرصيد المجاني اليومي</span>
              <span className="font-bold tabular-nums" style={{ color: activeAccent.primary }}>
                {userCredits.toLocaleString('ar-EG')} نقطة
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (userCredits / 1000) * 100)}%`,
                  backgroundColor: activeAccent.primary,
                }}
              ></div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="truncate max-w-[100px]">{userName}</span>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-amber-400 font-bold hover:underline"
              >
                شحن / مكافأة +1000
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN VIEWPORT */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 mr-64 p-8 min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-white">{brandName}</span>
              <span>/</span>
              <span style={{ color: activeAccent.primary }} className="font-bold">
                {activeTab === 'templates' && 'مكتبة القوالب الذكية الاحترافية'}
                {activeTab === 'dashboard' && 'لوحة التحكم'}
                {activeTab === 'video-transform' && 'تحليل وتجديد الفيديوهات (Video-to-Video)'}
                {activeTab === 'text-to-image' && 'توليد الصور من النصوص'}
                {activeTab === 'text-to-video' && 'توليد الفيديو من نصوص'}
                {activeTab === 'image-to-video' && 'تحويل الصور الثابتة إلى فيديو'}
                {activeTab === 'text-to-story' && 'صانع القصص والأفلام'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {activeTab === 'templates' && 'قوالب سريعة متفوقة على Leonardo & CapCut'}
              {activeTab === 'dashboard' && 'استوديو الإنتاج البصري والذكاء التوليدي'}
              {activeTab === 'video-transform' && 'استوديو تحليل وتحويل الفيديوهات إلى سينما 4K'}
              {activeTab === 'text-to-image' && 'استوديو توليد الصور الفنية فائقة الدقة'}
              {activeTab === 'text-to-video' && 'استوديو تصيير الفيديو السينمائي'}
              {activeTab === 'image-to-video' && 'محرك تحريك الصور وتحويلها لفيديو'}
              {activeTab === 'text-to-story' && 'مساعد تفكيك النصوص وسيناريوهات الأفلام'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Accent Color Picker Trigger Button */}
            <button
              onClick={() => setShowAccentPickerModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-2"
              title="تغيير لون التمييز للتطبيق"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/40"
                style={{ backgroundColor: activeAccent.primary }}
              ></div>
              <span className="text-slate-200">لون التمييز</span>
              <Palette className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* AI Engine Switcher Trigger */}
            <button
              onClick={() => setShowEngineModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition flex items-center gap-2"
              title="تغيير محرك الذكاء الاصطناعي"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{aiEngine}</span>
            </button>

            {/* Watermark Status Badge */}
            <button
              onClick={handleWatermarkToggle}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition flex items-center gap-2"
              title="إدارة العلامة المائية"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>علامة مائية: مفعلة</span>
            </button>

            {/* Login / Auth Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              style={{ backgroundColor: activeAccent.primary }}
            >
              <User className="w-3.5 h-3.5" />
              <span>{userName.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* TAB 0: SMART PRO TEMPLATES (Leonardo & CapCut Style) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#111827] border border-slate-800/90 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-amber-400" />
                  <span>مكتبة القوالب الجاهزة المجهزة مسبقاً بنقرة واحدة</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  اختر من قوالب السوشيال ميديا، إعلانات التيك توك، الشعارات ثلاثية الأبعاد، والأفلام لتطبيقها فوراً.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 shrink-0">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'image', label: 'صور (InstaSize)' },
                  { id: 'video', label: 'فيديو (CapCut)' },
                  { id: 'movie', label: 'قصص وأفلام' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTemplateFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      templateFilter === f.id
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    style={templateFilter === f.id ? { backgroundColor: activeAccent.primary } : {}}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {templatesList
                .filter((t) => templateFilter === 'all' || t.type === templateFilter)
                .map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 text-[10px]">
                          {tpl.badge}
                        </span>
                        <span className="text-slate-400 text-[11px]">{tpl.category}</span>
                      </div>

                      <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition leading-snug">
                        {tpl.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">{tpl.desc}</p>

                      <div className="p-3 bg-[#0B0F17] rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono line-clamp-2">
                        "{tpl.prompt}"
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyTemplate(tpl)}
                      className="w-full py-2.5 rounded-xl text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
                      style={{ backgroundColor: activeAccent.primary }}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>تطبيق القالب فوراً</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#111827] border border-slate-800/90 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">صور مُولدة (10ن)</span>
                  <h3 className="text-xl font-black text-white tabular-nums tracking-tight">1,248</h3>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800/90 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">فيديوهات نصوص (50ن)</span>
                  <h3 className="text-xl font-black text-white tabular-nums tracking-tight">312</h3>
                </div>
              </div>

              <div className="bg-[#111827] border border-amber-500/30 p-4 rounded-2xl flex items-center gap-3 bg-amber-500/5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-amber-300 font-bold block mb-0.5">تحويل فيديو (100ن)</span>
                  <h3 className="text-xl font-black text-white tabular-nums tracking-tight">42</h3>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800/90 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">قصص وأفلام (100ن)</span>
                  <h3 className="text-xl font-black text-white tabular-nums tracking-tight">85</h3>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800/90 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">زمن المعالجة القياسي</span>
                  <h3 className="text-xl font-black text-white tabular-nums tracking-tight">2.8s</h3>
                </div>
              </div>
            </div>

            {/* Quick Actions Hero Banner */}
            <div
              className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-[#111827] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
              style={{ borderColor: activeAccent.primary + '40' }}
            >
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-white text-xs rounded-full font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>محرك {aiEngine} مع علامة مائية رسمية ونظام نقاط مجاني</span>
                </div>
                <h3 className="text-2xl font-bold text-white leading-snug">
                  مرحباً بك في {brandName}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  الاستوديو المتكامل لتحليل وتحويل الفيديوهات القديمة لسينما 4K، توليد الصور فائقة الدقة، تحريك اللقطات، وتفكيك القصص إلى مشاهد كاملة.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setActiveTab('video-transform')}
                  className="px-4 py-2.5 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تحليل وتحويل فيديو (100ن)</span>
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="px-4 py-2.5 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: activeAccent.primary }}
                >
                  <Boxes className="w-4 h-4" />
                  <span>تصفح القوالب</span>
                </button>
                <button
                  onClick={() => setActiveTab('text-to-image')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>توليد صور (10ن)</span>
                </button>
              </div>
            </div>

            {/* Recent Generations Showcase */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">أحدث الأعمال المولدة في الاستوديو</h3>
                  <p className="text-xs text-slate-400">جميع النتائج تتضمن العلامة المائية الرسمية مع إمكانية المشاركة والتحميل</p>
                </div>
                <button
                  onClick={() => setActiveTab('text-to-image')}
                  className="text-xs font-semibold hover:underline transition flex items-center gap-1"
                  style={{ color: activeAccent.primary }}
                >
                  <span>عرض جميع الصور</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {generatedImages.map((img) => (
                  <div
                    key={img.id}
                    className="group bg-[#111827] border border-slate-800/90 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col"
                  >
                    <div
                      className="relative aspect-video overflow-hidden bg-slate-900 cursor-pointer"
                      onClick={() => setSelectedImgModal(img)}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Watermark badge on card preview */}
                      {watermarkEnabled && (
                        <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[9px] text-slate-300 font-semibold border border-white/10 backdrop-blur-sm pointer-events-none">
                          {watermarkText}
                        </div>
                      )}

                      <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-[10px] px-2 py-0.5 rounded-md text-slate-300 font-semibold border border-white/10">
                        {img.style}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed" title={img.prompt}>
                        {img.prompt}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                        <span>{img.createdAt}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(img.prompt);
                              showToast('تم نسخ الوصف إلى الحافظة!');
                            }}
                            className="text-slate-400 hover:text-white transition p-1"
                            title="نسخ الوصف"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              triggerShare({
                                title: `تصميم إبداعي بنمط ${img.style} - ${brandName}`,
                                text: `اكتشف هذا التصميم المولد بنمط ${img.style}:\n"${img.prompt}"`,
                                url: window.location.href,
                                imageUrl: img.imageUrl,
                                category: img.style,
                              })
                            }
                            className="text-slate-400 hover:text-white transition p-1"
                            title="مشاركة (Web Share)"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => downloadWatermarkedImage(img.imageUrl, `superai-${img.id}.jpg`)}
                            className="text-slate-400 hover:text-white transition p-1"
                            title="تحميل مع العلامة المائية"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 1.5: VIDEO ANALYSIS & VIDEO-TO-VIDEO RECREATION */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'video-transform' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Banner */}
            <div
              className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl"
              style={{ borderColor: activeAccent.primary + '40' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-full font-bold">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تقنية Video-to-Video Transformation المتقدمة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                    المحرك: {aiEngine}
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    تكلفة العملية: 100 نقطة
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                تحليل الفيديوهات وإعادة إنتاجها سينمائياً (Video-to-Video)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                ارفع فيديو قديماً، أو ضع رابطاً، أو حدد قصة ملحمية (مثل قصص الأنبياء، التاريخ الإسلامي، أو ريلز الهاتف). يقوم الذكاء الاصطناعي بفحص الكادرات، تفريغ النص، ثم إعادة إخراج العمل كفيديو سينمائي 4K فائق الاحترافية بحركات كاميرا هوليوودية وهندسة صوتية متكاملة.
              </p>
            </div>

            {/* Input & Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Input Source & Presets */}
              <div className="lg:col-span-2 bg-[#111827] border border-slate-800/90 rounded-2xl p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    1. مصدر الفيديو أو القصة المراد تحليلها وإعادة إخراجها:
                  </label>
                  {/* Mode Tabs */}
                  <div className="flex items-center gap-2 bg-[#0B0F17] p-1.5 rounded-xl border border-slate-800 mb-4">
                    <button
                      type="button"
                      onClick={() => setVtSourceMode('topic')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                        vtSourceMode === 'topic'
                          ? 'text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      style={vtSourceMode === 'topic' ? { backgroundColor: activeAccent.primary } : {}}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>وصف أو قصة فيديو</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVtSourceMode('link')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                        vtSourceMode === 'link'
                          ? 'text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      style={vtSourceMode === 'link' ? { backgroundColor: activeAccent.primary } : {}}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>رابط يوتيوب / تيك توك</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVtSourceMode('upload')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                        vtSourceMode === 'upload'
                          ? 'text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      style={vtSourceMode === 'upload' ? { backgroundColor: activeAccent.primary } : {}}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>رفع ملف فيديو</span>
                    </button>
                  </div>

                  {/* Mode Form Content */}
                  {vtSourceMode === 'topic' && (
                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        value={vtTopic}
                        onChange={(e) => setVtTopic(e.target.value)}
                        placeholder="اكتب سيناريو أو عنوان الفيديو أو القصة التاريخية (مثال: قصة النبي يونس في بطن الحوت وسفينة البحر الهائج، أو ملحمة تاريخية)..."
                        className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition leading-relaxed resize-none"
                      ></textarea>
                    </div>
                  )}

                  {vtSourceMode === 'link' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5">
                        <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                        <input
                          type="url"
                          value={vtUrl}
                          onChange={(e) => setVtUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... أو رابط تيك توك / ريلز"
                          className="bg-transparent text-xs text-white flex-1 focus:outline-none placeholder-slate-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        يدعم روابط YouTube Shorts, TikTok, Instagram Reels والفيديوهات المباشرة بصيغة MP4.
                      </p>
                    </div>
                  )}

                  {vtSourceMode === 'upload' && (
                    <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-6 text-center bg-[#0B0F17] transition cursor-pointer relative">
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVtFileName(file.name);
                            showToast(`تم اختيار الملف: ${file.name}`);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Video className="w-8 h-8 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          {vtFileName ? `الملف المحدد: ${vtFileName}` : 'اسحب وأفلت ملف الفيديو هنا أو انقر للاختيار'}
                        </span>
                        <span className="text-[10px] text-slate-400">يدعم صيغ MP4, MOV, WebM حتى 250MB</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Presets Section */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">أمثلة سريعة جاهزة للاختبار بنقرة واحدة:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => loadPresetVt('younus')}
                      className="p-3 bg-[#0B0F17] hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl text-right transition group flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        قصة النبي يونس والحوت
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">ملحمة دينية وتاريخية في بحر عاصف</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => loadPresetVt('pyramids')}
                      className="p-3 bg-[#0B0F17] hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl text-right transition group flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        أسرار بناء الأهرامات
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">وثائقي تاريخي مهيب للحضارة القديمة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => loadPresetVt('tiktok_drone')}
                      className="p-3 bg-[#0B0F17] hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl text-right transition group flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        تريند درون تيك توك 8K
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">تحويل تصوير هاتف مهتز إلى درون سينمائي</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Settings & Triggers */}
              <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      2. الأسلوب السينمائي للتجديد (Recreation Style):
                    </label>
                    <select
                      value={vtStyle}
                      onChange={(e) => setVtStyle(e.target.value)}
                      className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Cinematic Hollywood">سينمائي هوليوودي فائق الواقعية 8K (Hollywood Cinematic)</option>
                      <option value="Historical Epic Documentary">وثائقي تاريخي مهيب (Historical Epic)</option>
                      <option value="Studio Ghibli Anime">أنمي استوديو جيبلي الأسطوري (Studio Ghibli)</option>
                      <option value="3D Pixar Animation">ثلاثي الأبعاد ديزني وبيكسار (3D Pixar Style)</option>
                      <option value="Cyberpunk Hyperlapse">خيال علمي سيبربانك متسارع (Cyberpunk Neon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      3. إيقاع الكاميرا والانتقال (Pacing & Motion):
                    </label>
                    <select
                      value={vtPacing}
                      onChange={(e) => setVtPacing(e.target.value)}
                      className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="سريع ومشوق (TikTok/Reels)">سريع ومشوق (TikTok / Reels - 15 ثانية)</option>
                      <option value="سينمائي متزن">سينمائي متزن (YouTube / Cinema - 30 ثانية)</option>
                      <option value="وثائقي ملحمي عميق">وثائقي ملحمي عميق (Documentary - 45 ثانية)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      4. نبرة التعليق الصوتي الفصيح (Voiceover Tone):
                    </label>
                    <select
                      value={vtVoiceMood}
                      onChange={(e) => setVtVoiceMood(e.target.value)}
                      className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="سرد تاريخي وقور">سرد تاريخي وقور (فصحى مع نبرة مهيبة)</option>
                      <option value="درامي ملحمي مشحون بالمشاعر">درامي ملحمي مشحون بالمشاعر والتوتر</option>
                      <option value="معلق وثائقي هوليوودي">معلق وثائقي هوليوودي دافئ وعميق</option>
                    </select>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isTransformingVideo}
                    onClick={handleRunVideoTransformation}
                    className="w-full py-3.5 rounded-xl text-white font-black text-xs transition shadow-2xl flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isTransformingVideo ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>جاري تنفيذ خط أنابيب التحويل الخُطوي ({vtProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>تحليل وتوليد الفيديو المطور (100 نقطة)</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>الرصيد المتاح: {userCredits} نقطة</span>
                    <span>خصم: 100 نقطة للعملية</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Modern Pipeline Flow (التوليد الخُطوي التريند) */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>خط أنابيب الإنتاج الخُطوي التريند (Step-by-Step Generation Flow)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    مراحل المعالجة الذكية من الفحص إلى الرندرة السينمائية 4K والمكساج النهائي
                  </p>
                </div>
                {isTransformingVideo && (
                  <span className="text-xs font-bold text-amber-400 animate-pulse">
                    {vtStepTitle}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {isTransformingVideo && (
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${vtProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Pipeline 5-Stage Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  {
                    num: 1,
                    title: 'التحليل الذكي',
                    sub: 'فحص الكادرات وتفريغ النص',
                    icon: Eye,
                  },
                  {
                    num: 2,
                    title: 'صياغة السيناريو',
                    sub: 'إعادة كتابة ملحمية للنص',
                    icon: FileText,
                  },
                  {
                    num: 3,
                    title: 'الأوامر البصرية',
                    sub: 'هندسة زوايا الكاميرا 8K',
                    icon: Wand2,
                  },
                  {
                    num: 4,
                    title: 'الرندرة السينمائية',
                    sub: 'توليد بمحرك ' + aiEngine,
                    icon: Film,
                  },
                  {
                    num: 5,
                    title: 'المكساج وهندسة الصوت',
                    sub: 'دمج التعليق والعلامة المائية',
                    icon: Music,
                  },
                ].map((st) => {
                  const IconC = st.icon;
                  const isActive = isTransformingVideo && vtStep === st.num;
                  const isDone = !isTransformingVideo && vtResult !== null;
                  return (
                    <div
                      key={st.num}
                      className={`p-3.5 rounded-xl border transition flex flex-col justify-between ${
                        isActive
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-slate-800 bg-[#0B0F17]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-amber-500 text-black animate-bounce'
                              : isDone
                              ? 'bg-emerald-500 text-black'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {st.num}
                        </span>
                        <IconC
                          className={`w-4 h-4 ${
                            isActive ? 'text-amber-400 animate-pulse' : isDone ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{st.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{st.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results Presentation Section */}
            {vtResult && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 1. Deep AI Video Analysis Report Card */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">تقرير الفحص والتحليل الذكي للفيديو الأصلي (AI Video Audit)</h3>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      نمط المحتوى: {vtResult.analysis.detectedStyle}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300">ملخص القصة والشخصيات المكتشفة:</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{vtResult.analysis.summary}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {vtResult.analysis.characters.map((ch, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                          >
                            👤 {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-red-400">نقاط الضعف السينمائية في الفيديو الأصلي:</h4>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {vtResult.analysis.cinematicWeaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 text-[11px] text-emerald-400 font-medium">
                        ✨ خطة التطوير: {vtResult.analysis.enhancementPlan}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Comparison Player (Before vs After) */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <GitCompare className="w-5 h-5 text-amber-400" />
                        <span>مشغل المقارنة التفاعلي (قبل التحويل مقابل بعد التحويل)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {vtResult.recreation.title} • أسلوب: {vtResult.recreation.style}
                      </p>
                    </div>

                    {/* Mode Toggle Pills */}
                    <div className="flex items-center gap-1.5 bg-[#0B0F17] p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setComparisonMode('after')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          comparisonMode === 'after'
                            ? 'text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        style={comparisonMode === 'after' ? { backgroundColor: activeAccent.primary } : {}}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>الإنتاج المطور (4K After)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setComparisonMode('before')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          comparisonMode === 'before'
                            ? 'text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        style={comparisonMode === 'before' ? { backgroundColor: activeAccent.primary } : {}}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>الفيديو الأصلي (Before)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setComparisonMode('split')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          comparisonMode === 'split'
                            ? 'text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        style={comparisonMode === 'split' ? { backgroundColor: activeAccent.primary } : {}}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>عرض مقارن متزامن</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Screen Viewport */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center group shadow-2xl">
                    {/* Mode: After (AI Upgraded 4K) */}
                    {comparisonMode === 'after' && (
                      <div className="relative w-full h-full">
                        <img
                          src={vtResult.recreation.scenes[0]?.previewAsset || cinematicImg}
                          alt="AI Recreation 4K"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

                        {/* Top Badges */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-500/90 text-black font-black text-[11px] shadow">
                            4K HDR CINEMA
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] backdrop-blur-md border border-white/20">
                            60 FPS FLUID
                          </span>
                        </div>

                        {/* Mandatory Branded Watermark */}
                        {watermarkEnabled && (
                          <div className="absolute bottom-5 right-5 bg-black/85 px-3 py-1.5 rounded-xl text-xs text-white font-bold border border-white/20 shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>{watermarkText}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mode: Before (Simulated Low-Res Original Footage) */}
                    {comparisonMode === 'before' && (
                      <div className="relative w-full h-full filter saturate-50 contrast-75 brightness-90">
                        <img
                          src={vtResult.recreation.scenes[0]?.previewAsset || cinematicImg}
                          alt="Original Before"
                          className="w-full h-full object-cover blur-[0.6px]"
                        />
                        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700">
                          الفيديو الأصلي (480p / ألوان باهتة)
                        </div>
                      </div>
                    )}

                    {/* Mode: Split View (Side by Side) */}
                    {comparisonMode === 'split' && (
                      <div className="relative w-full h-full flex">
                        {/* Left Half: Before */}
                        <div className="w-1/2 h-full relative overflow-hidden filter saturate-50 contrast-75 border-l-2 border-amber-400">
                          <img
                            src={vtResult.recreation.scenes[0]?.previewAsset || cinematicImg}
                            alt="Original Left"
                            className="w-full h-full object-cover blur-[0.6px]"
                          />
                          <span className="absolute top-3 right-3 bg-black/80 px-2.5 py-0.5 rounded text-[10px] text-slate-300 font-bold">
                            قبل التحويل (Before)
                          </span>
                        </div>

                        {/* Right Half: After */}
                        <div className="w-1/2 h-full relative overflow-hidden">
                          <img
                            src={vtResult.recreation.scenes[0]?.previewAsset || cinematicImg}
                            alt="Recreated Right"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-amber-500 text-black px-2.5 py-0.5 rounded text-[10px] font-black shadow">
                            بعد التحويل (4K After)
                          </span>
                          {watermarkEnabled && (
                            <div className="absolute bottom-4 left-4 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold border border-white/20">
                              {watermarkText}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Center Play Overlay Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlayerPlaying(!isPlayerPlaying);
                        if (!isPlayerPlaying) {
                          handlePlayVtVoiceover(1, vtResult.recreation.scenes[0]?.upgradedVoiceover || '');
                        } else {
                          window.speechSynthesis?.cancel();
                          setPlayingVtVoiceScene(null);
                        }
                      }}
                      className="absolute inset-auto w-16 h-16 rounded-full bg-black/70 hover:bg-black/90 text-white border-2 border-white/40 hover:border-amber-400 flex items-center justify-center transition-transform hover:scale-110 shadow-2xl backdrop-blur-md"
                    >
                      {isPlayerPlaying ? (
                        <Pause className="w-7 h-7 text-amber-400" />
                      ) : (
                        <Play className="w-7 h-7 text-amber-400 mr-1" />
                      )}
                    </button>
                  </div>

                  {/* Benchmark Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0B0F17] p-4 rounded-xl border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">الدقة السينمائية</span>
                      <span className="text-xs font-black text-amber-400">{vtResult.metrics.resolution}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">معدل الإطارات</span>
                      <span className="text-xs font-black text-white">{vtResult.metrics.frameRate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">مؤشر الجودة الإخراجية</span>
                      <span className="text-xs font-black text-emerald-400">{vtResult.metrics.cinematicIndex}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">الترقية البصرية المحققة</span>
                      <span className="text-xs font-black text-sky-400">{vtResult.metrics.productionValue}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Recreated Scenes Breakdown (المشاهد المجددة بالتفصيل) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Clapperboard className="w-4 h-4 text-amber-400" />
                        <span>تفصيل المشاهد المجددة (Recreated Scene Storyboard)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        كل مشهد يتضمن لقطة الكاميرا، الإضاءة، التعليق الصوتي الفصيح مع زر الاستماع (TTS)، والمؤثرات الصوتية
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const fullScript = vtResult.recreation.scenes
                          .map((s) => `[المشهد ${s.sceneNumber} - ${s.timestamp}]\n${s.upgradedVoiceover}`)
                          .join('\n\n');
                        navigator.clipboard.writeText(fullScript);
                        showToast('تم نسخ سيناريو العمل بالكامل إلى الحافظة!');
                      }}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ كامل السيناريو</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {vtResult.recreation.scenes.map((sc) => (
                      <div
                        key={sc.sceneNumber}
                        className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4 hover:border-slate-700 transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                          <div className="flex items-center gap-3">
                            <span
                              className="px-3 py-1 rounded-lg text-xs font-black text-white shadow"
                              style={{ backgroundColor: activeAccent.primary }}
                            >
                              المشهد #{sc.sceneNumber}
                            </span>
                            <span className="text-xs text-slate-400 font-mono font-bold">⏱️ {sc.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Listen to Voiceover TTS */}
                            <button
                              type="button"
                              onClick={() => handlePlayVtVoiceover(sc.sceneNumber, sc.upgradedVoiceover)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                playingVtVoiceScene === sc.sceneNumber
                                  ? 'bg-amber-500 text-black shadow-lg animate-pulse'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              }`}
                            >
                              {playingVtVoiceScene === sc.sceneNumber ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" />
                                  <span>إيقاف الصوت</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                  <span>استماع للتعليق الفصيح</span>
                                </>
                              )}
                            </button>

                            {/* Transfer to Text-to-Image */}
                            <button
                              type="button"
                              onClick={() => {
                                setImgPrompt(sc.upgradedVisual);
                                setActiveTab('text-to-image');
                                showToast(`تم نقل وصف المشهد #${sc.sceneNumber} إلى استوديو توليد الصور!`);
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                              title="توليد صورة مخصصة لهذا المشهد"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>توليد صورة المشهد</span>
                            </button>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                          {/* Scene Image with Watermark */}
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                            <img
                              src={sc.previewAsset}
                              alt={`Scene ${sc.sceneNumber}`}
                              className="w-full h-full object-cover"
                            />
                            {watermarkEnabled && (
                              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white font-bold border border-white/10 pointer-events-none">
                                {watermarkText}
                              </div>
                            )}
                          </div>

                          {/* Upgraded vs Original Comparison */}
                          <div className="md:col-span-2 space-y-3">
                            <div className="bg-[#0B0F17] p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                              <span className="text-[10px] text-amber-400 font-bold block">
                                🌟 اللقطة المطورة (8K Cinematic Prompt):
                              </span>
                              <p className="text-slate-200 leading-relaxed">{sc.upgradedVisual}</p>
                            </div>

                            <div className="bg-[#0B0F17] p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                              <span className="text-[10px] text-slate-500 font-bold block">
                                ⏪ اللقطة الأصلية قبل التحويل:
                              </span>
                              <p className="text-slate-400 leading-relaxed text-[11px]">{sc.originalSnippet}</p>
                            </div>

                            {/* Camera & Lighting & Sound Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                                <span className="font-bold text-slate-400 block mb-0.5">🎥 حركة الكاميرا:</span>
                                <span className="text-slate-300">{sc.cameraMovement}</span>
                              </div>
                              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                                <span className="font-bold text-slate-400 block mb-0.5">💡 الإضاءة والظلال:</span>
                                <span className="text-slate-300">{sc.lightingMood}</span>
                              </div>
                              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                                <span className="font-bold text-slate-400 block mb-0.5">🎵 هندسة الصوت (SFX):</span>
                                <span className="text-slate-300">{sc.soundDesign}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Upgraded Voiceover Block */}
                        <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 rounded-xl border border-amber-500/20 text-xs space-y-1">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>نص التعليق الصوتي المطور (Voiceover Script):</span>
                          </span>
                          <p className="text-slate-200 text-xs leading-relaxed font-serif pt-1">
                            "{sc.upgradedVoiceover}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Bottom Action & Share Toolbar */}
                <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300">
                      يتم تصدير الفيديو واللقطات مع العلامة المائية الإلزامية ({watermarkText})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        triggerShare({
                          title: vtResult.recreation.title,
                          text: `شاهد إنتاج الفيديو السينمائي المجدد عبر ${brandName}:\n${vtResult.recreation.title}`,
                          url: window.location.href,
                          imageUrl: vtResult.recreation.scenes[0]?.previewAsset,
                          category: 'تحويل فيديو Video-to-Video',
                        })
                      }
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-2 shadow"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>مشاركة النتيجة (Share)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadWatermarkedImage(
                          vtResult.recreation.scenes[0]?.previewAsset || cinematicImg,
                          `superai-recreated-video-${Date.now()}.jpg`
                        )
                      }
                      className="px-5 py-2.5 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xl"
                      style={{ backgroundColor: activeAccent.primary }}
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل العمل مع العلامة المائية</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: TEXT-TO-IMAGE GENERATOR */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'text-to-image' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Generation Control Panel */}
              <div className="bg-[#111827] border border-slate-800/90 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-200">
                        الوصف النصي للصورة (Prompt) <span className="text-amber-400 font-bold">(10 نقاط)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleEnhancePrompt(setImgPrompt, imgPrompt)}
                        className="text-[11px] font-semibold flex items-center gap-1 transition"
                        style={{ color: activeAccent.primary }}
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>تحسين بالذكاء الاصطناعي</span>
                      </button>
                    </div>
                    <textarea
                      value={imgPrompt}
                      onChange={(e) => setImgPrompt(e.target.value)}
                      rows={4}
                      placeholder="مثال: واحة مائية مستقبلية محاطة بكثبان رملية وأبراج زجاجية، إضاءة ذهبية وقت الغسق، تفاصيل سينمائية 8K..."
                      className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-600 transition resize-none leading-relaxed"
                    />

                    {/* Quick Suggestion Chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setImgPrompt(
                            'فارس عربي أسطوري بدرع مرصع بنقوش هندسية كهرومغناطيسية وسيف ضوئي وسط عاصفة رملية ليلية'
                          )
                        }
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition"
                      >
                        فارس أسطوري
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setImgPrompt(
                            'مدينة طافية في الغيوم مستوحاة من العمارة الأندلسية مع حدائق معلقة وطيور ميكانيكية لامعة'
                          )
                        }
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition"
                      >
                        عمارة أندلسية
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setImgPrompt(
                            'بورتريت واقعي سينمائي لشاب عربي بملامح معبرة مع إضاءة ستوديو ملونة وعمق ميداني 8K'
                          )
                        }
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition"
                      >
                        بورتريت InstaSize
                      </button>
                    </div>
                  </div>

                  {/* Aspect Ratio Selector (1:1, 16:9, 9:16, 4:5) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-2">أبعاد الصورة (Aspect Ratio)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { ratio: '1:1', label: '1:1 مربع' },
                        { ratio: '16:9', label: '16:9 عريض' },
                        { ratio: '9:16', label: '9:16 ستوري' },
                        { ratio: '4:5', label: '4:5 إنستغرام' },
                      ].map((item) => (
                        <button
                          key={item.ratio}
                          type="button"
                          onClick={() => setImgAspectRatio(item.ratio)}
                          className={`py-2 text-[11px] font-semibold rounded-lg border transition ${
                            imgAspectRatio === item.ratio
                              ? 'text-white shadow-sm'
                              : 'border-slate-800 bg-[#0B0F17] text-slate-400 hover:text-slate-200'
                          }`}
                          style={
                            imgAspectRatio === item.ratio
                              ? {
                                  borderColor: activeAccent.primary,
                                  backgroundColor: activeAccent.primary + '33',
                                }
                              : {}
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-2">النمط الفني (Art Style)</label>
                    <select
                      value={imgStyle}
                      onChange={(e) => setImgStyle(e.target.value)}
                      className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition cursor-pointer"
                    >
                      <option value="Cinematic">سينمائي درامي (Cinematic)</option>
                      <option value="Photorealistic">واقعي فوتوغرافي (Photorealistic Ultra 8K)</option>
                      <option value="Anime">أنمي ياباني احترافي (Modern Anime Art)</option>
                      <option value="Cyberpunk">خيال علمي وسايبربانك (Cyberpunk)</option>
                      <option value="3D Render">تصيير ثلاثي الأبعاد (3D Octane Render)</option>
                      <option value="Oil Painting">لوحة زيتية كلاسيكية (Oil Painting)</option>
                    </select>
                  </div>

                  {/* Advanced Settings */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedImg(!showAdvancedImg)}
                      className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 font-medium py-1 transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>إعدادات متقدمة (InstaSize & Upscale)</span>
                      </span>
                      {showAdvancedImg ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showAdvancedImg && (
                      <div className="mt-3 space-y-3 bg-[#0B0F17] p-3 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">الوصف المستبعد (Negative Prompt)</label>
                          <input
                            type="text"
                            value={imgNegativePrompt}
                            onChange={(e) => setImgNegativePrompt(e.target.value)}
                            placeholder="تشويش، عناصر غير متناسقة، جودة منخفضة..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">مستوى الدقة (AI Upscale)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Standard', 'HD', '4K Ultra'].map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => setImgQuality(q)}
                                className={`py-1.5 text-[10px] font-semibold rounded border transition ${
                                  imgQuality === q
                                    ? 'text-white'
                                    : 'border-slate-800 bg-slate-900 text-slate-400'
                                }`}
                                style={
                                  imgQuality === q
                                    ? {
                                        borderColor: activeAccent.primary,
                                        backgroundColor: activeAccent.primary + '33',
                                      }
                                    : {}
                                }
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate Button & Progress */}
                <div className="pt-4 border-t border-slate-800">
                  {isGeneratingImg ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold" style={{ color: activeAccent.primary }}>
                          {imgStatusStep}
                        </span>
                        <span className="text-slate-400 tabular-nums font-bold">{imgProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${imgProgress}%`,
                            backgroundColor: activeAccent.primary,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateImage}
                      className="w-full py-3.5 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: activeAccent.primary }}
                    >
                      <Wand2 className="w-4 h-4" />
                      <span>توليد الصورة الآن (10 نقاط)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Gallery Preview */}
              <div className="lg:col-span-2 bg-[#111827] border border-slate-800/90 p-6 rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" style={{ color: activeAccent.primary }} />
                      <span>معرض الصور المولدة ({generatedImages.length})</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">ميزة تصدير العلامة المائية مفعلة تلقائياً</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                    {generatedImages.map((img) => (
                      <div
                        key={img.id}
                        className="group relative bg-[#0B0F17] border border-slate-800/90 rounded-xl overflow-hidden hover:border-slate-700 transition cursor-pointer"
                        onClick={() => setSelectedImgModal(img)}
                      >
                        <div className="aspect-video relative overflow-hidden bg-slate-950">
                          <img
                            src={img.imageUrl}
                            alt={img.prompt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {watermarkEnabled && (
                            <span className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[8px] text-slate-300 font-semibold border border-white/10 backdrop-blur-sm pointer-events-none">
                              {watermarkText}
                            </span>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 justify-between">
                            <span className="text-[10px] text-slate-200 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                              {img.style}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerShare({
                                    title: `صورة فنية بنمط ${img.style} - ${brandName}`,
                                    text: `صورة ذكاء اصطناعي بنمط ${img.style}:\n"${img.prompt}"`,
                                    url: window.location.href,
                                    imageUrl: img.imageUrl,
                                    category: img.style,
                                  });
                                }}
                                className="p-1.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-xs transition"
                                title="مشاركة الصورة"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setI2vImage(img.imageUrl);
                                  setActiveTab('image-to-video');
                                  showToast('تم نقل الصورة إلى أداة التحريك بالفيديو!');
                                }}
                                className="px-2 py-1 text-[10px] text-white rounded-lg font-medium transition"
                                style={{ backgroundColor: activeAccent.primary }}
                                title="تحويل هذه الصورة إلى فيديو"
                              >
                                تحويل لفيديو
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <p className="text-[11px] text-slate-300 line-clamp-1 font-medium">{img.prompt}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80">
                            <span>
                              {img.aspectRatio} · {img.quality}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerShare({
                                    title: `صورة فنية بنمط ${img.style} - ${brandName}`,
                                    text: `صورة ذكاء اصطناعي بنمط ${img.style}:\n"${img.prompt}"`,
                                    url: window.location.href,
                                    imageUrl: img.imageUrl,
                                    category: img.style,
                                  });
                                }}
                                className="p-1 text-slate-400 hover:text-white transition"
                                title="مشاركة (Web Share)"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(img.prompt);
                                  showToast('تم نسخ الوصف!');
                                }}
                                className="p-1 text-slate-400 hover:text-white transition"
                                title="نسخ الوصف"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadWatermarkedImage(img.imageUrl, `superai-${img.id}.jpg`);
                                }}
                                className="p-1 text-slate-400 hover:text-white transition"
                                title="تحميل مع العلامة المائية"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>الصيغة: JPG مع وسم العلامة المائية التلقائي</span>
                  <span>الرصيد: 10 نقاط لكل صورة</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: TEXT-TO-VIDEO GENERATOR */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'text-to-video' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="bg-[#111827] border border-slate-800/90 p-6 rounded-2xl space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-200">
                      سيناريو أو وصف اللقطة المتحركة <span className="text-amber-400 font-bold">(50 نقطة)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleEnhancePrompt(setVideoPrompt, videoPrompt)}
                      className="text-[11px] font-semibold flex items-center gap-1 transition"
                      style={{ color: activeAccent.primary }}
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>تحسين بالذكاء الاصطناعي</span>
                    </button>
                  </div>
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={4}
                    placeholder="مثال: لقطة درون سينمائية تنحدر بسلاسة بين سحب الشفق الذهبي نحو واحة خضراء وسط رمال متحركة، إضاءة شمسية ناعمة..."
                    className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-600 transition resize-none leading-relaxed"
                  />
                </div>

                {/* Motion Intensity Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-slate-200">كثافة وسرعة الحركة (Motion Intensity)</span>
                    <span className="font-black tabular-nums" style={{ color: activeAccent.primary }}>
                      {videoMotion}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={videoMotion}
                    onChange={(e) => setVideoMotion(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: activeAccent.primary }}
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>حركة بطيئة هادئة</span>
                    <span>ديناميكية متسارعة</span>
                  </div>
                </div>

                {/* Duration Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">مدة المقطع (Duration)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { sec: 5, label: '5 ثوانٍ (سريع وخفيف)' },
                      { sec: 10, label: '10 ثوانٍ (سينمائي مفصل)' },
                    ].map((d) => (
                      <button
                        key={d.sec}
                        type="button"
                        onClick={() => setVideoDuration(d.sec)}
                        className={`py-2 text-[11px] font-semibold rounded-lg border transition ${
                          videoDuration === d.sec
                            ? 'text-white shadow-sm'
                            : 'border-slate-800 bg-[#0B0F17] text-slate-400 hover:text-slate-200'
                        }`}
                        style={
                          videoDuration === d.sec
                            ? {
                                borderColor: activeAccent.primary,
                                backgroundColor: activeAccent.primary + '33',
                              }
                            : {}
                        }
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera Movement */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">حركة الكاميرا (Camera Motion)</label>
                  <select
                    value={videoCamera}
                    onChange={(e) => setVideoCamera(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Drone Shot (تصوير درون جوي)">تصوير درون جوي (Drone Aerial Shot)</option>
                    <option value="Pan Left-to-Right (بانوراما لليمين)">بانوراما أفقية (Pan Left to Right)</option>
                    <option value="Zoom In Cinematic (تقريب سينمائي)">تقريب سينمائي هادئ (Cinematic Zoom In)</option>
                    <option value="Orbit 360 (دوران محوري)">دوران محوري كامل (Orbit 360)</option>
                    <option value="Static Tripod (ثابت كلاسيكي)">كاميرا ثابتة بتركيز عالٍ (Static Tripod)</option>
                  </select>
                </div>

                {/* Generate Video Button */}
                <div className="pt-2">
                  {isVideoGenerating ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold" style={{ color: activeAccent.primary }}>
                          {videoStatusStep}
                        </span>
                        <span className="text-slate-400 tabular-nums font-bold">{videoProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${videoProgress}%`,
                            backgroundColor: activeAccent.primary,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateVideo}
                      className="w-full py-3.5 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: activeAccent.primary }}
                    >
                      <Film className="w-4 h-4" />
                      <span>توليد الفيديو السينمائي (50 نقطة)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Video Player Preview with Watermark Overlay */}
              <div className="lg:col-span-2 bg-[#111827] border border-slate-800/90 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4" style={{ color: activeAccent.primary }} />
                      <span>معاينة مشغل الفيديو التفاعلي</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">دقة 1080p FHD بمعدل 24 إطار/ثانية</span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-2xl flex items-center justify-center">
                    <video
                      ref={videoPlayerRef}
                      src={generatedVideoUrl}
                      loop
                      muted={isVideoMuted}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      className="w-full h-full object-cover"
                    />

                    {/* Watermark overlay on Video */}
                    {watermarkEnabled && (
                      <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-slate-200 font-semibold border border-white/10 z-10 pointer-events-none flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{watermarkText}</span>
                      </div>
                    )}

                    {!isVideoPlaying && (
                      <button
                        onClick={() => {
                          if (videoPlayerRef.current) {
                            videoPlayerRef.current.play();
                            setIsVideoPlaying(true);
                          }
                        }}
                        className="absolute w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform backdrop-blur-md"
                        style={{ backgroundColor: activeAccent.primary }}
                      >
                        <Play className="w-6 h-6 mr-0.5" />
                      </button>
                    )}
                  </div>

                  {/* Player Controls Strip */}
                  <div className="mt-4 p-3 bg-[#0B0F17] rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (videoPlayerRef.current) {
                            if (isVideoPlaying) {
                              videoPlayerRef.current.pause();
                            } else {
                              videoPlayerRef.current.play();
                            }
                            setIsVideoPlaying(!isVideoPlaying);
                          }
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                      >
                        {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (videoPlayerRef.current) {
                            videoPlayerRef.current.currentTime = 0;
                            videoPlayerRef.current.play();
                            setIsVideoPlaying(true);
                          }
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="إعادة التشغيل"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (videoPlayerRef.current) {
                            videoPlayerRef.current.muted = !isVideoMuted;
                            setIsVideoMuted(!isVideoMuted);
                          }
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-xs text-slate-400">
                      <span>المدة: </span>
                      <span className="text-slate-200 font-semibold">{videoDuration} ثوانٍ</span>
                      <span className="mx-2">·</span>
                      <span>الكاميرا: </span>
                      <span className="font-semibold" style={{ color: activeAccent.primary }}>
                        {videoCamera.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          triggerShare({
                            title: `فيديو سينمائي بالذكاء الاصطناعي - ${brandName}`,
                            text: `مقطع فيديو سينمائي مولد بواسطة الذكاء الاصطناعي:\n"${videoPrompt || 'حركة سينمائية استثنائية'}"`,
                            url: generatedVideoUrl || window.location.href,
                            category: 'فيديو سينمائي',
                          })
                        }
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                        title="مشاركة الفيديو (Web Share)"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>مشاركة</span>
                      </button>

                      <a
                        href={generatedVideoUrl}
                        download="superai-video.mp4"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تنزيل المقطع</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
                  <span>تم تصيير المقطع بواسطة {brandName} (تكلفة التوليد: 50 نقطة)</span>
                  <span className="text-emerald-400">ترميز MP4 مع علامة مائية رسمية</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: IMAGE-TO-VIDEO CONVERTER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'image-to-video' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Upload & Settings */}
              <div className="bg-[#111827] border border-slate-800/90 p-6 rounded-2xl space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">الصورة المصدر (Source Image)</label>
                  <label
                    htmlFor="img-file-input"
                    className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-[#0B0F17] block"
                  >
                    <input
                      id="img-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-xs text-slate-200 font-semibold">اسحب الصورة وأفلتها هنا أو اضغط للتصفح</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">يدعم JPG, PNG, WebP حتى 15MB</span>
                  </label>
                </div>

                {/* Preset Starter Images */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">أو اختر صورة جاهزة للتجربة:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { img: cinematicImg, name: 'واحة' },
                      { img: cyberpunkImg, name: 'فارس' },
                      { img: animeImg, name: 'أنمي' },
                      { img: photoImg, name: 'معمار' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setI2vImage(item.img);
                          showToast(`تم اختيار صورة ${item.name}`);
                        }}
                        className={`relative rounded-lg overflow-hidden border aspect-video transition ${
                          i2vImage === item.img ? 'ring-2 ring-white' : 'border-slate-800'
                        }`}
                        style={i2vImage === item.img ? { borderColor: activeAccent.primary } : {}}
                      >
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">
                    وصف الحركة المرئية المطلوبة <span className="text-amber-400 font-bold">(50 نقطة)</span>
                  </label>
                  <input
                    type="text"
                    value={i2vPrompt}
                    onChange={(e) => setI2vPrompt(e.target.value)}
                    placeholder="مثال: تحريك السحب مع انسكاب الماء بسلاسة وزوم هادئ..."
                    className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-slate-200">مقدار الحركة (Motion Scale)</span>
                    <span className="font-bold tabular-nums" style={{ color: activeAccent.primary }}>
                      {i2vMotion}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={i2vMotion}
                    onChange={(e) => setI2vMotion(parseInt(e.target.value, 10))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: activeAccent.primary }}
                  />
                </div>

                {/* Generate Button */}
                <div className="pt-2">
                  {isI2vGenerating ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold" style={{ color: activeAccent.primary }}>
                          {i2vStatusStep}
                        </span>
                        <span className="text-slate-400 tabular-nums font-bold">{i2vProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${i2vProgress}%`,
                            backgroundColor: activeAccent.primary,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateImageToVideo}
                      className="w-full py-3.5 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: activeAccent.primary }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>تحريك الصورة إلى فيديو (50 نقطة)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Side-by-Side Preview */}
              <div className="lg:col-span-2 bg-[#111827] border border-slate-800/90 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Clapperboard className="w-4 h-4" style={{ color: activeAccent.primary }} />
                      <span>المعاينة المباشرة: الصورة المصدر والفيديو المتحرك الناتج</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Source Image */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 block">الصورة الثابتة الأصلية:</span>
                      <div className="aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 relative">
                        {i2vImage ? (
                          <img src={i2vImage} alt="المصدر" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                            لم يتم اختيار صورة
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 text-[10px] rounded text-slate-300">
                          الصورة الثابتة
                        </span>
                      </div>
                    </div>

                    {/* Result Video */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 block">الفيديو الناتج بالحركة:</span>
                      <div className="aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 relative flex items-center justify-center">
                        <video
                          ref={i2vVideoRef}
                          src={i2vVideoUrl}
                          loop
                          controls
                          className="w-full h-full object-cover"
                        />
                        {watermarkEnabled && (
                          <span className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded text-[9px] text-slate-200 font-semibold border border-white/10 backdrop-blur-sm pointer-events-none z-10">
                            {watermarkText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#0B0F17] rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400 truncate max-w-sm">
                    <span>الوصف الحركي: </span>
                    <span className="text-slate-200 font-semibold">{i2vPrompt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        triggerShare({
                          title: `فيديو متحرك من صورة - ${brandName}`,
                          text: `تحريك صورة بالذكاء الاصطناعي مع تأثيرات حركية:\n"${i2vPrompt}"`,
                          url: i2vVideoUrl || window.location.href,
                          imageUrl: i2vImage || undefined,
                          category: 'صورة إلى فيديو',
                        })
                      }
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      title="مشاركة الفيديو (Web Share)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة</span>
                    </button>
                    <a
                      href={i2vVideoUrl}
                      download="animated-image.mp4"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل الفيديو</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: TEXT-TO-MOVIE & STORY GENERATOR */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'text-to-story' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Input & Story Generation Card */}
            <div className="bg-[#111827] border border-slate-800/90 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: activeAccent.primary }} />
                    <span>
                      نص القصة أو السيناريو العام (Story & Script){' '}
                      <span className="text-amber-400 font-bold">(100 نقطة)</span>
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    اكتب نصاً سردياً أو قصة طويلة ليقوم المحرك بتفكيكها إلى مشاهد سينمائية منظمة مع التوجيهات البصرية والتعليق الصوتي.
                  </p>
                </div>

                {/* Preset Starters */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">قصص نموذجية:</span>
                  <button
                    type="button"
                    onClick={() => loadPresetStory('oasis')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 rounded-lg transition"
                  >
                    واحة النجوم
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetStory('clock')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 rounded-lg transition"
                  >
                    برج الساعة
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetStory('knight')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 rounded-lg transition"
                  >
                    فارس المستقبل
                  </button>
                </div>
              </div>

              <textarea
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                rows={5}
                placeholder="اكتب قصتك أو فكرتك السينمائية هنا بالتفصيل باللغة العربية..."
                className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-xl p-4 text-xs text-slate-200 focus:outline-none placeholder:text-slate-600 transition resize-none leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400">
                  <span>العمل الحالي: </span>
                  <span className="text-white font-bold">{storyTitle}</span>
                  <span className="mx-2">·</span>
                  <span>النوع: </span>
                  <span className="font-semibold" style={{ color: activeAccent.primary }}>
                    {storyGenre}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateStory}
                  disabled={isStoryGenerating}
                  className="w-full sm:w-auto px-6 py-3 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: activeAccent.primary }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isStoryGenerating
                      ? 'جاري التحليل وتوليد المشاهد...'
                      : 'تفكيك القصة وتوليد المشاهد السينمائية (100 نقطة)'}
                  </span>
                </button>
              </div>

              {isStoryGenerating && (
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${storyProgress}%`,
                      backgroundColor: activeAccent.primary,
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Generated Scenes Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>المشاهد السينمائية المستخرجة ({storyScenes.length} مشاهد)</span>
                </h3>

                <button
                  onClick={() => {
                    const textData = storyScenes
                      .map(
                        (s) =>
                          `${s.title}\nالمطالبة البصرية: ${s.visual_prompt}\nالتعليق الصوتي: "${s.voiceover}"\nالمؤثرات: ${s.sound_effects || 'طبيعية'}\n`
                      )
                      .join('\n---\n\n');
                    navigator.clipboard.writeText(textData);
                    showToast('تم نسخ كامل نص السيناريو والمشاهد إلى الحافظة!');
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ المشاهد كاملة</span>
                </button>
              </div>

              <div className="space-y-4">
                {storyScenes.map((scene) => (
                  <div
                    key={scene.scene_number}
                    className="bg-[#111827] border border-slate-800/90 hover:border-slate-700/80 p-5 rounded-2xl space-y-4 transition"
                  >
                    {/* Scene Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border"
                          style={{
                            backgroundColor: activeAccent.primary + '22',
                            color: activeAccent.primary,
                            borderColor: activeAccent.primary + '44',
                          }}
                        >
                          {scene.scene_number}
                        </span>
                        <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {scene.mood_and_lighting && (
                          <span className="text-[11px] text-amber-300/80 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            {scene.mood_and_lighting}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            triggerShare({
                              title: `${scene.title} - سيناريو ${brandName}`,
                              text: `المشهد: ${scene.title}\nالمطالبة البصرية: ${scene.visual_prompt}\nالتعليق الصوتي: "${scene.voiceover}"`,
                              url: window.location.href,
                              category: 'مشهد سينمائي',
                            })
                          }
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-[11px] font-semibold transition flex items-center gap-1.5"
                          title="مشاركة المشهد"
                        >
                          <Share2 className="w-3 h-3 text-slate-400" />
                          <span>مشاركة</span>
                        </button>
                      </div>
                    </div>

                    {/* Visual Prompt Section */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" style={{ color: activeAccent.primary }} />
                          <span>المطالبة البصرية لتوليد الإطار (Visual Prompt):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUseScenePrompt(scene.visual_prompt)}
                          className="text-[11px] font-semibold flex items-center gap-1 transition"
                          style={{ color: activeAccent.primary }}
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>توليد صورة هذا المشهد</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 leading-relaxed font-mono">
                        {scene.visual_prompt}
                      </p>
                    </div>

                    {/* Voiceover Script Section with Audio Player */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>نص التعليق الصوتي المقترح (Voiceover Script):</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePlayVoiceover(scene.scene_number, scene.voiceover)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition flex items-center gap-1 ${
                              playingVoiceScene === scene.scene_number
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                            }`}
                          >
                            {playingVoiceScene === scene.scene_number ? (
                              <>
                                <Pause className="w-3 h-3" />
                                <span>إيقاف القراءة</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                <span>استمع بالصوت العربي</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(scene.voiceover);
                              showToast('تم نسخ نص التعليق الصوتي!');
                            }}
                            className="p-1 text-slate-400 hover:text-white transition"
                            title="نسخ التعليق الصوتي"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              triggerShare({
                                title: `تعليق صوتي لمشهد: ${scene.title}`,
                                text: `"${scene.voiceover}"`,
                                url: window.location.href,
                                category: 'تعليق صوتي',
                              })
                            }
                            className="p-1 text-slate-400 hover:text-white transition"
                            title="مشاركة التعليق الصوتي"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 italic bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        "{scene.voiceover}"
                      </p>
                    </div>

                    {/* Sound Effects */}
                    {scene.sound_effects && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                        <span className="font-bold text-slate-500">المؤثرات الصوتية (SFX):</span>
                        <span>{scene.sound_effects}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* FULLSCREEN IMAGE MODAL */}
        {/* ---------------------------------------------------- */}
        {selectedImgModal && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImgModal(null)}
          >
            <div
              className="bg-[#111827] border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2.5 py-1 rounded-md font-semibold border"
                    style={{
                      backgroundColor: activeAccent.primary + '22',
                      color: activeAccent.primary,
                      borderColor: activeAccent.primary + '44',
                    }}
                  >
                    {selectedImgModal.style}
                  </span>
                  <span className="text-xs text-slate-400">بُعد: {selectedImgModal.aspectRatio}</span>
                  <span className="text-xs text-slate-400">Seed: {selectedImgModal.seed}</span>
                </div>
                <button
                  onClick={() => setSelectedImgModal(null)}
                  className="p-1 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-center bg-black/50 max-h-[60vh] overflow-hidden relative">
                <img
                  src={selectedImgModal.imageUrl}
                  alt={selectedImgModal.prompt}
                  className="max-h-[55vh] w-auto object-contain rounded-xl shadow-2xl"
                />
                {watermarkEnabled && (
                  <span className="absolute bottom-6 right-6 bg-black/80 px-3 py-1 rounded-lg text-[10px] text-slate-200 font-semibold border border-white/10 backdrop-blur-md pointer-events-none">
                    {watermarkText}
                  </span>
                )}
              </div>

              <div className="p-5 pt-0 space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800">
                  {selectedImgModal.prompt}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setI2vImage(selectedImgModal.imageUrl);
                      setSelectedImgModal(null);
                      setActiveTab('image-to-video');
                      showToast('تم نقل الصورة إلى أداة تحويل الصور إلى فيديو!');
                    }}
                    className="px-4 py-2 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
                    style={{ backgroundColor: activeAccent.primary }}
                  >
                    <Clapperboard className="w-4 h-4" />
                    <span>تحويل هذه الصورة إلى فيديو</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        triggerShare({
                          title: `عمل فني بنمط ${selectedImgModal.style} - ${brandName}`,
                          text: `اكتشف هذا التصميم المولد بنمط ${selectedImgModal.style}:\n"${selectedImgModal.prompt}"`,
                          url: window.location.href,
                          imageUrl: selectedImgModal.imageUrl,
                          category: selectedImgModal.style,
                        })
                      }
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                      title="مشاركة الصورة"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedImgModal.prompt);
                        showToast('تم نسخ الوصف!');
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الوصف</span>
                    </button>
                    <button
                      onClick={() => downloadWatermarkedImage(selectedImgModal.imageUrl, `superai-${selectedImgModal.id}.jpg`)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل مع العلامة المائية</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ACCENT COLOR PICKER MODAL */}
        {/* ---------------------------------------------------- */}
        {showAccentPickerModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShowAccentPickerModal(false)}
          >
            <div
              className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: activeAccent.primary + '33', color: activeAccent.primary }}
                  >
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">تخصيص لون التمييز الأساسي (Accent Color)</h3>
                    <p className="text-[11px] text-slate-400">اختر طابعك اللوني المفضل ليتم تطبيقه فوراً</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAccentPickerModal(false)}
                  className="p-1 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.values(ACCENT_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      changeAccentColor(theme.id);
                      setShowAccentPickerModal(false);
                    }}
                    className={`p-3.5 rounded-xl border text-right transition flex items-center justify-between ${
                      accentKey === theme.id
                        ? 'border-white/40 ring-2 ring-white/20'
                        : 'border-slate-800 hover:border-slate-700 bg-[#0B0F17]'
                    }`}
                    style={accentKey === theme.id ? { backgroundColor: theme.primary + '20' } : {}}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <span className="text-xs font-bold text-slate-200">{theme.name.split(' ')[0]}</span>
                    </div>
                    {accentKey === theme.id && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAccentPickerModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* WATERMARK PRO NOTICE MODAL (Mandatory Specification) */}
        {/* ---------------------------------------------------- */}
        {showWatermarkProModal && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShowWatermarkProModal(false)}
          >
            <div
              className="bg-[#111827] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white">ترقية العلامة المائية (PRO Watermark)</h3>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 leading-relaxed font-semibold">
                إزالة العلامة المائية ميزة مدفوعة قريباً! يمكنك حالياً استخدام التطبيق مجاناً مع 1000 نقطة يومية.
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                يتم ختم وسم "{watermarkText}" رسمياً أسفل اليمين لحماية الملكية الفكرية لحين تفعيل باقة الاشتراك الاحترافية.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowWatermarkProModal(false)}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition"
                >
                  حسناً، متابعة الاستخدام المجاني
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* AI ENGINE CUSTOMIZATION MODAL */}
        {/* ---------------------------------------------------- */}
        {showEngineModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEngineModal(false)}
          >
            <div
              className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">تخصيص محرك الذكاء الاصطناعي</h3>
                </div>
                <button onClick={() => setShowEngineModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">اختر المحرك المعتمد:</label>
                {[
                  { name: 'Gemini Ultra Pro v3', desc: 'الأسرع والأدق في التوليد والسرد العربي' },
                  { name: 'Sora Video Engine 2.0', desc: 'محرك سينمائي لفيزيائية الفيديو' },
                  { name: 'Flux Ultra HD Engine', desc: 'توليد صور واقعية بتفاصيل فائقة' },
                  { name: 'Leonardo Pro Creator', desc: 'أنماط الأنمي والبورتريه الرقمي' },
                  { name: 'RunWay Gen-3 Alpha', desc: 'محرك تحريك الصور ثلاثي الأبعاد' },
                ].map((eng) => (
                  <button
                    key={eng.name}
                    type="button"
                    onClick={() => {
                      setAiEngine(eng.name);
                      localStorage.setItem('app_ai_engine', eng.name);
                      showToast(`تم تغيير محرك الذكاء الاصطناعي إلى: ${eng.name}`);
                      setShowEngineModal(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-right transition flex items-center justify-between ${
                      aiEngine === eng.name
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-slate-800 bg-[#0B0F17] hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{eng.name}</h4>
                      <p className="text-[10px] text-slate-400">{eng.desc}</p>
                    </div>
                    {aiEngine === eng.name && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* LOGO & BRANDING DESIGNER MODAL */}
        {/* ---------------------------------------------------- */}
        {showLogoModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowLogoModal(false)}
          >
            <div
              className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">تخصيص اسم وشعار المنصة</h3>
                </div>
                <button onClick={() => setShowLogoModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم الاستوديو الجديد:</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                      localStorage.setItem('app_brand_name', e.target.value);
                    }}
                    placeholder="مثال: SuperAI Studio..."
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">أيقونة الشعار:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'sparkles', label: 'توليدي', icon: Sparkles },
                      { id: 'brain', label: 'عقل ذكي', icon: Brain },
                      { id: 'film', label: 'سينما', icon: Film },
                      { id: 'zap', label: 'طاقة', icon: Zap },
                    ].map((ic) => {
                      const IconComp = ic.icon;
                      return (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => setBrandIcon(ic.id)}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                            brandIcon === ic.id
                              ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                              : 'border-slate-800 bg-[#0B0F17] text-slate-400'
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                          <span className="text-[10px]">{ic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowLogoModal(false);
                  showToast('تم حفظ الشعار واسم المنصة بنجاح!');
                }}
                className="w-full py-2.5 rounded-xl text-white text-xs font-bold transition shadow-lg mt-2"
                style={{ backgroundColor: activeAccent.primary }}
              >
                تطبيق الشعار الآن
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* AUTHENTICATION & RECHARGE MODAL */}
        {/* ---------------------------------------------------- */}
        {showAuthModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <div
              className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">تسجيل الدخول وشحن النقاط</h3>
                </div>
                <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">رصيدك الحالي:</span>
                <h4 className="text-2xl font-black text-amber-400 tabular-nums">
                  {userCredits.toLocaleString('ar-EG')} نقطة
                </h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم أو البريد:</label>
                  <input
                    type="text"
                    defaultValue={userName}
                    id="auth-input-name"
                    placeholder="name@domain.com"
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('auth-input-name') as HTMLInputElement | null;
                    const val = el?.value.trim() || 'مبدع الذكاء الاصطناعي';
                    setUserName(val);
                    localStorage.setItem('app_user_name', val);
                    rechargeCredits(1000);
                    setShowAuthModal(false);
                  }}
                  className="w-full py-3 rounded-xl text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: activeAccent.primary }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد الحساب ومكافأة +1000 نقطة مجانية</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE SHARE MODAL */}
        {/* ---------------------------------------------------- */}
        {shareData && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShareData(null)}
          >
            <div
              className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center border border-slate-700">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">مشاركة العمل الفني</h3>
                    <p className="text-[11px] text-slate-400">انشر إبداعك أو انسخ رابطاً مباشراً للمشروع</p>
                  </div>
                </div>
                <button
                  onClick={() => setShareData(null)}
                  className="p-1 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Item Summary Box */}
              <div className="bg-[#0B0F17] border border-slate-800/90 rounded-xl p-3.5 space-y-2 flex items-center gap-3">
                {shareData.imageUrl && (
                  <img
                    src={shareData.imageUrl}
                    alt="معاينة"
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold block mb-0.5" style={{ color: activeAccent.primary }}>
                    {shareData.category || 'إنتاج بالذكاء الاصطناعي'}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{shareData.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{shareData.text}</p>
                </div>
              </div>

              {/* Native Web Share Button */}
              {'share' in navigator && (
                <button
                  type="button"
                  onClick={() => triggerShare(shareData, false)}
                  className="w-full py-3 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: activeAccent.primary }}
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر تطبيقات الجهاز (Web Share API)</span>
                </button>
              )}

              {/* Direct Link Copy */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">الرابط المباشر للمشاركة</label>
                <div className="flex items-center gap-2 bg-[#0B0F17] border border-slate-700/80 rounded-xl p-1.5 pr-3">
                  <input
                    type="text"
                    readOnly
                    value={shareData.url || window.location.href}
                    className="bg-transparent text-xs text-slate-300 flex-1 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyDirectShareLink(shareData.url || window.location.href)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5"
                    style={{ backgroundColor: activeAccent.primary }}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="block text-[11px] text-slate-400 font-semibold">مشاركة مباشرة على المنصات:</span>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${shareData.title}\n${shareData.text}\n\n${shareData.url || window.location.href}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-center text-[11px] font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>واتساب</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `${shareData.title}\n${shareData.text}`
                    )}&url=${encodeURIComponent(shareData.url || window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-center text-[11px] font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>منصة X</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      shareData.url || window.location.href
                    )}&text=${encodeURIComponent(`${shareData.title}\n${shareData.text}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-xl text-center text-[11px] font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>تيليجرام</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareData.url || window.location.href
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-center text-[11px] font-bold transition flex flex-col items-center gap-1"
                  >
                    <span>لينكد إن</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
