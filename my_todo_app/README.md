# Running
These assume you are using VSCode's terminal.
If fastapi and uvicorn are not already installed:
```
.\venv\Scripts\activate
pip install fastapi uvicorn
cd my_todo_app
uvicorn main:app --port 5173 --reload
```

If installed:
```
.\venv\Scripts\activate
cd my_todo_app
uvicorn main:app --port 5173 --reload
```

```powershell
python -m venv venv
.\venv\Scripts\activate
```

```powershell
deactivate
```

