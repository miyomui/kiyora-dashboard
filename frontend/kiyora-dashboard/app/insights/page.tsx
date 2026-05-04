"use client";

import { motion } from "framer-motion";
import { 
  BarChart4, 
  TrendingUp, 
  ShoppingBag, 
  Globe,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

const insights = [
  { 
    title: "การเติบโตของตลาด", 
    value: "+12.4%", 
    desc: "การเติบโตในกลุ่มประชากรที่มีความสนใจสูง",
    icon: TrendingUp,
    trend: "up"
  },
  { 
    title: "ความภักดีต่อแบรนด์", 
    value: "84%", 
    desc: "อัตราการซื้อซ้ำของลูกค้า Kiyora",
    icon: ShoppingBag,
    trend: "up"
  },
  { 
    title: "ฐานข้อมูลการวิเคราะห์", 
    value: "2.4k", 
    desc: "จำนวนผู้ตอบแบบสอบถามที่นำมาวิเคราะห์",
    icon: Globe,
    trend: "neutral"
  },
];

export default function InsightsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">ข้อมูลเชิงลึกทางธุรกิจ</h1>
        <p className="mt-2 text-slate-400 font-medium">คำแนะนำเชิงกลยุทธ์สำหรับแบรนด์ Kiyora จากการวิเคราะห์ข้อมูล</p>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {insights.map((item, idx) => (
          <motion.div 
            key={idx}
            className="bg-white p-10 rounded-[2.5rem] border border-rose-50 shadow-sm hover:shadow-lg transition-all group"
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

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white p-10 rounded-[3rem] border border-rose-50 shadow-sm">
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
                    animate={{ width: `${bar.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-rose-300 to-rose-400 p-10 rounded-[3rem] text-white shadow-xl shadow-rose-100 flex flex-col justify-between border-4 border-white/30">
          <div>
            <div className="bg-white/30 w-fit p-3 rounded-2xl mb-8">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black mb-5">ข้อเสนอแนะจาก AI</h2>
            <p className="text-rose-50 leading-relaxed font-medium italic text-lg">
              "เน้นการทำตลาดในกลุ่มอายุ 18-24 ปี โดยชูจุดเด่นเรื่อง 'ความอ่อนโยนต่อผิวเป็นสิว' 
              ข้อมูลชี้ให้เห็นว่ากลุ่มนี้ให้ความสำคัญกับความอ่อนโยนของสูตรมากกว่าคำแนะนำจากแพทย์"
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
