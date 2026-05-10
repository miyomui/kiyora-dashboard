"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Fingerprint, 
  Info,
  ChevronRight,
  Target,
  Zap,
  ShieldCheck,
  TrendingUp,
  Grid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

// Types based on the API response
interface Persona {
  id: number;
  name: string;
  description: string;
  stats: Record<string, number>;
}

interface ClusterPoint {
  pca_1: number;
  pca_2: number;
  cluster: number;
  anomaly_score: number;
}

interface CorrelationData {
  columns: string[];
  values: number[][];
}

interface UnsupervisedData {
  stats: Record<string, any>;
  correlation: CorrelationData;
  clusters: ClusterPoint[];
  personas: Persona[];
  summary: {
    total_count: number;
    anomaly_count: number;
    cluster_counts: Record<string, number>;
  };
}

/* ── Fallback Data (used when API is unavailable) ──────────────────── */
const FALLBACK_DATA: UnsupervisedData = {
  summary: { total_count: 82, anomaly_count: 5, cluster_counts: { "0": 26, "1": 15, "2": 41 } },
  clusters: [
    { pca_1: -1.36, pca_2: 3.91, cluster: 0, anomaly_score: 1 },
    { pca_1: 1.29, pca_2: 1.03, cluster: 2, anomaly_score: 0 },
    { pca_1: -2.01, pca_2: 1.11, cluster: 0, anomaly_score: 0 },
    { pca_1: 0.13, pca_2: -1.05, cluster: 2, anomaly_score: 0 },
    { pca_1: -1.32, pca_2: 0.79, cluster: 0, anomaly_score: 0 },
    { pca_1: -0.72, pca_2: -0.60, cluster: 1, anomaly_score: 0 },
    { pca_1: 2.22, pca_2: -0.67, cluster: 2, anomaly_score: 0 },
    { pca_1: -1.10, pca_2: 1.40, cluster: 0, anomaly_score: 0 },
  ],
  personas: [
    {
      id: 0,
      name: "The Derma-Influenced Seeker",
      description: "กลุ่มลูกค้าที่ได้รับอิทธิพลจากแพทย์และผู้เชี่ยวชาญ ให้ความสำคัญกับผิวบอบบางและความสะอาดเชิงลึก",
      stats: { "deep_cleansing_score": 0.98, "sensitive_skin_score": 0.96, "eye_friendly_score": 0.86, "low_friction_score": 0.78, "acne_friendly_score": 0.73 }
    },
    {
      id: 1,
      name: "The Smart Budgeter",
      description: "กลุ่มลูกค้าที่เน้นความคุ้มค่าและราคาเป็นหลัก มักตัดสินใจจากโปรโมชั่น",
      stats: { "moisturizing_score": 0.8, "low_friction_score": 0.71, "is_price_sensitive": 0.87, "eye_friendly_score": 0.7, "oil_control_score": 0.68 }
    },
    {
      id: 2,
      name: "The All-Round Skincare Enthusiast",
      description: "กลุ่มลูกค้าที่ใส่ใจทุกด้าน มีความกังวลเรื่องผิวหลายประเด็น และต้องการผลิตภัณฑ์ที่ตอบโจทย์รอบด้าน",
      stats: { "eye_friendly_score": 0.96, "acne_friendly_score": 0.95, "oil_control_score": 0.95, "sensitive_skin_score": 0.95, "deep_cleansing_score": 0.94 }
    }
  ],
  correlation: {
    columns: ["deep_cleansing", "acne_friendly", "sensitive_skin", "moisturizing", "oil_control"],
    values: [
      [1.0, 0.27, 0.42, 0.11, -0.02],
      [0.27, 1.0, 0.29, 0.09, 0.39],
      [0.42, 0.29, 1.0, 0.05, 0.15],
      [0.11, 0.09, 0.05, 1.0, 0.37],
      [-0.02, 0.39, 0.15, 0.37, 1.0]
    ]
  },
  stats: {}
};

export default function UnsupervisedPage() {
  const [data, setData] = useState<UnsupervisedData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeTab, setActiveTab] = useState<"clusters" | "correlation" | "personas">("personas");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Priority: Env Var > Production Render > Localhost
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://kiyora-dashboard.onrender.com');
        
        const response = await fetch(`${apiUrl}/unsupervised`);
        if (!response.ok) throw new Error("API response not ok");
        const json = await response.json();
        setData(json);
        setUsingFallback(false);
      } catch (err: any) {
        console.warn("Unsupervised API failed, using fallback data:", err.message);
        setData(FALLBACK_DATA);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">กำลังวิเคราะห์ข้อมูลเชิงลึก...</p>
      </div>
    );
  }

  // No longer returning early on error, we use Fallback instead
  const COLORS = ["#f43f5e", "#10b981", "#3b82f6", "#f59e0b"];

  return (
    <div className="space-y-10 pb-20">
      {/* Fallback Notice */}
      {usingFallback && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>
            <b>ข้อมูลสถิต (Offline Mode):</b> กำลังแสดงข้อมูลตัวอย่างเนื่องจากไม่สามารถเชื่อมต่อ Server ได้ 
            (หากคุณเป็นแอดมิน กรุณาตรวจสอบการตั้งค่า Backend)
          </p>
        </div>
      )}

      {/* Header & Stats Overview */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-white">
        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
              <BarChart3 className="h-3 w-3" />
              Unsupervised Learning Mode
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">การจัดกลุ่มลูกค้า<br /><span className="text-teal-300">& วิเคราะห์ข้อมูลเชิงลึก</span></h1>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
              ค้นหาความสัมพันธ์ที่ซ่อนอยู่และแบ่งกลุ่มลูกค้า (Customer Segmentation) 
              จากพฤติกรรมจริงเพื่อสร้างกลยุทธ์ที่ตอบโจทย์แต่ละคน
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="text-teal-300 font-bold text-3xl">{data.summary.total_count}</div>
              <div className="text-slate-400 text-xs font-bold uppercase mt-1">จำนวนข้อมูลทั้งหมด</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="text-indigo-400 font-bold text-3xl">{data.summary.anomaly_count}</div>
              <div className="text-slate-400 text-xs font-bold uppercase mt-1">ข้อมูลผิดปกติ (Anomalies)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Control */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: "personas", name: "Customer Personas", icon: Users },
          { id: "clusters", name: "Clustering Visualization", icon: Target },
          { id: "correlation", name: "Behavior Correlation", icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === tab.id 
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200" 
              : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "personas" && (
          <motion.div
            key="personas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {data.personas.map((persona, idx) => (
              <div 
                key={persona.id}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Fingerprint className="h-20 w-20" />
                </div>
                
                <div 
                  className="w-16 h-16 rounded-3xl mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS[idx % COLORS.length]}20`, color: COLORS[idx % COLORS.length] }}
                >
                  <Users className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{persona.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">{persona.description}</p>
                
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">คุณลักษณะหลัก</div>
                  {Object.entries(persona.stats).filter(([_, v]) => v > 0.5).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600">{k.replace(/_/g, ' ')}</span>
                        <span className="text-slate-400">{(v * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 delay-300"
                          style={{ 
                            width: `${v * 100}%`, 
                            backgroundColor: COLORS[idx % COLORS.length] 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400 uppercase">ขนาดกลุ่ม</div>
                  <div className="px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-slate-600">
                    {data.summary.cluster_counts[persona.id] || 0} คน
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "clusters" && (
          <motion.div
            key="clusters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Cluster Visualization (PCA)</h3>
                  <p className="text-slate-400 text-sm mt-1">การกระจายตัวของลูกค้าในรูปแบบ 2 มิติ (Principal Component Analysis)</p>
                </div>
                <div className="flex gap-4">
                  {data.personas.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-bold text-slate-500">{p.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-800" />
                    <span className="text-xs font-bold text-slate-500">Anomaly</span>
                  </div>
                </div>
              </div>

              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="pca_1" name="PC1" hide />
                    <YAxis type="number" dataKey="pca_2" name="PC2" hide />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const p = payload[0].payload as ClusterPoint;
                          const persona = data.personas.find(per => per.id === p.cluster);
                          return (
                            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100">
                              <p className="text-sm font-bold text-slate-800">{persona?.name || `Segment ${p.cluster}`}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                Cluster: {p.cluster} | {p.anomaly_score ? "⚠️ Anomaly Detected" : "Normal Response"}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Customers" data={data.clusters}>
                      {data.clusters.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.anomaly_score ? "#991b1b" : COLORS[entry.cluster % COLORS.length]} 
                          opacity={entry.anomaly_score ? 1 : 0.7}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-teal-50 border border-teal-100 p-8 rounded-[2.5rem] flex gap-6 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <Info className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <h4 className="font-bold text-teal-800 mb-2">เข้าใจผลลัพธ์ของ PCA</h4>
                <p className="text-teal-700/70 text-sm leading-relaxed">
                  PCA ช่วยลดมิติของข้อมูลจากหลายสิบตัวแปรให้เหลือเพียง 2 แกนที่สำคัญที่สุด 
                  เพื่อให้เราเห็นการเกาะกลุ่ม (Clustering) ของลูกค้าได้ด้วยตาเปล่า 
                  จุดที่อยู่ใกล้กันหมายถึงลูกค้าที่มีพฤติกรรมและทัศนคติคล้ายคลึงกัน
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "correlation" && (
          <motion.div
            key="correlation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-x-auto">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-800">Behavior Correlation Matrix</h3>
                <p className="text-slate-400 text-sm mt-1">วิเคราะห์ความสัมพันธ์ของแต่ละปัจจัย (+1 คือแปรผันตามกัน, -1 คือแปรผกผันกัน)</p>
              </div>

              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="flex border-b border-slate-50">
                  <div className="w-48 shrink-0 bg-slate-50/50 p-4" />
                  {data.correlation.columns.map(col => (
                    <div key={col} className="flex-1 p-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center rotate-45 h-20 flex items-end justify-center">
                      {col.replace(/_score|_count/g, '')}
                    </div>
                  ))}
                </div>

                {/* Heatmap Body */}
                {data.correlation.columns.map((row, i) => (
                  <div key={row} className="flex border-b border-slate-50 last:border-0">
                    <div className="w-48 shrink-0 bg-slate-50/50 p-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center">
                      {row.replace(/_score|_count/g, '')}
                    </div>
                    {data.correlation.values[i].map((val, j) => {
                      // Color scaling
                      const absVal = Math.abs(val);
                      const isPos = val > 0;
                      const opacity = absVal * 0.8 + 0.1;
                      const bg = isPos ? `rgba(16, 185, 129, ${opacity})` : `rgba(244, 63, 94, ${opacity})`;
                      
                      return (
                        <div 
                          key={`${i}-${j}`} 
                          className="flex-1 p-2 text-[10px] font-bold flex items-center justify-center min-h-[50px] transition-all hover:scale-110 cursor-default"
                          style={{ backgroundColor: bg, color: absVal > 0.4 ? 'white' : 'inherit' }}
                          title={`${row} vs ${data.correlation.columns[j]}: ${val}`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
