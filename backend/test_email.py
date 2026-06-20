from email_service import send_certificate_email

result = send_certificate_email(
    "student@gmail.com",
    "Test Student",
    "ABC12345",
    "certificate.pdf"
)

print(result)