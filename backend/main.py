from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

from database import Base, engine, SessionLocal
from models import User, Certificate
from schemas import RegisterSchema, LoginSchema, CertificateSchema
from auth import hash_password, verify_password, create_token
from certificate import generate_certificate
from email_service import send_certificate_email

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Certificate Generator Web App")

# CORS for Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://certificate-generator-frontend.onrender.com",
        "https://*.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/files", StaticFiles(directory="."), name="files")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Certificate Generator API is running"}

@app.get("/health")
def health():
    return {"status": "healthy", "message": "Backend is running"}

# Add your endpoints here (register, login, generate certificate, etc.)
# ... (your existing endpoints)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
