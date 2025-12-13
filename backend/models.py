from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# BẢNG TRUNG GIAN CHO QUAN HỆ NHIỀU - NHIỀU (NOTE - TAG)
# Một Note có nhiều Tag, một Tag gắn được cho nhiều Note
note_tags = Table(
    "note_tags",
    Base.metadata,
    Column("note_id", Integer, ForeignKey("notes.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id = Column(String(100), primary_key=True, index=True) # UID từ Firebase
    email = Column(String(255), unique=True, index=True)
    display_name = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Quan hệ ngược để truy vấn cho dễ (user.notes, user.folders...)
    notes = relationship("Note", back_populates="owner")
    folders = relationship("Folder", back_populates="owner")
    tags = relationship("Tag", back_populates="owner")

class Folder(Base):
    __tablename__ = "folders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    user_id = Column(String(100), ForeignKey("users.id")) # Folder của ai?
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Quan hệ: Một Folder chứa nhiều Note
    owner = relationship("User", back_populates="folders")
    notes = relationship("Note", back_populates="folder")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    color = Column(String(20), default="#FFFFFF") # Thêm màu cho đẹp
    user_id = Column(String(100), ForeignKey("users.id")) # Tag của ai?
    
    owner = relationship("User", back_populates="tags")
    # Quan hệ Many-to-Many với Note
    notes = relationship("Note", secondary=note_tags, back_populates="tags")

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"))
    
    # THÊM CỘT NÀY: Note thuộc về Folder nào? (Có thể null nếu note chưa phân loại)
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    
    title = Column(String(255))
    content = Column(Text)
    is_deleted = Column(Boolean, default=False) # Cái này dùng cho Thùng rác (Trash)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Các mối quan hệ (Relationships)
    owner = relationship("User", back_populates="notes")
    folder = relationship("Folder", back_populates="notes")
    tags = relationship("Tag", secondary=note_tags, back_populates="notes")
    is_starred = Column(Boolean, default=False)