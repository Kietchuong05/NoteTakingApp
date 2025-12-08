# models.py
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String(100), primary_key=True, index=True) # UID từ Firebase
    email = Column(String(255), unique=True, index=True)
    display_name = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"))
    title = Column(String(255))
    content = Column(Text) # MySQL LongText
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())