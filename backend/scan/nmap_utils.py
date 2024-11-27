import os
from loguru import logger


def is_root(func):
    """
    Decorator to check if the user is running the script as root.
    """

    def wrapper(*args, **kwargs):
        if os.geteuid() != 0:
            logger.error(
                "You need to have root privileges to run this script.\nPlease try again, this time using 'sudo'. Exiting."
            )
            return {"error": True, "message": "You need to have root privileges to run this script."}
            # exit()
        return func(*args, **kwargs)

    return wrapper
