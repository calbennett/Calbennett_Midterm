from fastapi import APIRouter, Path, HTTPException, status
from model import Todo, TodoRequest
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List

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
async def get_todo_by_id(id: int = Path(..., title="default")) -> dict:
    for todo in todo_list:
        if todo.id == id:
            return {"todo": todo}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The todo with ID={id} is not found.",
    )


@todo_router.put("/todos/{id}")
async def update_todo(id: int, todo: TodoRequest) -> dict:
    print(id)
    try:
        for x in todo_list:
            print(x.id)
            if x.id == id:
                print(f"Received data: {todo}")
                x.title = todo.title
                x.cls = todo.cls
                x.due = todo.due
                x.priority = todo.priority
                updatedTodo = Todo(id=x.id, title=x.title, cls=x.cls, due=x.due, priority=x.priority)
                for i, x in enumerate(todo_list):
                    if x.id == id:
                        todo_list[i] = updatedTodo
                return {"message": "Todo found"}
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The todo with ID={id} is not found.",
        )
    except Exception as e:
        print(f"Error processing request: {e}")
        return {"error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR

@todo_router.delete("/todos/{id}")
async def delete_todo(id: int) -> dict:
    try:
        # Use a list comprehension to filter out the todo with the given ID
        deleted_todo = [todo for todo in todo_list if todo.id == id]
        
        if not deleted_todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"The todo with ID={id} is not found.",
            )
        
        # Remove the todo from the todo_list
        todo_list.remove(deleted_todo[0])

        return {"message": f"Todo with ID={id} deleted successfully"}
    except Exception as e:
        print(f"Error processing request: {e}")
        return {"error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR