import React, { useState, useEffect } from 'react';
import { ShieldCheck, Crosshair, ArrowRight, CheckSquare, Zap, Activity } from 'lucide-react';

interface AuditItem {
  id: string;
  question: string;
  description: string;
  category: 'Infrastructure' | 'Personnel' | 'Sanitation';
}

const AUDIT_QUESTIONS: AuditItem[] = [
  {
    id: "bird_proof",
    question: "إحكام الحماية وعزل الطيور البرية عن فتحات التهوية والشبك الحظائري",
    description: "هل شباك العزل معزولة ومكتملة الفحص الدوري للثقوب؟ ملامسة القطيع لفيلق الطيور البرية ينقل أمراض الإنفلونزا شديدة الضراوة والنيوكاسل المعوي.",
    category: "Infrastructure"
  },
  {
    id: "water_chlorination",
    question: "كلورة مياه الآبار والمخازن بصفة منتظمة (تركيز من 2 إلى 4 جزء في المليون)",
    description: "هل مياه الشرب لخطوط الحظائر مكلورة بانتظام لضمان قتل الميكروبات؟ مستويات بكتيريا E. coli والسالامونيلا تترعرع وتتضاعف بمعدلات عملاقة في الأنابيب الراكدة.",
    category: "Sanitation"
  },
  {
    id: "vehicle_disinfection",
    question: "رش وتطهير وسائط النقل وشاحنات التوريد عند البوابات الميدانية للمشروع",
    description: "هل تخضع جميع شاحنات الأعلاف والصيصان للرش بالمطهرات قبل الفناء الداخلي؟ عجلات السيارات والشاحنات هي من أكبر حوامل ناقلات الدواجن والبيوض الطفيلية.",
    category: "Personnel"
  },
  {
    id: "footwear_exchange",
    question: "استبدال الأحذية وارتداء الملابس البيضاء الواقية عند عتبة كل عنبر",
    description: "هل يلتزم المشرفون والعمال بتبديل البوتات الواقية عند مدخل العنبر المنفصل؟ ارتداء الحذاء عينه يضمن تفشي عدوى الجمبورو والكوكسيديا الطفيلية بين الحظائر الحيوية.",
    category: "Personnel"
  },
  {
    id: "litter_moisture",
    question: "اختبار جفاف فرشة العنبر الدائم وإبقاؤها خالية تماماً من بقع رطوبة السقايات",
    description: "هل رطوبة النشارة تحت نسبة 30%؟ البقع الرطبة المحتقنة بالبراز والمحيطة بالمشارب هي الحاضن البيئي المباشر لطفيل الكوكسيديا النازف والتهاب الأمعاء التنخري.",
    category: "Sanitation"
  },
  {
    id: "ammonia_ventilation",
    question: "تنظيم تدفق الشفاطات واختبار جودة الهواء ومستويات غاز الأمونيا (< 15 جزء بالمليون)",
    description: "هل الشفاطات والفتحات العلوية مبرمجة لطرد الغازات الخانقة بشكل سلس؟ الأمونيا المرتفعة تشل أهداب المجرى الأنفي، فاتحة بوابة غزو أمراض السعال والمايكوبلازما (CRD).",
    category: "Infrastructure"
  }
];

export default function BiosecurityTester() {
  const [scores, setScores] = useState<Record<string, 'fully' | 'partially' | 'neglected'>>(() => {
    const saved = localStorage.getItem('vetscout_bio_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      bird_proof: 'fully',
      water_chlorination: 'partially',
      vehicle_disinfection: 'neglected',
      footwear_exchange: 'partially',
      litter_moisture: 'partially',
      ammonia_ventilation: 'fully'
    };
  });

  useEffect(() => {
    localStorage.setItem('vetscout_bio_scores', JSON.stringify(scores));
  }, [scores]);

  const selectOption = (id: string, option: 'fully' | 'partially' | 'neglected') => {
    setScores(prev => ({ ...prev, [id]: option }));
  };

  // Compute stats
  const totalScore: number = (Object.values(scores) as string[]).reduce<number>((acc: number, currentStr: string) => {
    if (currentStr === 'fully') return acc + 16.6;
    if (currentStr === 'partially') return acc + 8.3;
    return acc;
  }, 0);

  const roundedScore = Math.min(100, Math.round(totalScore));

  const getHealthDescriptor = (sc: number) => {
    if (sc >= 85) return { label: "أمان حيوي ممتاز وحصين للغاية", color: "bg-emerald-50 text-emerald-950 border-emerald-250 text-right", text: "الفوج محمي بامتياز. فرصة تفشي الفيروسات الوبائية القاتلة كالنيوكاسل والإنفلونزا طفيفة ومقيدة بشدة. استمر بهذا التدقيق الصارم." };
    if (sc >= 50) return { label: "خطر متوسط - يحتاج لمراجعة ومعالجة", color: "bg-amber-50 text-amber-950 border-amber-250 text-right", text: "توجد ثغرات في أمان الحظائر. عدم الالتزام الدقيق بتبديل البوتات عند العتبات أو وجود نشارة رطبة قد يسرب العدوى للقطيع بأي دفعة." };
    return { label: "تهديد حرج وخطير للغاية بوقوع إصابات ونفوق", color: "bg-red-50 text-red-950 border-red-250 text-right", text: "العنابر مهددة باختراق وبائي مميت ممرض للأمراض التنفسية والمعوية. رطوبة النشارة وتسلل الطيور البرية وعدم تكلير المياه تشكل بوابات مستهلة للأمراض." };
  };

  const rating = getHealthDescriptor(roundedScore);

  const getCategoryArabic = (cat: string) => {
    if (cat === 'Infrastructure') return 'البنية والإنشاء الحامي';
    if (cat === 'Sanitation') return 'المطهرات والتعقيم المائي';
    return 'سلوكيات العاملين والزائرين';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6 text-right" id="biosecurity-scorecard" dir="rtl">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Score display block */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="space-y-4 text-right">
            <div className="space-y-0.5 text-right w-full">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5 justify-start">
                <ShieldCheck className="w-5.5 h-5.5 text-[#027E74]" />
                <span>تقييم الأمان البيولوجي المداجني</span>
              </h3>
              <p className="text-xs text-slate-500">احسب كفاءة حراسة المزرعة وحصر الطفيليات ومخرجات البيو-أمن حيوياً</p>
            </div>

            {/* Huge radial/donut score card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center space-y-3">
              <div className="inline-block relative">
                <div className="text-4xl font-black font-mono text-slate-900 tracking-tight" dir="ltr">{roundedScore}%</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">كفاءة الأمان البيولوجي المزدوج</div>
              </div>

              {/* Status capsule */}
              <div className={`p-3.5 rounded-xl border text-xs font-bold leading-normal text-right ${rating.color}`}>
                <div className="font-extrabold text-sm mb-1.5">{rating.label}</div>
                <p className="font-normal text-[11px] text-slate-700 leading-relaxed text-right">{rating.text}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/40 text-xs text-emerald-800 space-y-2 lg:mt-0 mt-4 leading-relaxed text-right">
            <div className="flex items-center gap-1 font-bold justify-start">
              <Zap className="w-3.5 h-3.5 text-[#027E74]" />
              <span>مذكرة المشرف الفورية للبيو-أمن</span>
            </div>
            <p className="text-[11px] leading-relaxed text-right">
              أي تقييمات أقل من 80% تستلزم تحركات استباقية سريعة بالبنية. تأكد فوراً من فحص مطهر العجلات وجفاف الفرشة تحت مشارب التسمين لمنع تطفل الكوكسبديا الملتوية.
            </p>
          </div>
        </div>

        {/* Audit Questions checklist */}
        <div className="lg:col-span-8 space-y-4 text-right">
          <div className="space-y-3 max-h-[500px] overflow-y-auto pl-1 pr-1">
            {AUDIT_QUESTIONS.map((item, index) => {
              const activeOption = scores[item.id];
              return (
                <div
                  key={item.id}
                  className="p-4 border border-slate-100 bg-slate-50/20 rounded-xl space-y-2.5 hover:border-emerald-100 transition-colors text-right"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div className="space-y-0.5 text-right flex-grow">
                      <div className="flex items-center gap-2 flex-wrap justify-start">
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-sm font-sans font-bold">
                          {getCategoryArabic(item.category)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">الخطوة {index+1} من 6</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-1 text-right">{item.question}</h4>
                    </div>

                    {/* Score pill selector */}
                    <div className="flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200 shrink-0 gap-0.5 self-end sm:self-start z-10" dir="ltr">
                      <button
                        onClick={() => selectOption(item.id, 'fully')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          activeOption === 'fully'
                            ? 'bg-[#027E74] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        مطبق تماما
                      </button>
                      <button
                        onClick={() => selectOption(item.id, 'partially')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          activeOption === 'partially'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        جزئيا
                      </button>
                      <button
                        onClick={() => selectOption(item.id, 'neglected')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          activeOption === 'neglected'
                            ? 'bg-red-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        مهمل بالكامل
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal text-right">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
