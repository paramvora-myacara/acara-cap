from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.models import User, Borrower, Lender, Mediator
from extensions import db
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        'user': user.to_dict(),
        'access_token': access_token
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({'error': 'Email, password, and role are required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = User(
        email=data['email'],
        first_name=data.get('firstName'),
        last_name=data.get('lastName'),
        company_name=data.get('companyName'),
        phone_number=data.get('phoneNumber'),
        role=data['role']
    )
    user.set_password(data['password'])

    db.session.add(user)

    # Create role-specific record
    if data['role'] == 'borrower':
        borrower = Borrower(id=user.id)
        if data.get('additionalInfo'):
            borrower.set_additional_info(data['additionalInfo'])
        db.session.add(borrower)
    elif data['role'] == 'lender':
        lender = Lender(id=user.id)
        if data.get('lendingCriteria'):
            lender.set_lending_criteria(data['lendingCriteria'])
        db.session.add(lender)
    elif data['role'] == 'mediator':
        mediator = Mediator(id=user.id, commission_rate=data.get('commissionRate'))
        db.session.add(mediator)

    db.session.commit()

    access_token = create_access_token(identity=user.id)

    return jsonify({
        'user': user.to_dict(),
        'access_token': access_token
    }), 201


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    if not data or not data.get('currentPassword') or not data.get('newPassword'):
        return jsonify({'error': 'Current password and new password are required'}), 400

    if not user.check_password(data['currentPassword']):
        return jsonify({'error': 'Current password is incorrect'}), 401

    user.set_password(data['newPassword'])
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200

