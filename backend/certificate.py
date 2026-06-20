import qrcode
import uuid
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors

def generate_certificate(data):
    cert_code = str(uuid.uuid4())[:8]

    qr_text = f"""
Certificate Code: {cert_code}
Name: {data.student_name}
Email: {data.student_email}
Achievement: {data.achievement}
Event/Course: {data.event_name}
Organization: {data.organization_name}
Details: {data.course_details}
Expiry Date: {data.expiry_date}
"""

    qr_file = f"qr_{cert_code}.png"
    pdf_file = f"certificate_{cert_code}.pdf"

    qr = qrcode.make(qr_text)
    qr.save(qr_file)

    c = canvas.Canvas(pdf_file, pagesize=landscape(A4))
    width, height = landscape(A4)

    # Background
    c.setFillColor(colors.white)
    c.rect(0, 0, width, height, fill=True)

    # Main border
    if data.template_name == "Template 1":
        main_color = colors.HexColor("#0F4C81")
    elif data.template_name == "Template 2":
        main_color = colors.HexColor("#0B6B3A")
    else:
        main_color = colors.HexColor("#8B0000")

    c.setStrokeColor(main_color)
    c.setLineWidth(7)
    c.rect(30, 30, width - 60, height - 60)

    c.setStrokeColor(colors.gold)
    c.setLineWidth(3)
    c.rect(50, 50, width - 100, height - 100)

    # QR top-left
    c.drawImage(qr_file, 70, height - 150, 85, 85)

    # Logo circle
    c.setStrokeColor(main_color)
    c.setLineWidth(3)
    c.circle(width / 2, height - 90, 45)

    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(main_color)
    c.drawCentredString(width / 2, height - 85, "CERTIFIED")
    c.drawCentredString(width / 2, height - 105, "AWARD")

    # Organization
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 165, data.organization_name.upper())

    # Title
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 210, "CERTIFICATE OF ACHIEVEMENT")

    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 245, "THIS DOCUMENT CERTIFIES THAT")

    # Student name
    c.setFillColor(main_color)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width / 2, height - 305, data.student_name.upper())

    # Achievement
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 355, "HAS SUCCESSFULLY COMPLETED")

    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(width / 2, height - 395, data.event_name)

    # Course details
    c.setFont("Helvetica", 13)
    c.drawCentredString(width / 2, height - 430, data.course_details)

    c.setFont("Helvetica", 13)
    c.drawCentredString(width / 2, height - 465, f"Achievement: {data.achievement}")

    # Bottom details
    c.setFont("Helvetica", 11)
    c.drawString(80, 85, f"Certificate Code: {cert_code}")
    c.drawString(80, 65, f"Expiry Date: {data.expiry_date}")

    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - 90, 85, "Authorized Signature")
    c.line(width - 250, 105, width - 90, 105)

    # Seal
    c.setStrokeColor(main_color)
    c.setFillColor(colors.lightgrey)
    c.circle(width - 115, 165, 35, fill=True)
    c.setFillColor(main_color)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(width - 115, 165, "VERIFIED")
    c.drawCentredString(width - 115, 150, "CERTIFICATE")

    c.save()

    return cert_code, pdf_file, qr_file