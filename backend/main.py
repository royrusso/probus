from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from api import info, profile
from loguru import logger
from backend.api import nmap, scan_event
from db import engine
from backend import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def probus_openapi_schema():
    openapi_schema = get_openapi(
        title="Probus",
        version="1.0",
        description="Probus API",
        routes=app.routes,
    )
    openapi_schema["info"] = {
        "title": "Probus REST API",
        "version": "1.0",
        "description": "REST API for Probus - a network security tool",
        "contact": {
            "name": "Get Help with this API",
            "url": "https://github.com/royrusso/probus",
            "email": "",
        },
        "license": {
            "name": "AGPL v3",
            "url": "https://github.com/royrusso/probus/blob/master/LICENSE",
        },
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


origins = ["*"]
app = FastAPI()
app.include_router(profile.router)
app.include_router(scan_event.router)
app.include_router(nmap.router)
app.include_router(info.router)

app.openapi = probus_openapi_schema

# TODO: We should disable this and reverse proxy through the UI's dev server.
#       That will match more closely with how we deploy and eliminate the need for CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


### BEGIN: attempt to serve the frontend via FastAPI so we only have one Docker container
# Fails on serving non-cached assets? Fails on refreshing the page
# class SPAStaticFiles(StaticFiles):
#     async def get_response(self, path: str, scope):
#         response = await super().get_response(path, scope)
#         if response.status_code == 404:
#             response = await super().get_response(".", scope)
#         return response
# app.mount("/", SPAStaticFiles(directory="frontend/dist", html=True), name="frontend")
## END


if __name__ == "__main__":
    """
    If using VSCode, you can run this script in the included FastAPI debug configuration
    instead of running __main__.

    Alternatively, you can run this script directly from the command line, which will ignore this
    block and run the server: uvicorn main:app --reload
    """
    # import FindMyIP as ip

    # print(ip.internet())
    # print(ip.internal())
    # print(ip.external())

    import uvicorn
    import settings

    host = settings.API_HOST_IP
    port = int(settings.API_HOST_PORT)
    logger.info(f"Starting server at {host}:{port}")
    uvicorn.run(app, host=host, port=port)
