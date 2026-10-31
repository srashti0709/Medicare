from fastapi import FastAPI

from api.diabetes import router as diabetes_router
from api.kidney import router as kidney_router
from api.report import router as report_router
from fastapi.middleware.cors import CORSMiddleware 
from api.assistant import router as assistant_router


app = FastAPI(
    title="Medicare AI Service",
    description="AI and Machine Learning service for Medicare",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# Include routers
# -----------------------------------

app.include_router(diabetes_router)
app.include_router(kidney_router)
app.include_router(report_router)
app.include_router(assistant_router)

# -----------------------------------
# Root
# -----------------------------------

@app.get("/")
def root():

    return {
        "message": "Medicare AI Service is running"
    }


# -----------------------------------
# Health Check
# -----------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }