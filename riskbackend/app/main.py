from fastapi import FastAPI
from app.db.api import router

app = FastAPI()
app.include_router(router)