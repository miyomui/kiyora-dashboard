"use client";

import { motion } from "framer-motion";
import { 
  PieChart, 
  Layers, 
  Zap, 
  CircleDot, 
  ScatterChart, 
  MousePointer2,
  Lock
} from "lucide-react";

const indicators = [
  { label: "คะแนน Silhouette", value: "0.42", icon: CircleDot, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Calinski-Harabasz", value: "1245.8", icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Davies-Bouldin", value: "0.85", icon: Zap, color: "text-orange-400", bg: "bg-orange-50" },
];

export default function UnsupervisedPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">การจัดกลุ่มลูกค้า</h1>
          <p className="mt-2 text-slate-400 font-medium">การวิเคราะห์กลุ่มเป้าหมาย (ฉบับร่าง)</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-5 py-2 rounded-full border border-amber-100 text-sm font-bold">
          <Lock className="h-4 w-4" /> กำลังพัฒนา
        </div>
      </section>

      {/* Indicators Panel */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map((indicator, idx) => (
          <motion.div 
            key={idx}
            className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`w-12 h-12 ${indicator.bg} ${indicator.color} rounded-2xl flex items-center justify-center mb-5`}>
              <indicator.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-400">{indicator.label}</p>
            <p className="text-2xl font-black text-slate-800">{indicator.value}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Segmentation Preview */}
        <section className="bg-white p-10 rounded-[3rem] border border-rose-50 shadow-xl opacity-60">
          <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-rose-400" />
            สัดส่วนกลุ่มลูกค้า
          </h2>
          <div className="aspect-square bg-rose-50/30 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-rose-100">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-rose-200 mx-auto mb-4" />
              <p className="text-rose-300 font-bold">แบบร่างกราฟ</p>
            </div>
          </div>
        </section>

        {/* Feature Importance Preview */}
        <section className="bg-white p-10 rounded-[3rem] border border-rose-50 shadow-xl opacity-60">
          <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <ScatterChart className="h-5 w-5 text-rose-400" />
            การกระจายตัวของกลุ่ม (PCA)
          </h2>
          <div className="aspect-square bg-rose-50/30 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-rose-100">
            <div className="text-center">
              <MousePointer2 className="h-16 w-16 text-rose-200 mx-auto mb-4" />
              <p className="text-rose-300 font-bold">แบบร่างการกระจายตัว</p>
            </div>
          </div>
        </section>
      </div>

      {/* Draft Notes */}
      <section className="bg-rose-50/50 p-10 rounded-[3rem] border border-rose-100">
        <h3 className="text-rose-600 font-black mb-6 flex items-center gap-2">
           บันทึกการพัฒนา
        </h3>
        <ul className="space-y-4 text-slate-500 text-sm font-medium list-none">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0" />
            <span>ใช้เทคนิค K-Means สำหรับการระบุตัวตนของกลุ่มลูกค้า</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0" />
            <span>กำลังเตรียมระบบ Feature Scaling เพื่อความแม่นยำ</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0" />
            <span>ใช้ Elbow Method ในการกำหนดจำนวนกลุ่มที่เหมาะสม (k=3)</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0" />
            <span>เป้าหมายถัดไป: การเชื่อมโยงกลุ่มลูกค้าเข้ากับกลยุทธ์การตลาด</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
