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
} from "lucide-react";

// ── Static label/icon definitions for Indicators Panel ────────────────────────
const metricDefs = [
  { key: "accuracy",  label: "ความแม่นยำ", icon: Target,   color: "text-rose-400",   bg: "bg-rose-50"   },
  { key: "precision", label: "ความชัดเจน", icon: Activity, color: "text-teal-500",   bg: "bg-teal-50"   },
  { key: "recall",    label: "การจดจำ",    icon: History,  color: "text-blue-400",   bg: "bg-blue-50"   },
  { key: "f1",        label: "คะแนนรวม",  icon: Percent,  color: "text-orange-400", bg: "bg-orange-50" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface ModelRow {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  selected: boolean;
}

interface ModelData {
  testSize: number;
  models: ModelRow[];
}

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

  // Model comparison state
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loadingComp, setLoadingComp] = useState(true);

  // Fetch model comparison from API on mount
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
    fetch(`${apiUrl}/model-comparison`)
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data: ModelData) => setModelData(data))
      .catch(() => setModelData(null))
      .finally(() => setLoadingComp(false));
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
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

      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">วิเคราะห์และทำนายผล</h1>
        <p className="mt-2 text-slate-400 font-medium">ทำนายพฤติกรรมการเลือกใช้แบรนด์ด้วยระบบ AI</p>
      </section>

      {/* Indicators Panel — values from selected model via API */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricDefs.map((m, idx) => {
          const val = selectedModel ? (selectedModel as any)[m.key] : null;
          const display = val !== null && val !== undefined
            ? `${(val * 100).toFixed(2)}%`
            : "—";
          return (
            <motion.div
              key={m.key}
              className="bg-white p-8 rounded-[2rem] border border-rose-50 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-5`}>
                <m.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-400">{m.label}</p>
              <p className="text-2xl font-black text-slate-800">{display}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Prediction Form */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-rose-50 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 bg-rose-400 h-full" />
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Search className="h-5 w-5 text-rose-400" />
              กรอกข้อมูลผู้ใช้งาน
            </h2>

            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 ml-1">เพศ</label>
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-medium text-slate-600"
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
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-medium text-slate-600"
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
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-medium text-slate-600"
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
                  <span className="text-rose-500 font-black bg-rose-50 px-4 py-1 rounded-xl">
                    {formData.acne_score}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  value={formData.acne_score}
                  onChange={(e) => setFormData({ ...formData, acne_score: parseInt(e.target.value) })}
                />
              </div>

              <div className="md:col-span-2 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-400 text-white rounded-[1.5rem] py-5 font-black shadow-lg shadow-rose-100 hover:bg-rose-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
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
                className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-rose-50 shadow-xl text-center space-y-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mx-auto w-24 h-24 bg-teal-50 text-teal-500 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-md">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">ผลการวิเคราะห์</h3>
                  <p className={`text-3xl font-black mt-2 ${result.prediction_label === "Kiyora User" ? "text-teal-500" : "text-rose-400"}`}>
                    {result.prediction_label === "Kiyora User" ? "กลุ่มลูกค้า Kiyora" : "กลุ่มลูกค้าทั่วไป"}
                  </p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-white">
                  <p className="text-slate-400 text-sm font-bold mb-3">ความน่าจะเป็น</p>
                  <p className="text-5xl font-black text-slate-800">
                    {(result.probability["1 (Kiyora)"] * 100).toFixed(1)}%
                  </p>
                  <div className="w-full bg-white h-3 rounded-full mt-6 overflow-hidden shadow-inner">
                    <motion.div
                      className="bg-gradient-to-r from-rose-300 to-rose-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probability["1 (Kiyora)"] * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : predError ? (
              <motion.div
                key="error"
                className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 text-center space-y-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
                <h3 className="text-rose-800 font-black text-lg">เกิดข้อผิดพลาด</h3>
                <p className="text-rose-600 text-sm font-medium">{predError}</p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-rose-100 text-center space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto opacity-50">
                  <Activity className="h-10 w-10 text-rose-300" />
                </div>
                <p className="text-slate-400 text-sm font-bold">รอข้อมูลเพื่อทำการวิเคราะห์...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Model Comparison Table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-rose-400" />
            การเปรียบเทียบประสิทธิภาพโมเดล
          </h2>
          <p className="mt-1 text-slate-400 font-medium text-sm">
            {modelData?.testSize
              ? `ทดสอบบน Test Set (20%) — ${modelData.testSize} ตัวอย่าง`
              : "ทดสอบบน Test Set (20%)"}
          </p>
        </div>

        {/* Loading state */}
        {loadingComp && (
          <div className="bg-white rounded-[2rem] border border-rose-50 shadow-xl p-16 flex items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium text-sm">กำลังโหลดข้อมูลโมเดลจาก API...</span>
          </div>
        )}

        {/* API failed state */}
        {!loadingComp && !modelData && (
          <div className="bg-rose-50 rounded-[2rem] border border-rose-100 p-10 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-rose-300 mx-auto" />
            <p className="font-bold text-rose-600 text-sm">ไม่สามารถเชื่อมต่อ API ได้</p>
            <p className="text-rose-400 text-xs font-medium">ตรวจสอบให้แน่ใจว่า Backend กำลังทำงานอยู่</p>
          </div>
        )}

        {/* Table — only when data is ready */}
        {!loadingComp && modelData && (
          <div className="bg-white rounded-[2rem] border border-rose-50 shadow-xl overflow-hidden">
            <div className="grid grid-cols-5 bg-rose-50/60 border-b border-rose-100 px-6 py-4">
              {["โมเดล", "Accuracy", "Precision", "Recall", "F1-Score"].map((h, i) => (
                <p
                  key={h}
                  className={`text-xs font-black text-slate-500 uppercase tracking-wider ${i === 0 ? "" : "text-center"}`}
                >
                  {h}
                </p>
              ))}
            </div>

            {modelData.models.map((m, idx) => (
              <motion.div
                key={m.name}
                className={`grid grid-cols-5 items-center px-6 py-5 border-b border-slate-50 last:border-none transition-colors ${
                  m.selected ? "bg-teal-50/40" : "hover:bg-slate-50/50"
                }`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {m.selected && (
                    <span className="bg-teal-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      ✓ เลือกใช้
                    </span>
                  )}
                  <span className={`text-sm font-bold ${m.selected ? "text-teal-700" : "text-slate-600"}`}>
                    {m.name}
                  </span>
                </div>

                {[m.accuracy, m.precision, m.recall, m.f1].map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className={`text-base font-black ${m.selected ? "text-teal-600" : "text-slate-700"}`}>
                      {(val * 100).toFixed(0)}%
                    </span>
                    <div className="w-full max-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${m.selected ? "bg-teal-400" : "bg-rose-200"}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${val * 100}%` }}
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

        {/* Model Justification */}
        {!loadingComp && modelData && (
          <motion.div
            className="bg-white rounded-[2rem] border border-teal-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-teal-50 px-8 py-5 border-b border-teal-100 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-teal-500" />
              <h3 className="font-black text-teal-800">Model Justification — เหตุผลในการเลือกโมเดล</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-800">โจทย์เป็นแบบ Binary Classification</span>
                    {" "}— ทำนายว่าลูกค้าจะเลือกใช้ Kiyora (1) หรือไม่ (0)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-800">ข้อมูลไม่สมดุล (Imbalanced Data)</span>
                    {" "}— Class 0 มี 72 ตัวอย่าง vs Class 1 มีเพียง 10 ตัวอย่าง
                    จึงใช้{" "}
                    <code className="bg-slate-100 px-1.5 rounded text-xs font-mono text-rose-600">
                      class_weight="balanced"
                    </code>
                    {" "}เพื่อชดเชย
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-800">เลือก Logistic Regression</span>
                    {" "}— เพราะให้ค่า Recall สูงสุด (50%) สำหรับ Class 1 ซึ่งสำคัญกว่า Precision
                    ในบริบทของการหาลูกค้าเป้าหมาย
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-300 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-800">Random Forest {"&"} KNN</span>
                    {" "}— Accuracy สูง (82%, 88%) แต่ Recall = 0% เพราะไม่รองรับ Imbalanced Data
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-300 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-800">SVM</span>
                    {" "}— ให้ผลใกล้เคียง Logistic Regression แต่ซับซ้อนกว่าโดยไม่จำเป็น
                  </p>
                </div>
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 mt-2">
                  <p className="text-xs font-bold text-teal-700 leading-relaxed">
                    💡 <span className="font-black">สรุป:</span>{" "}
                    ในบริบทการหาลูกค้า Kiyora การ "ไม่พลาด" ลูกค้าที่สนใจ (Recall)
                    สำคัญกว่าความแม่นยำที่สูงแต่พลาดกลุ่มเป้าหมาย
                    จึงเลือก Logistic Regression เป็นโมเดลหลัก
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
