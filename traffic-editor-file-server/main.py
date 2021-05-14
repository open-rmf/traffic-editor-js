#!/usr/bin/env python3

from fastapi import FastAPI, File, UploadFile
from fastapi.logger import logger as fastapi_logger
from uvicorn.logging import ColourizedFormatter
import logging
import sys
import os


logger = logging.getLogger('traffic-editor-file-server')
console_formatter = ColourizedFormatter(
    "{levelprefix:<8} {name}: {message}",
    style="{",
    use_colors=True
)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setFormatter(console_formatter)
logger.addHandler(ch)
logger.debug("hello world")

if 'MAP_DIR' not in os.environ:
    logging.error("ERROR! MAP_DIR must be set in the environment")
    sys.exit(1)

map_dir = os.getenv("MAP_DIR")
logging.info(f"serving from {map_dir}")

app = FastAPI()

@app.get("/files/{filename}")
async def get_file(filename: str):
    return {"filename": filename}

@app.post("/map_file")
async def write_map_file(file: UploadFile = File(...)):
    return {"status": "ok"}
