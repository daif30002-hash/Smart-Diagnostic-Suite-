import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertCircle, FileText, CheckCircle, ShieldAlert, Sparkles, RefreshCw, Layers } from 'lucide-react';

// Pre-defined SVG vectors converted to Base64 to serve as valid, functional vision presets.
// These mock avian situations are clean and diagnostic.
const HOVER_LIVE_FLOCK_SVG = `PHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJkMzc0OCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNGZkMWM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MSVZFLUZMT0NLIEhVRERMSU5HIFBBVFRFUk48L3RleHQ+CiAgPCEtLSBSZXByZXNlbnQgY2hpY2tlbnMgaHVkZGxpbmcgdG9nZXRoZXIgLS0+CiAgPGcgZmlsbD0iI2VjYzk0YiIgc3Ryb2tlPSIjZDY5ZTJlIiBzdHJva2Utd2lkdGg9IjIiPgogICAgPGNpcmNsZSBjeD0iMTYwIiBjeT0iMTgwIiByPSIyOCIgb3BhY2l0eT0iMC45Ii8+CiAgICA8Y2lyY2xlIGN4PSIxOTAiIGN5PSIxOTAiIHI9IjMyIiBvcGFjaXR5PSIwLjkiLz4KICAgIDxjaXJjbGUgY3g9IjIxMCIgY3k9IjE3MCIgcj0iMzAiIG9wYWNpdH09IjAuOSIvPgogICAgPGNpcmNsZSBjeD0iMjQwIiBjeT0iMTk1IiByPSIzNCIgb3BhY2l0eT0iMC45Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNzAiIGN5PSIyMjAiIHI9IjMyIiBvcGFjaXR5PSIwLjkiLz4KICAgIDxjaXJjbGUgY3g9IjIxMCIgY3k9IjIyNSIgcj0iMzUiIG9wYWNpdHk9IjAuOSIvPgogICAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMjIwIiByPSIzMCIgb3BhY2l0eT0iMC45Ii8+CiAgPC9nPgogIDxyZWN0IHg9IjE0MCIgeT0iMjcwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYiIGZpbGw9IiNiNzc5MWYiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjEwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNhMGFlYzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhc2Ugc3R1ZHk6IEJyb2lsZXIgYnVuY2hpbmcgaW4gY29ybmVycywgcnVmZmxlZCBmZWF0aGVyczwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjEyNSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmYzgxODEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNVU1BFQ1RFRCBHVU1CT1JPIE9SIFRFTVBFUkFUVVJFIFNUPS9URVhUPgo8L3N2Zz4=`;

const LIVER_PERIHEPATITIS_SVG = `PHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzNiMGYwZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZjU2NTY1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BVVRPUFNZOiBMSVZFUiBDT0FUSU5HPC90ZXh0PgogIDwhLS0gTGl2ZXIgc2hhcGUgLS0+CiAgPHBhdGggZD0iTSAxMjAsMTgwIFEgMjAwLDEwMCAyODAsMTgwIFEgMjAwLDI2MCAxMjAsMTgwIFoiIGZpbGw9IiM0YTE1MTUiIHN0cm9rZT0iIzliMmMyYyIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPCEtLSBGaWJyaW5vdXMgcGxhcXVlIC0tPgogIDxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxODAiIHJ4PSI1NSIgcnk9IjM1IiBmaWxsPSIjZmVmMDhhIiBvcGFjaXR5PSIwLjg1IiBzdHJva2U9IiNjYWhhMDQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjE3MCIgY3k9IjE3MCIgcj0iOCIgZmlsbD0iI2NhOGEwNCIvPgogIDxjaXJjbGUgY3g9IjIzMCIgY3k9IjE4NSIgcj0iMTAiIGZpbGw9IiNjYWhhMDQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjkwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2UyZThmMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2FzZSBzdHVkeTogWWVsbG93LXdoaXRlIGZpYnJpbm91cyBwZXIraGVwYXRpdGlzPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iMTE1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2VjYzk0YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U1VTUEVDVEVEIEUuIENPTEkgLyBDT0xJQkFDSUxMT1NJUzwvdGV4dD4KPC9zdmc+`;

const COCCIDIA_CECA_SVG = `PHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFlMWI0YiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iMzUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjE2IiBmaWxsPSIjYTViNGZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DRUNBIEhFTU9SUkhBR0UgKFBPU1QtTU9SVEVNKTwvdGV4dD4KICA8IS0tIEludGVzdGluYWwgbG9vcCAtLT4KICA8cGF0aCBkPSJNIDExMCwxODAgUSAxNTAsMjIwIDIwMCwxODAgVCAyOTAsMTgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDwhLS0gQ2VjYWwgYmFncyAtLT4KICA8cGF0aCBkPSJNIDE3MCwxODAgUSAxODUsMjQwIDIwMCwyNDAgUSAyMTUsMjQwIDIzMCwxODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzdmMWQxZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHJlY3QgeD0iMTgwIiB5PSIxOTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzQ1MGEwYSIgb3BhY2l0eT0iMC44Ii8+CiAgPHRleHQgeD0iDUAlIiB5PSI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNjYmQ1ZTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhc2Ugc3R1ZHk6IEJsb29kLWZpbGxlZCBzd29sbGVuIGNlY2FsIHBvdWNoZXM8L3RleHQ+CiAgPHRleHQgeD0iDUAlIiB5PSIxMDUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZWY0NDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TVVNQRUNURUQgQ09DQ0lESU9TSVMgKEUuIFRFTkVMTEEpPC90ZXh0Pgo8L3N2Zz4=`;

export default function AIAnalyzer() {
  const [image, setImage] = useState<string | null>(() => localStorage.getItem('vetscout_ai_image'));
  const [mimeType, setMimeType] = useState<string>(() => localStorage.getItem('vetscout_ai_mime') || "image/png");
  const [analysisType, setAnalysisType] = useState<'flock' | 'necropsy'>(() => (localStorage.getItem('vetscout_ai_type') as 'flock' | 'necropsy') || 'flock');
  const [userNotes, setUserNotes] = useState<string>(() => localStorage.getItem('vetscout_ai_notes') || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<string | null>(() => localStorage.getItem('vetscout_ai_report'));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (image) localStorage.setItem('vetscout_ai_image', image);
    else localStorage.removeItem('vetscout_ai_image');
  }, [image]);

  useEffect(() => {
    localStorage.setItem('vetscout_ai_mime', mimeType);
  }, [mimeType]);

  useEffect(() => {
    localStorage.setItem('vetscout_ai_type', analysisType);
  }, [analysisType]);

  useEffect(() => {
    localStorage.setItem('vetscout_ai_notes', userNotes);
  }, [userNotes]);

  useEffect(() => {
    if (report) localStorage.setItem('vetscout_ai_report', report);
    else localStorage.removeItem('vetscout_ai_report');
  }, [report]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        const parts = event.target.result.split(",");
        const base64Data = parts[1];
        const extractedMime = parts[0].split(";")[0].split(":")[1];
        
        setImage(base64Data);
        setMimeType(extractedMime);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag over files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          const parts = event.target.result.split(",");
          setImage(parts[1]);
          setMimeType(parts[0].split(";")[0].split(":")[1]);
          setErrorMsg(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset Selectors
  const selectPreset = (type: 'flock_hud' | 'liver' | 'coccidia') => {
    setErrorMsg(null);
    setReport(null);
    
    if (type === 'flock_hud') {
      setImage(HOVER_LIVE_FLOCK_SVG);
      setMimeType("image/svg+xml");
      setAnalysisType("flock");
      setUserNotes("Broiler flock is huddling in corners. Feed consumption dropped by 15% over the past 3 days. Wet litter throughout house 2.");
    } else if (type === 'liver') {
      setImage(LIVER_PERIHEPATITIS_SVG);
      setMimeType("image/svg+xml");
      setAnalysisType("necropsy");
      setUserNotes("Post-mortem of a 28-day old broiler that died suddenly. Thick yellow cheese-like accumulation over the liver surface and cloudy heart sacs.");
    } else if (type === 'coccidia') {
      setImage(COCCIDIA_CECA_SVG);
      setMimeType("image/svg+xml");
      setAnalysisType("necropsy");
      setUserNotes("Found bloody diarrhetic discharges on wood shavings. Post-mortem reveals these heavily red, bulging intestine sections.");
    }
  };

  // API triggers
  const triggerAnalysis = async () => {
    if (!image) {
      setErrorMsg("Please upload an image or choose one of the diagnostic templates.");
      return;
    }

    setIsAnalyzing(true);
    setReport(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image,
          mimeType: mimeType,
          type: analysisType,
          userNotes: userNotes,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Server failed to deliver an analysis.");
      }

      setReport(data.analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Unable to contact the AI veterinarian. Confirm your backend & secrets.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right" id="ai-analyzer-section" dir="rtl">
      
      {/* Upload and Context Config Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 justify-start">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">محلل الحالة الصحية والآفات (FlockSight)</h3>
              <p className="text-xs text-slate-500">فحص الآفات الميدانية وحالات تجمع القطيع بالذكاء الاصطناعي</p>
            </div>
          </div>

          {/* Toggle Type */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl gap-1" dir="ltr">
            <button
              onClick={() => setAnalysisType('flock')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                analysisType === 'flock'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏠 القطيع الحي والعنابر
            </button>
            <button
              onClick={() => setAnalysisType('necropsy')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                analysisType === 'necropsy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔬 الصفة التشريحية والآفات
            </button>
          </div>

          {/* Drag and Drop Container */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] ${
              image 
                ? 'border-emerald-300 bg-emerald-50/10' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {image ? (
              <div className="space-y-3 w-full">
                {/* Render SVG image preset or Base64 directly */}
                <div className="h-32 w-full max-w-[240px] mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-900 flex items-center justify-center">
                  <img
                    src={`data:${mimeType};base64,${image}`}
                    alt="Active target"
                    className="object-contain h-full w-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold">تم تحميل عينة الفحص بنجاح</span>
                  <button
                    onClick={() => {
                      setImage(null);
                      setReport(null);
                    }}
                    className="text-[11px] bg-red-50 text-red-600 hover:bg-red-100 font-bold px-2 py-0.5 rounded-md cursor-pointer"
                  >
                    حذف الصورة
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2 flex flex-col items-center justify-center w-full">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-slate-600" />
                <span className="text-xs font-bold text-slate-700 block">اسحب صورتك هنا أو انقر للتصفح والرفع</span>
                <span className="text-[10px] text-slate-400 block font-mono">الصيغ المدعومة: PNG, JPG, JPEG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Presets bar */}
          <div className="space-y-2 text-right">
            <span className="text-xs font-bold text-slate-700 block">أمثلة تجريبية تفاعلية للآفات والأعراض:</span>
            <div className="grid grid-cols-3 gap-2" dir="ltr">
              <button
                onClick={() => selectPreset('flock_hud')}
                className="p-2 border border-slate-100 hover:border-emerald-300 bg-slate-50 text-[10px] rounded-xl font-bold text-slate-700 flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <span>🏠 تجمّع الطيور</span>
                <span className="text-[9px] text-[#027E74] font-bold">نموذج حيوي</span>
              </button>
              <button
                onClick={() => selectPreset('liver')}
                className="p-2 border border-slate-100 hover:border-emerald-300 bg-slate-50 text-[10px] rounded-xl font-bold text-slate-700 flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <span>🔬 آفات الكبد</span>
                <span className="text-[9px] text-amber-600 font-bold"> perihepatitis </span>
              </button>
              <button
                onClick={() => selectPreset('coccidia')}
                className="p-2 border border-slate-100 hover:border-emerald-300 bg-slate-50 text-[10px] rounded-xl font-bold text-slate-700 flex flex-col items-center gap-1 transition cursor-pointer"
              >
                <span>🩸 تضخم الأعورين</span>
                <span className="text-[9px] text-red-650 font-bold">الكوكسيديا</span>
              </button>
            </div>
          </div>

          {/* Supervisor Information Input */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-slate-700 block">ملاحظات الطبيب / المشرف الميداني المرافقة (اختياري):</label>
            <textarea
              id="user-clinical-observations"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="مثال: عمر الدفعة والمحطن 24 يوماً، تم تلقيح لاسوتا في اليوم 14، تراجع جاف في استهلاك مياه العنبر بنسبة 15%..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 min-h-[90px] text-slate-700 text-right"
              dir="rtl"
            />
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 text-xs text-red-800 justify-start" dir="rtl">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={triggerAnalysis}
            disabled={isAnalyzing || !image}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all ${
              !image 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#027E74] hover:bg-[#006A62] text-white'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري دراسة وفحص الآفات تشخيصياً...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>تحليل وفحص عينة الدواجن بالذكاء الاصطناعي</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnostic Assessment Report Column */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col flex-grow min-h-[460px]">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#027E74]" />
              <span>نتائج الفحص والتقرير البيطري المقارن</span>
            </h4>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">
              الحالة: {isAnalyzing ? 'جاري الفحص...' : report ? 'التقرير جاهز ونشط' : 'بانتظار العينة'}
            </span>
          </div>

          {isAnalyzing && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#027E74] animate-spin"></div>
                <Sparkles className="w-5 h-5 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-1 max-w-sm">
                <p className="text-sm font-bold text-slate-800">يقوم ذكاء جيمي الاصطناعي بفحص معالم الصفة والريش</p>
                <p className="text-xs text-slate-500 leading-relaxed">مطابقة معالم تجمعات العنابر، أعراض الكبد المتجبنة والانتفاخات النزفية مع كتيبات تشخيص أمراض الدواجن الميدانية المتكاملة...</p>
              </div>
            </div>
          )}

          {!isAnalyzing && !report && (
            <div className="flex-grow flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Layers className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-sm font-semibold">جاهز لاستقبال عينات القطعان والتشريح ومخرجاتها</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                ارفع صورة أو فحصاً لحزمة طيور نافقة، أو انقر على نماذج الآفات الجاهزة لمشاهدة استجابة التقرير التفصيلي المتكامل بالذكاء الاصطناعي.
              </p>
            </div>
          )}

          {!isAnalyzing && report && (
            <div className="flex-grow flex flex-col justify-between" dir="rtl">
              <div className="prose prose-sm max-w-none prose-emerald text-sm text-slate-700 leading-relaxed overflow-y-auto max-h-[500px] border-b border-slate-100 pb-4 pl-1 text-right">
                {/* Clean inline rendering of markdown tags */}
                {report.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return <h6 key={index} className="font-bold text-slate-900 text-base mt-4 mb-2 text-right">{line.replace('### ', '')}</h6>;
                  }
                  if (line.startsWith('## ')) {
                    return <h5 key={index} className="font-bold text-[#027E74] text-lg border-b border-slate-100 pb-1 mt-5 mb-2.5 text-right">{line.replace('## ', '')}</h5>;
                  }
                  if (line.startsWith('# ')) {
                    return <h4 key={index} className="font-black text-slate-900 text-xl tracking-tight mt-6 mb-3 border-r-4 border-[#027E74] pr-2 text-right">{line.replace('# ', '')}</h4>;
                  }
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return (
                      <div key={index} className="flex gap-2 text-xs text-slate-700 mr-2 py-0.5 leading-relaxed justify-start text-right">
                        <span className="text-emerald-500 font-bold shrink-0">&bull;</span>
                        <span>{line.substring(2)}</span>
                      </div>
                    );
                  }
                  if (line.trim().length === 0) {
                    return <div key={index} className="h-2"></div>;
                  }
                  return <p key={index} className="text-xs text-slate-600 leading-relaxed mb-1.5 text-right font-sans">{line}</p>;
                })}
              </div>

              {/* Warn banner */}
              <div className="mt-4 bg-orange-50/70 border border-orange-100 rounded-xl p-3.5 flex items-start gap-2.5 justify-start text-right">
                <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-bold text-orange-900">إخلاء مسؤولية بيطرية وسريرية استرشادية</h5>
                  <p className="text-[10px] text-orange-800 leading-relaxed mt-0.5">
                    التحليل المقدم يعتمد بالكامل على تقنيات الذكاء الاصطناعي ومعالجة النماذج البصرية الإحصائية والمقارنات الباثولوجية المتوفرة بالأرشيف. لا يغني هذا التشغيل بأي حال من الأحوال عن الفحص الخبري المعملي والتشريح الميداني تحت إشراف الدوائر البيطرية المختصة.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
