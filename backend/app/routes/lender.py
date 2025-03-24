from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import User, Lender, LenderMatch, IntroductionRequest, Project, Borrower
from extensions import db
from datetime import datetime

lender_bp = Blueprint('lender', __name__)


# Helper function to check if user is a lender
def is_lender(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'lender'


@lender_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    if not is_lender(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    lender = Lender.query.get(user_id)
    user = User.query.get(user_id)

    if not lender or not user:
        return jsonify({'error': 'Lender profile not found'}), 404

    profile_data = {
        **lender.to_dict(),
        **user.to_dict()
    }

    return jsonify(profile_data), 200


@lender_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()

    if not is_lender(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()

    user = User.query.get(user_id)
    lender = Lender.query.get(user_id)

    if not user or not lender:
        return jsonify({'error': 'Lender profile not found'}), 404

    # Update user data
    if data.get('firstName'):
        user.first_name = data['firstName']
    if data.get('lastName'):
        user.last_name = data['lastName']
    if data.get('companyName'):
        user.company_name = data['companyName']
    if data.get('phoneNumber'):
        user.phone_number = data['phoneNumber']

    # Update lender data
    if data.get('lendingCriteria'):
        lender.set_lending_criteria(data['lendingCriteria'])

    user.updated_at = datetime.utcnow()
    lender.updated_at = datetime.utcnow()

    db.session.commit()

    profile_data = {
        **lender.to_dict(),
        **user.to_dict()
    }

    return jsonify(profile_data), 200


@lender_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_matches():
    user_id = get_jwt_identity()

    if not is_lender(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    matches = LenderMatch.query.filter_by(lender_id=user_id).order_by(LenderMatch.created_at.desc()).all()

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

        result.append(match_data)

    return jsonify(result), 200


@lender_bp.route('/introduction-requests', methods=['GET'])
@jwt_required()
def get_introduction_requests():
    user_id = get_jwt_identity()

    if not is_lender(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    requests = IntroductionRequest.query.filter_by(
        lender_id=user_id,
        request_status='pending'
    ).order_by(IntroductionRequest.requested_at.desc()).all()

    result = []
    for req in requests:
        req_data = req.to_dict()
        req_data['project'] = req.project.to_dict()

        # Get borrower info
        borrower = Borrower.query.get(req.borrower_id)
        borrower_user = User.query.get(req.borrower_id)

        if borrower and borrower_user:
            req_data['borrower'] = {
                'id': borrower.id,
                'company_name': borrower_user.company_name,
                'first_name': borrower_user.first_name,
                'last_name': borrower_user.last_name
            }

        result.append(req_data)

    return jsonify(result), 200


@lender_bp.route('/introduction-requests/<request_id>/respond', methods=['POST'])
@jwt_required()
def respond_to_introduction(request_id):
    user_id = get_jwt_identity()

    if not is_lender(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()

    if not data or 'accept' not in data:
        return jsonify({'error': 'Accept status is required'}), 400

    intro_request = IntroductionRequest.query.filter_by(id=request_id, lender_id=user_id).first()

    if not intro_request:
        return jsonify({'error': 'Introduction request not found or does not belong to lender'}), 404

    # Update request status
    intro_request.request_status = 'accepted' if data['accept'] else 'rejected'
    intro_request.updated_at = datetime.utcnow()

    # If accepted, create a match
    if data['accept']:
        # Check if match already exists
        existing_match = LenderMatch.query.filter_by(
            project_id=intro_request.project_id,
            lender_id=user_id,
            borrower_id=intro_request.borrower_id
        ).first()

        if not existing_match:
            match = LenderMatch(
                project_id=intro_request.project_id,
                lender_id=user_id,
                borrower_id=intro_request.borrower_id,
                match_score=0.85  # Sample score
            )
            db.session.add(match)

    db.session.commit()

    return jsonify(intro_request.to_dict()), 200

