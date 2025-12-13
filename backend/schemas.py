from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- 1. USER SCHEMAS ---
class UserBase(BaseModel):
    email: str
    display_name: str

class UserCreate(UserBase):
    id: str # UID từ Firebase

class UserResponse(UserBase):
    id: str
    # created_at: datetime # Tạm bỏ qua nếu DB chưa có hoặc ko cần thiết
    class Config:
        from_attributes = True

# --- 2. FOLDER SCHEMAS (Phải đứng trước Note) ---
# FolderResponse phải có trước thì NoteResponse mới dùng được
class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    user_id: str

class FolderResponse(FolderBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True # <--- CÁI NÀY QUAN TRỌNG NÈ

# --- 3. TAG SCHEMAS (Phải đứng trước Note) ---
class TagBase(BaseModel):
    name: str
    color: Optional[str] = "#FFFFFF"

class TagCreate(TagBase):
    name: str
    color: Optional[str] = "#FFFFFF"
    user_id: str

class TagResponse(TagBase):
    id: int
    
    class Config:
        from_attributes = True # <--- CÁI NÀY QUAN TRỌNG NÈ

# --- 4. NOTE SCHEMAS ---
class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None # Cho phép null để tránh lỗi
    folder_id: Optional[int] = None # Note có thể không nằm trong folder nào

class NoteCreate(NoteBase):
    user_id: str
    tag_ids: List[int] = [] # Danh sách ID các thẻ muốn gắn

# Schema dùng để Update
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder_id: Optional[int] = None
    is_deleted: Optional[bool] = None
    tag_ids: Optional[List[int]] = None
    is_starred: Optional[bool] = None
    
    class Config:
        from_attributes = True

# --- QUAN TRỌNG NHẤT: TRẢ VỀ DỮ LIỆU ---
class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    is_starred: bool = False
    
    # Nested Models: Backend tự động chui vào lấy thông tin chi tiết
    folder: Optional[FolderResponse] = None 
    tags: List[TagResponse] = [] 
    
    # EM THIẾU CÁI NÀY TRONG CODE CŨ CỦA EM NÈ 👇
    class Config:
        from_attributes = True