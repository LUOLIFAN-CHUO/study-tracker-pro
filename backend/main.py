from typing import List  # <--- 把它加在这里
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
import database
from database import engine, get_db

# 确保有这一行，用来建表
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.router.redirect_slashes = True

# 这一段是跨域授权，非常重要
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = models.User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def get_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).all()

@app.post("/items/", response_model=schemas.StudyItem)
def create_item_for_user(
    user_id: int, 
    item: schemas.StudyItemCreate, 
    db: Session = Depends(get_db)
):
    # 显式地把每一个字段都拿出来，清清楚楚地传给数据库模型
    db_item = models.StudyItem(
        title=item.title,
        language=item.language,
        duration=item.duration,  # 👈 显式存入时长！这样绝对不会漏
        user_id=user_id
    )
    
    db.add(db_item)
    db.commit()      # 提交保存到数据库
    db.refresh(db_item)  # 刷新获取最新数据（包含自动生成的 id）
    return db_item

@app.get("/users/{user_id}/items/", response_model=List[schemas.StudyItem])
def read_items(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.StudyItem).filter(models.StudyItem.user_id == user_id).all()