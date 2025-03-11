from flask import Blueprint, request, jsonify, current_app
from app.models.models import Lender, User
from app.services.lender_matches import get_preliminary_matches # We will modify this service
from sqlalchemy import text
from app import db
import jwt
from datetime import datetime, timedelta
import json

bp = Blueprint('api', __name__) # Corrected name argument


@bp.route('/preliminary_match', methods=['GET']) # Changed to GET method
def preliminary_match():
    """
    Endpoint to get all lenders for preliminary matching.

    Returns:
    {
        "lenders": [
            {
                "lender_id": 1,
                "user_id": 2,
                "lending_criteria": { ... },
                "user": {
                    "email": "lender1@example.com",
                    "company_name": "Lender Company A"
                }
            },
            ...
        ],
        "success": true
    }
    """
    result = get_preliminary_matches() # Modified service call to get all lenders

    if result['success']:
        lenders_data = [lender.to_dict() for lender in result['lenders']] # Serialize lenders
        return jsonify({
            'lenders': lenders_data,
            'success': True
        })
    else:
        return jsonify({
            'message': result['message'],
            'success': False
        }), 500

@bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user (borrower, lender, or mediator).

    Expected request body:
    {
        "email": "user@example.com",
        "password": "securepassword",
        "role": "borrower",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "555-123-4567",
        "company_name": "Acme Corp",
        "lending_criteria": {},  // Required for lenders
        "additional_borrower_info": {},  // Optional for borrowers
        "commission_rate": 2.5  // Optional for mediators
    }
    """
    pass  # Placeholder for future implementation


@bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate a user and return a JWT token.

    Expected request body:
    {
        "email": "user@example.com",
        "password": "securepassword"
    }
    """
    pass  # Placeholder for future implementation


@bp.route('/borrowers/<int:borrower_id>/projects', methods=['POST'])
def create_project(borrower_id):
    """
    Create a new project for a borrower.

    Expected request body:
    {
        "project_address": "123 Main St, New York, NY",
        "asset_type": "Multifamily",
        "deal_type": "Acquisition",
        "capital_type": "Debt",
        "debt_request": 5000000,
        "total_cost": 7000000,
        "completed_value": 8000000,
        "project_description": "A 50-unit multifamily property..."
    }
    """
    pass  # Placeholder for future implementation


@bp.route('/borrowers/<int:borrower_id>/projects', methods=['GET'])
def get_borrower_projects(borrower_id):
    """
    Get all projects for a borrower.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """
    Get a specific project by ID.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """
    Update a specific project.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/documents', methods=['POST'])
def upload_document(project_id):
    """
    Upload a document for a project.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/documents', methods=['GET'])
def get_project_documents(project_id):
    """
    Get all documents for a project.
    """
    pass  # Placeholder for future implementation


@bp.route('/documents/<int:document_id>', methods=['GET'])
def download_document(document_id):
    """
    Download a specific document.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/potential_lenders', methods=['GET'])
def get_potential_lenders(project_id):
    """
    Get potential lender matches for a project.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/request_introduction/<int:lender_id>', methods=['POST'])
def request_introduction(project_id, lender_id):
    """
    Request an introduction to a lender.
    """
    pass  # Placeholder for future implementation


@bp.route('/borrowers/<int:borrower_id>/matches', methods=['GET'])
def get_borrower_matches(borrower_id):
    """
    Get all matches for a borrower.
    """
    pass  # Placeholder for future implementation


@bp.route('/lenders/<int:lender_id>/matches', methods=['GET'])
def get_lender_matches(lender_id):
    """
    Get all matches for a lender.
    """
    pass  # Placeholder for future implementation


@bp.route('/matches/<int:match_id>', methods=['PUT'])
def update_match_status(match_id):
    """
    Update the status of a match (accept/reject).
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/communications', methods=['POST'])
def send_message(project_id):
    """
    Send a message related to a project.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/communications', methods=['GET'])
def get_project_communications(project_id):
    """
    Get all communications for a project.
    """
    pass  # Placeholder for future implementation


@bp.route('/projects/<int:project_id>/communications/<int:communication_id>/read', methods=['PUT'])
def mark_message_as_read(project_id, communication_id):
    """
    Mark a communication as read.
    """
    pass  # Placeholder for future implementation


@bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    """
    Initiate the password reset process.
    """
    pass  # Placeholder for future implementation


@bp.route('/reset_password', methods=['POST'])
def reset_password():
    """
    Reset a user's password using a token.
    """
    pass  # Placeholder for future implementation


@bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get user information by ID.
    """
    pass  # Placeholder for future implementation


@bp.route('/logout', methods=['POST'])
def logout():
    """
    Log out a user.
    """
    pass  # Placeholder for future implementation


@bp.route('/mediators/<int:mediator_id>/projects', methods=['GET'])
def get_mediator_projects(mediator_id):
    """
    Get all projects (mediator view).
    """
    pass  # Placeholder for future implementation


@bp.route('/mediators/<int:mediator_id>/lenders', methods=['GET'])
def get_mediator_lenders(mediator_id):
    """
    Get all lenders (mediator view).
    """
    pass  # Placeholder for future implementation


@bp.route('/mediators/<int:mediator_id>/matches', methods=['POST'])
def create_match(mediator_id):
    """
    Create a formal match between a project and a lender.
    """
    pass  # Placeholder for future implementation