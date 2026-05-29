from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base  # 👈 绝对不能写成 from .database

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)

class StudyItem(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    language = Column(String, index=True, default="General")
    # --- 关键：数据库里的时长字段 ---
    duration = Column(Float, default=0.0) 
    # ---------------------------
    user_id = Column(Integer, ForeignKey("users.id"))