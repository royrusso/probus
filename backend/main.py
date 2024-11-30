from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from api import scan, default, info
from loguru import logger

app = FastAPI()


def minerva_openapi_schema():
    openapi_schema = get_openapi(
        title="Minerva",
        version="1.0",
        description="Minerva API",
        routes=app.routes,
    )
    openapi_schema["info"] = {
        "title": "Minerva REST API",
        "version": "1.0",
        "description": "REST API for Minerva - a network security tool",
        "contact": {
            "name": "Get Help with this API",
            "url": "https://github.com/royrusso/minerva",
            "email": "",
        },
        "license": {
            "name": "AGPL v3",
            "url": "https://github.com/royrusso/minerva/blob/master/LICENSE",
        },
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


origins = ["*"]
app = FastAPI()
app.include_router(scan.router)
app.include_router(info.router)
app.include_router(default.router)


app.openapi = minerva_openapi_schema

# TODO: We should disable this and reverse proxy through the UI's dev server.
#       That will match more closely with how we deploy and eliminate the need for CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
