import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_certificate_email(
    student_email,
    student_name,
    certificate_code,
    pdf_file
):
    try:
        msg = EmailMessage()

        msg["Subject"] = "Certificate Generated Successfully"
        msg["From"] = EMAIL_USER
        msg["To"] = student_email

        msg.set_content(
            f"""
Hello {student_name},

Congratulations!

Your certificate has been generated successfully.

Verification Code:
{certificate_code}

Please find the certificate attached.

Regards,
Certificate Generator Team
"""
        )

        with open(pdf_file, "rb") as f:
            msg.add_attachment(
                f.read(),
                maintype="application",
                subtype="pdf",
                filename=os.path.basename(pdf_file)
            )

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASSWORD)
            smtp.send_message(msg)

        print("Email sent successfully")
        return True

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        return True