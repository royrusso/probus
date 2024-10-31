from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from api import scan, default

app = FastAPI()


tags_metadata = [{"name": "nmap", "description": "Operations with nmap"}]


def netpretzel_openapi_schema():
    openapi_schema = get_openapi(
        title="Pretzel",
        version="1.0",
        description="Pretzel API",
        routes=app.routes,
    )
    openapi_schema["info"] = {
        "title": "Net Pretzel REST API",
        "version": "1.0",
        "description": "REST API for Net Pretzel - a network security tool",
        # "x-tagGroups" : tags_metadata,
        "contact": {
            "name": "Get Help with this API",
            "url": "https://github.com/royrusso/net-pretzel",
            "email": "",
        },
        "license": {
            "name": "AGPL v3",
            "url": "https://github.com/royrusso/net-pretzel/blob/master/LICENSE",
        },
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


# TODO: this needs to be an EVN var or something?
origins = ["*"]
app = FastAPI(openapi_tags=tags_metadata)
app.include_router(scan.router)
app.include_router(default.router)

app.openapi = netpretzel_openapi_schema

# TODO: We should disable this and reverse proxy through the UI's dev server.
#       That will match more closely with how we deploy and eliminate the need for CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# if __name__ == "__main__":
#     """
#     If using VSCode, you can run this script in the included FastAPI debug configuration.
#     """
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
