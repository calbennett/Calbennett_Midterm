from pydantic import BaseModel
from datetime import date


class Todo(BaseModel):
    id: int
    title: str
    cls: str
    due: date


class TodoRequest(BaseModel):
    title: str
    cls: str
