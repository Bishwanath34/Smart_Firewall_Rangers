from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import logging

# -----------------------------------------------------
#  Logging
# -----------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger(__name__)

# -----------------------------------------------------
#  Environment Config
# -----------------------------------------------------
MODEL_PATH = os.getenv("MODEL_PATH", "model.joblib")

# -----------------------------------------------------
#  Load ML Model
# -----------------------------------------------------
if not os.path.exists(MODEL_PATH):
    logger.error(f"Model file not found at {MODEL_PATH}")
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

logger.info(f"Loading model from: {MODEL_PATH}")
model = joblib.load(MODEL_PATH)

# -----------------------------------------------------
#  FastAPI App
# -----------------------------------------------------
app = FastAPI(title="AI-NGFW ML Scoring Service", version="1.0")

# -----------------------------------------------------
#  Request Schema
# -----------------------------------------------------
class RequestContext(BaseModel):
    method: str
    path: str
    role: str
    userId: str
    userAgent: str
    risk_rule: float

# -----------------------------------------------------
#  Scoring Endpoint
# -----------------------------------------------------
@app.post("/score")
def score(context: RequestContext):
    try:
        # Convert to DataFrame
        df = pd.DataFrame([context.model_dump()])

        # Predict probability
        proba = float(model.predict_proba(df)[0][1])

        # Risk label
        if proba < 0.3:
            label = "normal"
        elif proba < 0.6:
            label = "medium_risk"
        else:
            label = "high_risk"

        return {
            "ml_risk": proba,
            "ml_label": label
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Error during prediction")

# -----------------------------------------------------
#  Health Check (for Kubernetes / Render / AWS)
# -----------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}
if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
