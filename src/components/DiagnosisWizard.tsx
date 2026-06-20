import React, { useState, useEffect } from 'react';
import { POULTRY_DISEASES, Disease } from '../diseasesData';
import { Check, ShieldAlert, ChevronRight, Activity, Award, HelpCircle, FileLock } from 'lucide-react';

interface MatchedResult {
  disease: Disease;
  percentage: number;
  matchedSymptoms: string[];
  matchedLesions: string[];
}

export default function DiagnosisWizard() {
  const [step, setStep] = useState<number>(() => {
    const saved = localStorage.getItem('vetscout_wiz_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [projectMode, setProjectMode] = useState<'Breeder' | 'Fattening'>(() => {
    return (localStorage.getItem('vetscout_wiz_mode') as 'Breeder' | 'Fattening') || 'Fattening';
  });
  const [ageRange, setAgeRange] = useState<string>(() => {
    return localStorage.getItem('vetscout_wiz_age') || 'all';
  });
  
  // Active clinical signs selected
  const [symptoms, setSymptoms] = useState<string[]>(() => {
    const saved = localStorage.getItem('vetscout_wiz_symptoms');
    return saved ? JSON.parse(saved) : [];
  });
  // Active necropsy findings selected 
  const [lesions, setLesions] = useState<string[]>(() => {
    const saved = localStorage.getItem('vetscout_wiz_lesions');
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState<MatchedResult[]>(() => {
    const saved = localStorage.getItem('vetscout_wiz_results');
    return saved ? JSON.parse(saved) : [];
  });
  const [hasCalculated, setHasCalculated] = useState<boolean>(() => {
    return localStorage.getItem('vetscout_wiz_calculated') === 'true';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vetscout_wiz_step', String(step));
  }, [step]);

  useEffect(() => {
    localStorage.setItem('vetscout_wiz_mode', projectMode);
  }, [projectMode]);

  useEffect(() => {
    localStorage.setItem('vetscout_wiz_age', ageRange);
  }, [ageRange]);

  useEffect(() => {
    localStorage.setItem('vetscout_wiz_symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem('vetscout_wiz_lesions', JSON.stringify(lesions));
  }, [lesions]);

  useEffect(() => {
    localStorage.setItem('vetscout_wiz_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('vetscout_wiz_calculated', String(hasCalculated));
  }, [hasCalculated]);

  // Available interactive symptom entries
  const CLINICAL_SIGNS = [
    { id: "gasping", label: "سعال، ضيق تنفس، حشرجة في الصوت، أو أصوات تنفسية مسموعة", tag: "تنفسي" },
    { id: "bloody_droppings", label: "زرق دموي، أو بني شوكولاتي متكرر، أو مائل للبرتقالي النازف", tag: "هضمي معوي" },
    { id: "green_diarrhea", label: "إسهال مائي مخضر أو مائل جداً للاصفرار المائي", tag: "هضمي معوي" },
    { id: "vent_soil", label: "إسهال مائي متجبن أبيض/أصفر مع اتساخ شديد لريش المجمع", tag: "هضمي معوي" },
    { id: "torticollis", label: "التواء الرقبة (الصرع العصبي) أو تدلي وشلل الأجنحة", tag: "عصبي" },
    { id: "swollen_head", label: "احتقان وتورم شديد بالرأس والوجه، العرف، والدلايات", tag: "حاد" },
    { id: "lameness", label: "عرج واضح بالقطيع أو تورم شديد في مفاصل العرقوب", tag: "حركي مفصلي" },
    { id: "sudden_deaths", label: "نفوق مفاجئ وغير مفسر بمعدل كبير خلال 48 ساعة", tag: "حاد متسارع" }
  ];

  // Available post-mortem lesion options
  const POST_MORTEM_LESIONS = [
    { id: "proventriculus_spots", label: "أنزفة ومساحات نزفية دقيقة على غدد غشاء المعدة الغدية", organ: "المعدة الغدية" },
    { id: "ulcers_tonsils", label: "قرح ونزف معوي في غدد لوز اللفائفي أو الأعورية", organ: "الامعاء واللوزتين" },
    { id: "bursa_cherry", label: "تضخم كرزي دموي أو ضمور مصلي حاد في غدة فابريشيوس", organ: "غدة فابريشيوس" },
    { id: "kidney_urate", label: "تضخم الكلى الحاد والبهتان مع امتلائها برواسب اليورات الطباشيرية البيضاء", organ: "الكليتين" },
    { id: "cecal_blood", label: "تضخم الأعورين على شكل سجق داكن ممتلئين بجلطات دموية نزفية غامقة", organ: "الأعورين" },
    { id: "fibrin_liver", label: "غشاء فيبريني تجبني مصفر (زبدة مائعة) يغطي السطح الخارجي للكبد وغشاء القلب", organ: "الكبد والقلب" },
    { id: "velvet_gut", label: "تنخر ومظهر منشفي تركي حاد متمزق لغشاء جدار الأمعاء الداخلي", organ: "جدار الأمعاء" }
  ];

  // Toggle selected items helper
  const toggleSymptom = (id: string) => {
    setSymptoms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleLesion = (id: string) => {
    setLesions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Perform scoring synthesis logic
  const calculateDifferentialMatches = () => {
    const finalMatches: MatchedResult[] = [];

    POULTRY_DISEASES.forEach(disease => {
      let score = 0;
      let totalChecksPossible = 0;
      const matchedSympStrings: string[] = [];
      const matchedLesStrings: string[] = [];

      // 1. Project Mode suitability (important weighting)
      if (disease.impactedProjects.includes(projectMode)) {
        score += 20;
      }
      totalChecksPossible += 20;

      // 2. Symptoms intersection checking
      symptoms.forEach(symp => {
        // Soft match clinical symptoms
        let matches = false;
        if (symp === "gasping" && (disease.id === "newcastle-disease" || disease.id === "infectious-bronchitis" || disease.id === "crd-mycoplasmosis" || disease.id === "colibacillosis")) {
          matches = true;
        }
        if (symp === "bloody_droppings" && (disease.id === "coccidiosis" || disease.id === "necrotic-enteritis")) {
          matches = true;
        }
        if (symp === "green_diarrhea" && (disease.id === "newcastle-disease" || disease.id === "avian-influenza")) {
          matches = true;
        }
        if (symp === "vent_soil" && (disease.id === "gumboro-disease" || disease.id === "colibacillosis")) {
          matches = true;
        }
        if (symp === "torticollis" && disease.id === "newcastle-disease") {
          matches = true;
        }
        if (symp === "swollen_head" && (disease.id === "avian-influenza" || disease.id === "crd-mycoplasmosis")) {
          matches = true;
        }
        if (symp === "lameness" && (disease.id === "gumboro-disease" || disease.id === "colibacillosis")) {
          matches = true;
        }
        if (symp === "sudden_deaths" && (disease.id === "avian-influenza" || disease.id === "gumboro-disease" || disease.id === "necrotic-enteritis")) {
          matches = true;
        }

        if (matches) {
          score += 15;
          const label = CLINICAL_SIGNS.find(c => c.id === symp)?.label || symp;
          matchedSympStrings.push(label);
        }
      });
      totalChecksPossible += (symptoms.length * 15);

      // 3. Post-mortem lesions intersection checking
      lesions.forEach(les => {
        let matches = false;
        if (les === "proventriculus_spots" && (disease.id === "newcastle-disease" || disease.id === "avian-influenza")) {
          matches = true;
        }
        if (les === "ulcers_tonsils" && (disease.id === "newcastle-disease")) {
          matches = true;
        }
        if (les === "bursa_cherry" && disease.id === "gumboro-disease") {
          matches = true;
        }
        if (les === "kidney_urate" && (disease.id === "infectious-bronchitis" || disease.id === "gumboro-disease")) {
          matches = true;
        }
        if (les === "cecal_blood" && disease.id === "coccidiosis") {
          matches = true;
        }
        if (les === "fibrin_liver" && (disease.id === "colibacillosis" || disease.id === "crd-mycoplasmosis")) {
          matches = true;
        }
        if (les === "velvet_gut" && disease.id === "necrotic-enteritis") {
          matches = true;
        }

        if (matches) {
          score += 25;
          const label = POST_MORTEM_LESIONS.find(p => p.id === les)?.label || les;
          matchedLesStrings.push(label);
        }
      });
      totalChecksPossible += (lesions.length * 25);

      // Yield proportional rating
      const ratingPercentage = totalChecksPossible > 0 ? Math.round((score / totalChecksPossible) * 100) : 0;
      
      // Only keep in selection if there is any overlap
      if (ratingPercentage > 15) {
        finalMatches.push({
          disease,
          percentage: ratingPercentage,
          matchedSymptoms: matchedSympStrings,
          matchedLesions: matchedLesStrings
        });
      }
    });

    // Sort by descending matching percent
    finalMatches.sort((a, b) => b.percentage - a.percentage);
    setResults(finalMatches);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setSymptoms([]);
    setLesions([]);
    setResults([]);
    setHasCalculated(false);
    setStep(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6 text-right" id="diagnostic-scoring-matrix" dir="rtl">
      
      {/* Header Wizard Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-5 gap-4">
        <div className="space-y-0.5 text-right w-full">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 justify-start">
            <Activity className="w-5 h-5 text-[#027E74]" />
            <span>معالج ومصفوفة الترجيح التشخيصي</span>
          </h3>
          <p className="text-xs text-slate-500">منظومة ذكية لمطابقة مسببات الأمراض بناءً على عمر الفوج، الأعراض الميدانية، والآفات التشريحية للنافق</p>
        </div>
        
        {/* Step dots */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100 font-mono text-[10px] text-slate-500 shrink-0 self-end sm:self-auto" dir="ltr">
          <span className={`px-2 py-0.5 rounded-md ${step === 1 ? 'bg-[#027E74] text-white font-bold' : ''}`}>1. التهيئة</span>
          <span className="text-slate-300">/</span>
          <span className={`px-2 py-0.5 rounded-md ${step === 2 ? 'bg-[#027E74] text-white font-bold' : ''}`}>2. العوارض (الأعراض)</span>
          <span className="text-slate-300">/</span>
          <span className={`px-2 py-0.5 rounded-md ${step === 3 ? 'bg-[#027E74] text-white font-bold' : ''}`}>3. الصفة التشريحية</span>
        </div>
      </div>

      {/* Main Form Content */}
      {!hasCalculated ? (
        <div className="min-h-[280px] flex flex-col justify-between">
          
          {/* STEP 1: Demographic Setup */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                
                {/* Project Mode */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-slate-800 block">1. نمط الدورة الإنتاجية والتربية:</label>
                  <p className="text-xs text-slate-400">تتطلب تربية الأمهات حماية للبيض ودورات أمان طويلة؛ بينما يستهدف التسمين الميداني معدلات نمو عالية ومتسارعة.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => setProjectMode('Fattening')}
                      className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                        projectMode === 'Fattening'
                          ? 'border-[#027E74] bg-emerald-50/10 text-[#027E74] font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-600'
                      }`}
                    >
                      <span className="text-lg">🍖</span>
                      <span className="text-xs font-bold">تسمين (دجاج اللحم)</span>
                    </button>
                    <button
                      onClick={() => setProjectMode('Breeder')}
                      className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                        projectMode === 'Breeder'
                          ? 'border-[#027E74] bg-emerald-50/10 text-[#027E74] font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-600'
                      }`}
                    >
                      <span className="text-lg">🥚</span>
                      <span className="text-xs font-bold">أمهات التسمين</span>
                    </button>
                  </div>
                </div>

                {/* Age parameters */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-slate-800 block">2. عمر الفوج / الدفعة الحالية:</label>
                  <p className="text-xs text-slate-400">تحدد هذه الحساسية الفسيولوجية نطاقات الأمراض والآفات الأكثر احتمالاً للحدوث خلال أسابيع التربية.</p>
                  <div className="space-y-2 mt-2">
                    {[
                      { id: 'all', label: 'جميع عينات الدورة مشتبهة' },
                      { id: 'week1', label: 'مرحلة التحضين الأولى (اليوم 1 إلى 7)' },
                      { id: 'weeks2_4', label: 'شروخ وغزارة النمو (الأسابيع 2 إلى 4)' },
                      { id: 'weeks5', label: 'مرحلة التشطيب والتسويق (الأسبوع 5 فأكثر)' }
                    ].map((age) => (
                      <label
                        key={age.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer text-xs font-semibold text-slate-700 hover:bg-slate-50 transition justify-start text-right ${
                          ageRange === age.id ? 'border-[#027E74] bg-emerald-50/5 text-emerald-950' : 'border-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ageRangeSelector"
                          checked={ageRange === age.id}
                          onChange={() => setAgeRange(age.id)}
                          className="text-[#027E74] focus:ring-[#027E74]"
                        />
                        <span>{age.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Clinical signs selector */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-right">
              <div>
                <label className="text-sm font-bold text-slate-800 block">3. حدد الأعراض الإكلينيكية والظاهرية الملاحظة في العنبر:</label>
                <p className="text-xs text-slate-400 mt-1">طابق المظاهر الحيوية المصورة أو المرصودة من قِبل المشرف أو عمال المعالف.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {CLINICAL_SIGNS.map((sign) => {
                  const active = symptoms.includes(sign.id);
                  return (
                    <button
                      key={sign.id}
                      onClick={() => toggleSymptom(sign.id)}
                      className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer text-right justify-start ${
                        active
                          ? 'border-[#027E74] bg-emerald-50/5 text-slate-900 font-semibold shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-600'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        active ? 'bg-[#027E74] border-[#027E74] text-white' : 'border-slate-300'
                      }`}>
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <div className="space-y-0.5 text-xs text-slate-800">
                        <span className="block font-medium">{sign.label}</span>
                        <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm font-sans mt-0.5">
                          العلامة: {sign.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Post Mortem Lesions Selector */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-right">
              <div>
                <label className="text-sm font-bold text-slate-800 block">4. حدد الآفات والصفات التشريحية المسجلة (الصفة التشريحية للنافق):</label>
                <p className="text-xs text-slate-400 mt-1">علم على التغيرات العضوية الداخلية المستكشفة أثناء معاينة جيف الطيور النافقة ميدانياً.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {POST_MORTEM_LESIONS.map((lesion) => {
                  const active = lesions.includes(lesion.id);
                  return (
                    <button
                      key={lesion.id}
                      onClick={() => toggleLesion(lesion.id)}
                      className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer text-right justify-start ${
                        active
                          ? 'border-[#027E74] bg-emerald-50/5 text-slate-900 font-semibold shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-600'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        active ? 'bg-[#027E74] border-[#027E74] text-white' : 'border-slate-300'
                      }`}>
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <div className="space-y-0.5 text-xs text-slate-800">
                        <span className="block font-medium">{lesion.label}</span>
                        <span className="inline-block text-[9px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded-sm font-sans mt-0.5">
                          العضو المصاب: {lesion.organ}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls inside wizard */}
          <div className="border-t border-slate-50 pt-5 mt-6 flex justify-between items-center" dir="ltr">
            {step < 3 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-[#027E74] hover:bg-[#006A62] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>المتابعة</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={calculateDifferentialMatches}
                className="px-8 py-3 rounded-xl bg-[#027E74] hover:bg-[#006A62] text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-101 duration-150"
              >
                <Activity className="w-4 h-4" />
                <span>توليد التقرير الترجيحي والمطابقة</span>
              </button>
            )}

            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                السابق
              </button>
            ) : (
              <div />
            )}
          </div>

        </div>
      ) : (
        /* Results Presentation Screen */
        <div className="space-y-6 animate-in zoom-in-100 duration-150 text-right" dir="rtl">
          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-100">
            <div className="space-y-0.5 text-right">
              <span className="text-[10px] bg-emerald-100 text-[#027E74] px-2 py-0.5 rounded-full font-bold uppercase font-sans">
                تم تحميل ملف ترجيح الآفات بنجاح
              </span>
              <p className="text-xs text-slate-600 mt-1">
                طبيعة العنبر: <strong>دورة {projectMode === 'Fattening' ? 'تسمين دواجن' : 'أمهات وبياض'}</strong> &bull; الأعراض المختارة: {symptoms.length || 0} &bull; عوامل التشريح المسجلة: {lesions.length || 0}
              </p>
            </div>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-black transition cursor-pointer"
            >
              إعادة تعيين مصفوفة الأسئلة
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800">الأمراض الباثولوجية المرشحة (مرتبة بحسب نسبة ومعايير المطابقة):</h4>
            
            <div className="space-y-4">
              {results.map((res) => (
                <div
                  key={res.disease.id}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 p-5 shadow-xs transition-colors space-y-4 text-right"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="text-right">
                      <div className="flex items-center gap-2 flex-wrap justify-start">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          res.percentage >= 60 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-750'
                        }`}>
                          تطابق مؤكد بنسبة {res.percentage}%
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {res.disease.id}</span>
                      </div>
                      
                      <h5 className="font-extrabold text-slate-900 text-base mt-1 flex items-center gap-2 justify-start">
                        <span>{res.disease.arabicName || res.disease.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({res.disease.name})</span>
                      </h5>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold font-sans text-right">
                      المحفز المرضي: {res.disease.pathogen}
                    </div>
                  </div>

                  {/* Intersect indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 text-xs text-right">
                    <div className="space-y-1.5 text-right">
                      <span className="font-bold text-slate-700 block">الأعراض الميدانية المتطابقة:</span>
                      {res.matchedSymptoms.length > 0 ? (
                        <div className="space-y-1 text-right">
                          {res.matchedSymptoms.map((ms, index) => (
                            <span key={index} className="flex gap-1.5 text-slate-600 justify-start">
                              <span className="text-emerald-600 font-black">&bull;</span>
                              <span>{ms}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic block">لم تتقاطع أعراض حقلية وظاهرية مرافقة مباشرة.</span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-right">
                      <span className="font-bold text-slate-700 block">الصفات التشريحية المتطابقة:</span>
                      {res.matchedLesions.length > 0 ? (
                        <div className="space-y-1 text-right">
                          {res.matchedLesions.map((ml, index) => (
                            <span key={index} className="flex gap-1.5 text-slate-600 justify-start">
                              <span className="text-red-500 font-black">&bull;</span>
                              <span>{ml}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic block">لم تتقاطع آفات للتشريح والأعضاء مباشرة.</span>
                      )}
                    </div>
                  </div>

                  {/* Scientific actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2">
                    <div className="flex items-center gap-1 text-slate-500 justify-start">
                      <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>فحص التمايز والتشخيص الموصى به: <strong className="text-emerald-950 font-bold">{res.disease.differentialDiagnosis[0]}</strong></span>
                    </div>
                    
                    <span className="bg-emerald-50 text-[#027E74] px-3 py-1 rounded-lg font-bold text-right self-start sm:self-auto">
                      أولوية المكافحة: عزل الطيور، دورات الفيتامينات والرافعات، مراجعة البيو-أمن
                    </span>
                  </div>
                </div>
              ))}

              {results.length === 0 && (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-bold">لا يوجد مسبب بمطابقة مرشحة عالية</p>
                  <p className="text-xs text-slate-400 mt-0.5">قم بتعديل أو إضافة مؤشرات الأعراض أو حدد آفات تشريحية أدق للاقتصاص للداء الأقرب.</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg mx-auto">
              ⚠️ <strong>تنويه وإرشاد سريري:</strong> مصفوفة المطابقة والترجيح تبنى استقرائياً على المعطيات المرفقة تشكيلياً. في مزارع الدواجن قد تظهر إصابات مركبة متداخلة (مثال: نيوكاسل مصاحباً لهجمة قولونية حادة). العزل المخبري والزرع النسيجي تحت يد المصالح البيطرية الحقلية هو الموثق المعتمد والمثبت الوحيد.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
