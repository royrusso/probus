from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["default"])
def read_root():
    return {"Minerva says": "Hello World"}
