import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

def process_survey_data(file_path="data/raw.xlsx"):
    """
    Loads, cleans, and processes the survey data from an Excel file.

    Args:
        file_path (str): The path to the Excel file.

    Returns:
        pandas.DataFrame: The cleaned and processed DataFrame.
    """

    df = pd.read_excel(file_path, sheet_name="1")

    # ตั้ง header ใหม่
    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)

    target_col = "ปัจจุบันคุณใช้คลีนซิ่งแบรนด์ใดบ่อยที่สุด (เลือกเพียงคำตอบเดียว)"

    # สร้าง Target ใหม่ / เช็ค Missing Value / เช็คค่าซ้ำ, พิมพ์ไม่เหมือนกัน
    df["target_kiyora"] = df[target_col].apply(lambda x: 1 if x == "Kiyora" else 0)
    df = df.dropna(subset=[target_col])
    df[target_col] = df[target_col].str.strip().str.title()

    # เปลี่ยนชื่อคอลัมน์
    df = df.rename(columns={
        "Timestamp": "timestamp",
        "เพศ": "gender",
        "อายุ": "age",
        "โปรดระบุอาชีพของคุณ (อื่นๆ โปรดระบุ)": "occupation",
        "โปรดเลือกรายได้ต่อเดือนของคุณ": "monthly_income",
        "โปรดพิมพ์จังหวัดที่อยู่อาศัยของคุณ เช่น กทม. , ขอนแก่น, ชลบุรี": "province",
        "โปรดเลือกประเภทผิวของคุณ": "skin_type",
        "คุณมีความกังวล/ปัญหาผิวในเรื่องใดบ้าง (เลือกได้หลายข้อ)": "skin_concerns",
        "คุณเป็นสิวหรือไม่ เป็นสิวรุนแรงระดับใด": "acne_severity",
        "คุณปรึกษาหรือได้รับอิทธิพลจากใครในการเลือกสกินแคร์ 'สำหรับผิวหน้า' บ้าง (เลือกได้หลายคำตอบ)": "influencer_source",
        "คุณเลือกสกินแคร์ 'สำหรับผิวหน้า' อย่างไร (เลือกได้หลายข้อ)": "skincare_selection",
        "คุณเลือกคลีนซิ่ง เช่น Cleansing water, cleansing balm, cleansing oil อย่างไร (เลือกได้หลายข้อ)": "cleansing_selection",
        "คุณใช้คลีนซิ่งแบบน้ำ (Cleansing water) หรือไม่": "use_cleansing_water",
        "ปัจจุบันคุณใช้คลีนซิ่งแบบใดบ้าง (หากใช้หลายแบบ เลือกได้หลายคำตอบ)": "cleansing_types_used",
        "คุณใช้คลีนซิ่งแบบใดมากที่สุด (เลือกคำตอบเดียว)": "main_cleansing_type",
        "คุณใช้คลีนซิ่ง (Cleansing water) สูตรใด (หากใช้หลายแบบ เลือกได้หลายคำตอบ)": "cleansing_formula",

        # Likert Scale
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [เช็ดเมคอัพสะอาดหมดจด (Deep cleansing)]": "deep_cleansing_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [ช่วยลดสิว/ไม่ก่อให้เกิดสิวใหม่ (Acne-prone skin friendly)]": "acne_friendly_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [อ่อนโยนต่อผิวแพ้ง่าย (Sensitive skin friendly)]": "sensitive_skin_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [ไม่มีสารก่อการแพ้ (เช่น ไม่มีแอลกอฮอล์, ไม่มีน้ำหอม, ไม่มีสี)]": "no_irritant_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [ผ่านการทดสอบทางการแพทย์ (Hypoallergenic)]": "hypoallergenic_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [เช็ดแล้วชุ่มชื้น ผิวไม่แห้งตึง (Skin moisturized)]": "moisturizing_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [ลดแรงเสียดสีของสำลีกับใบหน้า เช็ดแล้วไม่แสบผิว (Low friction formula)]": "low_friction_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [มีสารบำรุงในตัว (Skin nourishment)]": "nourishment_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [เช็ดรอบดวงตาได้ไม่แสบตา (Eye-friendly)]": "eye_friendly_score",
        "ในการพิจารณาซื้อคลีนซิ่ง คุณพิจารณาคุณสมบัติใดบ้าง (5=มีผลต่อการพิจารณามากที่สุด) [ช่วยลด/ควบคุมความมัน (Oil control)]": "oil_control_score",

        "ปัจจัยใดบ้างที่ส่งผลต่อการเปลี่ยนหรือทดลองคลีนซิ่งใหม่ (อื่นๆ โปรดพิมพ์ระบุเหตุผลสั้นๆ)": "switching_factors",
        "ปัจจุบันคุณใช้คลีนซิ่งแบรนด์ใดอยู่บ้าง (เลือกได้หลายคำตอบ, เลือกอื่นๆ โปรดระบุ)": "brands_used",
        "ปัจจุบันคุณใช้คลีนซิ่งแบรนด์ใดบ่อยที่สุด (เลือกเพียงคำตอบเดียว)": "main_brand"
    })

    # จัดรูปแบบข้อมูลให้เหมือนกัน (Standardization)
    df["gender"] = df["gender"].replace({
        "ชาย": "male",
        "หญิง": "female"
    })
    df["province"] = df["province"].replace({
        "กทม": "bangkok",
        "กรุงเทพ": "bangkok",
        "กทม.": "bangkok",
    })
    cols_to_clean = [
        "gender", "province", "occupation",
        "skin_type", "acne_severity",
        "main_brand", "use_cleansing_water"
    ]
    for col in cols_to_clean:
        df[col] = df[col].str.strip().str.lower()

    # แปลงคำตอบปลายเปิด (Open-ended)
    df["skin_concerns"] = df["skin_concerns"].str.lower()
    df["acne"] = df["skin_concerns"].apply(lambda x: 1 if "สิว" in str(x) else 0)
    df["oily"] = df["skin_concerns"].apply(lambda x: 1 if "มัน" in str(x) else 0)
    df["sensitive"] = df["skin_concerns"].apply(lambda x: 1 if "แพ้ง่าย" in str(x) else 0)
    df["pore"] = df["skin_concerns"].apply(lambda x: 1 if "รูขุมขน" in str(x) else 0)
    df["dull"] = df["skin_concerns"].apply(lambda x: 1 if "หมอง" in str(x) else 0)
    df["dry"] = df["skin_concerns"].apply(lambda x: 1 if "แห้ง" in str(x) else 0)

    df["switching_factors"] = df["switching_factors"].str.lower()
    df["price_sensitive"] = df["switching_factors"].apply(lambda x: 1 if "ราคา" in str(x) else 0)
    df["promo_sensitive"] = df["switching_factors"].apply(lambda x: 1 if "promotion" in str(x) else 0)
    df["doctor_influence"] = df["switching_factors"].apply(lambda x: 1 if "dermatologist" in str(x) else 0)
    df["review_influence"] = df["switching_factors"].apply(lambda x: 1 if "review" in str(x) else 0)
    df["blogger_influence"] = df["switching_factors"].apply(lambda x: 1 if "blogger" in str(x) else 0)
    df["ads_influence"] = df["switching_factors"].apply(lambda x: 1 if "ads" in str(x) else 0)

    df["brands_used"] = df["brands_used"].str.lower()
    df["use_kiyora"] = df["brands_used"].apply(lambda x: 1 if "kiyora" in str(x) else 0)
    df["use_dermavie"] = df["brands_used"].apply(lambda x: 1 if "dermavie" in str(x) else 0)
    df["use_veloura"] = df["brands_used"].apply(lambda x: 1 if "veloura" in str(x) else 0)
    df["use_florelle"] = df["brands_used"].apply(lambda x: 1 if "florelle" in str(x) else 0)

    df["influencer_source"] = df["influencer_source"].str.lower()
    df["self_decision"] = df["influencer_source"].apply(lambda x: 1 if "ตนเอง" in str(x) else 0)
    df["friend_influence"] = df["influencer_source"].apply(lambda x: 1 if "เพื่อน" in str(x) else 0)
    df["doctor_influence2"] = df["influencer_source"].apply(lambda x: 1 if "หมอ" in str(x) else 0)
    df["influencer_influence"] = df["influencer_source"].apply(lambda x: 1 if "บลอกเกอร์" in str(x) else 0)

    df["cleansing_types_used"] = df["cleansing_types_used"].str.lower()
    df["use_water"] = df["cleansing_types_used"].apply(lambda x: 1 if "water" in str(x) else 0)
    df["use_oil"] = df["cleansing_types_used"].apply(lambda x: 1 if "oil" in str(x) else 0)
    df["use_balm"] = df["cleansing_types_used"].apply(lambda x: 1 if "balm" in str(x) else 0)
    df["use_sheet"] = df["cleansing_types_used"].apply(lambda x: 1 if "sheet" in str(x) else 0)
    df["use_milk"] = df["cleansing_types_used"].apply(lambda x: 1 if "milk" in str(x) else 0)

    # ตรวจสอบความสมเหตุสมผล (Logic Check)
    df = df[~(
        (df["acne_severity"].str.contains("ไม่มี", na=False)) &
        (df["acne"] == 1)
    )]
    df = df[~(
        (df["use_cleansing_water"].str.contains("ไม่", na=False)) &
        (df["use_water"] == 1)
    )]
    df = df[~(
        (df["main_brand"] == "kiyora") &
        (df["use_kiyora"] == 0)
    )]
    df = df.drop_duplicates()

    # Feature Selection (การคัดเลือกตัวแปรและการสร้างคุณลักษณะ)
    df["concern_count"] = df[["acne","oily","sensitive","pore","dull","dry"]].sum(axis=1)

    def map_acne(x):
        if "ไม่มี" in str(x):
            return 0
        elif "เล็กน้อย" in str(x):
            return 1
        elif "ปานกลาง" in str(x):
            return 2
        elif "รุนแรง" in str(x):
            return 3
        else:
            return None

    df["acne_score"] = df["acne_severity"].apply(map_acne)

    df["influence_score"] = (
        df["doctor_influence2"] +
        df["friend_influence"] +
        df["influencer_influence"]
    )

    df["is_price_sensitive"] = df["price_sensitive"] + df["promo_sensitive"]

    df["cleansing_variety"] = df[["use_water","use_oil","use_balm","use_sheet","use_milk"]].sum(axis=1)

    # Scale Transformation (ปรับ Likert Scale)
    likert_cols = [
        "deep_cleansing_score",
        "acne_friendly_score",
        "sensitive_skin_score",
        "no_irritant_score",
        "hypoallergenic_score",
        "moisturizing_score",
        "low_friction_score",
        "nourishment_score",
        "eye_friendly_score",
        "oil_control_score"
    ]

    for col in likert_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    scaler = MinMaxScaler()
    df[likert_cols] = scaler.fit_transform(df[likert_cols])

    # Encoding (แปลง text → ตัวเลข)
    df["gender"] = df["gender"].map({
        "male": 1,
        "female": 0
    })

    df["skin_type_clean"] = df["skin_type"].replace({
        "ผิวมัน": "oily",
        "ผิวแห้ง": "dry",
        "ผิวผสม": "combination",
        "ผิวธรรมดา": "normal",
        "ผิวขาดน้ำ": "dry",
        "ไม่แน่ใจ/ไม่ทราบ": "unknown"
    })

    df["skin_type_encoded"] = df["skin_type_clean"].map({
        "oily": 1,
        "dry": 2,
        "combination": 3,
        "normal": 4,
        "unknown": 0
    })

    return df

def generate_visualizations(df, output_dir="visualizations"):
    """
    Generates and saves various visualizations from the processed DataFrame.

    Args:
        df (pandas.DataFrame): The processed DataFrame.
        output_dir (str): The directory to save the visualization images.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Set a custom font for Thai characters if available for better display on plots
    # You might need to install fonts on your local system or container
    # Example for Colab: !apt-get install fonts-thai-tlwg
    # plt.rcParams['font.family'] = ['Tahoma'] # Or other Thai font like 'TH Sarabun New'

    # --- Demographic Profile Visualizations ---
    # 1. Gender Distribution
    plt.figure(figsize=(7, 5))
    sns.countplot(x='gender', data=df, palette='viridis', hue='gender', legend=False)
    plt.title("Gender Distribution")
    plt.xlabel("Gender (0=Female, 1=Male)")
    plt.ylabel("Count")
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "gender_distribution.png"))
    plt.close()

    # 2. Income Distribution
    plt.figure(figsize=(10, 6))
    sns.countplot(y='monthly_income', data=df, order=df['monthly_income'].value_counts().index, palette='plasma')
    plt.title("Income Distribution")
    plt.xlabel("Count")
    plt.ylabel("Monthly Income")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "income_distribution.png"))
    plt.close()

    # 3. Skin Type Distribution
    plt.figure(figsize=(7, 5))
    sns.countplot(x='skin_type_clean', data=df, palette='cividis', order=df['skin_type_clean'].value_counts().index)
    plt.title("Skin Type Distribution")
    plt.xlabel("Skin Type")
    plt.ylabel("Count")
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "skin_type_distribution.png"))
    plt.close()

    # --- Distribution Analysis of Engineered Features ---

    # 4. Skin Concerns Distribution (from binary flags) - A general overview of what concerns are present
    concerns_flags = ["acne","oily","sensitive","pore","dull","dry"]
    plt.figure(figsize=(10, 6))
    df[concerns_flags].sum().sort_values(ascending=False).plot(kind="bar", color='skyblue')
    plt.title("Skin Concerns Distribution (from Binary Flags)")
    plt.xlabel("Skin Concern")
    plt.ylabel("Count of Respondents")
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "skin_concerns_binary_distribution.png"))
    plt.close()

    # 5. Influence Score Distribution
    plt.figure(figsize=(7, 5))
    sns.countplot(x='influence_score', data=df, palette='cubehelix')
    plt.title("Distribution of Total Influence Score")
    plt.xlabel("Influence Score")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "influence_score_distribution.png"))
    plt.close()


    print(f"All {len(plt.get_fignums())} visualizations saved to the '{output_dir}' directory.")

if __name__ == "__main__":
    processed_df = process_survey_data()
    processed_df.to_csv("data/cleaned_data.csv", index=False, encoding="utf-8-sig")
    print("Data cleaning and feature engineering complete. 'cleaned_data.csv' saved.")

    # Generate and save visualizations
    generate_visualizations(processed_df, output_dir="visualizations")