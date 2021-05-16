# set up an environment

```
pip3 install pipenv
pipenv install
```

Now you should be inside a shell set up with all the fancy new packages we need.

# how to run it

```
pipenv shell
MAP_DIR=your-map-dir uvicorn main:app
```
(you can add `--reload` if you're working on the code)

# how to test

Test downloading a map file via GET:
```
curl http://localhost:8000/map_file
```

Test uploading a file via POST:
```
cd MAP_DIR
curl -F "file=@MAP_NAME.building.yaml" http://localhost:8000/map_file
```

If you want to run the server with lots of debug to console, add `--log-level trace` to the end of your `uvicorn` incantation above.
