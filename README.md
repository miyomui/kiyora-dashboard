# Kiyora Brand Analysis — AI-Driven Marketing System

ระบบวิเคราะห์การตลาดอัจฉริยะสำหรับแบรนด์ **Kiyora** พัฒนาด้วยเทคนิค Machine Learning ครบวงจร (End-to-End AI System) ตามข้อกำหนดโครงการ AIE 322, 323, 324, 325

### 🔗 Live Links
- **Website:** [https://kiyora-dashboard.vercel.app](https://kiyora-dashboard.vercel.app)
- **API (Backend):** [https://kiyora-dashboard.onrender.com](https://kiyora-dashboard.onrender.com)
- **GitHub Repository:** [https://github.com/miyomui/kiyora-dashboard](https://github.com/miyomui/kiyora-dashboard)

---

## 🌟 ฟีเจอร์หลัก

| หน้า | คำอธิบาย |
|---|---|
| **Home** | แนะนำระบบ, System Architecture Diagram, ทีมผู้พัฒนา |
| **Supervised Learning** | ทำนายว่าลูกค้าจะเลือกใช้ Kiyora หรือไม่ + เปรียบเทียบ 5 โมเดล |
| **Unsupervised Learning** | K-Means Clustering แบ่ง Customer Persona 3 กลุ่ม + PCA Visualization |
| **Business Insights** | Demographic Profile (เพศ/อายุ/รายได้/ผิว/จังหวัด/อาชีพ) + Dashboard 4 กราฟ (Brand Market Share, Skin Concerns, Cleansing Types, Feature Importance) จากข้อมูลจริง |

---

## 🛠️ Tech Stack

**Backend**
- Python 3.x
- FastAPI + Uvicorn
- Scikit-learn (Logistic Regression, SVM, Random Forest, Decision Tree, KNN)
- Pandas, Joblib

**Frontend**
- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- Lucide React

**Deployment**
- Backend: [Render](https://render.com)
- Frontend: [Vercel](https://vercel.com)

---

## 📂 โครงสร้างโปรเจกต์

```text
├── api/
│   └── main.py                    # FastAPI endpoints
├── frontend/
│   └── kiyora-dashboard/          # Next.js Web Application (React + Recharts)
├── src/
│   ├── database.py                # SQLite Persistence Layer
│   ├── supervised_train.py        # ฝึกสอนโมเดลทั้ง 5 ตัว
│   ├── supervised_evaluate.py     # เปรียบเทียบประสิทธิภาพโมเดล
│   ├── model_comparison.py        # ฟังก์ชันสำหรับ /model-comparison API
│   ├── predict.py                 # ฟังก์ชันทำนายผล (ใช้กับ API)
│   ├── process_data.py            # เตรียมและทำความสะอาดข้อมูล
│   └── unsupervised_analysis.py   # Clustering + PCA (Comparative Persona Analysis)
├── models/
│   ├── logistic_regression.pkl    # โมเดลหลัก (Recall สูงสุด)
│   └── ...
├── data/
│   ├── clean.csv                  # ข้อมูลแบบสอบถามจริง (82 respondents)
│   └── kiyora_logs.db             # ฐานข้อมูลเก็บประวัติการทำนาย
├── requirements.txt
└── README.md
```

---

## 🚀 วิธีรันในเครื่อง

### 1. Backend (FastAPI)

```bash
# ติดตั้ง dependencies
pip install -r requirements.txt

# (ถ้ายังไม่มีไฟล์โมเดล) ฝึกสอนโมเดลก่อน
python src/supervised_train.py

# รัน API server ที่ port 8000
uvicorn api.main:app --reload --port 8000
```

### 2. Frontend (Next.js)

```bash
cd frontend/kiyora-dashboard

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env.local และกำหนด API URL
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local

# รันในโหมด Development
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

---

## 🤖 ML Pipeline

```
clean.csv
    ↓  Train/Test Split (80/20, stratified)
    ↓  supervised_train.py
    ├── logistic_regression.pkl  ← โมเดลหลัก (Recall สูงสุดสำหรับ Imbalanced Data)
    ├── svm.pkl
    ├── random_forest.pkl
    ├── decision_tree.pkl
    └── knn.pkl
         ↓  supervised_evaluate.py
         └── ตารางเปรียบเทียบ Accuracy / Precision / Recall / F1
```

### เหตุผลในการเลือก Logistic Regression

ข้อมูลมีความไม่สมดุล (Class 0: 72 ตัวอย่าง vs Class 1: 10 ตัวอย่าง) จึงใช้ `class_weight="balanced"` และเลือกโมเดลที่ให้ค่า **Recall สูงสุด** เพื่อไม่พลาดลูกค้ากลุ่มเป้าหมาย

---

## 📡 API Endpoints

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/predict` | ทำนายว่าลูกค้าจะเลือก Kiyora |
| `GET` | `/model-comparison` | ผลเปรียบเทียบโมเดลทั้ง 5 ตัว (จาก .pkl จริง) |
| `GET` | `/unsupervised` | ผล Clustering + PCA + Anomaly Detection |
| `GET` | `/insights` | Demographic Profile + Business Dashboard (ข้อมูลจริง) |

---


## 👥 ทีมผู้พัฒนา

| ชื่อ | บทบาท |
|---|---|
| เจ | Machine Learning Engineer / Backend Developer |
| แพท | Business Analyst / Data Engineer |
| เนย | Frontend / Dashboard Developer |

---

**Project**: AIE 322, 323, 324, 325 — AI-Driven Marketing Campaign System  
**University**: Bangkok University
