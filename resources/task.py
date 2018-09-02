from flask_restful import Resource, reqparse
from flask_jwt import jwt_required, current_identity
from models.task import TaskModel
import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

class Task(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name',
        type=str,
        required=False
    )
    parser.add_argument('id',
        type=int,
        required=True,
        help="Id cannot be blank."
    )
    parser.add_argument('description',
        type=str,
        required=False
    )
    parser.add_argument('deadline',
        type=str,
        required=False
    )
    parser.add_argument('priority',
        type=str,
        required=False
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

        if 'name' not in data or 'description' not in data or 'deadline' not in data or 'priority' not in data:
            return {'message': 'invalid json sent in body'}, 400

        task = TaskModel(data['name'], data['description'], data['deadline'],
            data['priority'], current_identity.first().id)
        try:
            task.save_to_db()
        except:
            return {'message': 'error occurred while inserting task'}, 500
        return task.json(), 201

    @jwt_required()
    def put(self):
        data = Task.parser.parse_args()
        task = TaskModel.find_by_task_id_and_user_id(data['id'], current_identity.first().id).first()

        if 'name' not in data or 'description' not in data or 'deadline' not in data or 'priority' not in data:
            return {'message': 'invalid json sent in body'}, 400

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
    
    @jwt_required()
    def delete(self):
        data = Task.parser.parse_args()
        task = TaskModel.find_by_task_id_and_user_id(data['id'], current_identity.first().id).first()
        if task is not None:
            task.delete_from_db()

        return {'message': 'task is deleted'}


class TaskList(Resource):
    @jwt_required()
    def get(self):
        return {'tasks': [task.json() for task in TaskModel.find_by_user_id(current_identity.first().id).all()]}