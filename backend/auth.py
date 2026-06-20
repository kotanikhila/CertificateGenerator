from passlib.context import CryptContext
from jose import jwt

SECRET_KEY = "certificate_secret_key"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)

def create_token(data):
    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )