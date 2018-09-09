import os

from flask import Flask
from flask_restful import Api
from flask_jwt import JWT

from security import authenticate, identity
from resources.user import UserRegister, CurrentUser
from resources.task import Task, TaskList
from resources.appointment import Appointment, AppointmentList

app = Flask(__name__, static_url_path='/client/build')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'secret'
api = Api(app)

if os.environ.get('DATABASE_URL') is None:
    @app.before_first_request
    def create_tables():
        db.create_all()

jwt = JWT(app, authenticate, identity)

api.add_resource(UserRegister, '/api/register')
api.add_resource(Task, '/api/task')
api.add_resource(TaskList, '/api/tasks')
api.add_resource(Appointment, '/api/appointment')
api.add_resource(AppointmentList, '/api/appointments')
api.add_resource(CurrentUser, '/api/current_user')

if os.environ.get('IS_HEROKU') is not None:
    @app.route('/')
    def root():
        return app.send_static_file('index.html')


if __name__ == '__main__':
    from db import db
    db.init_app(app)
    app.run(port=5000, debug=True)