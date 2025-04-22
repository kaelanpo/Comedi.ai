from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Mount the static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse("dashboard.html")

@app.get("/{filename}.html")
async def read_html(filename: str):
    if os.path.exists(f"{filename}.html"):
        return FileResponse(f"{filename}.html")
    raise HTTPException(status_code=404, detail="File not found") 