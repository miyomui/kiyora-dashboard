"use client";
// Version: 1.0.1 - Reverted to Stable Version

import { motion } from "framer-motion";
import Link from "next/link";
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
  {
    name: "เจเจ",
    role: "Machine Learning Engineer / Backend Developer",
    desc: "ดูแลด้านโมเดลและการเชื่อมต่อข้อมูล",
    image: "/team/lalitwadee.jpg"
  },
  {
    name: "แพท",
    role: "Business Analyst / Data Engineer",
    desc: "วิเคราะห์ข้อมูลเชิงลึกและโครงสร้างข้อมูล",
    image: "/team/pat.jpg"
  },
  {
    name: "เนย",
    role: "Frontend / Dashboard Developer",
    desc: "ออกแบบและพัฒนาหน้าจอการแสดงผล",
    image: "/team/noey.jpg"
  },
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
            ระบบวิเคราะห์แบรนด์อัจฉริยะที่ช่วยให้คุณเข้าใจ <br />
            ความต้องการของลูกค้าและทำนายผลลัพธ์ได้อย่างแม่นยำ
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
            <Link href="/supervised" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl bg-rose-400 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-500 transition-all active:scale-95">
                เริ่มวิเคราะห์ผล
              </button>
            </Link>
            <button
              onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-bold leading-6 text-slate-600 flex items-center gap-2 group hover:text-rose-400 transition-colors"
            >
              ดูรายละเอียดเพิ่มเติม <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Soft decorative shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-white opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 -mr-10 -mb-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-teal-200 opacity-30 blur-2xl" />
      </motion.section>

      {/* System Architecture Diagram */}
      <section id="architecture" className="space-y-12 scroll-mt-20">
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">โครงสร้างสถาปัตยกรรมระบบ</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-medium">การเชื่อมต่อข้อมูลและการทำงานของ AI แบบครบวงจร</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-rose-200 via-teal-200 to-rose-200 -translate-y-1/2 -z-10 opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1: Data Source */}
            <motion.div
              className="flex flex-col items-center group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-rose-100 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm flex flex-col items-center text-center w-full min-h-[280px] justify-center">
                  <div className="bg-rose-50 p-4 rounded-2xl mb-6">
                    <Database className="h-8 w-8 text-rose-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">ฐานข้อมูล (Data)</h3>
                  <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">
                    ข้อมูลจากการสำรวจกลุ่มตัวอย่าง<br />
                    และปัจจัยที่มีผลต่อการตัดสินใจ<br />
                    ถูกจัดเก็บในรูปแบบ CSV/Clean Data
                  </p>
                  <div className="mt-4 px-3 py-1 bg-rose-50 rounded-full text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Layer 01</div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: AI Engine (Center) */}
            <motion.div
              className="flex flex-col items-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative scale-110 md:scale-125 z-20">
                <div className="absolute -inset-6 bg-teal-100 rounded-[2.5rem] blur-2xl opacity-40 animate-pulse" />
                <div className="relative bg-white p-8 rounded-[2.5rem] border-2 border-teal-200 shadow-xl flex flex-col items-center text-center w-full min-h-[280px] justify-center">
                  <div className="bg-teal-50 p-4 rounded-2xl mb-6 shadow-inner">
                    <Cpu className="h-8 w-8 text-teal-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">ระบบประมวลผล (AI)</h3>
                  <p className="text-xs text-teal-600/70 mt-3 font-bold leading-relaxed">
                    Logistic Regression (Supervised)<br />
                    K-Means & PCA (Unsupervised)<br />
                    Isolation Forest (Anomaly Detection)
                  </p>
                  <div className="mt-4 px-3 py-1 bg-teal-500 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter shadow-md shadow-teal-100">Brain Layer</div>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Intelligence Dashboard */}
            <motion.div
              className="flex flex-col items-center group"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-100 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm flex flex-col items-center text-center w-full min-h-[280px] justify-center">
                  <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                    <Layout className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">แดชบอร์ด (UX/UI)</h3>
                  <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">
                    Customer Persona Segmentation<br />
                    Behavior Correlation Matrix<br />
                    Real-time Predictive Analytics
                  </p>
                  <div className="mt-4 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Layer 03</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Flow Particles (Optional/Conceptual) */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-2 h-2 bg-teal-400 rounded-full -translate-y-1/2 animate-ping" />
          <div className="hidden md:block absolute top-1/2 right-1/3 w-2 h-2 bg-teal-400 rounded-full -translate-y-1/2 animate-ping" />
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
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Users className="h-12 w-12 text-rose-200" />
                )}
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
