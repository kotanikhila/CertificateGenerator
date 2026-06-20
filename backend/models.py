from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)
    proof_file = Column(String(255), nullable=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(100), nullable=False)
    student_email = Column(String(150), nullable=False)
    achievement = Column(Text, nullable=False)
    event_name = Column(String(150), nullable=False)
    organization_name = Column(String(150), nullable=False)
    course_details = Column(Text, nullable=True)
    template_name = Column(String(100), nullable=False)
    font_size = Column(Integer, nullable=False)
    font_style = Column(String(100), nullable=False)
    certificate_code = Column(String(100), unique=True, nullable=False)
    certificate_file = Column(String(255), nullable=False)
    qr_file = Column(String(255), nullable=False)
    expiry_date = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    organization_id = Column(Integer, ForeignKey("users.id"))