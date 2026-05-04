"use client";

import { useState } from "react";
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
  History
} from "lucide-react";

// Mock metrics (as calculated previously)
const metrics = [
  { label: "ความแม่นยำ", value: "76.47%", icon: Target, color: "text-rose-400", bg: "bg-rose-50" },
  { label: "ความชัดเจน", value: "25.00%", icon: Activity, color: "text-teal-500", bg: "bg-teal-50" },
  { label: "การจดจำ", value: "50.00%", icon: History, color: "text-blue-400", bg: "bg-blue-50" },
  { label: "คะแนนรวม", value: "33.33%", icon: Percent, color: "text-orange-400", bg: "bg-orange-50" },
];

export default function SupervisedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    gender: "0",
    skin_type: "0",
    acne: "0",
    doctor: "0",
    friend: "0",
    price: "0",
    acne_score: 3
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        doctor_influence2: parseInt(formData.doctor),
        friend_influence: parseInt(formData.friend),
        price_sensitive: parseInt(formData.price),
        acne: parseInt(formData.acne),
        skin_type_encoded: parseInt(formData.skin_type),
        acne_friendly_score: formData.acne_score / 5.0,
        gender: parseInt(formData.gender)
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อกับระบบหลังบ้านได้ กรุณาตรวจสอบการทำงานของ API");
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">วิเคราะห์และทำนายผล</h1>
        <p className="mt-2 text-slate-400 font-medium">ทำนายพฤติกรรมการเลือกใช้แบรนด์ด้วยระบบ AI</p>
      </section>

      {/* Indicators Panel */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div 
            key={idx}
            className="bg-white p-8 rounded-[2rem] border border-rose-50 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-2xl flex items-center justify-center mb-5`}>
              <metric.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-400">{metric.label}</p>
            <p className="text-2xl font-black text-slate-800">{metric.value}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Prediction Form */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-rose-50 shadow-xl overflow-hidden relative">
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
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, skin_type: e.target.value})}
                >
                  <option value="0">ไม่แน่ใจ</option>
                  <option value="1">ผิวมัน</option>
                  <option value="2">ผิวแห้ง</option>
                  <option value="3">ผิวผสม</option>
                  <option value="4">ผิวธรรมดา</option>
                </select>
              </div>

              {[
                { label: "กังวลเรื่องสิวหรือไม่?", name: "acne" },
                { label: "ซื้อตามคำแนะนำแพทย์?", name: "doctor" },
                { label: "ซื้อตามคำแนะนำเพื่อน?", name: "friend" },
                { label: "ราคาเป็นปัจจัยสำคัญ?", name: "price" },
              ].map((item) => (
                <div key={item.name} className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 ml-1">{item.label}</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-medium text-slate-600"
                    value={(formData as any)[item.name]}
                    onChange={(e) => setFormData({...formData, [item.name]: e.target.value})}
                  >
                    <option value="1">ใช่</option>
                    <option value="0">ไม่ใช่</option>
                  </select>
                </div>
              ))}

              <div className="md:col-span-2 space-y-6 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-500 ml-1">ให้ความสำคัญกับสูตรที่ 'อ่อนโยนต่อสิว' แค่ไหน? (0-5)</label>
                  <span className="text-rose-500 font-black bg-rose-50 px-4 py-1 rounded-xl">{formData.acne_score}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5" 
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  value={formData.acne_score}
                  onChange={(e) => setFormData({...formData, acne_score: parseInt(e.target.value)})}
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
                    <>เริ่มวิเคราะห์ข้อมูล <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" /></>
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
                className="bg-white p-10 rounded-[3rem] border border-rose-50 shadow-xl text-center space-y-8"
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
            ) : error ? (
              <motion.div 
                key="error"
                className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 text-center space-y-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
                <h3 className="text-rose-800 font-black text-lg">เกิดข้อผิดพลาด</h3>
                <p className="text-rose-600 text-sm font-medium">{error}</p>
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
    </div>
  );
}
