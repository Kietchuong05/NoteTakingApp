from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse
import os
from dotenv import load_dotenv

load_dotenv()

raw_password = os.getenv("DB_PASSWORD") 
encoded_password = urllib.parse.quote_plus(raw_password)

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{encoded_password}@127.0.0.1:3306/NoteTakingApp"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()