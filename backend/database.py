import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Load file .env (chỉ chạy khi ở Local)
load_dotenv()



# Lấy từng thành phần từ biến môi trường
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")


if not all([db_user, db_password, db_host, db_port, db_name]):
    raise ValueError("Thiếu biến môi trường rồi bé ơi! Kiểm tra lại .env hoặc Render đi!")

#Xử lý password
encoded_password = urllib.parse.quote_plus(db_password)

#Ghép lại thành chuỗi hoàn chỉnh (f-string)
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{db_user}:{encoded_password}@{db_host}:{db_port}/{db_name}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()