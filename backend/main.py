from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import pandas as pd

from database import Base, engine, SessionLocal
from models import User, Certificate
from schemas import RegisterSchema, LoginSchema, CertificateSchema
from auth import hash_password, verify_password, create_token
from certificate import generate_certificate
from email_service import send_certificate_email

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Certificate Generator Web App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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


@app.post("/register")
def register(user: RegisterSchema, db: Session = Depends(get_db)):
    old_user = db.query(User).filter(User.email == user.email).first()

    if old_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        is_approved=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registered successfully",
        "user_id": new_user.id,
        "role": new_user.role
    }

@app.post("/login")
def login(user: LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_token({
        "email": db_user.email,
        "role": db_user.role,
        "user_id": db_user.id
    })

    return {
        "message": "Login successful",
        "token": token,
        "role": db_user.role,
        "user_id": db_user.id
    }


@app.post("/generate-certificate/{organization_id}")
def create_certificate(
    organization_id: int,
    cert: CertificateSchema,
    db: Session = Depends(get_db)
):
    org = db.query(User).filter(User.id == organization_id).first()

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    if org.role != "organization":
        raise HTTPException(status_code=400, detail="Only organization can generate certificate")

    cert_code, pdf_file, qr_file = generate_certificate(cert)

    new_cert = Certificate(
        student_name=cert.student_name,
        student_email=cert.student_email,
        achievement=cert.achievement,
        event_name=cert.event_name,
        organization_name=cert.organization_name,
        course_details=cert.course_details,
        template_name=cert.template_name,
        font_size=cert.font_size,
        font_style=cert.font_style,
        certificate_code=cert_code,
        certificate_file=pdf_file,
        qr_file=qr_file,
        expiry_date=cert.expiry_date,
        organization_id=organization_id
    )

    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)

    email_sent = send_certificate_email(
        cert.student_email,
        cert.student_name,
        cert_code,
        pdf_file
    )

    return {
        "message": "Certificate generated successfully",
        "certificate_code": cert_code,
        "pdf_file": pdf_file,
        "qr_file": qr_file,
        "email_sent": email_sent
    }


@app.post("/bulk-generate/{organization_id}")
def bulk_generate(
    organization_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    org = db.query(User).filter(User.id == organization_id).first()

    if not org or org.role != "organization":
        raise HTTPException(
            status_code=400,
            detail="Only organization can bulk generate certificates"
        )

    df = pd.read_csv(file.file)
    generated = []

    for _, row in df.iterrows():
        cert_data = CertificateSchema(
            student_name=row["student_name"],
            student_email=row["student_email"],
            achievement=row["achievement"],
            event_name=row["event_name"],
            organization_name=row["organization_name"],
            course_details=row["course_details"],
            template_name=row.get("template_name", "Template 1"),
            font_size=int(row.get("font_size", 20)),
            font_style=row.get("font_style", "Helvetica"),
            expiry_date=row["expiry_date"]
        )

        cert_code, pdf_file, qr_file = generate_certificate(cert_data)

        new_cert = Certificate(
            student_name=cert_data.student_name,
            student_email=cert_data.student_email,
            achievement=cert_data.achievement,
            event_name=cert_data.event_name,
            organization_name=cert_data.organization_name,
            course_details=cert_data.course_details,
            template_name=cert_data.template_name,
            font_size=cert_data.font_size,
            font_style=cert_data.font_style,
            certificate_code=cert_code,
            certificate_file=pdf_file,
            qr_file=qr_file,
            expiry_date=cert_data.expiry_date,
            organization_id=organization_id
        )

        db.add(new_cert)
        db.commit()
        db.refresh(new_cert)

        email_sent = send_certificate_email(
            cert_data.student_email,
            cert_data.student_name,
            cert_code,
            pdf_file
        )

        generated.append({
            "student_email": cert_data.student_email,
            "certificate_code": cert_code,
            "pdf_file": pdf_file,
            "qr_file": qr_file,
            "email_sent": email_sent
        })

    return {
        "message": "Bulk certificates generated and emailed",
        "total": len(generated),
        "certificates": generated
    }


@app.get("/verify/{certificate_code}")
def verify_certificate(certificate_code: str, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(
        Certificate.certificate_code == certificate_code
    ).first()

    if not cert:
        raise HTTPException(status_code=404, detail="Invalid certificate")

    return {
        "status": "Valid Certificate",
        "student_name": cert.student_name,
        "student_email": cert.student_email,
        "achievement": cert.achievement,
        "event_name": cert.event_name,
        "organization_name": cert.organization_name,
        "course_details": cert.course_details,
        "expiry_date": cert.expiry_date,
        "certificate_file": cert.certificate_file,
        "qr_file": cert.qr_file,
        "download_url": f"http://127.0.0.1:8000/files/{cert.certificate_file}",
        "qr_url": f"http://127.0.0.1:8000/files/{cert.qr_file}"
    }


@app.get("/user-certificates/{email}")
def user_certificates(email: str, db: Session = Depends(get_db)):
    certificates = db.query(Certificate).filter(
        Certificate.student_email == email
    ).all()

    return certificates


@app.get("/all-certificates")
def all_certificates(db: Session = Depends(get_db)):
    certificates = db.query(Certificate).all()
    return certificates