from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class Todo(BaseModel):
    id: int
    title: str
    cls: str
    due: Optional[str]
    priority: Optional[int]



class TodoRequest(BaseModel):
    title: str
    cls: str
    due: Optional[str]
    priority: Optional[int]
