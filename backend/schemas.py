from pydantic import BaseModel

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginSchema(BaseModel):
    email: str
    password: str


class CertificateSchema(BaseModel):
    student_name: str
    student_email: str
    achievement: str
    event_name: str
    organization_name: str
    course_details: str
    template_name: str
    font_size: int
    font_style: str
    expiry_date: str