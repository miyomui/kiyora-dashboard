"use client";

import { motion } from "framer-motion";
import {
  Users,
  Database,
  Cpu,
  Layout,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const teamMembers = [
  { name: "ลลิตวดี", role: "Machine Learning Engineer / Backend Developer", desc: "ดูแลด้านโมเดลและการเชื่อมต่อข้อมูล" },
  { name: "แพท", role: "Business Analyst / Data Engineer", desc: "วิเคราะห์ข้อมูลเชิงลึกและโครงสร้างข้อมูล" },
  { name: "เนย", role: "Frontend / Dashboard Developer", desc: "ออกแบบและพัฒนาหน้าจอการแสดงผล" },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-rose-200 via-rose-100 to-teal-100 px-8 py-20 text-slate-800 shadow-xl shadow-rose-100/50"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-rose-600">
            Kiyora Brand <br />
            <span className="text-slate-700">Intelligence System</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-500 font-medium">
            ระบบวิเคราะห์แบรนด์อัจฉริยะที่ช่วยให้คุณเข้าใจ <br/>
            ความต้องการของลูกค้าและทำนายผลลัพธ์ได้อย่างแม่นยำ
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <button className="rounded-2xl bg-rose-400 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-500 transition-all">
              เริ่มวิเคราะห์ผล
            </button>
            <button className="text-sm font-bold leading-6 text-slate-600 flex items-center gap-2 group">
              ดูรายละเอียดเพิ่มเติม <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Soft decorative shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 -mr-10 -mb-10 h-64 w-64 rounded-full bg-teal-200 opacity-30 blur-2xl" />
      </motion.section>

      {/* System Architecture */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">โครงสร้างระบบ</h2>
          <p className="mt-2 text-slate-400 font-medium">การทำงานเบื้องหลังของระบบวิเคราะห์ Kiyora</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            { icon: Database, title: "ฐานข้อมูล", desc: "ข้อมูลจากการสำรวจตลาด", color: "text-rose-400", bg: "bg-rose-50" },
            { icon: Cpu, title: "ระบบประมวลผล", desc: "โมเดล AI และ API", color: "text-teal-500", bg: "bg-teal-50" },
            { icon: Layout, title: "ส่วนแสดงผล", desc: "หน้าจอแดชบอร์ดอัจฉริยะ", color: "text-blue-400", bg: "bg-blue-50" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="flex flex-col items-center p-10 rounded-[2.5rem] bg-white border border-rose-50 shadow-sm hover:shadow-md transition-shadow"
              {...fadeIn}
            >
              <div className={`${item.bg} p-5 rounded-2xl mb-6`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-400 text-center mt-2 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Members */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">ทีมผู้พัฒนา</h2>
            <p className="mt-2 text-slate-400 font-medium">ผู้เชี่ยวชาญเบื้องหลังการวิเคราะห์ข้อมูล</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold text-teal-600 border border-teal-100">
              <Activity className="h-3 w-3" /> 3 สมาชิกพร้อมดูแล
            </span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, idx) => (
            <motion.div 
              key={idx}
              className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-rose-50 shadow-sm hover:border-rose-200 transition-all"
              variants={fadeIn}
            >
              <div className="mb-6 h-28 w-28 rounded-[2rem] bg-rose-50 overflow-hidden flex items-center justify-center border-4 border-white shadow-inner group-hover:scale-105 transition-transform">
                <Users className="h-12 w-12 text-rose-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
              <p className="text-rose-400 text-sm font-bold mb-4">{member.role}</p>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{member.desc}</p>
              
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="h-6 w-6 text-teal-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
