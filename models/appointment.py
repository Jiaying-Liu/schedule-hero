from db import db
from datetime import datetime

class AppointmentModel(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = (db.Column(db.String(255)))
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('UserModel')

    def __init__(self, name, description, start, end, user_id):
        self.name = name
        self.description = description
        self.start = datetime.strptime(start, '%m-%d-%Y %H:%S')
        self.end = datetime.strptime(end, '%m-%d-%Y %H:%S')
        self.user_id = user_id

    def json(self):
        return {'id': self.id, 'name': self.name, 'description': self.description,
            'start': self.start.strftime('%m-%d-%Y %H:%S'),
            'end': self.end.strftime('%m-%d-%Y %H:%S')}
    
    @classmethod
    def find_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id)

    @classmethod
    def find_by_app_id_and_user_id(cls, _id, user_id):
        return cls.query.filter_by(id=_id, user_id=user_id)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self, name, description, start, end):
        self.name = name
        self.description = description
        self.start = datetime.strptime(start, '%m-%d-%Y %H:%S')
        self.end = datetime.strptime(end, '%m-%d-%Y %H:%S')
