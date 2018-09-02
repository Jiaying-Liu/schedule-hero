from flask_restful import Resource, reqparse
from flask_jwt import jwt_required, current_identity
from models.appointment import AppointmentModel
import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

class Appointment(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id',
        type=int,
        required=True,
        help="Id cannot be blank."
    )
    parser.add_argument('name', type=str, required=False)
    parser.add_argument('description', type=str, required=False)
    parser.add_argument('start', type=str, required=False)
    parser.add_argument('end', type=str, required=False)


    @jwt_required()
    def post(self):
        data = Appointment.parser.parse_args()

        logging.debug('name is in is {}'.format('name' in data))

        if ('name' not in data) or ('description' not in data) or ('start' not in data) or ('end' not in data):
            return {'message': 'invalid json sent in body'}, 400

        appoint = AppointmentModel(data['name'], data['description'], data['start'],
            data['end'], current_identity.first().id)
        try:
            appoint.save_to_db()
        except:
            return {'message': 'error occurred while inserting appointment'}, 500
        return appoint.json(), 201

    @jwt_required()
    def put(self):
        data = Appointment.parser.parse_args()
        appoint = AppointmentModel.find_by_app_id_and_user_id(data['id'], current_identity.first().id).first()

        if 'name' not in data or 'description' not in data or 'start' not in data or 'end' not in data:
            return {'message': 'invalid json sent in body'}, 400

        if appoint is None:
            appoint = AppointmentModel(data['name'], data['description'], data['start'],
                data['end'], current_identity.first().id)
        else:
            appoint.update(data['name'], data['description'], data['start'], data['end'])
        try:
            appoint.save_to_db()
        except:
            return {'message': 'error occurred while saving appointment'}, 500
        return appoint.json()

    @jwt_required()
    def delete(self):
        data = Appointment.parser.parse_args()
        appointment = AppointmentModel.find_by_app_id_and_user_id(data['id'], current_identity.first().id).first()
        if appointment is not None:
            appointment.delete_from_db()

        return {'message': 'appointment is deleted'}


class AppointmentList(Resource):
    @jwt_required()
    def get(self):
        return {'appointments': [appoint.json() for appoint in AppointmentModel.find_by_user_id(current_identity.first().id).all()]}
