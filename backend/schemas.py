from pydantic import BaseModel
from typing import List, Optional, Any

# ==========================================
# 1. 学习项目 (StudyItem) 相关的 Schema
# ==========================================
class StudyItemBase(BaseModel):
    title: str
    language: str = "General"
    duration: float = 0.0  # 👈 你心心念念的时长字段，必须在这里！

class StudyItemCreate(StudyItemBase):
    pass

class StudyItem(StudyItemBase):
    id: int
    user_id: int
    logs: list = []  # 👈 还原你之前 Swagger 里的 logs 结构，防止报错

    class Config:
        # Pydantic V2 的写法（允许从数据库模型读取数据）
        # 如果你用的 Pydantic V1 报错，可以把这行改成 orm_mode = True
        from_attributes = True


# ==========================================
# 2. 用户 (User) 相关的 Schema
# ==========================================
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    # 如果你在 main.py 里让查询用户时也返回他的学习记录，可以把下面这行的 # 去掉：
    # items: List[StudyItem] = []

    class Config:
        from_attributes = True