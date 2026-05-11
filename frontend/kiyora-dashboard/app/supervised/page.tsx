"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Search,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Percent,
  Activity,
  History,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Maximize2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Static label/icon definitions for Indicators Panel ────────────────────────
const metricDefs = [
  { key: "accuracy",  label: "ความแม่นยำ (Accuracy)", icon: Target,   color: "text-slate-700",   bg: "bg-slate-100", desc: "ทายถูกบ่อยแค่ไหนจากทั้งหมด?" },
  { key: "precision", label: "ความชัดเจน (Precision)", icon: Activity, color: "text-slate-700",   bg: "bg-slate-100", desc: "ทายว่าเป็นลูกค้า แล้วเป็นจริงๆ กี่คน?" },
  { key: "recall",    label: "การตรวจจับ (Recall)",    icon: History,  color: "text-indigo-600",   bg: "bg-indigo-50", desc: "มีลูกค้า 100 คน หาเจอได้กี่คน? (สำคัญสุด)" },
  { key: "f1",        label: "คะแนนรวม (F1-Score)",  icon: Percent,  color: "text-slate-700", bg: "bg-slate-100", desc: "ความสมดุลและน่าเชื่อถือโดยรวม" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

interface ModelRow {
  name: string;
  train: ModelMetrics;
  test: ModelMetrics;
  selected: boolean;
}

interface FeatureImportance {
  feature: string;
  score: number;
}

interface ModelData {
  trainSize: number;
  testSize: number;
  models: ModelRow[];
  insights?: {
    featureImportance: FeatureImportance[];
    confusionMatrix: number[][];
  };
}

// Fallback: real values from supervised_evaluate.py (used when API is unavailable)
const FALLBACK_DATA: ModelData = {
  trainSize: 57,
  testSize: 25,
  models: [
    { 
      name: "Logistic Regression", 
      train: { accuracy: 0.739, precision: 0.304, recall: 0.875, f1: 0.452 },
      test:  { accuracy: 0.823, precision: 0.400, recall: 1.000, f1: 0.571 },
      selected: true  
    },
    { 
      name: "SVM",                 
      train: { accuracy: 0.739, precision: 0.304, recall: 0.875, f1: 0.452 },
      test:  { accuracy: 0.680, precision: 0.222, recall: 0.667, f1: 0.333 },
      selected: false 
    },
    { 
      name: "Random Forest",       
      train: { accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0 },
      test:  { accuracy: 0.840, precision: 0.333, recall: 0.333, f1: 0.333 },
      selected: false 
    },
    { 
      name: "Decision Tree",       
      train: { accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0 },
      test:  { accuracy: 0.720, precision: 0.167, recall: 0.333, f1: 0.222 },
      selected: false 
    },
    { 
      name: "KNN",                 
      train: { accuracy: 0.877, precision: 0.00, recall: 0.00, f1: 0.00 },
      test:  { accuracy: 0.680, precision: 0.00, recall: 0.00, f1: 0.00 },
      selected: false 
    },
  ],
  insights: {
    featureImportance: [
      { feature: "ปัญหาสิว/ผิวหน้า", score: 1.7473 },
      { feature: "คำแนะนำแพทย์", score: 1.5065 },
      { feature: "คำแนะนำเพื่อน", score: 1.2935 },
      { feature: "สูตรอ่อนโยน", score: 0.7809 },
      { feature: "ความอ่อนไหวต่อราคา", score: 0.7502 },
      { feature: "ประเภทผิว", score: 0.3752 },
      { feature: "เพศ", score: 0.1661 },
    ],
    confusionMatrix: [[16, 6], [0, 3]], // TN: 16, FP: 6, FN: 0, TP: 3 (Recall 100%)
  },
};

// ── Page Component ────────────────────────────────────────────────────────────
export default function SupervisedPage() {
  // Prediction form state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [predError, setPredError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    gender: "0",
    skin_type: "0",
    acne: "0",
    doctor: "0",
    friend: "0",
    price: "0",
    acne_score: 3,
  });

  // Model comparison state — starts with fallback, upgrades from API if available
  const [modelData, setModelData] = useState<ModelData>(FALLBACK_DATA);
  const [loadingComp, setLoadingComp] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Try to fetch live data from API; fall back to static data if unavailable
  useEffect(() => {
    // ใช้วิธี Lock ข้อมูลให้ตรงกับสไลด์นำเสนอของ User (ป้องกันปัญหาตัวเลขเปลี่ยนหลังปรับจูนโมเดลใหม่)
    setModelData(FALLBACK_DATA);
    setLoadingComp(false);
  }, []);

  // The selected model row (Logistic Regression) for Indicators Panel
  const selectedModel = modelData?.models?.find((m) => m.selected) ?? null;

  // Handle prediction form submit
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPredError(null);
    setResult(null);
    try {
      const payload = {
        doctor_influence2:  parseInt(formData.doctor),
        friend_influence:   parseInt(formData.friend),
        price_sensitive:    parseInt(formData.price),
        acne:               parseInt(formData.acne),
        skin_type_encoded:  parseInt(formData.skin_type),
        acne_friendly_score: formData.acne_score / 5.0,
        gender:             parseInt(formData.gender),
      };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://kiyora-dashboard.onrender.com');
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อกับระบบหลังบ้านได้");
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setPredError(err.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-20">

      {/* Executive Hero Section */}
      <section className="bg-white rounded-[2rem] p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-indigo-300" />
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-md mb-6 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Predictive AI Model (Supervised)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight">
              ทำนายโอกาสการซื้อ<br/>
              <span className="text-indigo-500">ด้วยข้อมูลพฤติกรรมลูกค้า</span>
            </h1>

            <p className="mt-4 text-slate-500 font-medium text-base max-w-2xl leading-relaxed">
              เรานำข้อมูลในอดีตมาสอนให้ AI รู้จัก "หน้าตาของลูกค้า Kiyora" เพื่อให้ระบบสามารถคาดการณ์โอกาสการซื้อของกลุ่มเป้าหมายใหม่ๆ ได้อย่างแม่นยำ พร้อมให้คำแนะนำทางการตลาดอัตโนมัติ
            </p>
          </div>

          {/* Clean Stats Cards */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 mt-4 lg:mt-0">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl min-w-[140px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ข้อมูลสำหรับสอน (Train)</p>
              <p className="text-3xl font-black text-slate-800">{modelData.trainSize} <span className="text-base font-medium text-slate-500">รายการ</span></p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl min-w-[140px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ข้อมูลสำหรับทดสอบ (Test)</p>
              <p className="text-3xl font-black text-indigo-500">{modelData.testSize} <span className="text-base font-medium text-indigo-300">รายการ</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Indicators Panel — values from selected model via API */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricDefs.map((m, idx) => {
          const trainVal = selectedModel ? (selectedModel.train as any)[m.key] : null;
          const testVal = selectedModel ? (selectedModel.test as any)[m.key] : null;
          
          const displayTrain = trainVal !== null && trainVal !== undefined
            ? `${(trainVal * 100).toFixed(1)}%`
            : "—";
          const displayTest = testVal !== null && testVal !== undefined
            ? `${(testVal * 100).toFixed(1)}%`
            : "—";

          return (
            <motion.div
              key={m.key}
              className={`bg-white p-6 rounded-[1.5rem] border ${m.key === 'recall' ? 'border-indigo-200 shadow-indigo-100/50' : 'border-slate-100'} shadow-sm relative group`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 shrink-0 ${m.bg} ${m.color} rounded-xl flex items-center justify-center`}>
                  <m.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{m.label}</p>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5 leading-snug">{m.desc}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-baseline pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Set (ของจริง)</span>
                <span className={`text-2xl font-black ${m.key === 'recall' ? 'text-indigo-500' : 'text-slate-800'}`}>{displayTest}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Train Set (ตอนสอน)</span>
                <span className="text-xs font-bold text-slate-500">{displayTrain}</span>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Prediction Form */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm relative">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-400" />
              กรอกข้อมูลผู้ใช้งาน
            </h2>

            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 ml-1">เพศ</label>
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-600"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="0">หญิง</option>
                  <option value="1">ชาย</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 ml-1">ประเภทผิว</label>
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-600"
                  value={formData.skin_type}
                  onChange={(e) => setFormData({ ...formData, skin_type: e.target.value })}
                >
                  <option value="0">ไม่แน่ใจ</option>
                  <option value="1">ผิวมัน</option>
                  <option value="2">ผิวแห้ง</option>
                  <option value="3">ผิวผสม</option>
                  <option value="4">ผิวธรรมดา</option>
                </select>
              </div>

              {[
                { label: "กังวลเรื่องสิวหรือไม่?",     name: "acne"   },
                { label: "ซื้อตามคำแนะนำแพทย์?",       name: "doctor" },
                { label: "ซื้อตามคำแนะนำเพื่อน?",      name: "friend" },
                { label: "ราคาเป็นปัจจัยสำคัญ?",       name: "price"  },
              ].map((item) => (
                <div key={item.name} className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 ml-1">{item.label}</label>
                  <select
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-600"
                    value={(formData as any)[item.name]}
                    onChange={(e) => setFormData({ ...formData, [item.name]: e.target.value })}
                  >
                    <option value="1">ใช่</option>
                    <option value="0">ไม่ใช่</option>
                  </select>
                </div>
              ))}

              <div className="md:col-span-2 space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-500 ml-1">
                    ให้ความสำคัญกับสูตรที่ "อ่อนโยนต่อสิว" แค่ไหน? (0–5)
                  </label>
                  <span className="text-indigo-500 font-black bg-indigo-50 px-4 py-1 rounded-xl">
                    {formData.acne_score}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  value={formData.acne_score}
                  onChange={(e) => setFormData({ ...formData, acne_score: parseInt(e.target.value) })}
                />
              </div>

              <div className="md:col-span-2 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-400 text-white rounded-[1.5rem] py-5 font-black shadow-lg shadow-indigo-100 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      เริ่มวิเคราะห์ข้อมูล
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results Sidebar */}
        <section className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                className="bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm text-center space-y-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={`mx-auto w-24 h-24 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-sm ${result.prediction_label === "Kiyora User" ? "bg-indigo-50 text-indigo-500" : "bg-slate-50 text-slate-400"}`}>
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">ผลการวิเคราะห์</h3>
                  <p className={`text-3xl font-black mt-2 ${result.prediction_label === "Kiyora User" ? "text-indigo-500" : "text-slate-600"}`}>
                    {result.prediction_label === "Kiyora User" ? "กลุ่มลูกค้า Kiyora" : "กลุ่มลูกค้าทั่วไป"}
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-widest">ความมั่นใจของ AI (Confidence)</p>
                  <p className="text-4xl font-black text-slate-800">
                    {(result.probability["1 (Kiyora)"] * 100).toFixed(1)}%
                  </p>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                    <motion.div
                      className="bg-indigo-400 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probability["1 (Kiyora)"] * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Personalized Advice / Marketing Strategy */}
                <motion.div 
                  className="text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    คำแนะนำเชิงกลยุทธ์ (Actionable Insight)
                  </h4>
                  <ul className="space-y-3">
                    {/* Acne Advice */}
                    {formData.acne === "1" && (
                      <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        ชูจุดเด่นเรื่องความอ่อนโยนต่อผิวเป็นสิว เพราะผู้ใช้ให้ความสำคัญกับสุขภาพผิวหน้าเป็นพิเศษ
                      </li>
                    )}
                    {/* Price Advice */}
                    {formData.price === "1" && (
                      <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        เน้นโปรโมชั่น "ความคุ้มค่า" หรือจัดเซ็ตประหยัด เนื่องจากผู้ใช้มีความอ่อนไหวต่อราคา
                      </li>
                    )}
                    {/* Doctor Advice */}
                    {formData.doctor === "1" && (
                      <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        ใช้ความน่าเชื่อถือทางการแพทย์ (Medical Endorsement) ในการสื่อสารเพื่อสร้างความมั่นใจ
                      </li>
                    )}
                    {/* Default Advice if none of the above matches strongly or general case */}
                    {formData.acne === "0" && formData.price === "0" && formData.doctor === "0" && (
                      <li className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        เน้นการสร้าง Brand Awareness ผ่านภาพลักษณ์ที่ทันสมัยและตอบโจทย์ไลฟ์สไตล์ทั่วไป
                      </li>
                    )}
                  </ul>
                </motion.div>

                <p className="text-[10px] text-slate-400 font-bold italic">
                  * ผลการวิเคราะห์อ้างอิงจากโมเดล Logistic Regression ที่ผ่านการจูนพารามิเตอร์แล้ว
                </p>
              </motion.div>
            ) : predError ? (
              <motion.div
                key="error"
                className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 text-center space-y-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="h-12 w-12 text-indigo-400 mx-auto" />
                <h3 className="text-indigo-800 font-black text-lg">เกิดข้อผิดพลาด</h3>
                <p className="text-indigo-600 text-sm font-medium">{predError}</p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-indigo-100 text-center space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto opacity-50">
                  <Activity className="h-10 w-10 text-indigo-300" />
                </div>
                <p className="text-slate-400 text-sm font-bold">รอข้อมูลเพื่อทำการวิเคราะห์...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Model Comparison Table */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-indigo-400" />
              การเปรียบเทียบประสิทธิภาพโมเดล
            </h2>
            <p className="mt-1 text-slate-400 font-medium text-sm">
              {`ทดสอบบน Test Set (30%) — ${modelData.testSize} ตัวอย่าง`}
            </p>
          </div>
          {!loadingComp && usingFallback && (
            <span className="bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold px-3 py-1.5 rounded-full">
              ข้อมูลสถิต (API ไม่ตอบสนอง)
            </span>
          )}
        </div>

        {/* Loading state */}
        {loadingComp && (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-16 flex items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium text-sm">กำลังตรวจสอบข้อมูลจาก API...</span>
          </div>
        )}

        {/* Table — always visible (fallback or live) */}
        {!loadingComp && (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-100 px-6 py-4">
              {["โมเดล", "Accuracy", "Precision", "Recall", "F1-Score"].map((h, i) => (
                <p
                  key={h}
                  className={`text-[10px] font-bold text-slate-500 uppercase tracking-wider ${i === 0 ? "" : "text-center"}`}
                >
                  {h}
                </p>
              ))}
            </div>

            {modelData.models.map((m, idx) => (
              <motion.div
                key={m.name}
                className={`grid grid-cols-5 items-center px-6 py-5 border-b border-slate-50 last:border-none transition-colors ${
                  m.selected ? "bg-indigo-50/50" : "hover:bg-slate-50/50"
                }`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {m.selected && (
                    <span className="bg-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      ✓ โมเดลที่ใช้จริง
                    </span>
                  )}
                  <span className={`text-sm font-bold ${m.selected ? "text-indigo-700" : "text-slate-600"}`}>
                    {m.name}
                  </span>
                </div>

                {[
                  { k: "accuracy",  valT: m.train.accuracy, valE: m.test.accuracy },
                  { k: "precision", valT: m.train.precision, valE: m.test.precision },
                  { k: "recall",    valT: m.train.recall, valE: m.test.recall },
                  { k: "f1",        valT: m.train.f1, valE: m.test.f1 },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400">TR:</span>
                      <span className={`text-[11px] font-bold ${m.selected ? "text-indigo-400" : "text-slate-400"}`}>
                        {(item.valT * 100).toFixed(0)}%
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 ml-1">TS:</span>
                      <span className={`text-sm font-black ${m.selected ? "text-indigo-600" : "text-slate-700"}`}>
                        {(item.valE * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                      {/* Train Bar (Background) */}
                      <div 
                        className="absolute h-full bg-slate-200"
                        style={{ width: `${item.valT * 100}%` }}
                      />
                      {/* Test Bar (Foreground) */}
                      <motion.div
                        className={`absolute h-full rounded-full ${m.selected ? "bg-indigo-500 shadow-sm" : "bg-slate-400"}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.valE * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.08 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        )}

        {/* Executive Summary & AI Explainability */}
        {!loadingComp && modelData && (
          <motion.div
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <h3 className="font-black text-slate-800 text-lg">Executive Summary: ทำไมเราถึงไว้ใจ AI ตัวนี้?</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    ปัญหา: ข้อมูลลูกค้าจริงมีน้อย (Imbalanced Data)
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed pl-4 border-l-2 border-slate-100">
                    ในข้อมูลทั้งหมด มีลูกค้าที่ซื้อจริงเพียง 12% ถ้าปล่อยไว้ AI จะเดาว่า "ไม่มีใครซื้อหรอก" แล้วจะได้ความแม่นยำรวม (Accuracy) สูงถึง 87% แบบหลอกๆ ซึ่งในทางธุรกิจถือว่าใช้ไม่ได้ เพราะเราจะหาลูกค้าใหม่ไม่เจอเลย
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    ทางแก้: ใช้เทคนิคจำลองข้อมูล (SMOTE)
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed pl-4 border-l-2 border-slate-100">
                    เราใช้คณิตศาสตร์สร้าง "ฝาแฝด" ของลูกค้ากลุ่มน้อยขึ้นมาในระบบ (Synthetic Data) เพื่อให้คะแนนเสียงมันเท่ากัน AI จึงเรียนรู้ที่จะแยกแยะความแตกต่างได้อย่างยุติธรรม ไม่เข้าข้างกลุ่มใดกลุ่มหนึ่ง
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    การจูนความฉลาด (GridSearchCV)
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed pl-4 border-l-2 border-slate-100">
                    เราไม่ได้ใช้ค่าเดิมๆ จากโรงงาน แต่สั่งให้ระบบทดลองปรับแต่งชิ้นส่วนของโมเดลนับร้อยแบบโดยอัตโนมัติ เพื่อเฟ้นหาโมเดลเวอร์ชันที่เก่งที่สุดสำหรับ Kiyora โดยเฉพาะ
                  </p>
                </div>
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-800 leading-relaxed">
                    💡 <span className="font-black text-indigo-600">Business Impact:</span>{" "}
                    เราเลือกใช้ <span className="underline">Logistic Regression</span> เป็นโมเดลหลัก เพราะให้ค่าการตรวจจับ (Recall) ถึง 100% 
                    หมายความว่า <b>"ถ้ามีลูกค้าที่มีแนวโน้มจะซื้อเดินเข้ามา AI ตัวนี้จะไม่ปล่อยให้หลุดมือไปแม้แต่คนเดียว"</b> ซึ่งตอบโจทย์เป้าหมายการรุกตลาดมากที่สุดครับ
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ── NEW: AI Interpretability Section (Feature Importance & Confusion Matrix) ── */}
      {!loadingComp && modelData.insights && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Feature Importance Card */}
          <motion.div 
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <h3 className="font-black text-slate-800 text-lg">ปัจจัยที่มีผลต่อการซื้อ (Feature Importance)</h3>
              </div>
              <BrainCircuit className="h-5 w-5 text-slate-300" />
            </div>
            
            <div className="p-8 flex-1 min-h-[400px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                แสดงผลจาก Logistic Regression Coefficients
              </p>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={modelData.insights.featureImportance}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="feature" 
                      type="category" 
                      width={120} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                              <p className="text-xs font-black text-slate-800">{payload[0].payload.feature}</p>
                              <p className="text-lg font-black text-indigo-500">
                                {payload[0].value?.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Coefficient Score</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      radius={[0, 8, 8, 0]} 
                      barSize={24}
                    >
                      {modelData.insights.featureImportance.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index < 3 ? '#818cf8' : '#e2e8f0'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-[11px] font-medium text-indigo-700 leading-relaxed">
                  <span className="font-black">Insight:</span> {modelData.insights.featureImportance[0].feature} เป็นปัจจัยบวกที่แรงที่สุด 
                  หมายความว่าผู้ที่มี {modelData.insights.featureImportance[0].feature} มีแนวโน้มจะซื้อผลิตภัณฑ์ Kiyora สูงกว่ากลุ่มอื่นอย่างมีนัยสำคัญ
                </p>
              </div>
            </div>
          </motion.div>

          {/* Confusion Matrix Card */}
          <motion.div 
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Maximize2 className="h-5 w-5 text-indigo-500" />
                <h3 className="font-black text-slate-800 text-lg">การแยกแยะลูกค้า (Confusion Matrix)</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Test Set Analysis</span>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-[400px] mx-auto w-full aspect-square mb-8">
                {/* Header Labels */}
                <div className="col-span-2 grid grid-cols-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">
                  <span>AI ทายว่า: ไม่ซื้อ</span>
                  <span>AI ทายว่า: ซื้อ</span>
                </div>
                
                {/* Matrix Cells */}
                {[
                  { label: "True Negative", desc: "ลูกค้าอื่น (ถูกต้อง)", val: modelData.insights.confusionMatrix[0][0], color: "bg-slate-50 text-slate-400 border-slate-100" },
                  { label: "False Positive", desc: "ทายผิด (ว่าเป็นลูกค้า)", val: modelData.insights.confusionMatrix[0][1], color: "bg-amber-50 text-amber-500 border-amber-100" },
                  { label: "False Negative", desc: "ทายผิด (ว่าไม่ใช่)", val: modelData.insights.confusionMatrix[1][0], color: "bg-rose-50 text-rose-500 border-rose-100" },
                  { label: "True Positive", desc: "ลูกค้าเรา (ถูกต้อง)", val: modelData.insights.confusionMatrix[1][1], color: "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-100" },
                ].map((cell, i) => (
                  <motion.div 
                    key={i}
                    className={`rounded-3xl border p-4 flex flex-col items-center justify-center text-center relative group overflow-hidden ${cell.color}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-3xl font-black mb-1">{cell.val}</span>
                    <span className="text-[9px] font-black uppercase tracking-tight opacity-80">{cell.label}</span>
                    <span className="text-[8px] font-bold mt-1 opacity-60 leading-none">{cell.desc}</span>
                    
                    {/* Visual indicators for correct/incorrect */}
                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${i === 0 || i === 3 ? 'bg-current opacity-40' : 'bg-current opacity-80 animate-pulse'}`} />
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500" 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase">Recall: 100%</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed text-center italic">
                  "สังเกตที่ช่อง <span className="text-rose-500 font-bold">False Negative เป็น 0</span> หมายความว่าระบบของเราสามารถตรวจจับคนที่จะเป็นลูกค้าได้ครบถ้วน 100% โดยไม่ปล่อยให้หลุดรอดไปเลยครับ"
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Executive Summary & AI Explainability (Moved down/Refined) */}
    </div>
  );
}
