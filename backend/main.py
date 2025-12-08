# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db

# Tạo bảng tự động nếu chưa có (nhưng bạn nên chạy SQL tay thì tốt hơn)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- PHẦN XÁC THỰC GIẢ (Sẽ thay bằng Firebase thật sau) ---
# Hiện tại Frontend chưa có, nên ta hardcode user
def get_current_user():
    # Giả vờ user ID là 'test_uid_123' đang đăng nhập
    return {"uid": "test_uid_123", "email": "test@example.com"}

# --- CÁC API ---

# 1. Tạo Note mới
@app.post("/notes/", response_model=schemas.NoteResponse)
def create_note(
    note: schemas.NoteCreate, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user) # Lấy user giả
):
    # Trước tiên phải đảm bảo user tồn tại trong DB (Logic tạm)
    db_user = db.query(models.User).filter(models.User.id == user['uid']).first()
    if not db_user:
        new_user = models.User(id=user['uid'], email=user['email'])
        db.add(new_user)
        db.commit()

    # Tạo note
    new_note = models.Note(
        user_id=user['uid'],
        title=note.title,
        content=note.content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

# 2. Lấy danh sách Note của user hiện tại
@app.get("/notes/", response_model=List[schemas.NoteResponse])
def read_notes(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    # Chỉ lấy note của user đang đăng nhập và chưa bị xóa
    notes = db.query(models.Note).filter(
        models.Note.user_id == user['uid'],
        models.Note.is_deleted == False
    ).all()
    return notes

# 3. Lấy chi tiết 1 Note
@app.get("/notes/{note_id}", response_model=schemas.NoteResponse)
def read_note_detail(
    note_id: int, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == user['uid']
    ).first()
    
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

# 4. Cập nhật Note
@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(
    note_id: int, 
    note_update: schemas.NoteCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user['uid']).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.title = note_update.title
    db_note.content = note_update.content
    db.commit()
    db.refresh(db_note)
    return db_note