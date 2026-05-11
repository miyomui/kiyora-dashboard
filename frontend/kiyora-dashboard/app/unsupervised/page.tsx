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
  strategy?: string;
  top_features?: Record<string, number>;
  stats: Record<string, number>;
}

interface ClusterPoint {
  tsne_1: number;
  tsne_2: number;
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
  evaluation_metrics?: {
    kmeans_inertia: number;
    kmeans_silhouette: number;
    pca_explained_variance: number[];
  };
  summary: {
    total_count: number;
    anomaly_count: number;
    cluster_counts: Record<string, number>;
  };
}

/* ── Fallback Data (used when API is unavailable) ──────────────────── */
const FALLBACK_DATA: UnsupervisedData = {
  "stats": {
    "deep_cleansing_score": {
      "count": 82.0,
      "mean": 0.9,
      "std": 0.23,
      "min": 0.0,
      "25%": 1.0,
      "50%": 1.0,
      "75%": 1.0,
      "max": 1.0
    },
    "acne_friendly_score": {
      "count": 82.0,
      "mean": 0.83,
      "std": 0.25,
      "min": 0.0,
      "25%": 0.75,
      "50%": 1.0,
      "75%": 1.0,
      "max": 1.0
    },
    "sensitive_skin_score": {
      "count": 82.0,
      "mean": 0.85,
      "std": 0.29,
      "min": 0.0,
      "25%": 1.0,
      "50%": 1.0,
      "75%": 1.0,
      "max": 1.0
    },
    "moisturizing_score": {
      "count": 82.0,
      "mean": 0.78,
      "std": 0.29,
      "min": 0.0,
      "25%": 0.5,
      "50%": 1.0,
      "75%": 1.0,
      "max": 1.0
    },
    "oil_control_score": {
      "count": 82.0,
      "mean": 0.77,
      "std": 0.25,
      "min": 0.0,
      "25%": 0.5,
      "50%": 0.75,
      "75%": 1.0,
      "max": 1.0
    }
  },
  "correlation": {
    "columns": [
      "deep_cleansing_score",
      "acne_friendly_score",
      "sensitive_skin_score",
      "moisturizing_score",
      "oil_control_score"
    ],
    "values": [
      [
        1.0,
        0.27,
        0.42,
        0.11,
        -0.02
      ],
      [
        0.27,
        1.0,
        0.29,
        0.09,
        0.39
      ],
      [
        0.42,
        0.29,
        1.0,
        0.05,
        0.15
      ],
      [
        0.11,
        0.09,
        0.05,
        1.0,
        0.37
      ],
      [
        -0.02,
        0.39,
        0.15,
        0.37,
        1.0
      ]
    ]
  },
  "clusters": [
    {
      "tsne_1": -0.5765107139014658,
      "tsne_2": -2.3987653052872946,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.008802041152548318,
      "tsne_2": -1.5329512173746875,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.18202265835963893,
      "tsne_2": 0.6244441380062435,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.0838636288043368,
      "tsne_2": -0.9685567686177784,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.18202265835963893,
      "tsne_2": 0.6244441380062435,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.9914700569807374,
      "tsne_2": -2.096415003638866,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -2.0103557894517863,
      "tsne_2": -1.2292049219871632,
      "cluster": 2,
      "anomaly_score": 1
    },
    {
      "tsne_1": 1.0127098456845696,
      "tsne_2": -0.1032080119515367,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.6358258724478393,
      "tsne_2": 1.1883732555167872,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.3683540302174677,
      "tsne_2": -0.8048337361705419,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.445001172935652,
      "tsne_2": -0.9690220998641437,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.8988043870238523,
      "tsne_2": -0.40509298235359986,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.0127098456845696,
      "tsne_2": -0.1032080119515367,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.1775293307052803,
      "tsne_2": 1.3525616192103889,
      "cluster": 1,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.4829160634446517,
      "tsne_2": 0.13445315254958698,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.5376668428925371,
      "tsne_2": -1.5324858861283222,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.5376668428925371,
      "tsne_2": -1.5324858861283222,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.8988043870238523,
      "tsne_2": -0.40509298235359986,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.4267402082639122,
      "tsne_2": 0.43726878544438047,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.8972188319574566,
      "tsne_2": -0.8043684049241767,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.5953964463725148,
      "tsne_2": -1.5315552236355918,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.4988229718836084,
      "tsne_2": -0.6662064669693499,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.029112849356451396,
      "tsne_2": 0.6983822700601308,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -2.634311368825573,
      "tsne_2": 2.456502202870485,
      "cluster": 1,
      "anomaly_score": 1
    },
    {
      "tsne_1": 0.8988043870238523,
      "tsne_2": -0.40509298235359986,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -4.5837404920429945,
      "tsne_2": 2.1302342498610645,
      "cluster": 1,
      "anomaly_score": 1
    },
    {
      "tsne_1": -1.8424680525095711,
      "tsne_2": 0.8625706337537323,
      "cluster": 1,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.08479260930426577,
      "tsne_2": 1.000267240462194,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.445001172935652,
      "tsne_2": -0.9690220998641437,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.0127098456845696,
      "tsne_2": -0.1032080119515367,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.5589066315963692,
      "tsne_2": -0.6671371294620805,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.5579776510964403,
      "tsne_2": 0.6988476013064959,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.8036241815006422,
      "tsne_2": 1.7288500529127044,
      "cluster": 1,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.5765107139014658,
      "tsne_2": -2.3987653052872946,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.859800036681382,
      "tsne_2": 1.426034420017911,
      "cluster": 1,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.1027493612753856,
      "tsne_2": -0.10134668696607566,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -4.752396730151597,
      "tsne_2": 0.1614102407810923,
      "cluster": 1,
      "anomaly_score": 1
    },
    {
      "tsne_1": 0.48384504394458067,
      "tsne_2": -0.10274268070517142,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -2.3510220460456566,
      "tsne_2": -1.3682975224347207,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.5765107139014658,
      "tsne_2": -2.3987653052872946,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.5385958233924661,
      "tsne_2": 1.5641963579727376,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.2544485715567504,
      "tsne_2": -0.5029487657684787,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.445001172935652,
      "tsne_2": -0.9690220998641437,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.937648258032781,
      "tsne_2": 0.46118643680537236,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.1775293307052803,
      "tsne_2": 1.3525616192103889,
      "cluster": 1,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.465584079272841,
      "tsne_2": -0.4290106337145917,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.916408469328949,
      "tsne_2": -2.660809452395775,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": -1.066531644632526,
      "tsne_2": -1.532020554881957,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.18202265835963893,
      "tsne_2": 0.6244441380062435,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.1589252164561253,
      "tsne_2": -0.4041623198608694,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.4087834562927922,
      "tsne_2": 0.4616517680517376,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.0127098456845696,
      "tsne_2": -0.1032080119515367,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.0681171996989218,
      "tsne_2": 0.32255916760418035,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.030041829856380348,
      "tsne_2": -0.6666717982157152,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.030041829856380348,
      "tsne_2": -0.6666717982157152,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.0127098456845696,
      "tsne_2": -0.1032080119515367,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.1589252164561253,
      "tsne_2": -0.4041623198608694,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.937648258032781,
      "tsne_2": 0.46118643680537236,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -2.8066030055327347,
      "tsne_2": 3.3967197540833443,
      "cluster": 1,
      "anomaly_score": 1
    },
    {
      "tsne_1": 0.445001172935652,
      "tsne_2": -0.9690220998641437,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 0.030041829856380348,
      "tsne_2": -0.6666717982157152,
      "cluster": 2,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": -0.29209136393246443,
      "tsne_2": 2.291848507930518,
      "cluster": 1,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    },
    {
      "tsne_1": 1.4665130597727698,
      "tsne_2": 0.4607211055590071,
      "cluster": 0,
      "anomaly_score": 0
    }
  ],
  "personas": [
    {
      "id": 0,
      "name": "The Acne-Focused Seeker",
      "description": "กลุ่มลูกค้าที่กังวลเรื่องสิวเป็นหลัก ให้ความสำคัญกับความสะอาดและการผ่านการทดสอบทางการแพทย์",
      "strategy": "ยิง Ads เจาะกลุ่มคนเป็นสิว โดยนำเสนอผลลัพธ์ Before/After ที่เน้นเรื่องสิวลดลงหรือสิวไม่ขึ้นเพิ่ม",
      "top_features": {
        "acne_friendly_score": 0.97,
        "deep_cleansing_score": 0.95,
        "sensitive_skin_score": 0.95,
        "eye_friendly_score": 0.93
      },
      "stats": {
        "deep_cleansing_score": 0.95,
        "acne_friendly_score": 0.97,
        "sensitive_skin_score": 0.95,
        "no_irritant_score": 0.82,
        "hypoallergenic_score": 0.89,
        "moisturizing_score": 0.88,
        "low_friction_score": 0.87,
        "nourishment_score": 0.8,
        "eye_friendly_score": 0.93,
        "oil_control_score": 0.91,
        "acne_score": 1.17,
        "influence_score": 1.06,
        "is_price_sensitive": 0.7,
        "concern_count": 3.0
      }
    },
    {
      "id": 1,
      "name": "The Smart Budgeter",
      "description": "กลุ่มลูกค้าที่เน้นความคุ้มค่าและราคาเป็นหลัก มักตัดสินใจจากโปรโมชั่น",
      "strategy": "จัดแคมเปญโปรโมชั่น ลดแลกแจกแถม หรือทำ Bundle Set เพื่อดึงดูดการซื้อซ้ำ",
      "top_features": {
        "oil_control_score": 0.78,
        "eye_friendly_score": 0.78,
        "moisturizing_score": 0.75,
        "low_friction_score": 0.73
      },
      "stats": {
        "deep_cleansing_score": 0.5,
        "acne_friendly_score": 0.62,
        "sensitive_skin_score": 0.25,
        "no_irritant_score": 0.7,
        "hypoallergenic_score": 0.7,
        "moisturizing_score": 0.75,
        "low_friction_score": 0.73,
        "nourishment_score": 0.67,
        "eye_friendly_score": 0.78,
        "oil_control_score": 0.78,
        "acne_score": 1.25,
        "influence_score": 0.8,
        "is_price_sensitive": 0.8,
        "concern_count": 3.0
      }
    },
    {
      "id": 2,
      "name": "The Derma-Influenced Seeker",
      "description": "กลุ่มลูกค้าที่ได้รับอิทธิพลจากแพทย์และผู้เชี่ยวชาญ ให้ความสำคัญกับผิวบอบบางและความสะอาดเชิงลึก",
      "strategy": "เน้นการโฆษณาที่ใช้ผู้เชี่ยวชาญทางผิวหนัง (Dermatologist) ยืนยันผลลัพธ์และความปลอดภัย",
      "top_features": {
        "deep_cleansing_score": 0.96,
        "sensitive_skin_score": 0.92,
        "eye_friendly_score": 0.83,
        "low_friction_score": 0.79
      },
      "stats": {
        "deep_cleansing_score": 0.96,
        "acne_friendly_score": 0.65,
        "sensitive_skin_score": 0.92,
        "no_irritant_score": 0.7,
        "hypoallergenic_score": 0.68,
        "moisturizing_score": 0.6,
        "low_friction_score": 0.79,
        "nourishment_score": 0.43,
        "eye_friendly_score": 0.83,
        "oil_control_score": 0.5,
        "acne_score": 1.33,
        "influence_score": 1.16,
        "is_price_sensitive": 0.6,
        "concern_count": 2.76
      }
    }
  ],
  "evaluation_metrics": {
    "kmeans_inertia": 231.16,
    "kmeans_silhouette": 0.3466,
    "pca_explained_variance": [
      0.3738,
      0.2498
    ]
  },
  "summary": {
    "total_count": 82,
    "anomaly_count": 5,
    "cluster_counts": {
      "0": 47,
      "2": 25,
      "1": 10
    }
  }
};

export default function UnsupervisedPage() {
  const [data, setData] = useState<UnsupervisedData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeTab, setActiveTab] = useState<"clusters" | "correlation" | "personas" | "stats">("personas");

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
          { id: "stats", name: "Descriptive Stats & Metrics", icon: Grid },
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
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{persona.description}</p>
                
                {persona.strategy && (
                  <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-700 uppercase">Strategic Recommendation</span>
                    </div>
                    <p className="text-indigo-800 text-sm font-medium">{persona.strategy}</p>
                  </div>
                )}
                
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
                  <h3 className="text-2xl font-bold text-slate-800">Cluster Visualization (t-SNE)</h3>
                  <p className="text-slate-400 text-sm mt-1">การกระจายตัวของลูกค้าในรูปแบบ 2 มิติ (t-Distributed Stochastic Neighbor Embedding)</p>
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
                    <XAxis type="number" dataKey="tsne_1" name="t-SNE 1" hide />
                    <YAxis type="number" dataKey="tsne_2" name="t-SNE 2" hide />
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
                <h4 className="font-bold text-teal-800 mb-2">เข้าใจผลลัพธ์ของ t-SNE</h4>
                <p className="text-teal-700/70 text-sm leading-relaxed">
                  กราฟนี้ใช้เทคนิค t-SNE (t-Distributed Stochastic Neighbor Embedding) เพื่อลดมิติข้อมูลและแสดงผลเป็น 2 มิติ
                  ช่วยให้เห็นพฤติกรรมลูกค้าที่เกาะกลุ่มกัน (Clusters) ตามความคล้ายคลึงของคำตอบ
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

        {activeTab === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {data.evaluation_metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-2">K-Means Silhouette Score</div>
                  <div className="text-3xl font-bold text-indigo-600">{data.evaluation_metrics.kmeans_silhouette.toFixed(3)}</div>
                  <div className="text-xs text-slate-400 mt-2">คุณภาพการจัดกลุ่ม (เข้าใกล้ 1 ยิ่งดี)</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-2">K-Means Inertia (Elbow)</div>
                  <div className="text-3xl font-bold text-teal-600">{data.evaluation_metrics.kmeans_inertia.toFixed(2)}</div>
                  <div className="text-xs text-slate-400 mt-2">ระยะห่างภายในกลุ่ม (ค่าน้อยยิ่งดี)</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-2">t-SNE Dimensionality</div>
                  <div className="text-3xl font-bold text-rose-500">
                    2D Mapping
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Projection for visualization</div>
                </div>
              </div>
            )}

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Descriptive Statistics</h3>
                <p className="text-slate-400 text-sm mt-1">สถิติพื้นฐานของตัวแปรหลัก (ค่าเฉลี่ย, ส่วนเบี่ยงเบนมาตรฐาน)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Feature</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Mean</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Std Dev</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Min</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(data.stats).map((col) => {
                      const statsObj = data.stats[col];
                      if(typeof statsObj !== 'object') return null;
                      return (
                        <tr key={col} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-600 text-sm">{col}</td>
                          <td className="p-4 text-right text-slate-500 text-sm">{statsObj.mean?.toFixed(2) || "-"}</td>
                          <td className="p-4 text-right text-slate-500 text-sm">{statsObj.std?.toFixed(2) || "-"}</td>
                          <td className="p-4 text-right text-slate-500 text-sm">{statsObj.min?.toFixed(2) || "-"}</td>
                          <td className="p-4 text-right text-slate-500 text-sm">{statsObj.max?.toFixed(2) || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
