#!/usr/bin/env python3

from glob import glob
import logging
import os
import sys

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from uvicorn.logging import ColourizedFormatter


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
    logger.error("MAP_DIR must be set in the environment")
    sys.exit(1)

map_dir = os.getenv("MAP_DIR")
logger.info(f"serving from {map_dir}")

# spin through MAP_DIR and use the first .building.yaml file we see
map_filenames = glob(os.path.join(map_dir, "*.building.yaml"))
if not map_filenames:
    logger.error(f"couldn't find a .building.yaml file in {map_dir}")
    sys.exit(1)

map_filename = map_filenames[0]
logger.info(f"using {map_filename} as the map")

app = FastAPI()

@app.get("/file/{filename}")
async def get_file(filename: str):
    # todo: sanitize the filename
    return {"filename": filename}

@app.get("/map_file")
async def get_map_file():
    return FileResponse(map_filename)

@app.post("/map_file")
async def write_map_file(file: UploadFile = File(...)):
    # todo: write the uploaded file to map_filename
    return {"status": "ok"}
