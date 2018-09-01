from flask_restful import Resource, reqparse
from flask_jwt import jwt_required, current_identity
from models.task import TaskModel
import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

class Task(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name',
        type=str,
        required=True,
        help="Name cannot be blank."
    )
    parser.add_argument('id',
        type=int,
        required=True,
        help="Id cannot be blank."
    )
    parser.add_argument('description',
        type=str,
        required=True,
        help="Must have description arg."
    )
    parser.add_argument('deadline',
        type=str,
        required=True,
        help="deadline cannot be blank."
    )
    parser.add_argument('priority',
        type=str,
        required=True,
        help="Priority cannot be blank."
    )

    # @jwt_required()
    # def get(self, name):
    #     logging.debug(current_identity.first().id)
    #     task = TaskModel.find_by_name_and_user_id(name, current_identity.first().id).first()
    #     if task:
    #         return task.json()
    #     return {'message': 'Task not found'}, 404

    @jwt_required()
    def post(self):
        data = Task.parser.parse_args()
        task = TaskModel(data['name'], data['description'], data['deadline'],
            data['priority'], current_identity.first().id)
        try:
            task.save_to_db()
        except:
            return {'message': 'error occurred while inserting task'}, 500
        return task.json(), 201

    @jwt_required()
    def put(self):
        logging.debug("in put")
        data = Task.parser.parse_args()
        task = TaskModel.find_by_task_id_and_user_id(data['id'], current_identity.first().id).first()

        if task is None:
            task = TaskModel(data['name'], data['description'], data['deadline'],
                data['priority'], current_identity.first().id)
        else:
            task.update(data['name'], data['description'], data['deadline'], data['priority'])
        try:
            task.save_to_db()
        except:
            return {'message': 'error occurred while saving task'}, 500
        return task.json()

            


class TaskList(Resource):
    @jwt_required()
    def get(self):
        return {'tasks': [task.json() for task in TaskModel.find_by_user_id(current_identity.first().id).all()]}