from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import User, Mediator, LenderMatch, Project, Borrower, Lender
from extensions import db
from datetime import datetime

mediator_bp = Blueprint('mediator', __name__)


# Helper function to check if user is a mediator
def is_mediator(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'mediator'


@mediator_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    if not is_mediator(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    mediator = Mediator.query.get(user_id)
    user = User.query.get(user_id)

    if not mediator or not user:
        return jsonify({'error': 'Mediator profile not found'}), 404

    profile_data = {
        **mediator.to_dict(),
        **user.to_dict()
    }

    return jsonify(profile_data), 200


@mediator_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()

    if not is_mediator(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()

    user = User.query.get(user_id)
    mediator = Mediator.query.get(user_id)

    if not user or not mediator:
        return jsonify({'error': 'Mediator profile not found'}), 404

    # Update user data
    if data.get('firstName'):
        user.first_name = data['firstName']
    if data.get('lastName'):
        user.last_name = data['lastName']
    if data.get('companyName'):
        user.company_name = data['companyName']
    if data.get('phoneNumber'):
        user.phone_number = data['phoneNumber']

    # Update mediator data
    if 'commissionRate' in data:
        mediator.commission_rate = data['commissionRate']

    user.updated_at = datetime.utcnow()
    mediator.updated_at = datetime.utcnow()

    db.session.commit()

    profile_data = {
        **mediator.to_dict(),
        **user.to_dict()
    }

    return jsonify(profile_data), 200


@mediator_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_all_matches():
    user_id = get_jwt_identity()

    if not is_mediator(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    matches = LenderMatch.query.order_by(LenderMatch.created_at.desc()).all()

    result = []
    for match in matches:
        match_data = match.to_dict()
        match_data['project'] = match.project.to_dict()

        # Get borrower info
        borrower = Borrower.query.get(match.borrower_id)
        borrower_user = User.query.get(match.borrower_id)

        if borrower and borrower_user:
            match_data['borrower'] = {
                'id': borrower.id,
                'company_name': borrower_user.company_name,
                'first_name': borrower_user.first_name,
                'last_name': borrower_user.last_name
            }

        # Get lender info
        lender = Lender.query.get(match.lender_id)
        lender_user = User.query.get(match.lender_id)

        if lender and lender_user:
            match_data['lender'] = {
                'id': lender.id,
                'company_name': lender_user.company_name,
                'first_name': lender_user.first_name,
                'last_name': lender_user.last_name
            }

        result.append(match_data)

    return jsonify(result), 200

