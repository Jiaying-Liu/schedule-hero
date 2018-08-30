from flask_restful import Resource, reqparse
from models.user import UserModel
import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

class UserRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name',
        type=str,
        required=True,
        help="User must have name!")
    parser.add_argument('username',
        type=str,
        required=True,
        help="user must have username!")
    parser.add_argument('password',
        type=str,
        required=True,
        help="user must have password!")

    def post(self):
        data = UserRegister.parser.parse_args()
        user = UserModel.find_by_username(data['username'])
        if user is None:

            user = UserModel(**data)
            user.save_to_db()

            return {"message": "User created successfully."}, 201
        else:
            ##logging.debug(user.name)
            return {"message": "A user with that username already exists!"}, 400