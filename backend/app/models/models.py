from datetime import datetime
from app import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app import db


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    company_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    borrower = db.relationship('Borrower', uselist=False, back_populates='user', cascade='all, delete-orphan')
    lender = db.relationship('Lender', uselist=False, back_populates='user', cascade='all, delete-orphan')
    mediator = db.relationship('Mediator', uselist=False, back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.email}>'


class Borrower(db.Model):
    __tablename__ = 'borrowers'

    borrower_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), unique=True, nullable=False)
    additional_info = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='borrower')
    projects = db.relationship('Project', back_populates='borrower', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Borrower {self.borrower_id}>'


class Lender(db.Model):
    __tablename__ = 'lenders'

    lender_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), unique=True, nullable=False)
    lending_criteria = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='lender')

    def __repr__(self):
        return f'<Lender {self.lender_id}>'

    def to_dict(self):
        return {
            'lender_id': self.lender_id,
            'user_id': self.user_id,
            'lending_criteria': self.lending_criteria,
            'user': {
                'email': self.user.email,
                'company_name': self.user.company_name
            }
        }


class Mediator(db.Model):
    __tablename__ = 'mediators'

    mediator_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), unique=True, nullable=False)
    commission_rate = db.Column(db.Numeric(5, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='mediator')

    def __repr__(self):
        return f'<Mediator {self.mediator_id}>'


class Project(db.Model):
    __tablename__ = 'projects'

    project_id = db.Column(db.Integer, primary_key=True)
    borrower_id = db.Column(db.Integer, db.ForeignKey('borrowers.borrower_id', ondelete='CASCADE'), nullable=False)
    project_address = db.Column(db.Text, nullable=False)
    asset_type = db.Column(db.String(50), nullable=False)
    deal_type = db.Column(db.String(50), nullable=False)
    capital_type = db.Column(db.String(50), nullable=False)
    debt_request = db.Column(db.Numeric(15, 2), nullable=False)
    total_cost = db.Column(db.Numeric(15, 2), nullable=False)
    completed_value = db.Column(db.Numeric(15, 2), nullable=False)
    project_description = db.Column(db.Text)
    status = db.Column(db.String(50), default='Pending', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    borrower = db.relationship('Borrower', back_populates='projects')
    documents = db.relationship('Document', back_populates='project', cascade='all, delete-orphan')
    communications = db.relationship('Communication', back_populates='project', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Project {self.project_id}>'

    def to_dict(self):
        return {
            'project_id': self.project_id,
            'borrower_id': self.borrower_id,
            'project_address': self.project_address,
            'asset_type': self.asset_type,
            'deal_type': self.deal_type,
            'capital_type': self.capital_type,
            'debt_request': float(self.debt_request),
            'total_cost': float(self.total_cost),
            'completed_value': float(self.completed_value),
            'project_description': self.project_description,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class LenderMatch(db.Model):
    __tablename__ = 'lender_matches'

    match_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id', ondelete='CASCADE'), nullable=False)
    lender_id = db.Column(db.Integer, db.ForeignKey('lenders.lender_id', ondelete='CASCADE'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('borrowers.borrower_id', ondelete='CASCADE'), nullable=False)
    match_status = db.Column(db.String(50), default='pending', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = db.relationship('Project')
    lender = db.relationship('Lender')
    borrower = db.relationship('Borrower')
    documents = db.relationship('Document', back_populates='lender_match', cascade='all, delete-orphan')

    __table_args__ = (
        db.UniqueConstraint('project_id', 'lender_id', name='unique_project_lender'),
    )

    def __repr__(self):
        return f'<LenderMatch {self.match_id}>'

    def to_dict(self):
        return {
            'match_id': self.match_id,
            'project_id': self.project_id,
            'lender_id': self.lender_id,
            'borrower_id': self.borrower_id,
            'match_status': self.match_status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'project_details': self.project.to_dict() if self.project else None,
            'lender_details': {
                'company_name': self.lender.user.company_name
            }
        }


class Document(db.Model):
    __tablename__ = 'documents'

    document_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id', ondelete='CASCADE'), nullable=True)
    match_id = db.Column(db.Integer, db.ForeignKey('lender_matches.match_id', ondelete='CASCADE'), nullable=True)
    uploader_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(100), nullable=False)
    file_url = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    project = db.relationship('Project', back_populates='documents')
    lender_match = db.relationship('LenderMatch', back_populates='documents')
    uploader = db.relationship('User')

    # Ensure that either project_id or match_id is set, but not both
    __table_args__ = (
        db.CheckConstraint(
            '(project_id IS NOT NULL AND match_id IS NULL) OR (project_id IS NULL AND match_id IS NOT NULL)',
            name='check_project_or_match'),
    )

    def __repr__(self):
        return f'<Document {self.document_id}>'

    def to_dict(self):
        return {
            'document_id': self.document_id,
            'project_id': self.project_id,
            'match_id': self.match_id,
            'uploader_id': self.uploader_id,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'file_url': self.file_url,
            'description': self.description,
            'uploaded_at': self.uploaded_at.isoformat()
        }


class Communication(db.Model):
    __tablename__ = 'communications'

    communication_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id', ondelete='CASCADE'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    project = db.relationship('Project', back_populates='communications')
    sender = db.relationship('User', foreign_keys=[sender_id])
    recipient = db.relationship('User', foreign_keys=[recipient_id])

    def __repr__(self):
        return f'<Communication {self.communication_id}>'

    def to_dict(self):
        return {
            'communication_id': self.communication_id,
            'project_id': self.project_id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }


class IntroductionRequest(db.Model):
    __tablename__ = 'introduction_requests'

    request_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id', ondelete='CASCADE'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('borrowers.borrower_id', ondelete='CASCADE'), nullable=False)
    lender_id = db.Column(db.Integer, db.ForeignKey('lenders.lender_id', ondelete='CASCADE'), nullable=False)
    request_status = db.Column(db.String(50), default='pending', nullable=False)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = db.relationship('Project')
    borrower = db.relationship('Borrower')
    lender = db.relationship('Lender')

    __table_args__ = (
        db.UniqueConstraint('project_id', 'lender_id', name='unique_project_lender_request'),
    )

    def __repr__(self):
        return f'<IntroductionRequest {self.request_id}>'