from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid
import json


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    company_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False)  # 'borrower', 'lender', 'mediator'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    borrower = db.relationship('Borrower', backref='user', uselist=False, cascade='all, delete-orphan')
    lender = db.relationship('Lender', backref='user', uselist=False, cascade='all, delete-orphan')
    mediator = db.relationship('Mediator', backref='user', uselist=False, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'company_name': self.company_name,
            'phone_number': self.phone_number,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Borrower(db.Model):
    __tablename__ = 'borrowers'

    id = db.Column(db.String(36), db.ForeignKey('users.id'), primary_key=True)
    additional_info = db.Column(db.Text)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    projects = db.relationship('Project', backref='borrower', lazy='dynamic', cascade='all, delete-orphan')

    def set_additional_info(self, info_dict):
        self.additional_info = json.dumps(info_dict)

    def get_additional_info(self):
        if self.additional_info:
            return json.loads(self.additional_info)
        return {}

    def to_dict(self):
        return {
            'id': self.id,
            'additional_info': self.get_additional_info(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Lender(db.Model):
    __tablename__ = 'lenders'

    id = db.Column(db.String(36), db.ForeignKey('users.id'), primary_key=True)
    lending_criteria = db.Column(db.Text)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    matches = db.relationship('LenderMatch', backref='lender', lazy='dynamic')
    introduction_requests = db.relationship('IntroductionRequest', backref='lender', lazy='dynamic')

    def set_lending_criteria(self, criteria_dict):
        self.lending_criteria = json.dumps(criteria_dict)

    def get_lending_criteria(self):
        if self.lending_criteria:
            return json.loads(self.lending_criteria)
        return {}

    def to_dict(self):
        return {
            'id': self.id,
            'lending_criteria': self.get_lending_criteria(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Mediator(db.Model):
    __tablename__ = 'mediators'

    id = db.Column(db.String(36), db.ForeignKey('users.id'), primary_key=True)
    commission_rate = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'commission_rate': self.commission_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    borrower_id = db.Column(db.String(36), db.ForeignKey('borrowers.id'), nullable=False)
    project_address = db.Column(db.String(255), nullable=False)
    asset_type = db.Column(db.String(50), nullable=False)
    deal_type = db.Column(db.String(50), nullable=False)
    capital_type = db.Column(db.String(50), nullable=False)
    debt_request = db.Column(db.Float)
    total_cost = db.Column(db.Float)
    completed_value = db.Column(db.Float)
    project_description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    documents = db.relationship('Document', backref='project', lazy='dynamic', cascade='all, delete-orphan')
    matches = db.relationship('LenderMatch', backref='project', lazy='dynamic')
    introduction_requests = db.relationship('IntroductionRequest', backref='project', lazy='dynamic')
    communications = db.relationship('Communication', backref='project', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'borrower_id': self.borrower_id,
            'project_address': self.project_address,
            'asset_type': self.asset_type,
            'deal_type': self.deal_type,
            'capital_type': self.capital_type,
            'debt_request': self.debt_request,
            'total_cost': self.total_cost,
            'completed_value': self.completed_value,
            'project_description': self.project_description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    uploader_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(100))
    file_path = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    uploader = db.relationship('User')

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'uploader_id': self.uploader_id,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_path': self.file_path,
            'description': self.description,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }


class LenderMatch(db.Model):
    __tablename__ = 'lender_matches'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    lender_id = db.Column(db.String(36), db.ForeignKey('lenders.id'), nullable=False)
    borrower_id = db.Column(db.String(36), db.ForeignKey('borrowers.id'), nullable=False)
    match_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    borrower = db.relationship('Borrower', foreign_keys=[borrower_id])

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'lender_id': self.lender_id,
            'borrower_id': self.borrower_id,
            'match_score': self.match_score,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class IntroductionRequest(db.Model):
    __tablename__ = 'introduction_requests'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    borrower_id = db.Column(db.String(36), db.ForeignKey('borrowers.id'), nullable=False)
    lender_id = db.Column(db.String(36), db.ForeignKey('lenders.id'), nullable=False)
    request_status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'rejected'
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    borrower = db.relationship('Borrower', foreign_keys=[borrower_id])

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'borrower_id': self.borrower_id,
            'lender_id': self.lender_id,
            'request_status': self.request_status,
            'requested_at': self.requested_at.isoformat() if self.requested_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Communication(db.Model):
    __tablename__ = 'communications'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    sender_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    sender = db.relationship('User', foreign_keys=[sender_id])
    recipient = db.relationship('User', foreign_keys=[recipient_id])

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

