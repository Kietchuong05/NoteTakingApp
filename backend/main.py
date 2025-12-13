from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from database import engine, SessionLocal, Base
import models, schemas

# Tạo bảng (Nếu em chạy lệnh kia rồi thì dòng này nó sẽ bỏ qua, ko sao cả)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000", # Nếu em dùng React thường
    "http://localhost:5173", # Nếu em dùng Vite (React + Vite)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
app.add_middleware( CORSMiddleware,
    allow_origins=["*"], # Chơi lớn: Cho phép tất cả (để test cho dễ, sau này sửa lại sau)
    allow_credentials=True,
    allow_methods=["*"], # Cho phép mọi loại lệnh: GET, POST, PUT, DELETE...
    allow_headers=["*"],
)

# Dependency để lấy kết nối DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API TẠO USER (Để test thôi nhé) ---
class UserCreate(schemas.BaseModel):
    id: str
    email: str
    display_name: str

@app.post("/users/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Kiểm tra xem user này đã có trong kho chưa?
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    
    if db_user:
        # Nếu có rồi -> Trả về luôn, coi như thành công (Điểm danh xong)
        return db_user
    
    # 2. Nếu chưa có -> Thì mới tạo mới
    new_user = models.User(
        id=user.id,
        email=user.email,
        display_name=user.display_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
# --- API CHO FOLDER ---
@app.post("/folders/", response_model=schemas.FolderResponse)
def create_folder(folder: schemas.FolderCreate, db: Session = Depends(get_db)):
    db_folder = models.Folder(**folder.dict())
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

@app.get("/folders/", response_model=List[schemas.FolderResponse])
def read_folders(user_id: str, db: Session = Depends(get_db)):
    # Lọc folder theo user_id (chứ ai lại hiện folder của thằng hàng xóm?)
    return db.query(models.Folder).filter(models.Folder.user_id == user_id).all()

# --- API CHO TAG ---
@app.post("/tags/", response_model=schemas.TagResponse)
def create_tag(tag: schemas.TagCreate, db: Session = Depends(get_db)):
    db_tag = models.Tag(**tag.dict())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

@app.get("/tags/", response_model=List[schemas.TagResponse])
def read_tags(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.Tag).filter(models.Tag.user_id == user_id).all()

# --- API CHO NOTE (QUAN TRỌNG NHẤT) ---
@app.post("/notes/", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    # 1. Tách danh sách tag_ids ra riêng
    tag_ids = note.tag_ids
    
    # 2. Tạo data cho note (loại bỏ tag_ids vì bảng Note ko có cột này)
    note_data = note.dict(exclude={"tag_ids"})
    new_note = models.Note(**note_data)
    
    # 3. Xử lý gán Tags (Many-to-Many)
    if tag_ids:
        # Tìm các tag có id nằm trong danh sách gửi lên
        tags = db.query(models.Tag).filter(models.Tag.id.in_(tag_ids)).all()
        if len(tags) != len(tag_ids):
            raise HTTPException(status_code=404, detail="Một số Tag không tồn tại")
        new_note.tags = tags # SQLAlchemy tự động điền vào bảng trung gian note_tags

    # 4. Lưu vào DB
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@app.get("/notes/", response_model=List[schemas.NoteResponse])
def read_notes(
    user_id: str, 
    folder_id: Optional[int] = None, # <--- Thêm tham số này (mặc định là None)
    db: Session = Depends(get_db),
    is_deleted: bool = False
):
    # 1. Tạo câu truy vấn cơ bản (Lấy theo user và chưa bị xóa)
    query = db.query(models.Note).filter(
        models.Note.user_id == user_id, 
        models.Note.is_deleted == False
    )
    
    # 2. Nếu có folder_id gửi lên thì lọc thêm
    if folder_id:
        query = query.filter(models.Note.folder_id == folder_id)
        
    # 3. Trả kết quả
    return query.all()

@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: int, note_update: schemas.NoteUpdate, db: Session = Depends(get_db)):
    # 1. Tìm note trong DB
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    
    # 2. Cập nhật dữ liệu
    update_data = note_update.dict(exclude_unset=True) # Chỉ lấy những trường người dùng gửi lên
    for key, value in update_data.items():
        setattr(db_note, key, value)

    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

# --- API XÓA GHI CHÚ (DELETE) ---
@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    
    # Thay vì db.delete(db_note), ta làm thế này:
    db_note.is_deleted = True 
    db.commit()
    return {"message": "Đã chuyển vào thùng rác"}

# 3. Thêm hàm xóa vĩnh viễn (Hard Delete)
@app.delete("/notes/{note_id}/permanent")
def delete_note_permanently(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    
    db.delete(db_note) # Xóa bay màu thật sự
    db.commit()
    return {"message": "Đã xóa vĩnh viễn"}

# --- API SỬA GHI CHÚ (UPDATE) - CÓ XỬ LÝ TAG ---
@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: int, note_update: schemas.NoteUpdate, db: Session = Depends(get_db)):
    # 1. Tìm note trong DB
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    
    # 2. Xử lý dữ liệu update
    # Tách tag_ids ra xử lý riêng
    update_data = note_update.dict(exclude_unset=True)
    
    if "tag_ids" in update_data:
        tag_ids = update_data.pop("tag_ids") # Lấy ra và xóa khỏi dict update_data
        # Tìm các object Tag tương ứng
        if tag_ids is not None:
            new_tags = db.query(models.Tag).filter(models.Tag.id.in_(tag_ids)).all()
            db_note.tags = new_tags # <--- SQLAlchemy tự động xóa cũ, thay bằng mới

    # 3. Cập nhật các trường thông tin khác (title, content...)
    for key, value in update_data.items():
        setattr(db_note, key, value)

    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

