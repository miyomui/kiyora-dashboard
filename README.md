# Kiyora Brand Analysis & Dashboard

ระบบวิเคราะห์ข้อมูลและแดชบอร์ดอัจฉริยะสำหรับแบรนด์ **Kiyora** พัฒนาด้วย Machine Learning เพื่อช่วยทำนายพฤติกรรมลูกค้าและให้ข้อมูลเชิงลึกทางธุรกิจ ในรูปแบบที่สวยงาม ทันสมัย และใช้งานง่าย (Pastel Thai Edition)

## 🌟 ฟีเจอร์หลัก (Key Features)

- **หน้าหลัก (Home)**: แนะนำระบบ ข้อมูลทีมผู้พัฒนา และโครงสร้างสถาปัตยกรรมของระบบ
- **การทำนายผล (Supervised Learning)**: ระบบทำนายว่าผู้ใช้งานมีโอกาสเป็นลูกค้าของแบรนด์ Kiyora หรือไม่ โดยวิเคราะห์จากสภาพผิว พฤติกรรมการซื้อ และปัจจัยอื่นๆ
- **การจัดกลุ่มลูกค้า (Unsupervised Learning)**: ระบบแบ่งกลุ่มลูกค้า (Customer Segmentation) เพื่อช่วยให้แบรนด์เข้าใจกลุ่มเป้าหมายได้ชัดเจนขึ้น
- **ข้อมูลเชิงลึก (Business Insights)**: วิเคราะห์แนวโน้มตลาดและความรู้สึกของผู้บริโภค พร้อมข้อเสนอแนะเชิงกลยุทธ์จาก AI

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend API**: FastAPI (Python)
- **Machine Learning**: Scikit-learn (Logistic Regression)
- **Design**: Minimal Pastel Theme with Kanit Font

## 🚀 การติดตั้งและใช้งาน (Setup & Usage)

### 1. การเตรียมระบบ Backend (API)
1. ติดตั้ง Library ที่จำเป็น:
   ```bash
   pip install -r requirements.txt
   ```
2. รัน API Server:
   ```bash
   uvicorn api.main:app --reload --port 8001
   ```

### 2. การเตรียมระบบ Frontend (Dashboard)
1. เข้าไปที่โฟลเดอร์แดชบอร์ด:
   ```bash
   cd frontend/kiyora-dashboard
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. รันหน้าเว็บ (Development Mode):
   ```bash
   npm run dev
   ```
4. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

- `api/`: ระบบ Backend สำหรับประมวลผลโมเดล
- `frontend/kiyora-dashboard/`: โค้ดส่วนหน้าจอแดชบอร์ด (Next.js)
- `models/`: ไฟล์โมเดลที่ฝึกสอนแล้ว (`.pkl`)
- `src/`: โค้ดหลักสำหรับการประมวลผลข้อมูลและโมเดล
- `data/`: ข้อมูลที่ใช้ในโปรเจกต์
- `notebook/`: Jupyter Notebook สำหรับการวิเคราะห์ข้อมูลเบื้องต้น

---
**พัฒนาโดย**: ทีม Kiyora Analysis
