import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json
import os

def run_unsupervised_analysis(file_path="data/clean.csv"):
    """
    Performs unsupervised learning tasks: Clustering, PCA, Anomaly Detection.
    Returns a dictionary of results for the API.
    """
    if not os.path.exists(file_path):
        return {"error": f"File {file_path} not found. Please run process_data.py first."}

    df = pd.read_csv(file_path)

    # 1. Feature Selection for Unsupervised Learning
    # Focus on behavior, preferences, and skin concerns
    likert_cols = [
        "deep_cleansing_score", "acne_friendly_score", "sensitive_skin_score",
        "no_irritant_score", "hypoallergenic_score", "moisturizing_score",
        "low_friction_score", "nourishment_score", "eye_friendly_score",
        "oil_control_score"
    ]
    behavior_cols = ["acne_score", "influence_score", "is_price_sensitive", "concern_count"]
    
    features = likert_cols + behavior_cols
    X = df[features].fillna(0)

    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 2. Clustering (K-Means)
    # Using 3 clusters for easy interpretation (Persona: Budget, Expert/Medical, General)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X_scaled)

    # 3. Dimensionality Reduction (PCA) for Visualization
    pca = PCA(n_components=2)
    pca_results = pca.fit_transform(X_scaled)
    df['pca_1'] = pca_results[:, 0]
    df['pca_2'] = pca_results[:, 1]

    # 4. Anomaly Detection (Isolation Forest)
    iso_forest = IsolationForest(contamination=0.05, random_state=42)
    df['is_anomaly'] = iso_forest.fit_predict(X_scaled)
    # -1 is anomaly, 1 is normal -> convert to 1 for anomaly, 0 for normal
    df['anomaly_score'] = df['is_anomaly'].apply(lambda x: 1 if x == -1 else 0)

    # 5. Correlation Analysis
    corr_matrix = df[features].corr().round(2)
    
    # 6. Persona Generation (Cluster Profiles)
    cluster_profiles = df.groupby('cluster')[features].mean().round(2)
    
    # Add human-friendly persona names based on comparative analysis
    # Calculate overall mean to find each cluster's distinguishing traits
    overall_mean = df[features].mean()

    # Define persona archetypes with signature features (ordered by priority)
    persona_defs = [
        {
            "key": "price",
            "check": lambda p, om: p['is_price_sensitive'] - om['is_price_sensitive'],
            "name": "The Smart Budgeter",
            "description": "กลุ่มลูกค้าที่เน้นความคุ้มค่าและราคาเป็นหลัก มักตัดสินใจจากโปรโมชั่น",
        },
        {
            "key": "influence",
            "check": lambda p, om: p['influence_score'] - om['influence_score'],
            "name": "The Derma-Influenced Seeker",
            "description": "กลุ่มลูกค้าที่ได้รับอิทธิพลจากแพทย์และผู้เชี่ยวชาญ ให้ความสำคัญกับผิวบอบบางและความสะอาดเชิงลึก",
        },
        {
            "key": "allround",
            "check": lambda p, om: p['concern_count'] - om['concern_count'],
            "name": "The All-Round Skincare Enthusiast",
            "description": "กลุ่มลูกค้าที่ใส่ใจทุกด้าน มีความกังวลเรื่องผิวหลายประเด็น และต้องการผลิตภัณฑ์ที่ตอบโจทย์รอบด้าน",
        },
        {
            "key": "gentle",
            "check": lambda p, om: p['sensitive_skin_score'] - om['sensitive_skin_score'],
            "name": "The Gentle Skin Enthusiast",
            "description": "กลุ่มผิวแพ้ง่ายที่เน้นความอ่อนโยนเป็นพิเศษ และพิจารณาส่วนประกอบที่ไม่มีสารก่อการแพ้",
        },
        {
            "key": "acne",
            "check": lambda p, om: p['acne_friendly_score'] - om['acne_friendly_score'],
            "name": "The Acne-Focused Seeker",
            "description": "กลุ่มลูกค้าที่กังวลเรื่องสิวเป็นหลัก ให้ความสำคัญกับความสะอาดและการผ่านการทดสอบทางการแพทย์",
        },
    ]

    # Score each cluster for each persona archetype
    cluster_scores = {}  # {cluster_id: {persona_key: score}}
    for i, profile in cluster_profiles.iterrows():
        cluster_scores[i] = {}
        for pdef in persona_defs:
            cluster_scores[i][pdef["key"]] = pdef["check"](profile, overall_mean)

    # Assign personas greedily: best-fit first, no duplicates
    used_keys = set()
    assignments = {}  # cluster_id -> persona_def

    for _ in range(len(cluster_profiles)):
        best_score = -999
        best_cluster = None
        best_def = None
        for i in cluster_profiles.index:
            if i in assignments:
                continue
            for pdef in persona_defs:
                if pdef["key"] in used_keys:
                    continue
                score = cluster_scores[i][pdef["key"]]
                if score > best_score:
                    best_score = score
                    best_cluster = i
                    best_def = pdef
        if best_cluster is not None and best_def is not None:
            assignments[best_cluster] = best_def
            used_keys.add(best_def["key"])

    personas = []
    for i, profile in cluster_profiles.iterrows():
        pdef = assignments.get(i, {
            "name": f"Segment {i+1}",
            "description": "กลุ่มลูกค้าทั่วไป"
        })
        # Pick top 4 features for this cluster
        sorted_feats = profile[likert_cols].sort_values(ascending=False)
        top_features = {k: round(float(v), 2) for k, v in sorted_feats.head(4).items()}

        personas.append({
            "id": int(i),
            "name": pdef["name"],
            "description": pdef["description"],
            "top_features": top_features,
            "stats": profile.to_dict()
        })

    # Prepare data for API
    results = {
        "stats": df[features].describe().round(2).to_dict(),
        "correlation": {
            "columns": features,
            "values": corr_matrix.values.tolist()
        },
        "clusters": df[['pca_1', 'pca_2', 'cluster', 'anomaly_score']].to_dict(orient='records'),
        "personas": personas,
        "summary": {
            "total_count": len(df),
            "anomaly_count": int(df['anomaly_score'].sum()),
            "cluster_counts": df['cluster'].value_counts().to_dict()
        }
    }

    return results

if __name__ == "__main__":
    results = run_unsupervised_analysis()
    # Save a sample to check
    with open("data/unsupervised_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
    print("Unsupervised analysis complete. 'data/unsupervised_results.json' saved.")
