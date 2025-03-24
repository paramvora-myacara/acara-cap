from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import User, Borrower, Lender, Project, Document, LenderMatch, IntroductionRequest, Communication
from extensions import db
from app.utils.file_storage import save_file, get_file_path
from app.utils.match_algorithm import find_matching_lenders
import os
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

borrower_bp = Blueprint('borrower', __name__)


# Helper functions to check user roles
def is_lender(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'lender'


def is_mediator(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'mediator'


def is_borrower(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'borrower'


@borrower_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        borrower = Borrower.query.get(user_id)
        user = User.query.get(user_id)

        if not borrower or not user:
            return jsonify({'error': 'Borrower profile not found'}), 404

        profile_data = {
            **borrower.to_dict(),
            **user.to_dict()
        }

        return jsonify(profile_data), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        user = User.query.get(user_id)
        borrower = Borrower.query.get(user_id)

        if not user or not borrower:
            return jsonify({'error': 'Borrower profile not found'}), 404

        # Update user data
        if data.get('firstName'):
            user.first_name = data['firstName']
        if data.get('lastName'):
            user.last_name = data['lastName']
        if data.get('companyName'):
            user.company_name = data['companyName']
        if data.get('phoneNumber'):
            user.phone_number = data['phoneNumber']

        # Update borrower data
        if data.get('additionalInfo'):
            borrower.set_additional_info(data['additionalInfo'])

        user.updated_at = datetime.utcnow()
        borrower.updated_at = datetime.utcnow()

        db.session.commit()

        profile_data = {
            **borrower.to_dict(),
            **user.to_dict()
        }

        return jsonify(profile_data), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@borrower_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        projects = Project.query.filter_by(borrower_id=user_id).order_by(Project.created_at.desc()).all()
        return jsonify([project.to_dict() for project in projects]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/projects/<project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        project = Project.query.filter_by(id=project_id, borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        return jsonify(project.to_dict()), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required_fields = ['projectAddress', 'assetType', 'dealType', 'capitalType']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        project = Project(
            borrower_id=user_id,
            project_address=data['projectAddress'],
            asset_type=data['assetType'],
            deal_type=data['dealType'],
            capital_type=data['capitalType'],
            debt_request=data.get('debtRequest'),
            total_cost=data.get('totalCost'),
            completed_value=data.get('completedValue'),
            project_description=data.get('projectDescription')
        )

        db.session.add(project)
        db.session.commit()

        # Find matching lenders using the algorithm
        matching_lenders = find_matching_lenders(project)

        # Create matches in the database
        for lender, score in matching_lenders:
            match = LenderMatch(
                project_id=project.id,
                lender_id=lender.id,
                borrower_id=user_id,
                match_score=score
            )
            db.session.add(match)

        db.session.commit()

        return jsonify(project.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@borrower_bp.route('/projects/<project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        project = Project.query.filter_by(id=project_id, borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if data.get('projectAddress'):
            project.project_address = data['projectAddress']
        if data.get('assetType'):
            project.asset_type = data['assetType']
        if data.get('dealType'):
            project.deal_type = data['dealType']
        if data.get('capitalType'):
            project.capital_type = data['capitalType']
        if 'debtRequest' in data:
            project.debt_request = data['debtRequest']
        if 'totalCost' in data:
            project.total_cost = data['totalCost']
        if 'completedValue' in data:
            project.completed_value = data['completedValue']
        if data.get('projectDescription'):
            project.project_description = data['projectDescription']

        project.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify(project.to_dict()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@borrower_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_matches():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        matches = LenderMatch.query.join(Project).filter(Project.borrower_id == user_id).order_by(
            LenderMatch.created_at.desc()).all()

        result = []
        for match in matches:
            match_data = match.to_dict()
            match_data['project'] = match.project.to_dict()

            # Get lender info
            lender_user = User.query.get(match.lender_id)
            if lender_user:
                match_data['lender'] = {
                    'id': match.lender_id,
                    'company_name': lender_user.company_name,
                    'first_name': lender_user.first_name,
                    'last_name': lender_user.last_name
                }

            result.append(match_data)

        return jsonify(result), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/request-introduction', methods=['POST'])
@jwt_required()
def request_introduction():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        data = request.get_json()

        if not data or not data.get('projectId') or not data.get('lenderId'):
            return jsonify({'error': 'Project ID and lender ID are required'}), 400

        # Check if project belongs to borrower
        project = Project.query.filter_by(id=data['projectId'], borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found or does not belong to borrower'}), 404

        # Check if lender exists
        lender = Lender.query.get(data['lenderId'])

        if not lender:
            return jsonify({'error': 'Lender not found'}), 404

        # Check if introduction request already exists
        existing_request = IntroductionRequest.query.filter_by(
            project_id=data['projectId'],
            borrower_id=user_id,
            lender_id=data['lenderId']
        ).first()

        if existing_request:
            return jsonify({'error': 'Introduction request already exists'}), 409

        introduction_request = IntroductionRequest(
            project_id=data['projectId'],
            borrower_id=user_id,
            lender_id=data['lenderId']
        )

        db.session.add(introduction_request)
        db.session.commit()

        return jsonify(introduction_request.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@borrower_bp.route('/projects/<project_id>/documents', methods=['GET'])
@jwt_required()
def get_documents(project_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Check if project belongs to borrower
        project = Project.query.filter_by(id=project_id, borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found or does not belong to borrower'}), 404

        documents = Document.query.filter_by(project_id=project_id).order_by(Document.uploaded_at.desc()).all()

        return jsonify([document.to_dict() for document in documents]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/projects/<project_id>/documents', methods=['POST'])
@jwt_required()
def upload_document(project_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Check if project belongs to borrower
        project = Project.query.filter_by(id=project_id, borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found or does not belong to borrower'}), 404

        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file:
            try:
                file_path, file_name, file_type = save_file(file, project_id)
                description = request.form.get('description', '')

                document = Document(
                    project_id=project_id,
                    uploader_id=user_id,
                    file_name=file_name,
                    file_type=file_type,
                    file_path=file_path,
                    description=description
                )

                db.session.add(document)
                db.session.commit()

                return jsonify(document.to_dict()), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'error': f'Failed to upload file: {str(e)}'}), 500

        return jsonify({'error': 'Failed to upload file'}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/documents/<document_id>/download', methods=['GET'])
@jwt_required()
def download_document(document_id):
    user_id = get_jwt_identity()

    try:
        document = Document.query.get(document_id)

        if not document:
            return jsonify({'error': 'Document not found'}), 404

        # Check if user has access to the document
        project = Project.query.get(document.project_id)

        if not project or (project.borrower_id != user_id and not is_lender(user_id) and not is_mediator(user_id)):
            return jsonify({'error': 'Unauthorized access'}), 403

        try:
            file_path = get_file_path(document.file_path)

            if not os.path.exists(file_path):
                return jsonify({'error': 'File not found on server'}), 404

            return send_file(file_path, as_attachment=True, download_name=document.file_name)
        except Exception as e:
            return jsonify({'error': f'Failed to download file: {str(e)}'}), 500
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/projects/<project_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(project_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Check if project belongs to borrower
        project = Project.query.filter_by(id=project_id, borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found or does not belong to borrower'}), 404

        messages = Communication.query.filter_by(project_id=project_id).filter(
            (Communication.sender_id == user_id) | (Communication.recipient_id == user_id)
        ).order_by(Communication.created_at).all()

        result = []
        for message in messages:
            message_data = message.to_dict()

            # Get sender info
            sender = User.query.get(message.sender_id)
            if sender:
                message_data['sender'] = {
                    'id': sender.id,
                    'first_name': sender.first_name,
                    'last_name': sender.last_name,
                    'company_name': sender.company_name,
                    'role': sender.role
                }

            # Get recipient info
            recipient = User.query.get(message.recipient_id)
            if recipient:
                message_data['recipient'] = {
                    'id': recipient.id,
                    'first_name': recipient.first_name,
                    'last_name': recipient.last_name,
                    'company_name': recipient.company_name,
                    'role': recipient.role
                }

            result.append(message_data)

        return jsonify(result), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500


@borrower_bp.route('/projects/<project_id>/messages', methods=['POST'])
@jwt_required()
def send_message(project_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Check if project belongs to borrower
        project = Project.query.filter_by(id=project_id, borrower_id=user_id).first()

        if not project:
            return jsonify({'error': 'Project not found or does not belong to borrower'}), 404

        data = request.get_json()

        if not data or not data.get('recipientId') or not data.get('message'):
            return jsonify({'error': 'Recipient ID and message are required'}), 400

        # Check if recipient exists
        recipient = User.query.get(data['recipientId'])

        if not recipient:
            return jsonify({'error': 'Recipient not found'}), 404

        communication = Communication(
            project_id=project_id,
            sender_id=user_id,
            recipient_id=data['recipientId'],
            message=data['message']
        )

        db.session.add(communication)
        db.session.commit()

        return jsonify(communication.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@borrower_bp.route('/messages/<message_id>/read', methods=['PUT'])
@jwt_required()
def mark_message_as_read(message_id):
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        message = Communication.query.filter_by(id=message_id, recipient_id=user_id).first()

        if not message:
            return jsonify({'error': 'Message not found or user is not the recipient'}), 404

        message.is_read = True
        db.session.commit()

        return jsonify(message.to_dict()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@borrower_bp.route('/unread-messages', methods=['GET'])
@jwt_required()
def get_unread_message_count():
    user_id = get_jwt_identity()

    if not is_borrower(user_id):
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        count = Communication.query.filter_by(recipient_id=user_id, is_read=False).count()

        return jsonify({'count': count}), 200
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

