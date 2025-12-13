from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from database import engine, SessionLocal, Base
import models, schemas


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
app.add_middleware( CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserCreate(schemas.BaseModel):
    id: str
    email: str
    display_name: str

@app.post("/users/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    
    if db_user:

        return db_user
    

    new_user = models.User(
        id=user.id,
        email=user.email,
        display_name=user.display_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/folders/", response_model=schemas.FolderResponse)
def create_folder(folder: schemas.FolderCreate, db: Session = Depends(get_db)):
    db_folder = models.Folder(**folder.dict())
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

@app.get("/folders/", response_model=List[schemas.FolderResponse])
def read_folders(user_id: str, db: Session = Depends(get_db)):

    return db.query(models.Folder).filter(models.Folder.user_id == user_id).all()


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


@app.post("/notes/", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):

    tag_ids = note.tag_ids
    

    note_data = note.dict(exclude={"tag_ids"})
    new_note = models.Note(**note_data)
    

    if tag_ids:

        tags = db.query(models.Tag).filter(models.Tag.id.in_(tag_ids)).all()
        if len(tags) != len(tag_ids):
            raise HTTPException(status_code=404, detail="Một số Tag không tồn tại")
        new_note.tags = tags


    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@app.get("/notes/", response_model=List[schemas.NoteResponse])
def read_notes(
    user_id: str, 
    folder_id: Optional[int] = None,
    db: Session = Depends(get_db),
    is_deleted: bool = False
):

    query = db.query(models.Note).filter(
        models.Note.user_id == user_id, 
        models.Note.is_deleted == False
    )
    

    if folder_id:
        query = query.filter(models.Note.folder_id == folder_id)
        

    return query.all()

@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: int, note_update: schemas.NoteUpdate, db: Session = Depends(get_db)):

    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    

    update_data = note_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)

    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    

    db_note.is_deleted = True 
    db.commit()
    return {"message": "Đã chuyển vào thùng rác"}


@app.delete("/notes/{note_id}/permanent")
def delete_note_permanently(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")
    
    db.delete(db_note)
    db.commit()
    return {"message": "Đã xóa vĩnh viễn"}


@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: int, note_update: schemas.NoteUpdate, db: Session = Depends(get_db)):

    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    update_data = note_update.dict(exclude_unset=True)
    
    if "tag_ids" in update_data:
        tag_ids = update_data.pop("tag_ids")

        if tag_ids is not None:
            new_tags = db.query(models.Tag).filter(models.Tag.id.in_(tag_ids)).all()
            db_note.tags = new_tags


    for key, value in update_data.items():
        setattr(db_note, key, value)

    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

