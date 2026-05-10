"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart4,
  TrendingUp,
  ShoppingBag,
  Globe,
  ArrowUpRight,
  Sparkles,
  Users,
  Loader2,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

/* ── Color Palette ─────────────────────────────────────────────────── */
const COLORS = ["#fb7185", "#2dd4bf", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#f472b6", "#818cf8", "#fbbf24", "#6ee7b7"];
const ROSE = ["#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c"];

/* ── Fallback Data (used when API is unavailable) ──────────────────── */
const FALLBACK = {
  total_respondents: 82,
  kiyora_users: 10,
  demographic: {
    gender: { "หญิง": 80, "ชาย": 2 },
    age: { "18-22 ปี": 29, "23-28 ปี": 26, "29-34 ปี": 19, "35 ปี ขึ้นไป": 7, "ต่ำกว่า 18 ปี": 1 },
    income: { "40,000 บาท ขึ้นไป": 25, "ต่ำกว่า 10,000 บาท": 23, "10,001 - 14,999 บาท": 10, "25,000 - 29,999 บาท": 7, "15,000 - 19,999 บาท": 6, "35,000 - 39,999 บาท": 5, "30,000 - 34,999 บาท": 3, "20,000 - 24,999 บาท": 3 },
    skin_type: { "ผิวผสม": 33, "ผิวมัน": 18, "ผิวแห้ง": 18, "ผิวธรรมดา": 7, "ไม่แน่ใจ": 6 },
    province: { "bangkok": 54, "ปทุมธานี": 5, "ฉะเชิงเทรา": 4, "นนทบุรี": 4, "นครปฐม": 4, "สมุทรปราการ": 2, "พะเยา": 2, "แพร่": 2 },
    occupation: { "พนักงานบริษัทเอกชน": 34, "นักศึกษา": 29, "ธุรกิจส่วนตัว": 7, "ข้าราชการ": 6, "อื่นๆ": 6 },
  },
  brand_market_share: { "dermavie": 14, "florelle": 12, "veloura": 11, "kiyora": 10, "eastern belle": 3, "aomizu": 3, "klinor lab": 3, "glow in skin": 3, "อื่นๆ": 23 },
  skin_concerns: { "สิว": 67, "ผิวมัน": 27, "ผิวแพ้ง่าย": 33, "รูขุมขน": 56, "ผิวหมองคล้ำ": 34, "ผิวแห้ง": 23 },
  cleansing_usage: { "Cleansing Water": 79, "Cleansing Oil": 31, "Cleansing Balm": 11, "Cleansing Sheet": 19, "Cleansing Milk": 5 },
  feature_importance: { "Deep Cleansing": 0.72, "Acne Friendly": 0.65, "Sensitive Skin": 0.68, "No Irritant": 0.62, "Hypoallergenic": 0.55, "Moisturizing": 0.70, "Low Friction": 0.58, "Nourishment": 0.60, "Eye Friendly": 0.63, "Oil Control": 0.61 },
};

/* ── Helper: dict → array ──────────────────────────────────────────── */
function toArr(obj: Record<string, number>) {
  return Object.entries(obj).map(([name, value]) => ({ name, value }));
}

/* ── Section Card Wrapper ──────────────────────────────────────────── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`bg-white p-6 sm:p-8 rounded-[2rem] border border-rose-50 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/* ── Custom Tooltip ────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-rose-100 text-sm">
      <p className="font-bold text-slate-700">{label || payload[0]?.name}</p>
      <p className="text-rose-500 font-black">{payload[0]?.value} คน</p>
    </div>
  );
}

/* ── Mini Donut Chart Component ────────────────────────────────────── */
function MiniDonut({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  return (
    <Card>
      <h3 className="text-sm font-bold text-slate-500 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(v: string) => <span className="text-xs text-slate-500 font-medium">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

/* ── Horizontal Bar Component ──────────────────────────────────────── */
function HorizontalBar({ data, title, color = "#fb7185" }: { data: { name: string; value: number }[]; title: string; color?: string }) {
  return (
    <Card>
      <h3 className="text-sm font-bold text-slate-500 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={120} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={color} radius={[0, 8, 8, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
export default function InsightsPage() {
  const [data, setData] = useState<typeof FALLBACK>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiyora-dashboard.onrender.com";
    fetch(`${apiUrl}/insights`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setUsingFallback(false); })
      .catch(() => { setData(FALLBACK); setUsingFallback(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 gap-3 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="font-medium">กำลังโหลดข้อมูลเชิงลึก...</span>
      </div>
    );
  }

  /* Prepare chart data */
  const genderData = toArr(data.demographic.gender);
  const ageData = toArr(data.demographic.age);
  const incomeData = toArr(data.demographic.income);
  const skinData = toArr(data.demographic.skin_type);
  const provinceData = toArr(data.demographic.province);
  const occupationData = toArr(data.demographic.occupation);
  const brandData = toArr(data.brand_market_share);
  const concernData = toArr(data.skin_concerns);
  const cleansingData = toArr(data.cleansing_usage);
  const featureData = Object.entries(data.feature_importance).map(([name, value]) => ({
    name,
    value: Math.round(value * 100),
    fullMark: 100,
  }));

  const kiyoraPercent = data.total_respondents > 0
    ? ((data.kiyora_users / data.total_respondents) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">ข้อมูลเชิงลึกทางธุรกิจ</h1>
        <p className="mt-2 text-slate-400 font-medium">
          Demographic Profile + Business Dashboard จากข้อมูลแบบสอบถามจริง ({data.total_respondents} คน)
        </p>
        {usingFallback && (
          <span className="inline-block mt-2 bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold px-3 py-1.5 rounded-full">
            ข้อมูลสถิต (API ไม่ตอบสนอง)
          </span>
        )}
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "ผู้ตอบแบบสอบถามทั้งหมด", value: `${data.total_respondents}`, desc: "จำนวนผู้ตอบแบบสอบถามที่นำมาวิเคราะห์", icon: Globe, trend: "neutral" },
          { title: "ผู้ใช้ Kiyora", value: `${kiyoraPercent}%`, desc: `${data.kiyora_users} คนจากทั้งหมด ${data.total_respondents} คน`, icon: ShoppingBag, trend: "up" },
          { title: "แบรนด์คู่แข่งหลัก", value: `${Object.keys(data.brand_market_share).length}`, desc: "จำนวนแบรนด์ที่มีในตลาด", icon: TrendingUp, trend: "up" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-rose-50 shadow-sm hover:shadow-lg transition-all group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-rose-50 text-rose-400 rounded-2xl group-hover:bg-rose-400 group-hover:text-white transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-rose-200 group-hover:text-rose-400 transition-colors" />
            </div>
            <p className="text-slate-400 font-bold text-sm">{item.title}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{item.value}</h3>
            <p className="text-slate-400 text-xs mt-5 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ════════════════════════════════════════════════════════════════
         DEMOGRAPHIC PROFILE
         ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-6 w-6 text-rose-400" />
          Demographic Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MiniDonut data={genderData} title="การกระจายเพศ" />
          <MiniDonut data={skinData} title="ประเภทผิว" />
          <MiniDonut data={ageData} title="ช่วงอายุ" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HorizontalBar data={incomeData} title="การกระจายรายได้ต่อเดือน" color="#2dd4bf" />
          <HorizontalBar data={occupationData} title="อาชีพ" color="#60a5fa" />
        </div>

        <HorizontalBar data={provinceData} title="จังหวัดที่อยู่อาศัย (Top 8)" color="#a78bfa" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
         BUSINESS DASHBOARDS (4 charts)
         ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart4 className="h-6 w-6 text-rose-400" />
          Business Dashboard
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1 — Brand Market Share */}
          <Card>
            <h3 className="text-sm font-bold text-slate-500 mb-1">ส่วนแบ่งตลาดแบรนด์ (Top 10)</h3>
            <p className="text-xs text-slate-400 mb-4">จำนวนผู้ตอบที่ใช้แต่ละแบรนด์เป็นหลัก</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={brandData} margin={{ left: 5, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={28}>
                  {brandData.map((entry, i) => (
                    <Cell key={i} fill={entry.name === "kiyora" ? "#2dd4bf" : ROSE[i % ROSE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 2 — Skin Concerns */}
          <Card>
            <h3 className="text-sm font-bold text-slate-500 mb-1">ปัญหาผิวที่พบบ่อย</h3>
            <p className="text-xs text-slate-400 mb-4">จำนวนผู้ตอบที่มีความกังวลแต่ละด้าน</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={concernData} margin={{ left: 5, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#fb7185" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 3 — Cleansing Type Usage */}
          <Card>
            <h3 className="text-sm font-bold text-slate-500 mb-1">ประเภทคลีนซิ่งที่ใช้</h3>
            <p className="text-xs text-slate-400 mb-4">จำนวนผู้ตอบที่ใช้คลีนซิ่งแต่ละประเภท</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={cleansingData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={(props: any) => `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
                  {cleansingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* 4 — Feature Importance Radar */}
          <Card>
            <h3 className="text-sm font-bold text-slate-500 mb-1">คุณสมบัติที่ลูกค้าให้ความสำคัญ</h3>
            <p className="text-xs text-slate-400 mb-4">คะแนนเฉลี่ย Likert Scale (0-100%)</p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={featureData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="คะแนนเฉลี่ย" dataKey="value" stroke="#f43f5e" fill="#fb7185" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         AI Recommendation (existing section, kept)
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card>
          <h2 className="text-xl font-bold text-slate-800 mb-10 flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-rose-400" />
            แนวโน้มความรู้สึกต่อแบรนด์
          </h2>
          <div className="space-y-8">
            {[
              { label: "เชิงบวก (Positive)", value: 75, color: "bg-teal-400" },
              { label: "ทั่วไป (Neutral)", value: 15, color: "bg-slate-200" },
              { label: "เชิงลบ (Negative)", value: 10, color: "bg-rose-300" },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>{bar.label}</span>
                  <span>{bar.value}%</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`h-full ${bar.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <section className="bg-gradient-to-br from-rose-300 to-rose-400 p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] text-white shadow-xl shadow-rose-100 flex flex-col justify-between border-4 border-white/30">
          <div>
            <div className="bg-white/30 w-fit p-3 rounded-2xl mb-8">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black mb-5">ข้อเสนอแนะจาก AI</h2>
            <p className="text-rose-50 leading-relaxed font-medium italic text-lg">
              &quot;เน้นการทำตลาดในกลุ่มอายุ 18-24 ปี โดยชูจุดเด่นเรื่อง &apos;ความอ่อนโยนต่อผิวเป็นสิว&apos;
              ข้อมูลชี้ให้เห็นว่ากลุ่มนี้ให้ความสำคัญกับความอ่อนโยนของสูตรมากกว่าคำแนะนำจากแพทย์&quot;
            </p>
          </div>
          <button className="mt-12 bg-white text-rose-400 px-8 py-4 rounded-2xl font-black text-sm hover:bg-rose-50 transition-all w-fit shadow-md">
            ดาวน์โหลดรายงานฉบับเต็ม
          </button>
        </section>
      </div>
    </div>
  );
}
