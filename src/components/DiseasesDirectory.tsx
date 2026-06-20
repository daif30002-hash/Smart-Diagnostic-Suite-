import React, { useState } from 'react';
import { Disease, POULTRY_DISEASES } from '../diseasesData';
import { Search, ShieldAlert, BookOpen, Layers, X, FileText, CheckCircle2, ChevronRight, Activity, ArrowRight } from 'lucide-react';

interface DiseasesDirectoryProps {
  onSelectDisease?: (diseaseId: string) => void;
  selectedProjectId: 'All' | 'Breeder' | 'Fattening';
}

export default function DiseasesDirectory({ onSelectDisease, selectedProjectId }: DiseasesDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'viral' | 'bacterial' | 'parasitic'>('all');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [activeFactsheetTab, setActiveFactsheetTab] = useState<'symptoms' | 'necropsy' | 'treatment' | 'prevention'>('symptoms');

  // Filter diseases based on parameters
  const filteredDiseases = POULTRY_DISEASES.filter(disease => {
    // 1. Project type filter
    if (selectedProjectId !== 'All' && !disease.impactedProjects.includes(selectedProjectId)) {
      return false;
    }

    // 2. Category tab filter
    if (activeTab !== 'all' && disease.category.toLowerCase() !== activeTab) {
      return false;
    }

    // 3. Search query filter
    const matchesSearch = 
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.arabicName.includes(searchQuery) ||
      disease.pathogen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.clinicalSymptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      disease.necropsyFindings.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const categories = ['All', 'Viral', 'Bacterial', 'Parasitic'];

  return (
    <div className="bg-slate-100 rounded-3xl border-[12px] border-slate-200 bg-opacity-90 p-5 md:p-6 space-y-6 shadow-xs" id="diseases-directory">
      {/* Search & Category Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 text-right">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="relative flex-1">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="disease-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالأعراض أو اسم المرض (مثال: نيوكاسل، التهاب الأمعاء، الكوكسيديا)..."
              className="w-full pr-11 pl-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#027E74]/20 focus:border-[#027E74] text-slate-800 font-medium transition-all text-right"
              dir="rtl"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
              >
                مسح البحث
              </button>
            )}
          </div>
          
          <div className="flex bg-slate-100/90 p-1 rounded-xl scrollbar-none overflow-x-auto gap-1" dir="ltr">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              كل الأمراض (All)
            </button>
            <button
              onClick={() => setActiveTab('viral')}
              className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'viral'
                  ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              فيروسي (Viral)
            </button>
            <button
              onClick={() => setActiveTab('bacterial')}
              className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'bacterial'
                  ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              بكتيري (Bacterial)
            </button>
            <button
              onClick={() => setActiveTab('parasitic')}
              className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'parasitic'
                  ? 'bg-white text-[#027E74] shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              طفيلي (Parasitic)
            </button>
          </div>
        </div>

        {/* Info indicators */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3 justify-start">
          <span className="flex items-center gap-1.5 font-bold text-[#027E74]">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-[#027E74] font-bold">✓</span>
            نعرض حالياً {filteredDiseases.length} مسبب مَرضي روتيني موثق
          </span>
          {selectedProjectId !== 'All' && (
            <span className="bg-emerald-50 text-[#027E74] px-2.5 py-0.5 rounded-full font-bold">
              تصفية لقطع: {selectedProjectId === 'Breeder' ? '🥚 الأمهات (Breeder)' : '🍖 التسمين (Fattening)'}
            </span>
          )}
        </div>
      </div>

      {/* Disease Cards Grid inside our nested container block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-right">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            id={`disease-card-${disease.id}`}
            onClick={() => {
              setSelectedDisease(disease);
              setActiveFactsheetTab('symptoms');
            }}
            className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Card Header Tags */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  disease.category === 'Viral' ? 'bg-red-50 text-red-700' :
                  disease.category === 'Bacterial' ? 'bg-amber-50 text-amber-700' :
                  disease.category === 'Parasitic' ? 'bg-emerald-50 text-[#027E74]' :
                  'bg-indigo-50 text-indigo-700'
                }`}>
                  مسبب {disease.category === 'Viral' ? 'فيروسي' : disease.category === 'Bacterial' ? 'بكتيري' : 'طفيلي'}
                </span>
                <span className="text-xs text-red-500 font-bold">
                  معدل النفوق: {disease.mortalityRate.split(' ')[0]}
                </span>
              </div>

              {/* Title & Pathogen details split to match screenshot precisely */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg md:text-xl tracking-tight leading-snug">
                  {disease.name}
                </h3>
                <p className="text-[#027E74] font-black text-sm text-right leading-none py-1" dir="rtl">
                  {disease.arabicName}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ميكروب مسبب: {disease.pathogen}
                </p>
              </div>

              {/* Targets Summary */}
              <div className="flex flex-wrap gap-1.5 mt-4 justify-start">
                {disease.impactedProjects.map((p) => (
                  <span key={p} className="text-[11px] bg-slate-50 text-slate-500 font-bold border border-slate-100/80 px-2 py-0.5 rounded-md">
                    مشاريع {p === 'Breeder' ? 'الأمهات' : 'التسمين'}
                  </span>
                ))}
                <span className="text-[11px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-bold">
                  {disease.affectedAges === 'All weeks' ? 'جميع الأسابيع والأعمار' : disease.affectedAges}
                </span>
              </div>

              {/* Bullet previews */}
              <div className="mt-4 border-t border-slate-50 pt-4 space-y-1.5 text-right">
                <span className="text-xs font-black text-slate-800 block">العلامة التشخيصية الفارقة:</span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;{disease.clinicalSymptoms[0]}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#027E74] font-extrabold group-hover:text-[#006A62] transition-colors" dir="rtl">
              <span>عرض الدليل البيطري الكامل والصفة التشريحية</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
          </div>
        ))}

        {filteredDiseases.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium text-lg">لا توجد مسببات تطابق فلاتر البحث الحالية</p>
            <p className="text-slate-400 text-sm mt-1">حاول مسح خانة البحث أو تغيير نوع الطيور المستهدفة.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-medium text-xs text-slate-700 transition cursor-pointer"
            >
              إعادة تعيين البحث
            </button>
          </div>
        )}
      </div>

      {/* Disease Factsheet Detailed Lightbox Modal */}
      {selectedDisease && (
        <div id="disease-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-height-[90vh] flex flex-col shadow-2xl relative border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap justify-start">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    selectedDisease.category === 'Viral' ? 'bg-red-50 text-red-700' :
                    selectedDisease.category === 'Bacterial' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    مسبب {selectedDisease.category === 'Viral' ? 'فيروسي' : selectedDisease.category === 'Bacterial' ? 'بكتيري' : 'طفيلي'}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                    الأعمار: {selectedDisease.affectedAges === 'All weeks' ? 'كل الأسابيع' : selectedDisease.affectedAges}
                  </span>
                  <span className="text-xs bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full font-semibold">
                    معدل النفوق المقدر: {selectedDisease.mortalityRate}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedDisease.name}
                </h2>
                <p className="text-xl font-bold text-[#027E74]">
                  {selectedDisease.arabicName}
                </p>
              </div>

              {/* Close Button & Pathogen Details */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="text-left hidden md:block pl-4 border-l border-slate-200">
                  <span className="text-xs text-slate-400 block font-mono">طبيعة الميكروب:</span>
                  <span className="text-sm font-semibold text-slate-700">{selectedDisease.pathogen}</span>
                </div>
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body & Navigation tabs */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] space-y-6">
              
              {/* Transmission alert box */}
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 font-display">تنبيه انتقال العدوى والانتشار</h4>
                  <p className="text-xs text-amber-800 leading-relaxed mt-0.5">{selectedDisease.transmissionMode}</p>
                </div>
              </div>

              {/* Tab options inside detailed factsheet */}
              <div className="flex border-b border-slate-100 overflow-x-auto gap-1">
                <button
                  onClick={() => setActiveFactsheetTab('symptoms')}
                  className={`pb-3 px-4 font-semibold text-sm border-b-2 hover:text-emerald-700 transition-all cursor-pointer whitespace-nowrap ${
                    activeFactsheetTab === 'symptoms'
                      ? 'border-[#027E74] text-[#027E74]'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  العلائم والأعراض الحقلية (Symptoms)
                </button>
                <button
                  onClick={() => setActiveFactsheetTab('necropsy')}
                  className={`pb-3 px-4 font-semibold text-sm border-b-2 hover:text-emerald-700 transition-all cursor-pointer whitespace-nowrap ${
                    activeFactsheetTab === 'necropsy'
                      ? 'border-[#027E74] text-[#027E74]'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  آفات الصفة التشريحية (Necropsy)
                </button>
                <button
                  onClick={() => setActiveFactsheetTab('treatment')}
                  className={`pb-3 px-4 font-semibold text-sm border-b-2 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap ${
                    activeFactsheetTab === 'treatment'
                      ? 'border-[#027E74] text-[#027E74]'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  الرعاية والعلاج والدعم البيطري (Support)
                </button>
                <button
                  onClick={() => setActiveFactsheetTab('prevention')}
                  className={`pb-3 px-4 font-semibold text-sm border-b-2 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap ${
                    activeFactsheetTab === 'prevention'
                      ? 'border-[#027E74] text-[#027E74]'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  الأمن الحيوي واللقاحات والمطهرات (Prevention)
                </button>
              </div>

              {/* Interactive Info Section Rendering */}
              <div>
                {activeFactsheetTab === 'symptoms' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-base justify-start">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <h5>مؤشرات تشخيصية حركية وسريرية</h5>
                      </div>
                      <ul className="space-y-3">
                        {selectedDisease.clinicalSymptoms.map((symptom, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed justify-start">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-[#027E74] flex items-center justify-center text-xs font-bold font-mono">
                              {i+1}
                            </span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono uppercase float-left">
                          مرجع المقارنة البصرية الحية
                        </span>
                        <h6 className="font-bold text-slate-800 text-sm mt-2 pt-4">ما تبحث عنه وتراقبه بصرياً في الحظيرة:</h6>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 italic bg-white p-3.5 rounded-xl border border-slate-100 text-right">
                          &ldquo;{selectedDisease.referenceImagesPlaceholder.flock}&rdquo;
                        </p>
                      </div>
                      
                      <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500 leading-relaxed text-right">
                        💡 <strong>نصيحة الطبيب المشرف:</strong> يجب رصد مستويات العطس والخرخرة الصباحية، نسب توزيع الطيور تحت الدفايات، وحالات تبلل الفرشة المحيطة بالمناهل.
                      </div>
                    </div>
                  </div>
                )}

                {activeFactsheetTab === 'necropsy' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-base justify-start">
                        <FileText className="w-5 h-5 text-red-600" />
                        <h5>ملاحظات التشريح والآفات الباطنية</h5>
                      </div>
                      <ul className="space-y-3">
                        {selectedDisease.necropsyFindings.map((finding, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed justify-start">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-xs font-bold font-mono">
                              {i+1}
                            </span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-mono uppercase float-left">
                          مرجع المقارنة البصرية للتشريح
                        </span>
                        <h6 className="font-bold text-slate-800 text-sm mt-2 pt-4">الملاحظات التشريحية المستهدفة:</h6>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 italic bg-white p-3.5 rounded-xl border border-slate-100 text-right">
                          &ldquo;{selectedDisease.referenceImagesPlaceholder.necropsy}&rdquo;
                        </p>
                      </div>
                      
                      <div className="mt-4 border-t border-slate-100 pt-3 text-red-800 bg-red-50/50 p-2.5 rounded-xl text-[11px] leading-relaxed font-semibold">
                        🛡️ <strong>العزل والتنظيم التفريقي:</strong> {selectedDisease.differentialDiagnosis.join(' / ')}
                      </div>
                    </div>
                  </div>
                )}

                {activeFactsheetTab === 'treatment' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100/60">
                        <h5 className="font-bold text-emerald-900 text-sm mb-3">التدابير الموصى بها مزارعياً وعلاجياً</h5>
                        <ul className="space-y-2">
                          {selectedDisease.treatmentAndControl.map((treatment, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-700 leading-relaxed justify-start">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                        <h5 className="font-bold text-slate-800 text-sm mb-2">توصيات إدارية وداعمة لمشرف العنبر:</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          في حالات الإصابة بمرض {selectedDisease.name}، يرجى تزويد المياه بالفيتامينات وتدعيمها بمضادات الإجهاد العضوية لتقليل نسب نفوق القطيع المجهد. اضبط مستويات التدفئة لتجنب التعرض للمغص المعوي الناتج عن انخفاض درجات الحرارة.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFactsheetTab === 'prevention' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-900 text-sm">برامج التحصين والوقاية المسبقة</h5>
                      <ul className="space-y-3">
                        {selectedDisease.biosecurityPrevention.map((prev, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700 leading-relaxed justify-start">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-2 ml-2"></span>
                            <span>{prev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-right">
                      <h6 className="font-bold text-slate-800 text-sm">معايير مزارع الفروج والأمهات الاحترازية:</h6>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        يجب الالتزام ببرنامج تعقيم وتطهير شامل للأحواش ومسح الغبار عن المراوح متبوعاً بفترة عزل (Empty Period) لا تقل عن 14 يوماً بين كل دفعة تفريخ وأخرى لكسر دورات تكاثر مسببات الأمراض في التربة.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
              <span className="text-center md:text-right">
                فهرس باثولوجيا الدواجن الطبية &bull; بروتوكول قطعان التربية والتسمين المعتمد
              </span>
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold font-sans transition shadow-xs cursor-pointer"
              >
                إغلاق دليل المرض
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
