from fastapi import FastAPI

app = FastAPI(title="Certificate Generator API")

@app.get("/")
def root():
    return {
        "message": "Certificate Generator API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/test")
def test():
    return {"message": "Test endpoint working!"}