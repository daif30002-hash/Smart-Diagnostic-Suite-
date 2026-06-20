import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, CheckCircle2, AlertCircle, RefreshCw, FileClock, ShieldAlert, FileHeart } from 'lucide-react';

interface AuditItem {
  id: string;
  question: string;
  category: string;
}

const AUDIT_QUESTIONS: AuditItem[] = [
  { id: "bird_proof", question: "Complete wild bird-proofing on mesh joints", category: "Infrastructure" },
  { id: "water_chlorination", question: "Steady well-water chlorination (2-4 ppm)", category: "Sanitation" },
  { id: "vehicle_disinfection", question: "Wheel bath sanitizers for vehicles", category: "Personnel" },
  { id: "footwear_exchange", question: "House-specific footwear exchange", category: "Personnel" },
  { id: "litter_moisture", question: "Litter dryness monitoring (<30%)", category: "Sanitation" },
  { id: "ammonia_ventilation", question: "Ventilation optimization & ammonia control", category: "Infrastructure" }
];

export default function ExportReportSection() {
  const [sessionState, setSessionState] = useState({
    hasAI: false,
    hasWiz: false,
    hasBio: false,
    aiNotesLength: 0,
    wizMatchesCount: 0,
    bioScore: 0,
    bioRating: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadSessionData = () => {
    const ai_report = localStorage.getItem('vetscout_ai_report');
    const ai_notes = localStorage.getItem('vetscout_ai_notes') || '';
    const wiz_calculated = localStorage.getItem('vetscout_wiz_calculated') === 'true';
    const wiz_results = localStorage.getItem('vetscout_wiz_results');
    const bio_scores_raw = localStorage.getItem('vetscout_bio_scores');

    // Parse wizard results
    let wizMatches = 0;
    if (wiz_calculated && wiz_results) {
      try {
        const parsed = JSON.parse(wiz_results);
        wizMatches = parsed.length;
      } catch (e) {}
    }

    // Parse biosecurity scores
    let bioScore = 50; // default start
    let countBio = false;
    let computedRating = "Moderate Risk";
    if (bio_scores_raw) {
      try {
        const scores = JSON.parse(bio_scores_raw);
        countBio = true;
        let total = 0;
        Object.values(scores).forEach((val) => {
          if (val === 'fully') total += 16.6;
          if (val === 'partially') total += 8.3;
        });
        bioScore = Math.min(100, Math.round(total));
        if (bioScore >= 85) computedRating = "Excellent Resilience";
        else if (bioScore >= 50) computedRating = "Moderate Risk Scenario";
        else computedRating = "Critical Pathogen Danger";
      } catch (e) {}
    }

    setSessionState({
      hasAI: !!ai_report,
      hasWiz: wiz_calculated && wizMatches > 0,
      hasBio: countBio,
      aiNotesLength: ai_notes.trim().length,
      wizMatchesCount: wizMatches,
      bioScore: bioScore,
      bioRating: computedRating
    });
  };

  useEffect(() => {
    loadSessionData();
    // Periodically update when session changes or is interacted with
    const interval = setInterval(loadSessionData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    setSuccessMessage(null);

    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Fetch dynamic records directly from localStorage to ensure 100% accuracy
      const ai_report = localStorage.getItem('vetscout_ai_report') || '';
      const ai_notes = localStorage.getItem('vetscout_ai_notes') || 'No additional observations provided by flock supervisor.';
      const ai_type = localStorage.getItem('vetscout_ai_type') || 'flock';
      
      const wiz_mode = localStorage.getItem('vetscout_wiz_mode') || 'Fattening';
      const wiz_age = localStorage.getItem('vetscout_wiz_age') || 'all';
      const wiz_symptoms_raw = localStorage.getItem('vetscout_wiz_symptoms');
      const wiz_lesions_raw = localStorage.getItem('vetscout_wiz_lesions');
      const wiz_results_raw = localStorage.getItem('vetscout_wiz_results');

      const bio_scores_raw = localStorage.getItem('vetscout_bio_scores');

      let symptomsList: string[] = [];
      let lesionsList: string[] = [];
      let wizResults: any[] = [];
      let bioScores: Record<string, string> = {};

      try { symptomsList = wiz_symptoms_raw ? JSON.parse(wiz_symptoms_raw) : []; } catch(e) {}
      try { lesionsList = wiz_lesions_raw ? JSON.parse(wiz_lesions_raw) : []; } catch(e) {}
      try { wizResults = wiz_results_raw ? JSON.parse(wiz_results_raw) : []; } catch(e) {}
      try { bioScores = bio_scores_raw ? JSON.parse(bio_scores_raw) : {}; } catch(e) {}

      let currentY = 15;
      const margin = 15;
      const pageWidth = 210;
      const contentWidth = pageWidth - (margin * 2);

      // Helper for adding multi-page awareness
      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > 280) {
          doc.addPage();
          currentY = 15;
          // Subpage header
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text("Broiler Vet-Scout Pathology Report • External Veterinary Review Copy", margin, 10);
          doc.setDrawColor(230, 230, 230);
          doc.line(margin, 11, margin + contentWidth, 11);
          currentY = 18;
        }
      };

      // --- PRIMARY HEADER BLOCK ---
      doc.setFillColor(2, 126, 116); // #027E74 Teal accent logo block
      doc.rect(margin, currentY, 15, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text("VS", margin + 5, currentY + 10.5);

      doc.setTextColor(30, 41, 59); // Deep Slate
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text("BROILER VET-SCOUT", margin + 18, currentY + 6);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("CLINICAL VETERINARY DIAGNOSTICS & ON-FARM EXCLUSION REPORT", margin + 18, currentY + 11);

      currentY += 20;

      // Divider line
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 6;

      // Report Metadata columns
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("REPORT RECIPIENT:", margin, currentY);
      doc.text("COMPILATION TIME:", margin + 65, currentY);
      doc.text("SUITE VERSION:", margin + 140, currentY);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text("vetlmar0@gmail.com (Supervisor)", margin, currentY + 5);
      
      const currentTimeString = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
      doc.text(currentTimeString, margin + 65, currentY + 5);
      doc.text("v3.5.2 Pro-Cloud Active", margin + 140, currentY + 5);

      currentY += 12;

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 8;

      // --- SECTION 1: BIOSECURITY AUDIT ---
      checkPageBreak(35);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(2, 126, 116);
      doc.text("1. ON-FARM BIOSECURITY EXCLUSION AUDIT", margin + 3, currentY + 5);

      currentY += 11;

      // Calculate the specific elements
      let calculatedBioScore = 0;
      Object.values(bioScores).forEach((val) => {
        if (val === 'fully') calculatedBioScore += 16.6;
        if (val === 'partially') calculatedBioScore += 8.3;
      });
      const finalBioScore = Math.min(100, Math.round(calculatedBioScore));

      let ratingLabel = "CRITICAL PATHOGEN ENTRY DANGER";
      let ratingBannerColor = [254, 226, 226]; // light red
      let ratingTextColor = [153, 27, 27]; // deep red
      if (finalBioScore >= 85) {
        ratingLabel = "EXCELLENT BIOSECURITY EXCLUSION INDICES";
        ratingBannerColor = [220, 252, 231]; // light green
        ratingTextColor = [21, 128, 61]; // deep green
      } else if (finalBioScore >= 50) {
        ratingLabel = "MODERATE outbreak scenario risk variables";
        ratingBannerColor = [254, 243, 199]; // light yellow
        ratingTextColor = [180, 83, 9]; // deep orange
      }

      // Draw active rating box
      doc.setFillColor(ratingBannerColor[0], ratingBannerColor[1], ratingBannerColor[2]);
      doc.rect(margin, currentY, contentWidth, 12, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(ratingTextColor[0], ratingTextColor[1], ratingTextColor[2]);
      doc.text(`${finalBioScore}% OUTBREAK EXCLUSION INDEX`, margin + 4, currentY + 8);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(ratingLabel.toUpperCase(), margin + 110, currentY + 7.5);

      currentY += 18;

      // Print Question by Question Audit Log
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("CRITICAL EXCLUSION BARRIER QUESTION", margin, currentY);
      doc.text("CATEGORY", margin + 115, currentY);
      doc.text("AUDIT RESULT", margin + 148, currentY);

      doc.setDrawColor(241, 245, 249);
      doc.line(margin, currentY + 1.5, margin + contentWidth, currentY + 1.5);
      currentY += 5.5;

      AUDIT_QUESTIONS.forEach((q) => {
        checkPageBreak(8);
        const ans = bioScores[q.id] || 'neglected';
        let ansTerm = "NEGLECTED (CRITICAL LEAK)";
        let ansColor = [239, 68, 68]; // red
        if (ans === 'fully') {
          ansTerm = "FULLY COMMITTED";
          ansColor = [16, 185, 129]; // green
        } else if (ans === 'partially') {
          ansTerm = "PARTIALLY MITIGATED";
          ansColor = [245, 158, 11]; // orange
        }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(q.question, margin, currentY);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(q.category, margin + 115, currentY);

        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(ansColor[0], ansColor[1], ansColor[2]);
        doc.text(ansTerm, margin + 148, currentY);

        currentY += 6.5;
      });

      currentY += 5;

      // --- SECTION 2: STRUCTURED DIAGNOSTIC MATRIX ---
      checkPageBreak(35);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(2, 126, 116);
      doc.text("2. STRUCTURED CLINICAL SCORING DISEASE MATRIX", margin + 3, currentY + 5);

      currentY += 12;

      // Demographics meta bar
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("OPERATION TYPE:", margin, currentY);
      doc.text("AGE CLASS:", margin + 50, currentY);
      doc.text("SELECTED SICKNESS SIGNS:", margin + 100, currentY);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`Broiler ${wiz_mode}`, margin, currentY + 4.5);
      
      let ageLabel = "All rearing ages combined";
      if (wiz_age === 'week1') ageLabel = "Brooding Stage (Days 1 - 7)";
      else if (wiz_age === 'weeks2_4') ageLabel = "Growing Peak (Weeks 2 - 4)";
      else if (wiz_age === 'weeks5') ageLabel = "Finishing Stage (Week 5+)";
      doc.text(ageLabel, margin + 50, currentY + 4.5);

      const signsCount = symptomsList.length + lesionsList.length;
      doc.text(`${signsCount} clinical & necropsy criteria checked`, margin + 100, currentY + 4.5);

      currentY += 13;

      // Sub-lists
      checkPageBreak(25);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("SELECTED CLINICAL SIGNS:", margin, currentY);
      doc.text("SELECTED POST-MORTEM LESIONS:", margin + 90, currentY);

      currentY += 4.5;
      
      const clinicalSympText = symptomsList.length > 0 ? symptomsList.join(', ') : 'None marked.';
      const necropsyLesText = lesionsList.length > 0 ? lesionsList.join(', ') : 'None marked.';

      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      
      const wrappedSymps = doc.splitTextToSize(clinicalSympText, 80);
      doc.text(wrappedSymps, margin, currentY);

      const wrappedLesions = doc.splitTextToSize(necropsyLesText, 80);
      doc.text(wrappedLesions, margin + 90, currentY);

      // Advance currentY based on wrapped height
      const linesMax = Math.max(wrappedSymps.length, wrappedLesions.length);
      currentY += (linesMax * 4) + 6;

      // Match results table headings
      checkPageBreak(30);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("DIFFERENTIAL PATHOGEN ASSESSMENT CLASS", margin, currentY);
      doc.text("CONFIDENCE", margin + 110, currentY);
      doc.text("CONFIRMATION RECOMMENDATION", margin + 135, currentY);

      doc.setDrawColor(241, 245, 249);
      doc.line(margin, currentY + 1.5, margin + contentWidth, currentY + 1.5);
      currentY += 5.5;

      if (wizResults.length === 0) {
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text("No matching score differential compiled. Add diagnostic criteria indicators.", margin + 10, currentY);
        currentY += 8;
      } else {
        wizResults.slice(0, 3).forEach((res: any) => {
          checkPageBreak(12);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          // Combine disease English and Arabic safely representation
          const dName = `${res.disease?.name || 'Unknown'} (${res.disease?.arabicName || ''})`;
          doc.text(dName, margin, currentY);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(`Pathogen: ${res.disease?.pathogen || 'N/A'}`, margin, currentY + 4);

          // Confidence level
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          if (res.percentage >= 60) {
            doc.setTextColor(220, 38, 38); // red
          } else {
            doc.setTextColor(217, 119, 6); // orange
          }
          doc.text(`${res.percentage}% match`, margin + 110, currentY);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(71, 85, 105);
          const differentialLabel = res.disease?.differentialDiagnosis?.[0] || 'Physical laboratory check';
          const wrappedDiff = doc.splitTextToSize(differentialLabel, 45);
          doc.text(wrappedDiff, margin + 135, currentY);

          currentY += 10;
        });
      }

      currentY += 4;

      // --- SECTION 3: AI VETEINARIAN DIAGNOSIS ---
      checkPageBreak(40);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(2, 126, 116);
      doc.text("3. VET AI FLOCKSIGHT VISION LESION ASSESSMENT", margin + 3, currentY + 5);

      currentY += 12;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("AI ANALYSIS TYPE MODE:", margin, currentY);
      doc.text("FARM MANAGER CLINICAL OBSERVATIONS FILED:", margin, currentY + 11);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      const isNecropsy = ai_type === 'necropsy';
      doc.text(isNecropsy ? "Post-Mortem Autopsy Organ / Lesion Pathology Reviews" : "Live flock behavior, vocalization, housing, and temperature index review", margin, currentY + 4.5);
      
      currentY += 15.5;

      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const wrappedNotes = doc.splitTextToSize(ai_notes, contentWidth);
      doc.text(wrappedNotes, margin, currentY);

      currentY += (wrappedNotes.length * 4.5) + 6;

      checkPageBreak(30);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(2, 126, 116);
      doc.text("REPORT ANALYSIS ASSESSMENTS:", margin, currentY);
      currentY += 5;

      if (!ai_report) {
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text("No automated image lesion assessment triggered in this session. Run AI analysis inside tab.", margin, currentY);
        currentY += 8;
      } else {
        // Clean markdown tags and print
        const reportLines = ai_report.split('\n');
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);

        reportLines.forEach((line) => {
          let cleanLine = line.trim();
          if (cleanLine.length === 0) return;

          // Detect markdown headings and style accordingly
          let isHeading = false;
          let isBullet = false;

          if (cleanLine.startsWith('# ') || cleanLine.startsWith('## ') || cleanLine.startsWith('### ')) {
            isHeading = true;
            cleanLine = cleanLine.replace(/### |## |# /, "");
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(30, 41, 59);
          } else if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
            isBullet = true;
            cleanLine = "• " + cleanLine.substring(2);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);
          } else {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);
          }

          const wrappedReportText = doc.splitTextToSize(cleanLine, contentWidth - (isBullet ? 4 : 0));
          
          checkPageBreak(wrappedReportText.length * 4);

          wrappedReportText.forEach((pText: string, pIdx: number) => {
            const xPos = margin + (isBullet && pIdx === 0 ? 0 : isBullet ? 4 : 0);
            doc.text(pText, xPos, currentY);
            currentY += 4;
          });
          currentY += 1.5; // spacing between paragraphs
        });
      }

      currentY += 6;

      // Legal & Clinical Disclaimer section
      checkPageBreak(25);
      doc.setFillColor(255, 247, 237); // orange-50
      doc.setDrawColor(254, 215, 170); // orange-200
      doc.rect(margin, currentY, contentWidth, 18, 'FD');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(194, 65, 12);
      doc.text("⚠️ CLINICAL AGRI-HEALTH INTELLIGENCE DISCLAIMER & REVIEW ADVISORY", margin + 4, currentY + 4.5);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 53, 4);
      const disText = "The findings compiled in this summary document represent statistical likelihood ratios based on algorithmic matrix scoring. This is not a physical biological diagnosis. All flock owners must perform physical, laboratory culturing, serological testing, or official autopsies before deploying vaccine and pathogen control changes in accordance with sovereign avian disease regulations.";
      const wrappedDis = doc.splitTextToSize(disText, contentWidth - 8);
      doc.text(wrappedDis, margin + 4, currentY + 8);

      // Download PDF
      doc.save(`Broiler-VetScout-Clinical-Report-${new Date().toISOString().slice(0,10)}.pdf`);
      setSuccessMessage("Pathology Session PDF compiled & downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Encountered error compiling PDF document via jsPDF. Validate local structures.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs relative overflow-hidden" id="pdf-export-panel">
      {/* Background visual graphics */}
      <div className="absolute left-0 top-0 -translate-y-4 -translate-x-4 w-32 h-32 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Explanation and content readiness checklists */}
        <div className="space-y-3 max-w-xl text-right">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 justify-start">
              <FileText className="w-5 h-5 text-[#027E74]" />
              <span>منسق التقارير الطبية وتصدير النتائج (PDF)</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              تجميع مخرجات الفحوصات والآفات المدعومة بالذكاء الاصطناعي، وإجابات قائمة تدقيق الأمن الحيوي، والتحليلات النسبية لمصفوفة الأمراض المكتشفة في مستند استشاري بيطري احترافي ومنظم.
            </p>
          </div>

          {/* Session checklist status bubbles to help user see what they are exporting */}
          <div className="flex flex-wrap gap-2.5 pt-1 justify-start">
            <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
              sessionState.hasAI 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {sessionState.hasAI ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#027E74]" />
                  <span>تقرير الآفات بالذكاء الاصطناعي: جاهز</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  <span>الذكاء الاصطناعي: لم يُحلل بعد</span>
                </>
              )}
            </div>

            <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
              sessionState.hasWiz 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {sessionState.hasWiz ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#027E74]" />
                  <span>مصفوفة التشخيص: {sessionState.wizMatchesCount} باثولوجيات</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  <span>مصفوفة الاستدلال: غير معالجة</span>
                </>
              )}
            </div>

            <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
              sessionState.hasBio 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {sessionState.hasBio ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#027E74]" />
                  <span>الأمن الحيوي المقيّم: {sessionState.bioScore}%</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                  <span>الأمن الحيوي: الحالة الافتراضية</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button Block */}
        <div className="flex flex-col gap-2 shrink-0 md:min-w-[200px] w-full md:w-auto">
          <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
              isGenerating
                ? 'bg-slate-100 text-slate-450 border border-slate-200 cursor-not-allowed'
                : 'bg-[#027E74] hover:bg-[#006A62] text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري إعداد صيغة التقرير...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>تصدير التقرير الطبي الميداني (PDF)</span>
              </>
            )}
          </button>

          <span className="text-[10px] text-zinc-400 text-center font-mono uppercase tracking-wider block">
            ملف جاهز للطباعة والتحميل A4
          </span>
        </div>

      </div>

      {successMessage && (
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200 justify-start">
          <CheckCircle2 className="w-4 h-4 text-[#027E74] shrink-0" />
          <span className="font-semibold text-[#027E74]">{successMessage}</span>
        </div>
      )}

    </div>
  );
}
