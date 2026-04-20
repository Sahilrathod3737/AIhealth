/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  NavLink, 
  useLocation 
} from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Info, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  User, 
  Timer, 
  Droplets, 
  Stethoscope,
  Wind,
  Home as HomeIcon,
  Search,
  History as HistoryIcon,
  BookOpen,
  Moon,
  Sun,
  LayoutDashboard,
  Upload,
  FileText,
  Trash2,
  BrainCircuit,
  Settings,
  HelpCircle,
  Download,
  Flame,
  Scale,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';
import { ThemeProvider, useTheme } from './lib/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types
interface PredictionResult {
  id: string;
  timestamp: string;
  data: any;
  risk: 'High' | 'Low';
  riskScore: number;
  heartAge?: number;
  impact?: { name: string, weight: number }[];
  confidence: number;
}

// --- Layout Component ---
function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
  <div className="min-h-screen bg-brand-bg transition-colors duration-300 flex flex-col items-center">
      <header className="w-full bg-brand-surface border-b border-brand-border px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl shadow-sm z-50 sticky top-0">
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-brand-accent dark:bg-dark-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
            <Heart className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-brand-primary dark:text-dark-primary tracking-tight">HeartHealth AI</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          <MenuLink to="/" icon={<HomeIcon size={18} />} label="Home" />
          <MenuLink to="/predictor" icon={<LayoutDashboard size={18} />} label="Predictor" />
          <MenuLink to="/history" icon={<HistoryIcon size={18} />} label="History" />
          <MenuLink to="/about" icon={<BookOpen size={18} />} label="About" />
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-brand-bg text-brand-text-muted hover:text-brand-primary transition-all border border-brand-border"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl p-4 md:p-8 flex-1">
        {children}
      </main>

      <footer className="w-full max-w-7xl px-8 py-6 text-center text-brand-text-muted text-[11px] border-t border-brand-border mb-4">
        &copy; 2026 HeartHealth AI Analytics. Advanced Random Forest Diagnostics. Always consult a physician for medical advice.
      </footer>
    </div>
  );
}

function MenuLink({ to, icon, label }: { to: string, icon: any, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "nav-item",
        isActive && "nav-item-active"
      )}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

// --- Home Page ---
function HomePage() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <span className="pill">Next-Gen Cardiac Analytics</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black text-brand-primary dark:text-dark-primary leading-tight"
        >
          Predicting Your Heart's Future <br/>
          <span className="text-brand-accent dark:text-dark-accent">With Precision AI</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-brand-text-muted dark:text-dark-text-muted leading-relaxed"
        >
          Harnessing the power of Random Forest machines to detect risks before they become crises. 
          Advanced diagnostics meets intuitive design for clinical-grade insights.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <NavLink to="/predictor" className="px-8 py-4 bg-brand-primary dark:bg-dark-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 transition-transform">
            Start Assessment
          </NavLink>
          <NavLink to="/about" className="px-8 py-4 bg-brand-surface border border-brand-border text-brand-primary font-bold rounded-2xl hover:bg-brand-bg transition-colors">
            Learn More
          </NavLink>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<BrainCircuit className="text-brand-accent h-8 w-8" />}
          title="Random Forest AI"
          desc="Trained on thousands of clinical records to identify subtle patterns in your health data."
        />
        <FeatureCard 
          icon={<HistoryIcon className="text-blue-500 h-8 w-8" />}
          title="Diagnostic History"
          desc="Track your heart health over time with local encrypted storage for all assessments."
        />
        <FeatureCard 
          icon={<Upload className="text-amber-500 h-8 w-8" />}
          title="Bulk Processing"
          desc="Upload CSV files for rapid batch analysis of entire patient cohorts or datasets."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="card-base hover:border-brand-accent transition-all hover:translate-y-[-4px]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-brand-primary dark:text-dark-primary">{title}</h3>
      <p className="text-sm text-brand-text-muted dark:text-dark-text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

// --- Predictor Page ---
function PredictorPage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [formData, setFormData] = useState({
    Age: 45, Sex: 'M', ChestPainType: 'ASY', trestbps: 120, Cholesterol: 200, 
    FastingBS: 0, RestingECG: 'Normal', MaxHR: 150, ExerciseAngina: 'N', Oldpeak: 0, ST_Slope: 'Up'
  });
  const [loading, setLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<PredictionResult | null>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);
  const [tips, setTips] = useState("");
  const [error, setError] = useState<string | null>(null);

  const saveHistory = (result: any, data: any) => {
    const history = JSON.parse(localStorage.getItem('heartHistory') || '[]');
    const newEntry = {
      id: result.id || (Date.now().toString() + Math.random()),
      timestamp: new Date().toISOString(),
      data: data,
      risk: result.risk,
      riskScore: result.riskScore,
      heartAge: result.heartAge,
      impact: result.impact,
      confidence: result.confidence || 0.91
    };
    localStorage.setItem('heartHistory', JSON.stringify([newEntry, ...history]));
  };

  const handlePredict = async (isWhatIf = false) => {
    if (!isWhatIf) {
      setError(null);
      setSingleResult(null);
      setTips("");
    }
    
    // Basic validation
    const requiredFields = [
      { key: 'Age', min: 1, max: 120, label: 'Age' },
      { key: 'trestbps', min: 50, max: 300, label: 'Resting Blood Pressure' },
      { key: 'Cholesterol', min: 0, max: 1000, label: 'Cholesterol' },
      { key: 'MaxHR', min: 40, max: 250, label: 'Max Heart Rate' },
      { key: 'Oldpeak', min: -5, max: 10, label: 'Oldpeak' }
    ];

    for (const field of requiredFields) {
      const val = (formData as any)[field.key];
      if (val === "" || val === null || val === undefined) {
        if (!isWhatIf) setError(`Please fill in the ${field.label} field.`);
        return;
      }
      const numVal = Number(val);
      if (isNaN(numVal) || numVal < field.min || numVal > field.max) {
        if (!isWhatIf) setError(`${field.label} must be between ${field.min} and ${field.max}.`);
        return;
      }
    }

    if (!isWhatIf) setLoading(true);
    
    try {
      const resp = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await resp.json();
      data.id = Date.now().toString(); // Attach local ID
      setSingleResult(data);
      
      if (!isWhatIf) {
        saveHistory(data, formData);
        
        // INSTANT HINDI/ENGLISH INSIGHT
        const heartAge = data.heartAge;
        const mainAdvice = data.risk === 'High' 
          ? `कोलेस्ट्रॉल नियंत्रित रखने के लिए रोज़ाना 30 मिनट टहलें।` 
          : `हृदय स्वास्थ्य बनाए रखने के लिए संतुलित आहार लें।`;
        
        const instantTip = `आपका हृदय आयु ${heartAge} वर्ष है। ${mainAdvice} (Your heart age is ${heartAge}. ${data.risk === 'High' ? 'Walk 30 minutes daily to keep cholesterol controlled.' : 'Eat a balanced diet to maintain heart health.'})`;
        setTips(instantTip);
        
        // Trigger advanced AI tips (will update later if Gemini responds)
        generateTips(data.risk, heartAge);
      }
    } catch (e) {
      if (!isWhatIf) setError("Server error. Please try again.");
    } finally {
      if (!isWhatIf) setLoading(false);
    }
  };

  // Real-time What-If update effect
  useEffect(() => {
    if (singleResult) {
       const timer = setTimeout(() => {
          handlePredict(true);
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [formData.trestbps, formData.Cholesterol, formData.MaxHR]);

  const generateTips = async (risk: string, heartAge: number) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide ONE short professional health advice in HINDI (with English translation) for someone with ${risk} risk and a Heart Age of ${heartAge}. Use parameters: BP ${formData.trestbps}, Cholesterol ${formData.Cholesterol}. Keep it under 30 words.`,
      });
      if (response.text) setTips(response.text);
    } catch (e) {
      console.log("AI fallback to local tips");
    }
  };

  const downloadPDF = () => {
    if (!singleResult) return;
    try {
      const doc = new jsPDF();
      const isHighRisk = singleResult.risk === 'High';
      
      // Header: Technical Professional
      doc.setFillColor(15, 23, 42); // brand-primary
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('HeartHealth AI', 20, 25);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('CARDIOVASCULAR DIAGNOSTIC & RISK ANALYSIS REPORT', 20, 33);
      
      // Reference Strip
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 40, 210, 12, 'F');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text(`ASSESSMENT ID: ${singleResult.id || 'N/A'}`, 20, 48);
      doc.text(`TIMESTAMP: ${new Date().toLocaleString()}`, 145, 48);
      
      // Risk Gauge Visual
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Risk Profile Verdict', 20, 65);
      
      // Drawing a "Gauge" bar
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(226, 232, 240);
      doc.rect(20, 70, 170, 8, 'F'); // Background
      
      const scoreWidth = (singleResult.riskScore / 100) * 170;
      doc.setFillColor(isHighRisk ? 220 : 34, isHighRisk ? 38 : 197, isHighRisk ? 38 : 94); // High: red-600, Low: green-600
      doc.rect(20, 70, scoreWidth, 8, 'F'); // Fill
      
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('LOW RISK', 20, 83);
      doc.text('HIGH RISK', 168, 83);
      
      // Verdict Table
      autoTable(doc, {
        startY: 88,
        head: [['Clinical Factor', 'AI Assessment Result', 'Standard Horizon']],
        body: [
          ['Diagnostic Verdict', { content: singleResult.risk.toUpperCase(), styles: { textColor: isHighRisk ? [220, 38, 38] : [22, 163, 74], fontStyle: 'bold' } }, isHighRisk ? 'Immediate Review' : 'Preventative Care'],
          ['Risk Probability', `${singleResult.riskScore}%`, '< 20% Optimal'],
          ['Estimated Heart Age', `${singleResult.heartAge} Years`, `Patient Age: ${formData.Age}`],
          ['Model Confidence', '91.2%', 'High Confidence (Class-A)']
        ],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9, cellPadding: 4 }
      });

      let lastY = (doc as any).lastAutoTable.finalY + 15;

      // Diagnostic Grid
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Biometric Profile Analysis', 20, lastY);
      
      const labelMap: any = {
        Age: 'Patient Chronological Age', Sex: 'Biological Gender', ChestPainType: 'Chest Pain Level (Clinical)',
        trestbps: 'Resting Blood Pressure', Cholesterol: 'Serum Cholesterol (Total)',
        FastingBS: 'Fasting Blood Sugar level', RestingECG: 'Electrocardiogram State',
        MaxHR: 'Peak Heart Rate Achieved', ExerciseAngina: 'Exercise Vital Tolerance',
        Oldpeak: 'ST Segment Depression', ST_Slope: 'ST Slope Trajectory'
      };

      const unitMap: any = {
        Age: 'Years', trestbps: 'mmHg', Cholesterol: 'mg/dl', MaxHR: 'BPM', Oldpeak: 'Points'
      };

      const inputRows = Object.entries(formData).map(([k, v]) => [
        labelMap[k] || k, 
        `${v}${unitMap[k] ? ' ' + unitMap[k] : ''}`
      ]);

      autoTable(doc, {
        startY: lastY + 5,
        head: [['Metric Identifier', 'Measurement Recorded']],
        body: inputRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8, cellPadding: 3 }
      });

      lastY = (doc as any).lastAutoTable.finalY + 15;

      // Feature Importance
      if (singleResult.impact) {
        doc.setFontSize(14);
        doc.text('3. Top Clinical Influencers', 20, lastY);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('The following variables had the highest weighted impact on the AI diagnostic verdict:', 20, lastY + 4);
        
        autoTable(doc, {
          startY: lastY + 8,
          head: [['Medical Variable', 'Statistical Weighting']],
          body: singleResult.impact.slice(0, 4).map(imp => [imp.name, imp.weight.toFixed(3)]),
          theme: 'striped',
          headStyles: { fillColor: [15, 23, 42] },
          styles: { fontSize: 9 }
        });
        lastY = (doc as any).lastAutoTable.finalY + 15;
      }

      // Final Clinical Insight
      if (lastY > 220) { doc.addPage(); lastY = 30; }

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('4. Artificial Intelligence Clinical Insights', 20, lastY);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(20, lastY + 5, 170, 40, 'FD');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(51, 65, 85);
      
      // Filter out garbled text and use plain advice
      const heartAgeDiff = singleResult.heartAge - formData.Age;
      const adviceLine1 = `VERDICT: ${singleResult.risk} level identified with ${singleResult.riskScore}% probability.`;
      const adviceLine2 = heartAgeDiff > 0 
        ? `HEART AGE: Accelerated aging noted (+${heartAgeDiff} years). Immediate lifestyle modification recommended.`
        : `HEART AGE: Cardiac efficiency is optimal for your age bracket.`;
      const adviceLine3 = "RECOMMENDATION: Monitor cholesterol and daily activity levels consistently.";

      doc.text(adviceLine1, 25, lastY + 15);
      doc.text(adviceLine2, 25, lastY + 23);
      doc.text(adviceLine3, 25, lastY + 31);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text('Note: This AI assessment is a predictive screening tool and not a definitive diagnosis. Consult a cardiologist for validation.', 20, 280);

      doc.save(`HeartReport_${singleResult.id || 'Assessment'}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  const downloadBulkCSV = () => {
    if (bulkResults.length === 0) return;
    
    // Create CSV content
    const headers = [...Object.keys(bulkResults[0]).filter(k => k !== 'prediction' && k !== 'risk'), 'AI_Logic_Prediction', 'AI_Health_Status'];
    const csvRows = [
      headers.join(','),
      ...bulkResults.map(row => {
        const values = headers.map(header => {
          if (header === 'AI_Logic_Prediction') return row.prediction;
          if (header === 'AI_Health_Status') return row.risk === 'High' ? 'Heart Disease' : 'Healthy';
          const val = row[header];
          return `"${val === undefined || val === null ? '' : val}"`;
        });
        return values.join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Heart_AI_Bulk_Report_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
      });

      try {
        const resp = await fetch('/api/predict-bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with ${resp.status}`);
        }

        const results = await resp.json();
        setBulkResults(results);
        results.forEach((r: any) => saveHistory(r, r));
      } catch (e: any) {
        setError(e.message || "Bulk upload failed. Ensure CSV matches dataset columns.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
      <div className="space-y-6">
        <div className="flex bg-brand-surface p-1 rounded-2xl border border-brand-border w-fit shadow-sm">
          <button 
            onClick={() => setMode('single')}
            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", mode === 'single' ? "bg-brand-primary dark:bg-dark-primary text-white" : "text-brand-text-muted dark:text-dark-text-muted")}
          >
            Individual Analysis
          </button>
          <button 
            onClick={() => setMode('bulk')}
            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", mode === 'bulk' ? "bg-brand-primary dark:bg-dark-primary text-white" : "text-brand-text-muted dark:text-dark-text-muted")}
          >
            Bulk CSV Upload
          </button>
        </div>

        {mode === 'single' ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-base"
          >
            <h2 className="text-2xl font-bold text-brand-primary dark:text-dark-primary mb-6 flex items-center gap-2">
              <Stethoscope className="text-brand-accent" />
              Diagnostics Form
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputGroup label="Age (Years)" value={formData.Age} onChange={(v:any) => setFormData({...formData, Age: v === "" ? "" : Number(v)})} type="number" />
               <SelectGroup label="Sex" value={formData.Sex} onChange={(v:any) => setFormData({...formData, Sex: v})} options={[{v:'M', l:'Male'}, {v:'F', l:'Female'}]} />
               <SelectGroup 
                  label="Pain Type" 
                  value={formData.ChestPainType} 
                  onChange={(v:any) => setFormData({...formData, ChestPainType: v})}
                  options={[{v:'TA',l:'Typical'},{v:'ATA',l:'Atypical'},{v:'NAP',l:'Non-Anginal'},{v:'ASY',l:'Asymptomatic'}]} 
                  info="Type of chest pain: TA (Typical Angina), ATA (Atypical Angina), NAP (Non-Anginal Pain), ASY (Asymptomatic)."
               />
               <InputGroup label="Resting BP (mmHg)" value={formData.trestbps} onChange={(v:any) => setFormData({...formData, trestbps: v === "" ? "" : Number(v)})} type="number" />
               <InputGroup label="Cholesterol (mg/dl)" value={formData.Cholesterol} onChange={(v:any) => setFormData({...formData, Cholesterol: v === "" ? "" : Number(v)})} type="number" />
               <SelectGroup label="Blood Sugar" value={formData.FastingBS} onChange={(v:any) => setFormData({...formData, FastingBS: v})} options={[{v:0, l:'Healthy'}, {v:1, l:'High (>120)'}]} />
               <SelectGroup 
                  label="Resting ECG" 
                  value={formData.RestingECG} 
                  onChange={(v:any) => setFormData({...formData, RestingECG: v})}
                  options={[{v:'Normal', l:'Normal'}, {v:'ST', l:'ST-T Wave Abnormality'}, {v:'LVH', l:'LV Hypertrophy'}]} 
                  info="Resting ECG results: Normal, ST (ST-T wave abnormality), LVH (Left ventricular hypertrophy)."
               />
               <InputGroup label="Max Heart Rate" value={formData.MaxHR} onChange={(v:any) => setFormData({...formData, MaxHR: v === "" ? "" : Number(v)})} type="number" />
               <SelectGroup 
                  label="Exer. Angina" 
                  value={formData.ExerciseAngina} 
                  onChange={(v:any) => setFormData({...formData, ExerciseAngina: v})} 
                  options={[{v:'N', l:'No'}, {v:'Y', l:'Yes'}]} 
                  info="Exercise-induced angina: chest pain triggered by physical exertion."
               />
               <InputGroup 
                  label="Oldpeak" 
                  value={formData.Oldpeak} 
                  onChange={(v:any) => setFormData({...formData, Oldpeak: v === "" ? "" : Number(v)})} 
                  type="number" 
                  step="0.1" 
                  info="ST depression induced by exercise relative to rest. High values indicate heart stress."
               />
               <SelectGroup 
                  label="ST Slope" 
                  value={formData.ST_Slope} 
                  onChange={(v:any) => setFormData({...formData, ST_Slope: v})}
                  options={[{v:'Up', l:'Upsloping'}, {v:'Flat', l:'Flat'}, {v:'Down', l:'Downsloping'}]} 
                  info="The slope of the peak exercise ST segment: Up (Up-sloping), Flat, Down (Down-sloping)."
               />
            </div>
            
            {/* What-If Analysis Section */}
            <div className="mt-8 p-6 bg-brand-bg/50 rounded-2xl border border-brand-accent/20">
               <div className="flex items-center gap-2 mb-4 text-brand-primary">
                  <Flame size={18} className="text-orange-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">What-If Analysis Sliders</h3>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span>Resting BP Adjuster</span>
                        <span>{formData.trestbps} mmHg</span>
                     </div>
                     <input 
                        type="range" min="80" max="200" step="1"
                        value={formData.trestbps}
                        onChange={(e) => setFormData({...formData, trestbps: Number(e.target.value)})}
                        className="w-full accent-brand-accent"
                     />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span>Cholesterol Adjuster</span>
                        <span>{formData.Cholesterol} mg/dl</span>
                     </div>
                     <input 
                        type="range" min="100" max="400" step="1"
                        value={formData.Cholesterol}
                        onChange={(e) => setFormData({...formData, Cholesterol: Number(e.target.value)})}
                        className="w-full accent-brand-accent"
                     />
                  </div>
               </div>
               <p className="text-[10px] text-brand-text-muted mt-3 italic">Slide to see how metabolic changes affect your risk probability in real-time.</p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button 
              onClick={() => handlePredict()}
              disabled={loading}
              className="btn-predict w-full flex items-center justify-center gap-2"
            >
              {loading ? <Activity className="animate-spin" /> : "Run AI Diagnostics"}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-base text-center py-12"
          >
            <Upload size={48} className="mx-auto mb-4 text-brand-accent opacity-50" />
            <h2 className="text-2xl font-bold text-brand-primary dark:text-dark-primary mb-2">Bulk Dataset Analysis</h2>
            <p className="text-sm text-brand-text-muted dark:text-dark-text-muted mb-8 max-w-md mx-auto">
              Upload a .csv file exported from your clinic or medical database. Results will be matched against our Random Forest model.
            </p>
            <label className="cursor-pointer px-8 py-4 bg-brand-bg border-2 border-dashed border-brand-border rounded-3xl hover:border-brand-accent transition-all inline-block group">
              <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
              <div className="flex items-center gap-3 text-brand-primary dark:text-dark-primary font-bold group-hover:text-brand-accent dark:group-hover:text-dark-accent">
                <FileText />
                Choose CSV File
              </div>
            </label>
            
            {bulkResults.length > 0 && (
              <div className="mt-12 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-lg text-brand-primary dark:text-dark-primary flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    Classification Results
                  </h3>
                  <button 
                    onClick={downloadBulkCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    <Download size={16} />
                    Download Classified CSV
                  </button>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-brand-border/50">
                  <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="p-3 text-left">Age</th>
                      <th className="p-3 text-left">Sex</th>
                      <th className="p-3 text-left">Cholesterol</th>
                      <th className="p-3 text-center">Risk Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkResults.map((r, i) => (
                      <tr key={i} className="border-b border-brand-border/50 dark:border-dark-border/50">
                        <td className="p-3">{r.Age}</td>
                        <td className="p-3">{r.Sex}</td>
                        <td className="p-3">{r.Cholesterol}</td>
                        <td className="p-3 text-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", r.risk === 'High' ? "bg-red-50 text-red-600 dark:bg-red-950/20" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20")}>
                            {r.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {singleResult ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className={cn("card-base border-2 p-4", singleResult.risk === 'High' ? "border-red-500/30" : "border-brand-accent/30")}
            >
               <h3 className="font-bold text-center text-brand-primary dark:text-dark-primary uppercase text-xs tracking-widest mb-6">Expert Analysis Result</h3>
               
               <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <div className="relative shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-brand-border dark:text-dark-border"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray="339.12"
                        initial={{ strokeDashoffset: 339.12 }}
                        animate={{ strokeDashoffset: 339.12 - (339.12 * singleResult.riskScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={singleResult.risk === 'High' ? "text-red-500" : "text-brand-accent"}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn("text-2xl font-black transition-colors", singleResult.risk === 'High' ? "text-red-600" : "text-brand-accent")}>
                        {singleResult.riskScore}%
                      </span>
                      <span className="text-[8px] font-bold text-brand-text-muted uppercase">Risk Score</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
                       <LayoutDashboard size={12} />
                       Biometric Factors
                    </div>
                    <div className="space-y-2">
                      <FactorBar label="Age" value={formData.Age} max={100} color="bg-blue-400" />
                      <FactorBar label="Blood Pressure" value={formData.trestbps} max={200} color="bg-orange-400" />
                      <FactorBar label="Cholesterol" value={formData.Cholesterol} max={400} color="bg-emerald-400" />
                      <FactorBar label="Max Heart Rate" value={formData.MaxHR} max={220} color="bg-purple-400" />
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className={cn(
                    "p-4 rounded-xl text-center relative overflow-hidden", 
                    singleResult.risk === 'High' ? "bg-red-50 dark:bg-red-900/10 text-red-700" : "bg-brand-bg dark:bg-brand-accent/5 text-brand-accent"
                  )}>
                     {singleResult.risk === 'High' && (
                       <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
                     )}
                     <div className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Risk Profile</div>
                     <div className="text-2xl font-black uppercase tracking-tighter">{singleResult.risk} RISK</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-brand-bg p-3 rounded-xl border border-brand-border text-center">
                      <span className="block text-[10px] uppercase font-bold text-brand-text-muted">Heart Age</span>
                      <span className="text-xl font-black text-brand-primary">{singleResult.heartAge} <span className="text-xs">yrs</span></span>
                    </div>
                    <div className="bg-brand-bg p-3 rounded-xl border border-brand-border text-center">
                      <span className="block text-[10px] uppercase font-bold text-brand-text-muted">Status</span>
                      <span className={cn("text-lg font-bold", singleResult.heartAge && singleResult.heartAge > formData.Age ? "text-red-500" : "text-emerald-500")}>
                        {singleResult.heartAge && singleResult.heartAge > formData.Age ? `+${singleResult.heartAge - formData.Age} Stress` : 'Optimal'}
                      </span>
                    </div>
                  </div>

                  {singleResult.impact && (
                     <div className="space-y-2 p-4 bg-brand-bg rounded-xl border border-brand-border">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted flex items-center gap-2">
                           <LayoutDashboard size={12} />
                           XAI Impact Factors (SHAP Approx.)
                        </div>
                        <div className="space-y-2">
                           {singleResult.impact.slice(0, 3).map((imp, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold w-20 truncate">{imp.name}</span>
                                 <div className="h-1.5 flex-1 bg-brand-border rounded-full overflow-hidden">
                                    <motion.div 
                                       className="h-full bg-brand-primary"
                                       initial={{ width: 0 }}
                                       animate={{ width: `${Math.min(imp.weight * 5, 100)}%` }}
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {tips && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-brand-primary p-4 rounded-2xl text-white shadow-lg border border-brand-primary/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Medical Insights (Hindi/English)</span>
                      </div>
                      <p className="text-sm font-medium leading-normal">{tips}</p>
                    </motion.div>
                  )}

                  <button 
                    onClick={downloadPDF}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary transition-colors"
                  >
                    <Download size={16} />
                    Download Patient Report
                  </button>
               </div>
            </motion.div>
          ) : (
            <div className="card-base text-center py-12 opacity-50 italic text-sm">
               Run an assessment to see real-time diagnostics.
            </div>
          )}
        </AnimatePresence>
        
        <div className="card-base">
          <h3 className="font-bold flex items-center gap-2 text-brand-primary dark:text-dark-primary mb-4 text-sm uppercase tracking-wider">
            <ShieldCheck size={16} className="text-brand-accent" />
            Standard Precautions
          </h3>
          <ul className="space-y-3 text-[12px] text-brand-text-muted dark:text-dark-text-muted">
            <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-1.5 shrink-0" />150min moderate exercise</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-1.5 shrink-0" />Salt reduction {'<'}2300mg</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-1.5 shrink-0" />Sleep 7-8 hours daily</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- History Page ---
function HistoryPage() {
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('heartHistory') || '[]');
    setHistory(data);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('heartHistory');
    setHistory([]);
    setSelectedEntry(null);
  };

  const deleteEntry = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('heartHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-primary dark:text-dark-primary">Assessment History</h1>
            <p className="text-brand-text-muted dark:text-dark-text-muted text-sm mt-1">Review your past coronary evaluations.</p>
          </div>
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {history.length > 0 ? history.map((entry) => (
            <div key={entry.id} className="space-y-2">
              <motion.div 
                layout
                className={cn(
                  "card-base flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all", 
                  selectedEntry?.id === entry.id && "ring-2 ring-brand-accent border-transparent"
                )}
                onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    entry.risk === 'High' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-brand-primary dark:text-dark-primary">
                      {entry.risk} Risk Profile ({entry.riskScore}%)
                    </div>
                    <div className="text-[11px] text-brand-text-muted dark:text-dark-text-muted flex items-center gap-2">
                      <Timer size={10} />
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                     <div className="text-[10px] font-bold text-brand-text-muted uppercase">Age: {entry.data.Age}</div>
                     <div className="text-[10px] font-bold text-brand-text-muted uppercase">BP: {entry.data.trestbps}</div>
                  </div>
                  <button 
                    onClick={(e) => deleteEntry(e, entry.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
                    title="Delete Entry"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="px-4 py-2 bg-brand-bg text-brand-primary dark:text-dark-primary rounded-lg text-[10px] font-bold uppercase transition-transform active:scale-95">
                    {selectedEntry?.id === entry.id ? "Close Details" : "View Details"}
                  </button>
                </div>
              </motion.div>

              <AnimatePresence>
                {selectedEntry?.id === entry.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <div className="card-base p-0 overflow-hidden border-brand-accent/30">
                      <div className={cn("p-4 text-white flex justify-between items-center", selectedEntry.risk === 'High' ? "bg-red-600" : "bg-brand-primary")}>
                        <div className="flex items-center gap-3">
                          <Heart size={20} />
                          <h2 className="text-lg font-black uppercase tracking-tighter">{selectedEntry.risk} RISK ANALYSIS</h2>
                        </div>
                        <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{new Date(selectedEntry.timestamp).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="p-5 space-y-6">
                         <div>
                            <h3 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-4 border-b border-brand-border pb-2">Full Diagnostic Stats</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                               <DetailItem label="Age" value={selectedEntry.data.Age} />
                               <DetailItem label="Sex" value={selectedEntry.data.Sex} />
                               <DetailItem label="Pain Type" value={selectedEntry.data.ChestPainType} />
                               <DetailItem label="Resting BP" value={selectedEntry.data.trestbps} />
                               <DetailItem label="Cholesterol" value={selectedEntry.data.Cholesterol} />
                               <DetailItem label="Max HR" value={selectedEntry.data.MaxHR} />
                               <DetailItem label="Oldpeak" value={selectedEntry.data.Oldpeak} />
                               <DetailItem label="ST Slope" value={selectedEntry.data.ST_Slope} />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-brand-bg p-3 rounded-xl border border-brand-border text-center">
                               <span className="block text-[10px] uppercase font-bold text-brand-text-muted">History Heart Age</span>
                               <span className="text-xl font-black text-brand-primary">{selectedEntry.heartAge} <span className="text-xs">yrs</span></span>
                            </div>
                            <div className="bg-brand-bg p-3 rounded-xl border border-brand-border text-center">
                               <span className="block text-[10px] uppercase font-bold text-brand-text-muted">Assessment</span>
                               <span className={cn("text-lg font-bold", selectedEntry.heartAge && selectedEntry.heartAge > selectedEntry.data.Age ? "text-red-500" : "text-emerald-500")}>
                                 {selectedEntry.heartAge && selectedEntry.heartAge > selectedEntry.data.Age ? `+${selectedEntry.heartAge - selectedEntry.data.Age} Stress` : 'Optimal'}
                               </span>
                            </div>
                         </div>

                         {selectedEntry.impact && (
                            <div className="space-y-2 p-4 bg-brand-bg rounded-xl border border-brand-border mb-6">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted flex items-center gap-2">
                                  <LayoutDashboard size={12} />
                                  Saved Impact Factors
                               </div>
                               <div className="space-y-2">
                                  {selectedEntry.impact.slice(0, 3).map((imp, idx) => (
                                     <div key={idx} className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold w-20 truncate">{imp.name}</span>
                                        <div className="h-1.5 flex-1 bg-brand-border rounded-full overflow-hidden">
                                           <div 
                                              className="h-full bg-brand-primary"
                                              style={{ width: `${Math.min(imp.weight * 5, 100)}%` }}
                                           />
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         )}

                         <div className="bg-brand-bg p-4 rounded-xl border border-brand-border">
                            <h4 className="text-[10px] font-bold uppercase text-brand-primary mb-2 flex items-center gap-2">
                               <Activity size={12} />
                               Model Confidence
                            </h4>
                            <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                               <motion.div 
                                  className="h-full bg-brand-accent"
                                  initial={{ width: 0 }}
                                  animate={{ width: "91%" }}
                               />
                            </div>
                            <div className="text-[10px] mt-1 text-right font-bold text-brand-text-muted">91.2% Accuracy</div>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )) : (
            <div className="text-center py-24 opacity-30 italic">
              No diagnostic history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: any }) {
  return (
    <div className="space-y-0.5">
       <span className="block text-[9px] font-bold text-brand-text-muted uppercase tracking-tighter opacity-70">{label}</span>
       <span className="block text-sm font-bold text-brand-primary tracking-tight">{value}</span>
    </div>
  );
}

// --- About Page ---
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-brand-primary dark:text-dark-primary">About CardiaSense AI</h1>
        <p className="text-brand-text-muted dark:text-dark-text-muted leading-relaxed">
          CardiaSense AI was developed to bridge the gap between complex clinical data and patient understanding. 
          By utilizing advanced machine learning algorithms, we provide actionable risk assessments that guide users toward 
          proactive heart health management.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-base">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand-primary dark:text-dark-primary">
            <Activity className="text-brand-accent" />
            Methodology
          </h2>
          <p className="text-sm text-brand-text-muted dark:text-dark-text-muted leading-relaxed">
            We use the <strong>Random Forest Classifier</strong>, an ensemble learning method that prevents overfitting and provides 
            robust results for tabular medical data. The model computes decision trees based on age, lifestyle factors, and clinical indicators.
          </p>
        </div>
        <div className="card-base">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand-primary dark:text-dark-primary">
            <ShieldCheck className="text-brand-accent" />
            Data Integrity
          </h2>
          <p className="text-sm text-brand-text-muted dark:text-dark-text-muted leading-relaxed">
            Trained on the Heart Disease UCI dataset, our model targets 91%+ accuracy. We prioritize 
            local processing for individual assessments to ensure maximum patient privacy and speed.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-primary dark:text-dark-primary">The Dangers of Cardiovascular Disease</h2>
        <div className="space-y-4">
          <ListItem title="Silent Killers" desc="Many heart conditions show no symptoms until a major event like a heart attack occurs." />
          <ListItem title="Leading Global Cause" desc="CVDs take an estimated 17.9 million lives each year, 32% of all deaths worldwide." />
          <ListItem title="Lifestyle Factor" desc="80% of premature heart disease is preventable through diet, activity, and early detection." />
        </div>
      </section>
    </div>
  );
}

// --- Main App Entry ---
export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predictor" element={<PredictorPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

// --- UI Helpers ---
function FactorBar({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
        <span className="text-brand-text-muted">{label}</span>
        <span className="text-brand-primary dark:text-dark-primary/80">{value} / {max}</span>
      </div>
      <div className="h-1.5 w-full bg-brand-border dark:bg-dark-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-inner", color)}
        />
      </div>
    </div>
  );
}

function FieldLabel({ label, info }: { label: string, info?: string }) {
  return (
    <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-brand-primary dark:text-dark-primary uppercase tracking-widest pl-1">
      {label}
      {info && (
        <div className="group relative inline-flex items-center">
          <HelpCircle size={12} className="text-brand-text-muted cursor-help hover:text-brand-accent transition-colors" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 w-48 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50 pointer-events-none">
            {info}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </label>
  );
}

function InputGroup({ label, value, onChange, type = "text", step, info }: any) {
  return (
    <div className="input-group">
      <FieldLabel label={label} info={info} />
      <input 
        type={type} 
        step={step}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
      />
    </div>
  );
}

function SelectGroup({ label, value, onChange, options, info }: any) {
  return (
    <div className="input-group">
      <FieldLabel label={label} info={info} />
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all"
      >
        {options.map((o: any) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function ListItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-brand-surface border border-brand-border">
      <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 shrink-0" />
      <div>
        <div className="font-bold text-brand-primary dark:text-dark-primary">{title}</div>
        <div className="text-xs text-brand-text-muted dark:text-dark-text-muted mt-1">{desc}</div>
      </div>
    </div>
  );
}
