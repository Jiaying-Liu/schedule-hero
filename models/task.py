from db import db
from datetime import datetime

class TaskModel(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(255))
    deadline = db.Column(db.DateTime)
    priority = db.Column(db.String(10), db.CheckConstraint("priority = 'low' or priority = 'medium' or priority = 'high'"))

    ## foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('UserModel')

    def __init__(self, name, description, deadline, priority, user_id):
        self.name = name
        self.description = description
        ## will need to do datetime string conversion
        self.deadline = datetime.strptime(deadline, '%m-%d-%Y %H:%S')
        self.priority = priority
        self.user_id = user_id

    def json(self):
        return {'id': self.id, 'name': self.name, 'description': self.description,
            'deadline': self.deadline.strftime('%m-%d-%Y %H:%S'), 'priority': self.priority }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id)

    @classmethod
    def find_by_task_id_and_user_id(cls, _id, user_id):
        return cls.query.filter_by(id=_id, user_id=user_id)

    @classmethod
    def find_by_name_and_user_id(cls, name, user_id):
        return cls.query.filter_by(name=name, user_id=user_id)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, description, deadline, priority):
        self.name = name
        self.description = description
        self.deadline = datetime.strptime(deadline, '%m-%d-%Y %H:%S')
        self.priority = priority