from fastapi import APIRouter, Path, HTTPException, status
from model import Todo, TodoRequest
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List
import uuid

todo_router = APIRouter()

todo_list: List[Todo] = []
max_id: int = 0


@todo_router.post("/todos", status_code=status.HTTP_201_CREATED)
async def add_todo(todo: TodoRequest) -> dict:
    global max_id

    newTodo = Todo(id=max_id, title=todo.title, cls=todo.cls, due=todo.due, priority=todo.priority)
    max_id += 1
    todo_list.append(newTodo)
    json_compatible_item_data = newTodo.model_dump()
    return JSONResponse(json_compatible_item_data, status_code=status.HTTP_201_CREATED)


@todo_router.get("/todos")
async def get_todos() -> dict:
    json_compatible_item_data = jsonable_encoder(todo_list)
    return JSONResponse(content=json_compatible_item_data)


@todo_router.get("/todos/{id}")
async def get_todo_by_id(id: str = Path(..., title="default")) -> dict:
    for todo in todo_list:
        if todo.id == id:
            return {"todo": todo}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The todo with ID={id} is not found.",
    )


@todo_router.put("/todos/{id}")
async def update_todo(id: str, todo: TodoRequest) -> dict:
    for x in todo_list:
        if x.id == id:
            x.title = todo.title
            x.cls = todo.cls
            x.due = todo.due  # Assuming 'due' is a field in the Todo model
            x.priority = todo.priority
            return {"message": "Todo updated successfully"}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The todo with ID={id} is not found.",
    )

