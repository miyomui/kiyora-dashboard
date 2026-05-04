## **Data Dictionary**

ตารางนี้อธิบายแต่ละคอลัมน์ใน DataFrame `df` หลังจากผ่านกระบวนการทำความสะอาดข้อมูล (Data Cleaning) และการสร้างคุณสมบัติ (Feature Engineering) แล้ว:

### **1. ข้อมูลส่วนบุคคล (Demographic & Background)**

*   **`timestamp`**: (Object) เวลาที่ผู้ตอบแบบสอบถามทำรายการ
*   **`gender`**: (Object, encoded to Int) เพศของผู้ตอบแบบสอบถาม (`male`, `female`)
    *   *หมายเหตุ:* ในคอลัมน์ `gender` ที่ถูกเข้ารหัส (`gender` ในส่วน Encoding) จะเป็น `1` สำหรับ `male` และ `0` สำหรับ `female`
*   **`age`**: (Object) ช่วงอายุของผู้ตอบแบบสอบถาม (เช่น `23-28 ปี`)
*   **`occupation`**: (Object) อาชีพของผู้ตอบแบบสอบถาม (เช่น `พนักงานบริษัทเอกชน`)
*   **`monthly_income`**: (Object) รายได้ต่อเดือนของผู้ตอบแบบสอบถาม (เช่น `35,000 - 39,999 บาท`)
*   **`province`**: (Object) จังหวัดที่อยู่อาศัย (เช่น `bangkok`, `นนทบุรี`)

### **2. ข้อมูลเกี่ยวกับผิว (Skin-related)**

*   **`skin_type`**: (Object) ประเภทผิวเดิมที่ผู้ตอบแบบสอบถามเลือก
*   **`skin_type_clean`**: (Object) ประเภทผิวที่ถูกจัดรูปแบบให้เป็นมาตรฐาน (เช่น `oily`, `dry`, `combination`, `normal`, `unknown`)
*   **`skin_type_encoded`**: (Int) ประเภทผิวที่ถูกเข้ารหัสเป็นตัวเลข:
    *   `0` = `unknown`
    *   `1` = `oily`
    *   `2` = `dry`
    *   `3` = `combination`
    *   `4` = `normal`
*   **`skin_concerns`**: (Object) ความกังวล/ปัญหาผิวของผู้ตอบแบบสอบถาม (คำตอบปลายเปิด)
*   **`acne_severity`**: (Object) ระดับความรุนแรงของสิว (เช่น `ไม่มีสิว`, `สิวเล็กน้อย`, `สิวปานกลาง`, `สิวรุนแรง`)

### **3. คุณสมบัติที่สร้างจากความกังวลเกี่ยวกับผิว (Engineered Skin Concerns Features)**

*   **`acne`**: (Int) Binary (0 หรือ 1) มีความกังวลเรื่องสิวหรือไม่ (1=มี)
*   **`oily`**: (Int) Binary (0 หรือ 1) มีความกังวลเรื่องผิวมันหรือไม่ (1=มี)
*   **`sensitive`**: (Int) Binary (0 หรือ 1) มีความกังวลเรื่องผิวแพ้ง่ายหรือไม่ (1=มี)
*   **`pore`**: (Int) Binary (0 หรือ 1) มีความกังวลเรื่องรูขุมขนหรือไม่ (1=มี)
*   **`dull`**: (Int) Binary (0 หรือ 1) มีความกังวลเรื่องผิวหมองคล้ำหรือไม่ (1=มี)
*   **`dry`**: (Int) Binary (0 หรือ 1) มีความกังวลเรื่องผิวแห้งหรือไม่ (1=มี)
*   **`concern_count`**: (Int) จำนวนความกังวลเรื่องผิวทั้งหมด (รวม `acne`, `oily`, `sensitive`, `pore`, `dull`, `dry`)
*   **`acne_score`**: (Int) คะแนนความรุนแรงของสิว (0=ไม่มี, 1=เล็กน้อย, 2=ปานกลาง, 3=รุนแรง)

### **4. ข้อมูลเกี่ยวกับการเลือกคลีนซิ่ง (Cleansing Selection Related)**

*   **`influencer_source`**: (Object) แหล่งที่มาของอิทธิพลในการเลือกสกินแคร์ (คำตอบปลายเปิด)
*   **`skincare_selection`**: (Object) วิธีการเลือกสกินแคร์สำหรับผิวหน้า (คำตอบปลายเปิด)
*   **`cleansing_selection`**: (Object) วิธีการเลือกคลีนซิ่ง (คำตอบปลายเปิด)
*   **`use_cleansing_water`**: (Object) ใช้คลีนซิ่งแบบน้ำหรือไม่ (เช่น `ใช่`, `ไม่`)
*   **`cleansing_types_used`**: (Object) ประเภทคลีนซิ่งที่ใช้ในปัจจุบัน (คำตอบปลายเปิด)
*   **`main_cleansing_type`**: (Object) ประเภทคลีนซิ่งที่ใช้มากที่สุด (เลือกคำตอบเดียว)
*   **`cleansing_formula`**: (Object) สูตรคลีนซิ่งแบบน้ำที่ใช้ (คำตอบปลายเปิด)

### **5. คุณสมบัติที่สร้างจากปัจจัยภายนอก (Engineered External Factors)**

*   **`price_sensitive`**: (Int) Binary (0 หรือ 1) มีความอ่อนไหวต่อราคาหรือไม่ (1=มี)
*   **`promo_sensitive`**: (Int) Binary (0 หรือ 1) มีความอ่อนไหวต่อโปรโมชั่นหรือไม่ (1=มี)
*   **`doctor_influence`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากแพทย์ผิวหนังหรือไม่ (จาก `switching_factors`)
*   **`review_influence`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากการรีวิวหรือไม่ (จาก `switching_factors`)
*   **`blogger_influence`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากบล็อกเกอร์หรือไม่ (จาก `switching_factors`)
*   **`ads_influence`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากโฆษณาหรือไม่ (จาก `switching_factors`)
*   **`self_decision`**: (Int) Binary (0 หรือ 1) การตัดสินใจด้วยตนเอง (จาก `influencer_source`)
*   **`friend_influence`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากเพื่อน (จาก `influencer_source`)
*   **`doctor_influence2`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากหมอ (จาก `influencer_source`)
*   **`influencer_influence`**: (Int) Binary (0 หรือ 1) ได้รับอิทธิพลจากบล็อกเกอร์/อินฟลูเอนเซอร์ (จาก `influencer_source`)
*   **`influence_score`**: (Int) คะแนนรวมของอิทธิพลภายนอก (`doctor_influence2` + `friend_influence` + `influencer_influence`)
*   **`is_price_sensitive`**: (Int) คะแนนรวมความอ่อนไหวต่อราคา/โปรโมชั่น (`price_sensitive` + `promo_sensitive`)

### **6. คุณสมบัติที่สร้างจากแบรนด์และประเภทคลีนซิ่งที่ใช้ (Engineered Brand & Cleansing Type Features)**

*   **`brands_used`**: (Object) แบรนด์คลีนซิ่งที่ใช้ในปัจจุบัน (คำตอบปลายเปิด)
*   **`main_brand`**: (Object) แบรนด์คลีนซิ่งที่ใช้บ่อยที่สุด (เลือกคำตอบเดียว)
*   **`use_kiyora`**: (Int) Binary (0 หรือ 1) ใช้แบรนด์ Kiyora อยู่หรือไม่
*   **`use_dermavie`**: (Int) Binary (0 หรือ 1) ใช้แบรนด์ Dermavie อยู่หรือไม่
*   **`use_veloura`**: (Int) Binary (0 หรือ 1) ใช้แบรนด์ Veloura อยู่หรือไม่
*   **`use_florelle`**: (Int) Binary (0 หรือ 1) ใช้แบรนด์ Florelle อยู่หรือไม่
*   **`use_water`**: (Int) Binary (0 หรือ 1) ใช้คลีนซิ่งแบบน้ำหรือไม่
*   **`use_oil`**: (Int) Binary (0 หรือ 1) ใช้คลีนซิ่งแบบออยล์หรือไม่
*   **`use_balm`**: (Int) Binary (0 หรือ 1) ใช้คลีนซิ่งแบบบาล์มหรือไม่
*   **`use_sheet`**: (Int) Binary (0 หรือ 1) ใช้คลีนซิ่งแบบแผ่นหรือไม่
*   **`use_milk`**: (Int) Binary (0 หรือ 1) ใช้คลีนซิ่งแบบมิลค์หรือไม่
*   **`cleansing_variety`**: (Int) จำนวนประเภทคลีนซิ่งที่ใช้

### **7. คะแนน Likert Scale (Scaled)**

ทุกคอลัมน์ด้านล่างนี้เป็นคะแนนความสำคัญ (5=มีผลต่อการพิจารณามากที่สุด) ที่ถูกแปลงเป็นตัวเลข (Numeric) และปรับขนาด (Scaled) ระหว่าง 0-1 ด้วย `MinMaxScaler`:

*   **`deep_cleansing_score`**: (Float) คะแนนความสำคัญของการเช็ดเมคอัพสะอาดหมดจด
*   **`acne_friendly_score`**: (Float) คะแนนความสำคัญของการช่วยลดสิว/ไม่ก่อให้เกิดสิวใหม่
*   **`sensitive_skin_score`**: (Float) คะแนนความสำคัญของความอ่อนโยนต่อผิวแพ้ง่าย
*   **`no_irritant_score`**: (Float) คะแนนความสำคัญของการไม่มีสารก่อการแพ้ (เช่น แอลกอฮอล์, น้ำหอม, สี)
*   **`hypoallergenic_score`**: (Float) คะแนนความสำคัญของการผ่านการทดสอบทางการแพทย์
*   **`moisturizing_score`**: (Float) คะแนนความสำคัญของการเช็ดแล้วชุ่มชื้น ผิวไม่แห้งตึง
*   **`low_friction_score`**: (Float) คะแนนความสำคัญของการลดแรงเสียดสีของสำลีกับใบหน้า
*   **`nourishment_score`**: (Float) คะแนนความสำคัญของการมีสารบำรุงในตัว
*   **`eye_friendly_score`**: (Float) คะแนนความสำคัญของการเช็ดรอบดวงตาได้ไม่แสบตา
*   **`oil_control_score`**: (Float) คะแนนความสำคัญของการช่วยลด/ควบคุมความมัน

### **8. ตัวแปรเป้าหมาย (Target Variable)**

*   **`target_kiyora`**: (Int) Binary (0 หรือ 1) ตัวแปรเป้าหมายว่าผู้ใช้ใช้แบรนด์ Kiyora เป็นหลักหรือไม่ (1 = Kiyora, 0 = Other brands)
