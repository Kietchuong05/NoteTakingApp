from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    email: str
    display_name: str

class UserCreate(UserBase):
    id: str

class UserResponse(UserBase):
    id: str
    class Config:
        from_attributes = True


class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    user_id: str

class FolderResponse(FolderBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


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
        from_attributes = True 

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None
    folder_id: Optional[int] = None 

class NoteCreate(NoteBase):
    user_id: str
    tag_ids: List[int] = []


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder_id: Optional[int] = None
    is_deleted: Optional[bool] = None
    tag_ids: Optional[List[int]] = None
    is_starred: Optional[bool] = None
    
    class Config:
        from_attributes = True


class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    is_starred: bool = False
    

    folder: Optional[FolderResponse] = None 
    tags: List[TagResponse] = [] 
    

    class Config:
        from_attributes = True