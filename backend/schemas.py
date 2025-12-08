# schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Khuôn mẫu dữ liệu khi Frontend GỬI LÊN để tạo note
class NoteCreate(BaseModel):
    title: str
    content: str

# Khuôn mẫu dữ liệu khi Backend TRẢ VỀ
class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True