# Kiyora Brand Analysis & Prediction System

This project analyzes survey data for the "Kiyora" cleansing brand and provides a machine learning model to predict brand usage.

## Project Structure

- `api/`: FastAPI backend for model serving.
- `frontend/`: Streamlit frontend for user interaction.
- `src/`: Core logic for data processing, training, and prediction.
- `data/`: Raw and processed data.
- `models/`: Trained model files (`.pkl`).
- `visualizations/`: Generated plots and charts.

## Setup & Usage

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the API (Backend)
Navigate to the root directory and run:
```bash
uvicorn api.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 3. Run the Frontend
In a new terminal, run:
```bash
streamlit run frontend/app.py
```
The web interface will open in your browser.

## Data Processing
To re-process raw data and generate visualizations:
```bash
python src/process_data.py
```

## Model Training
To retrain the model:
```bash
python src/train.py
```
