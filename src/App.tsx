import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Camera, 
  Activity, 
  ShieldAlert, 
  Bot, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import DiseasesDirectory from './components/DiseasesDirectory';
import AIAnalyzer from './components/AIAnalyzer';
import DiagnosisWizard from './components/DiagnosisWizard';
import BiosecurityTester from './components/BiosecurityTester';
import VetChat from './components/VetChat';
import ExportReportSection from './components/ExportReportSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'database' | 'analyzer' | 'wizard' | 'biosecurity' | 'chat'>('database');
  const [projectFilter, setProjectFilter] = useState<'All' | 'Breeder' | 'Fattening'>('All');

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased pb-24 select-none" dir="rtl">
      
      {/* Hero Banner Area */}
      <header className="bg-gradient-to-b from-white to-transparent border-b border-slate-100/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-extrabold shadow-2xs font-display">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>جناح التشخيص الذكي والتحليل المرضي - نشط</span>
            </div>
            
            {/* Hard-styled teal banner to match screenshot exactly */}
            <div className="w-full h-[120px] bg-[#027E74] rounded-2xl shadow-inner relative overflow-hidden" id="header-brand-banner">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center pr-6 md:pr-10">
                <div className="text-white text-right space-y-1">
                  <h2 className="text-xl md:text-3xl font-black tracking-tight font-display">
                    مستكشف الدواجن والتحليل المرضي (Vet-Scout)
                  </h2>
                  <p className="text-[10px] md:text-xs text-teal-100/90 font-bold tracking-widest uppercase font-mono">
                    المنصة البيطرية الميدانية الشاملة للأمن الحيوي والتشخيص التفريقي
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed text-right font-medium">
              تمكين مشرفي مشاريع الفروج والأمهات من استخدام أوراق تشخيصية تفاعلية، وسجلات تقييم الآفات بالذكاء الاصطناعي، وأدوات تدقيق ومطابقة فئات الأمن الحيوي بدقة حقلية عالية.
            </p>
          </div>

          {/* Quick Metrics Cards and Overview Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              { label: "الأمراض الباثولوجية الموثقة", value: "8 باثولوجيات رئيسية" },
              { label: "محلل الذكاء الاصطناعي للجروح", value: "مجهر FlockSight للرؤية" },
              { label: "مصفوفات التحليل النشطة", value: "معايير التشخيص التفريقي" },
              { label: "إشراف الأمن الحيوي", value: "مؤشرات USDA/WHO العالمية" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">{stat.label}</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 block mt-1 tracking-tight">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation Tabs Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* Custom Bento-styled Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#027E74]" />
            <span>الفهرس الشامل للأمراض (قاعدة البيانات)</span>
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'analyzer'
                ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Camera className="w-4 h-4 text-[#027E74] animate-pulse" />
            <span>محلل الأعضاء FlockSight (الذكاء الاصطناعي)</span>
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'wizard'
                ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Activity className="w-4 h-4 text-[#027E74]" />
            <span>مصفوفة التشخيص والصفة التشريحية</span>
          </button>

          <button
            onClick={() => setActiveTab('biosecurity')}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'biosecurity'
                ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#027E74]" />
            <span>تدقيق الأمن الحيوي ومخاطر تفشي الأوبئة</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Bot className="w-4 h-4 text-[#027E74]" />
            <span>مستشار العيادة الافتراضية المباشر</span>
          </button>
        </div>

        {/* Dynamic Views Rendering wrapper with route-like motion animations */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="min-h-[400px]"
        >
          {activeTab === 'database' && (
            <DiseasesDirectory selectedProjectId={projectFilter} />
          )}

          {activeTab === 'analyzer' && (
            <AIAnalyzer />
          )}

          {activeTab === 'wizard' && (
            <DiagnosisWizard />
          )}

          {activeTab === 'biosecurity' && (
            <BiosecurityTester />
          )}

          {activeTab === 'chat' && (
            <VetChat />
          )}
        </motion.div>

        {/* Dynamic PDF Export Section */}
        <ExportReportSection />

        {/* Informative Agriculture Resources footer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div className="bg-gradient-to-r from-emerald-950 to-teal-900 rounded-3xl p-6 text-white space-y-4 shadow-sm relative overflow-hidden text-right">
            <span className="text-[10px] font-bold text-emerald-300 font-mono tracking-wider uppercase">
              معايير الأمن الحيوي والوقاية التشغيلية
            </span>
            <h4 className="text-xl font-bold tracking-tight font-display">
              تجنب واستبعاد إنفلونزا الطيور شديدة الضراوة
            </h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
              يتطلب القانون من مشرفي قطعان الدواجن عزل دورات التربية فوراً في حال تراجع استهلاك المياه المعتاد بالتزامن مع تضخم في العرف أو بقع زرقاء في الأرجل والمناطق الخالية من الريش. يجب إبلاغ مفتشيات الهيئة البيطرية خلال 24 ساعة من الاشتباه لضمان التطويق الحيوي.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-white font-extrabold cursor-pointer">
              <span>عرض البروتوكولات الوقائية المحلية</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </div>
            {/* Ambient vector detail */}
            <span className="absolute left-[-20px] bottom-[-20px] opacity-10 text-9xl pointer-events-none select-none">🐔</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-120/60 p-6 shadow-2xs space-y-4 relative overflow-hidden text-right">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
              إرشادات الصفة التشريحية الحقلية
            </span>
            <h4 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              التسلسل التشريحي المنهجي لحالات النفوق
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              عند فحص وعزل الطيور النافقة، ابدأ بتتبع عزل ودراسة الأعضاء بشكل زمني ومنظم: تقييم القصبة الهوائية وتفقد السدادات المخاطية، تليها الأكياس الهوائية للرئة وتفقد الأغشية المتجبنة، ثم جدران وغدد المعدة الغدية بحثاً عن نزيف عند القمم، وانتهاءً بفحص غدة فابريشوس للتضخم.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#027E74] font-extrabold cursor-pointer">
              <span>تحليل ودراسة دليل باثولوجيا التشريح الكامل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

      </main>

      {/* Floating project navigator bar - exactly styled to support breeder/fattening filters visually */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl px-5 py-2.5 rounded-full flex flex-row items-center justify-between gap-6 max-w-4xl w-[92%] sm:w-auto" id="floating-project-bar">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#027E74] flex items-center justify-center text-white text-base font-black shadow-xs shrink-0">
            🦚
          </div>
          <div className="text-right leading-none hidden sm:block">
            <div className="text-xs font-black text-slate-900 tracking-tight">مستكشف الدواجن Vet-Scout</div>
            <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">رفيق تشخيص وإدارة مزارع الفروج</div>
          </div>
        </div>
        
        <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold gap-0.5 select-none shrink-0" dir="ltr">
          <button
            onClick={() => setProjectFilter('All')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
              projectFilter === 'All'
                ? 'bg-white text-[#027E74] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            كل الدفعات
          </button>
          <button
            onClick={() => setProjectFilter('Breeder')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
              projectFilter === 'Breeder'
                ? 'bg-white text-[#027E74] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🥚 الأمهات
          </button>
          <button
            onClick={() => setProjectFilter('Fattening')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
              projectFilter === 'Fattening'
                ? 'bg-white text-[#027E74] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍖 التسمين
          </button>
        </div>
      </div>

      {/* Global Clinical Agriculture Footer */}
      <footer className="mt-16 border-t border-slate-100 pt-8 bg-white pb-16 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
            <span className="font-bold text-slate-600 font-display">منصة تشخيص أمراض الدواجن (Vet-Scout)</span>
            <span className="text-slate-300">|</span>
            <span>الرفيق والإرشاد الميداني الشامل v1.5</span>
            <span className="text-slate-300">|</span>
            <span className="bg-emerald-50 text-[#027E74] px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold">بوابة الذكاء الاصطناعي متصلة</span>
          </div>
          <p className="max-w-xl mx-auto leading-normal text-[10px] text-slate-400 text-center font-sans">
            إخلاء مسؤولية للتربية الحقلية: هذا النظام هو دليل استرشادي لمشرفي قطعان الفروج والتسمين والتربية. جميع الاستدلالات أو مخرجات التحليل التلقائي والذكاء الاصطناعي هي توصيات مساندة فقط، ويجب التحقق المباشر من خلال الفحص والتشريح من مكاتب الطب البيطري المرخصة والتحاليل المخبرية المعتمدة.
          </p>
        </div>
      </footer>

    </div>
  );
}
