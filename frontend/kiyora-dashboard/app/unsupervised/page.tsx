"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CircleDot,
  Layers,
  Zap,
  Users,
  Target,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  BadgeDollarSign,
} from "lucide-react";

// ── Indicators ─────────────────────────────────────────────────────────────
const indicators = [
  {
    label: "Silhouette Score",
    value: "0.42",
    desc: "ความชัดเจนในการแบ่งกลุ่ม (ยิ่งสูงยิ่งดี)",
    icon: CircleDot,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Davies-Bouldin Index",
    value: "0.85",
    desc: "ความซ้อนทับระหว่างกลุ่ม (ยิ่งต่ำยิ่งดี)",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    label: "Calinski-Harabasz",
    value: "1,245",
    desc: "ความหนาแน่นภายในกลุ่มเทียบกับระหว่างกลุ่ม",
    icon: Layers,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "จำนวนกลุ่มที่เหมาะสม (k)",
    value: "3 กลุ่ม",
    desc: "วิเคราะห์จาก Elbow Method",
    icon: BarChart3,
    color: "text-rose-400",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

// ── Customer Personas ───────────────────────────────────────────────────────
const personas = [
  {
    id: 1,
    name: "กลุ่ม Expert-Driven",
    name_en: "Cluster 1 — Doctor-Driven",
    percent: 38,
    size: 912,
    color: "from-teal-100 to-teal-50",
    accent: "bg-teal-400",
    accentText: "text-teal-600",
    border: "border-teal-100",
    icon: Stethoscope,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    traits: [
      { label: "อิทธิพลจากแพทย์", pct: 85 },
      { label: "ความอ่อนโยนสูตร", pct: 72 },
      { label: "ความอ่อนไหวต่อราคา", pct: 30 },
    ],
    desc: "กลุ่มที่ตัดสินใจซื้อจากคำแนะนำของแพทย์ผิวหนังและผู้เชี่ยวชาญ ให้ความสำคัญกับสูตรที่อ่อนโยนต่อผิวแพ้สิว",
    strategy: "ใช้ Expert Content & Medical Influencer",
    strategyDetail: "เน้นนำเสนอผ่านแพทย์ผิวหนัง รีวิวจากผู้เชี่ยวชาญ และ Clinical Evidence",
  },
  {
    id: 2,
    name: "กลุ่ม Trend Follower",
    name_en: "Cluster 2 — Social-Driven",
    percent: 35,
    size: 840,
    color: "from-rose-100 to-rose-50",
    accent: "bg-rose-400",
    accentText: "text-rose-600",
    border: "border-rose-100",
    icon: HeartHandshake,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    traits: [
      { label: "อิทธิพลจากเพื่อน", pct: 82 },
      { label: "ความอ่อนโยนสูตร", pct: 60 },
      { label: "ความอ่อนไหวต่อราคา", pct: 50 },
    ],
    desc: "กลุ่มที่รับอิทธิพลจากเพื่อนและ Social Media เป็นหลัก ชอบทดลองสินค้าใหม่และแชร์ประสบการณ์",
    strategy: "ใช้ Word-of-Mouth & Social Campaign",
    strategyDetail: "ทำโปรแกรมแนะนำเพื่อน สร้าง User-Generated Content และ Community ออนไลน์",
  },
  {
    id: 3,
    name: "กลุ่ม Value Seeker",
    name_en: "Cluster 3 — Price-Driven",
    percent: 27,
    size: 648,
    color: "from-amber-100 to-amber-50",
    accent: "bg-amber-400",
    accentText: "text-amber-600",
    border: "border-amber-100",
    icon: BadgeDollarSign,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    traits: [
      { label: "ความอ่อนไหวต่อราคา", pct: 90 },
      { label: "อิทธิพลจากเพื่อน", pct: 45 },
      { label: "ความอ่อนโยนสูตร", pct: 40 },
    ],
    desc: "กลุ่มที่เน้นความคุ้มค่าของราคาเป็นหลัก ตัดสินใจซื้อเมื่อมีโปรโมชันหรือราคาพิเศษ",
    strategy: "ใช้ Promotion & Bundle Deal",
    strategyDetail: "ออกแบบแพ็กเกจราคาประหยัด โปรโมชันพิเศษ และโปรแกรมสะสมแต้มที่ชัดเจน",
  },
];

// ── PCA Cluster dots (visual representation) ───────────────────────────────
const clusterDots = [
  // Cluster 1 — Teal
  ...Array.from({ length: 22 }, (_, i) => ({
    x: 20 + (i % 5) * 6 + Math.sin(i) * 4,
    y: 25 + Math.floor(i / 5) * 6 + Math.cos(i) * 3,
    color: "bg-teal-300",
    cluster: 0,
  })),
  // Cluster 2 — Rose
  ...Array.from({ length: 20 }, (_, i) => ({
    x: 55 + (i % 5) * 6 + Math.sin(i + 2) * 4,
    y: 15 + Math.floor(i / 5) * 6 + Math.cos(i + 2) * 3,
    color: "bg-rose-300",
    cluster: 1,
  })),
  // Cluster 3 — Amber
  ...Array.from({ length: 16 }, (_, i) => ({
    x: 38 + (i % 4) * 6 + Math.sin(i + 4) * 3,
    y: 55 + Math.floor(i / 4) * 6 + Math.cos(i + 4) * 3,
    color: "bg-amber-300",
    cluster: 2,
  })),
];

export default function UnsupervisedPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* ── Header ── */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">
          การจัดกลุ่มลูกค้า (Unsupervised Learning)
        </h1>
        <p className="mt-2 text-slate-400 font-medium">
          วิเคราะห์พฤติกรรมและแบ่งกลุ่มลูกค้าด้วย K-Means Clustering และ PCA
        </p>
      </section>

      {/* ── Indicators Panel ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((ind, idx) => (
          <motion.div
            key={idx}
            className={`bg-white p-8 rounded-[2rem] border ${ind.border} shadow-sm`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`w-12 h-12 ${ind.bg} ${ind.color} rounded-2xl flex items-center justify-center mb-5`}>
              <ind.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{ind.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{ind.value}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">{ind.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ── Cluster Distribution (PCA Visual) + Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* PCA Scatter Visual */}
        <section className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-rose-50 shadow-xl">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-rose-400" />
            การกระจายตัวของกลุ่ม (PCA 2D)
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-8">
            ลดมิติข้อมูลด้วย Principal Component Analysis เพื่อแสดงการแบ่งกลุ่ม
          </p>

          {/* Scatter Plot */}
          <div className="relative w-full aspect-square bg-slate-50 rounded-[1.5rem] border border-slate-100 overflow-hidden">
            {/* Axis labels */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              PC1
            </span>
            <span className="absolute top-1/2 left-3 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              PC2
            </span>

            {clusterDots.map((dot, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 rounded-full ${dot.color} opacity-80`}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.3 + i * 0.015, type: "spring" }}
              />
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 space-y-1.5">
              {[
                { label: "Cluster 1", color: "bg-teal-300" },
                { label: "Cluster 2", color: "bg-rose-300" },
                { label: "Cluster 3", color: "bg-amber-300" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-[10px] font-bold text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Segment Distribution */}
        <section className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-rose-50 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-400" />
              สัดส่วนกลุ่มลูกค้า
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-8">
              จากกลุ่มตัวอย่างทั้งหมด 2,400 คน แบ่งด้วย K-Means (k=3)
            </p>
          </div>

          <div className="space-y-6">
            {personas.map((p, idx) => (
              <motion.div
                key={p.id}
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.15 }}
              >
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${p.accent}`} />
                    <span className="font-bold text-slate-700">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">{p.size.toLocaleString()} คน</span>
                    <span className={`font-black ${p.accentText}`}>{p.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`${p.accent} h-full rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percent}%` }}
                    transition={{ duration: 1.2, delay: 0.6 + idx * 0.15, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              <span className="font-black text-slate-700">วิธีการ:</span>{" "}
              ใช้ StandardScaler ปรับขนาดข้อมูล → K-Means (k=3) แบ่งกลุ่ม → PCA (2D) แสดงผล
              โดยเลือก k=3 จาก Elbow Method ที่ inertia เริ่มคงที่
            </p>
          </div>
        </section>
      </div>

      {/* ── Customer Persona Cards ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Target className="h-7 w-7 text-rose-400" />
            Customer Persona รายกลุ่ม
          </h2>
          <p className="mt-1 text-slate-400 font-medium text-sm">
            ลักษณะเด่นและพฤติกรรมการซื้อของลูกค้าในแต่ละ Cluster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((p, idx) => (
            <motion.div
              key={p.id}
              className={`bg-gradient-to-br ${p.color} rounded-[2.5rem] border ${p.border} p-8 flex flex-col gap-6 hover:shadow-lg transition-all`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`p-3 ${p.iconBg} rounded-2xl shadow-sm`}>
                  <p.icon className={`h-6 w-6 ${p.iconColor}`} />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${p.accentText}`}>
                    {p.name_en}
                  </p>
                  <h3 className="text-lg font-black text-slate-800 mt-0.5">{p.name}</h3>
                  <p className={`text-xs font-bold mt-1 ${p.accentText}`}>{p.percent}% ({p.size.toLocaleString()} คน)</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {p.desc}
              </p>

              {/* Trait Bars */}
              <div className="space-y-3 bg-white/60 rounded-2xl p-4 border border-white/80">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Feature Importance</p>
                {p.traits.map((trait, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-600">{trait.label}</span>
                      <span className={`font-black ${p.accentText}`}>{trait.pct}%</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className={`${p.accent} h-full rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${trait.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Strategic Recommendations ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-amber-400" />
            ข้อเสนอแนะเชิงกลยุทธ์ตาม Segment
          </h2>
          <p className="mt-1 text-slate-400 font-medium text-sm">
            Campaign Strategy ที่แนะนำสำหรับแต่ละกลุ่มลูกค้า
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((p, idx) => (
            <motion.div
              key={p.id}
              className="bg-white rounded-[2rem] border border-slate-50 shadow-sm p-8 flex flex-col gap-4 hover:border-rose-100 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${p.accent} text-white flex items-center justify-center text-xs font-black shadow`}>
                  {p.id}
                </div>
                <p className="font-black text-slate-800">{p.strategy}</p>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {p.strategyDetail}
              </p>
              <div className={`mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 ${p.accentText}`}>
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold">กลุ่มเป้าหมาย: {p.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall insight banner */}
        <motion.div
          className="bg-gradient-to-br from-rose-400 to-rose-500 rounded-[2.5rem] p-8 sm:p-10 text-white border-4 border-white/20 shadow-xl shadow-rose-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="bg-white/20 p-4 rounded-2xl w-fit">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">สรุปข้อค้นพบสำคัญจาก Clustering</h3>
              <p className="text-rose-50 font-medium leading-relaxed max-w-3xl">
                กลุ่มที่มีศักยภาพสูงสุดในการเป็นลูกค้า Kiyora คือ <strong>Cluster 1 (Expert-Driven)</strong> ที่มีอิทธิพลจากแพทย์สูง
                แนะนำให้เน้นลงทุนในช่องทาง Medical Influencer และ Clinical Endorsement
                ขณะเดียวกัน <strong>Cluster 2</strong> เป็นกลุ่ม Growth Potential ที่ขยายได้ผ่าน Social Media Campaign
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
