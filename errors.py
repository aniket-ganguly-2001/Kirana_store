import json

from flask import make_response
from werkzeug.exceptions import HTTPException


class NotFoundError(HTTPException):
    def __init__(self, status_code):
        self.response = make_response('', status_code)

class AccessError(HTTPException):
    def __init__(self, status_code):
        self.response = make_response('', status_code)

class ValidationError(HTTPException):
    def __init__(self, status_code, error_code, error_msg):
        msg = {"error_code": error_code, "error_message": error_msg}
        self.response = make_response(json.dumps(msg), status_code)