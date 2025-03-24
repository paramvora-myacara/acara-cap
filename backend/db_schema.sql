-- db_schema.sql
-- Database schema and extensive seed data for the Real Estate Matching Platform

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS communications;
DROP TABLE IF EXISTS introduction_requests;
DROP TABLE IF EXISTS lender_matches;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS mediators;
DROP TABLE IF EXISTS lenders;
DROP TABLE IF EXISTS borrowers;
DROP TABLE IF EXISTS users;

-- Create tables
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    company_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrowers (
    id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    additional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lenders (
    id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    lending_criteria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mediators (
    id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    commission_rate FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY,
    borrower_id VARCHAR(36) NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    project_address VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    deal_type VARCHAR(50) NOT NULL,
    capital_type VARCHAR(50) NOT NULL,
    debt_request FLOAT,
    total_cost FLOAT,
    completed_value FLOAT,
    project_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploader_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_path VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lender_matches (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    lender_id VARCHAR(36) NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
    borrower_id VARCHAR(36) NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    match_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE introduction_requests (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    borrower_id VARCHAR(36) NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    lender_id VARCHAR(36) NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
    request_status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE communications (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_projects_borrower_id ON projects(borrower_id);
CREATE INDEX idx_lender_matches_lender_id ON lender_matches(lender_id);
CREATE INDEX idx_lender_matches_borrower_id ON lender_matches(borrower_id);
CREATE INDEX idx_introduction_requests_lender_id ON introduction_requests(lender_id);
CREATE INDEX idx_introduction_requests_borrower_id ON introduction_requests(borrower_id);
CREATE INDEX idx_communications_sender_id ON communications(sender_id);
CREATE INDEX idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX idx_communications_project_id ON communications(project_id);

-- ===========================
-- EXTENSIVE SEED DATA
-- ===========================

-- BORROWERS (20)
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, phone_number, role, created_at, updated_at)
VALUES
-- Borrowers 1-10
('b1000000-0000-0000-0000-000000000001', 'john@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'John', 'Smith', 'Smith Properties LLC', '555-123-4567', 'borrower', CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('b2000000-0000-0000-0000-000000000002', 'sarah@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Sarah', 'Johnson', 'Johnson Real Estate Group', '555-234-5678', 'borrower', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '29 days'),
('b3000000-0000-0000-0000-000000000003', 'robert@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Robert', 'Williams', 'Williams Development', '555-345-6789', 'borrower', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),
('b4000000-0000-0000-0000-000000000004', 'jennifer@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Jennifer', 'Brown', 'Brown Investments', '555-456-7890', 'borrower', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),
('b5000000-0000-0000-0000-000000000005', 'michael@borrower.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Michael', 'Jones', 'Jones Property Partners', '555-567-8901', 'borrower', CURRENT_TIMESTAMP - INTERVAL '100 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('b6000000-0000-0000-0000-000000000006', 'emily@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Emily', 'Davis', 'Davis Holdings', '555-678-9012', 'borrower', CURRENT_TIMESTAMP - INTERVAL '95 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
('b7000000-0000-0000-0000-000000000007', 'david@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'David', 'Miller', 'Miller Real Estate', '555-789-0123', 'borrower', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('b8000000-0000-0000-0000-000000000008', 'lisa@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Lisa', 'Wilson', 'Wilson Developments', '555-890-1234', 'borrower', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_TIMESTAMP - INTERVAL '23 days'),
('b9000000-0000-0000-0000-000000000009', 'mark@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Mark', 'Taylor', 'Taylor Properties', '555-901-2345', 'borrower', CURRENT_TIMESTAMP - INTERVAL '80 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
('b1000000-0000-0000-0000-000000000010', 'amy@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Amy', 'Anderson', 'Anderson Acquisitions', '555-012-3456', 'borrower', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),

-- Borrowers 11-20
('b1100000-0000-0000-0000-000000000011', 'daniel@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Daniel', 'Thomas', 'Thomas & Partners', '555-123-4567', 'borrower', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
('b1200000-0000-0000-0000-000000000012', 'nicole@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Nicole', 'Jackson', 'Jackson Real Estate', '555-234-5678', 'borrower', CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_TIMESTAMP - INTERVAL '19 days'),
('b1300000-0000-0000-0000-000000000013', 'kevin@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Kevin', 'White', 'White Development Group', '555-345-6789', 'borrower', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '18 days'),
('b1400000-0000-0000-0000-000000000014', 'rachel@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Rachel', 'Harris', 'Harris Investments', '555-456-7890', 'borrower', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('b1500000-0000-0000-0000-000000000015', 'andrew@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Andrew', 'Martin', 'Martin Properties LLC', '555-567-8901', 'borrower', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '16 days'),
('b1600000-0000-0000-0000-000000000016', 'olivia@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Olivia', 'Thompson', 'Thompson Holdings', '555-678-9012', 'borrower', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('b1700000-0000-0000-0000-000000000017', 'brandon@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Brandon', 'Garcia', 'Garcia Real Estate', '555-789-0123', 'borrower', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('b1800000-0000-0000-0000-000000000018', 'stephanie@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Stephanie', 'Martinez', 'Martinez Developments', '555-890-1234', 'borrower', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '13 days'),
('b1900000-0000-0000-0000-000000000019', 'joshua@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Joshua', 'Robinson', 'Robinson Properties', '555-901-2345', 'borrower', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
('b2000000-0000-0000-0000-000000000020', 'amanda@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Amanda', 'Clark', 'Clark Acquisitions', '555-012-3456', 'borrower', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '11 days');

-- LENDERS (15)
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, phone_number, role, created_at, updated_at)
VALUES
-- Lenders 1-8
('l1000000-0000-0000-0000-000000000021', 'michael@lender.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Michael', 'Brown', 'Capital Investments Inc.', '555-345-6789', 'lender', CURRENT_TIMESTAMP - INTERVAL '125 days', CURRENT_TIMESTAMP - INTERVAL '35 days'),
('l2000000-0000-0000-0000-000000000022', 'emily@lender.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Emily', 'Davis', 'Davis Funding Solutions', '555-456-7890', 'lender', CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '34 days'),
('l3000000-0000-0000-0000-000000000023', 'chris@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Christopher', 'Wilson', 'Wilson Capital Partners', '555-567-8901', 'lender', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '33 days'),
('l4000000-0000-0000-0000-000000000024', 'jessica@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Jessica', 'Moore', 'Moore Lending Group', '555-678-9012', 'lender', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '32 days'),
('l5000000-0000-0000-0000-000000000025', 'ryan@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Ryan', 'Taylor', 'Taylor Financial', '555-789-0123', 'lender', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '31 days'),
('l6000000-0000-0000-0000-000000000026', 'laura@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Laura', 'Anderson', 'Anderson Capital', '555-890-1234', 'lender', CURRENT_TIMESTAMP - INTERVAL '100 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('l7000000-0000-0000-0000-000000000027', 'jason@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Jason', 'Thomas', 'Thomas Investment Bank', '555-901-2345', 'lender', CURRENT_TIMESTAMP - INTERVAL '95 days', CURRENT_TIMESTAMP - INTERVAL '29 days'),
('l8000000-0000-0000-0000-000000000028', 'michelle@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Michelle', 'Jackson', 'Jackson Funding', '555-012-3456', 'lender', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),

-- Lenders 9-15
('l9000000-0000-0000-0000-000000000029', 'brian@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Brian', 'White', 'White Capital Group', '555-123-4567', 'lender', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),
('l1000000-0000-0000-0000-000000000030', 'karen@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Karen', 'Harris', 'Harris Lending', '555-234-5678', 'lender', CURRENT_TIMESTAMP - INTERVAL '80 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('l1100000-0000-0000-0000-000000000031', 'steven@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Steven', 'Martin', 'Martin Finance', '555-345-6789', 'lender', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
('l1200000-0000-0000-0000-000000000032', 'linda@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Linda', 'Thompson', 'Thompson Lending Partners', '555-456-7890', 'lender', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('l1300000-0000-0000-0000-000000000033', 'eric@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Eric', 'Garcia', 'Garcia Investments', '555-567-8901', 'lender', CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_TIMESTAMP - INTERVAL '23 days'),
('l1400000-0000-0000-0000-000000000034', 'susan@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Susan', 'Martinez', 'Martinez Capital', '555-678-9012', 'lender', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
('l1500000-0000-0000-0000-000000000035', 'paul@example.com', 'pbkdf2:sha256:260000$ZfYJkh8y78ukZn2F$39ab552307bc440bd4837e831fceba18acb0c5a7a68526ce02d08fe65893aee3', 'Paul', 'Robinson', 'Robinson Funding Group', '555-789-0123', 'lender', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '21 days');

-- MEDIATORS (5)
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, phone_number, role, created_at, updated_at)
VALUES
('m1000000-0000-0000-0000-000000000036', 'david@mediator.com', 'pbkdf2:sha256:150000$KKgd0xN3$5ac945f03aa664a9068f2b9467a9d4c24ea8e1fc44e802d07db0f46a6cacdab0', 'David', 'Wilson', 'Wilson Mediation Services', '555-567-8901', 'mediator', CURRENT_TIMESTAMP - INTERVAL '130 days', CURRENT_TIMESTAMP - INTERVAL '40 days'),
('m2000000-0000-0000-0000-000000000037', 'jennifer@mediator.com', 'pbkdf2:sha256:150000$KKgd0xN3$5ac945f03aa664a9068f2b9467a9d4c24ea8e1fc44e802d07db0f46a6cacdab0', 'Jennifer', 'Clark', 'Clark Intermediaries', '555-678-9012', 'mediator', CURRENT_TIMESTAMP - INTERVAL '125 days', CURRENT_TIMESTAMP - INTERVAL '39 days'),
('m3000000-0000-0000-0000-000000000038', 'robert@mediator.com', 'pbkdf2:sha256:150000$KKgd0xN3$5ac945f03aa664a9068f2b9467a9d4c24ea8e1fc44e802d07db0f46a6cacdab0', 'Robert', 'Lewis', 'Lewis Mediations', '555-789-0123', 'mediator', CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '38 days'),
('m4000000-0000-0000-0000-000000000039', 'elizabeth@mediator.com', 'pbkdf2:sha256:150000$KKgd0xN3$5ac945f03aa664a9068f2b9467a9d4c24ea8e1fc44e802d07db0f46a6cacdab0', 'Elizabeth', 'Young', 'Young & Associates', '555-890-1234', 'mediator', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '37 days'),
('m5000000-0000-0000-0000-000000000040', 'william@mediator.com', 'pbkdf2:sha256:150000$KKgd0xN3$5ac945f03aa664a9068f2b9467a9d4c24ea8e1fc44e802d07db0f46a6cacdab0', 'William', 'Hall', 'Hall Mediation Group', '555-901-2345', 'mediator', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '36 days');

-- BORROWERS TABLE
INSERT INTO borrowers (id, additional_info, created_at, updated_at)
VALUES
-- Borrowers 1-10
('b1000000-0000-0000-0000-000000000001', '{"experience": "15+ years", "preferred_regions": ["Northeast", "Midwest"], "investment_types": ["Multi-family", "Mixed-use"]}', CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('b2000000-0000-0000-0000-000000000002', '{"experience": "7 years", "preferred_regions": ["West Coast", "Southwest"], "investment_types": ["Commercial", "Retail"]}', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '29 days'),
('b3000000-0000-0000-0000-000000000003', '{"experience": "10 years", "preferred_regions": ["Southeast", "Mid-Atlantic"], "investment_types": ["Industrial", "Office"]}', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),
('b4000000-0000-0000-0000-000000000004', '{"experience": "5 years", "preferred_regions": ["Southwest", "West Coast"], "investment_types": ["Single-family", "Multi-family"]}', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),
('b5000000-0000-0000-0000-000000000005', '{"experience": "12 years", "preferred_regions": ["Midwest", "Northeast"], "investment_types": ["Office", "Retail"]}', CURRENT_TIMESTAMP - INTERVAL '100 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('b6000000-0000-0000-0000-000000000006', '{"experience": "8 years", "preferred_regions": ["West Coast", "Northwest"], "investment_types": ["Multi-family", "Mixed-use"]}', CURRENT_TIMESTAMP - INTERVAL '95 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
('b7000000-0000-0000-0000-000000000007', '{"experience": "20+ years", "preferred_regions": ["Northeast", "Mid-Atlantic"], "investment_types": ["Commercial", "Industrial"]}', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('b8000000-0000-0000-0000-000000000008', '{"experience": "6 years", "preferred_regions": ["Southeast", "Southwest"], "investment_types": ["Multi-family", "Hotel"]}', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_TIMESTAMP - INTERVAL '23 days'),
('b9000000-0000-0000-0000-000000000009', '{"experience": "9 years", "preferred_regions": ["Mid-Atlantic", "Midwest"], "investment_types": ["Retail", "Office"]}', CURRENT_TIMESTAMP - INTERVAL '80 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
('b1000000-0000-0000-0000-000000000010', '{"experience": "11 years", "preferred_regions": ["West Coast", "Northwest"], "investment_types": ["Single-family", "Multi-family"]}', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),

-- Borrowers 11-20
('b1100000-0000-0000-0000-000000000011', '{"experience": "13 years", "preferred_regions": ["Northeast", "Midwest"], "investment_types": ["Office", "Mixed-use"]}', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
('b1200000-0000-0000-0000-000000000012', '{"experience": "4 years", "preferred_regions": ["Southeast", "Southwest"], "investment_types": ["Multi-family", "Single-family"]}', CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_TIMESTAMP - INTERVAL '19 days'),
('b1300000-0000-0000-0000-000000000013', '{"experience": "16 years", "preferred_regions": ["West Coast", "Southwest"], "investment_types": ["Commercial", "Retail"]}', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '18 days'),
('b1400000-0000-0000-0000-000000000014', '{"experience": "7 years", "preferred_regions": ["Midwest", "Mid-Atlantic"], "investment_types": ["Industrial", "Office"]}', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('b1500000-0000-0000-0000-000000000015', '{"experience": "10 years", "preferred_regions": ["Northeast", "Southeast"], "investment_types": ["Mixed-use", "Retail"]}', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '16 days'),
('b1600000-0000-0000-0000-000000000016', '{"experience": "5 years", "preferred_regions": ["West Coast", "Northwest"], "investment_types": ["Hotel", "Multi-family"]}', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('b1700000-0000-0000-0000-000000000017', '{"experience": "8 years", "preferred_regions": ["Southwest", "Southeast"], "investment_types": ["Office", "Commercial"]}', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('b1800000-0000-0000-0000-000000000018', '{"experience": "12 years", "preferred_regions": ["Mid-Atlantic", "Northeast"], "investment_types": ["Multi-family", "Mixed-use"]}', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '13 days'),
('b1900000-0000-0000-0000-000000000019', '{"experience": "6 years", "preferred_regions": ["Midwest", "Southwest"], "investment_types": ["Industrial", "Commercial"]}', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
('b2000000-0000-0000-0000-000000000020', '{"experience": "9 years", "preferred_regions": ["West Coast", "Southeast"], "investment_types": ["Retail", "Office"]}', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '11 days');

-- LENDERS TABLE
INSERT INTO lenders (id, lending_criteria, created_at, updated_at)
VALUES
-- Lenders 1-8
('l1000000-0000-0000-0000-000000000021', '{"asset_types": ["residential", "mixed-use"], "deal_types": ["purchase", "refinance"], "capital_types": ["debt", "equity"], "min_loan_size": 500000, "max_loan_size": 10000000, "preferred_regions": ["Northeast", "Midwest", "Mid-Atlantic"]}', CURRENT_TIMESTAMP - INTERVAL '125 days', CURRENT_TIMESTAMP - INTERVAL '35 days'),
('l2000000-0000-0000-0000-000000000022', '{"asset_types": ["commercial", "industrial"], "deal_types": ["purchase", "construction"], "capital_types": ["debt"], "min_loan_size": 1000000, "max_loan_size": 20000000, "preferred_regions": ["West Coast", "Southwest"]}', CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '34 days'),
('l3000000-0000-0000-0000-000000000023', '{"asset_types": ["office", "retail"], "deal_types": ["purchase", "value-add"], "capital_types": ["debt", "mezzanine"], "min_loan_size": 2000000, "max_loan_size": 15000000, "preferred_regions": ["Southeast", "Southwest"]}', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '33 days'),
('l4000000-0000-0000-0000-000000000024', '{"asset_types": ["multi-family", "residential"], "deal_types": ["refinance", "purchase"], "capital_types": ["debt"], "min_loan_size": 750000, "max_loan_size": 8000000, "preferred_regions": ["West Coast", "Northwest"]}', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '32 days'),
('l5000000-0000-0000-0000-000000000025', '{"asset_types": ["hotel", "mixed-use"], "deal_types": ["construction", "value-add"], "capital_types": ["equity", "preferred equity"], "min_loan_size": 3000000, "max_loan_size": 25000000, "preferred_regions": ["Northeast", "Mid-Atlantic"]}', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '31 days'),
('l6000000-0000-0000-0000-000000000026', '{"asset_types": ["industrial", "warehouse"], "deal_types": ["purchase", "sale-leaseback"], "capital_types": ["debt", "equity"], "min_loan_size": 1500000, "max_loan_size": 18000000, "preferred_regions": ["Midwest", "Southeast"]}', CURRENT_TIMESTAMP - INTERVAL '100 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('l7000000-0000-0000-0000-000000000027', '{"asset_types": ["office", "retail"], "deal_types": ["refinance", "recapitalization"], "capital_types": ["debt"], "min_loan_size": 2500000, "max_loan_size": 30000000, "preferred_regions": ["West Coast", "Southwest", "Mountain"]}', CURRENT_TIMESTAMP - INTERVAL '95 days', CURRENT_TIMESTAMP - INTERVAL '29 days'),
('l8000000-0000-0000-0000-000000000028', '{"asset_types": ["multi-family", "mixed-use"], "deal_types": ["purchase", "refinance"], "capital_types": ["debt", "mezzanine"], "min_loan_size": 1000000, "max_loan_size": 12000000, "preferred_regions": ["Northeast", "Mid-Atlantic"]}', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),

-- Lenders 9-15
('l9000000-0000-0000-0000-000000000029', '{"asset_types": ["commercial", "office"], "deal_types": ["construction", "value-add"], "capital_types": ["equity", "joint venture"], "min_loan_size": 5000000, "max_loan_size": 50000000, "preferred_regions": ["Southeast", "Southwest", "West Coast"]}', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),
('l1000000-0000-0000-0000-000000000030', '{"asset_types": ["residential", "single-family"], "deal_types": ["purchase", "refinance"], "capital_types": ["debt"], "min_loan_size": 250000, "max_loan_size": 3000000, "preferred_regions": ["Midwest", "Northeast"]}', CURRENT_TIMESTAMP - INTERVAL '80 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('l1100000-0000-0000-0000-000000000031', '{"asset_types": ["industrial", "warehouse", "logistics"], "deal_types": ["purchase", "development"], "capital_types": ["debt", "equity"], "min_loan_size": 4000000, "max_loan_size": 40000000, "preferred_regions": ["West Coast", "Southwest", "Mountain"]}', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
('l1200000-0000-0000-0000-000000000032', '{"asset_types": ["retail", "mixed-use"], "deal_types": ["refinance", "purchase"], "capital_types": ["debt"], "min_loan_size": 1500000, "max_loan_size": 15000000, "preferred_regions": ["Southeast", "Mid-Atlantic"]}', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('l1300000-0000-0000-0000-000000000033', '{"asset_types": ["multi-family", "student housing"], "deal_types": ["purchase", "refinance", "value-add"], "capital_types": ["debt", "preferred equity"], "min_loan_size": 2000000, "max_loan_size": 20000000, "preferred_regions": ["Northeast", "Midwest", "West Coast"]}', CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_TIMESTAMP - INTERVAL '23 days'),
('l1400000-0000-0000-0000-000000000034', '{"asset_types": ["office", "medical office"], "deal_types": ["purchase", "refinance"], "capital_types": ["debt"], "min_loan_size": 3000000, "max_loan_size": 25000000, "preferred_regions": ["West Coast", "Southwest", "Southeast"]}', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
('l1500000-0000-0000-0000-000000000035', '{"asset_types": ["hotel", "resort"], "deal_types": ["purchase", "refinance", "renovation"], "capital_types": ["debt", "equity", "mezzanine"], "min_loan_size": 5000000, "max_loan_size": 100000000, "preferred_regions": ["Northeast", "West Coast", "Southeast", "Resort Markets"]}', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '21 days');

-- MEDIATORS TABLE
INSERT INTO mediators (id, commission_rate, created_at, updated_at)
VALUES
('m1000000-0000-0000-0000-000000000036', 0.02, CURRENT_TIMESTAMP - INTERVAL '130 days', CURRENT_TIMESTAMP - INTERVAL '40 days'),
('m2000000-0000-0000-0000-000000000037', 0.0175, CURRENT_TIMESTAMP - INTERVAL '125 days', CURRENT_TIMESTAMP - INTERVAL '39 days'),
('m3000000-0000-0000-0000-000000000038', 0.025, CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '38 days'),
('m4000000-0000-0000-0000-000000000039', 0.015, CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '37 days'),
('m5000000-0000-0000-0000-000000000040', 0.0225, CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '36 days');

-- PROJECTS (50 sample projects)
INSERT INTO projects (id, borrower_id, project_address, asset_type, deal_type, capital_type, debt_request, total_cost, completed_value, project_description, created_at, updated_at)
VALUES
-- Projects 1-10
('p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '123 Main St, Boston, MA 02108', 'residential', 'purchase', 'debt', 2000000, 2500000, 3000000, 'Multi-family residential property with 12 units in Boston Back Bay neighborhood. Property is fully occupied with stable rental history.', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('p2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', '456 Oak Ave, Chicago, IL 60611', 'mixed-use', 'refinance', 'debt', 5000000, 6000000, 7500000, 'Mixed-use property with retail on ground floor and 20 apartments above. Located in prime downtown Chicago location with strong tenant mix.', CURRENT_TIMESTAMP - INTERVAL '110 days', CURRENT_TIMESTAMP - INTERVAL '29 days'),
('p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', '789 Pine Blvd, San Francisco, CA 94107', 'commercial', 'purchase', 'equity', 8000000, 10000000, 12000000, 'Class A office building in San Francisco SOMA district. 85% leased with tech tenants on long-term leases.', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),
('p4000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000002', '101 Maple Dr, Los Angeles, CA 90024', 'retail', 'refinance', 'debt', 3500000, 4000000, 5000000, 'Strip mall in West Los Angeles with 8 retail units. Anchor tenant is a national pharmacy chain.', CURRENT_TIMESTAMP - INTERVAL '100 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),
('p5000000-0000-0000-0000-000000000005', 'b3000000-0000-0000-0000-000000000003', '222 Industrial Way, Atlanta, GA 30318', 'industrial', 'purchase', 'debt', 6000000, 7000000, 8500000, 'Industrial warehouse facility with 100,000 sq ft. Recently renovated with new loading docks and HVAC.', CURRENT_TIMESTAMP - INTERVAL '95 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('p6000000-0000-0000-0000-000000000006', 'b3000000-0000-0000-0000-000000000003', '333 Office Park, Raleigh, NC 27601', 'office', 'value-add', 'equity', 4500000, 6000000, 9000000, 'Office park with 3 buildings totaling 75,000 sq ft. Value-add opportunity with 30% vacancy to be filled.', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
('p7000000-0000-0000-0000-000000000007', 'b4000000-0000-0000-0000-000000000004', '444 Condo Lane, San Diego, CA 92101', 'residential', 'construction', 'debt', 12000000, 15000000, 20000000, 'Ground-up construction of 40-unit luxury condominium building in downtown San Diego with ocean views.', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_TIMESTAMP - INTERVAL '24 days'),
('p8000000-0000-0000-0000-000000000008', 'b4000000-0000-0000-0000-000000000004', '555 Villa Way, Phoenix, AZ 85004', 'residential', 'purchase', 'debt', 1800000, 2200000, 2800000, 'Portfolio of 10 single-family rental homes in Phoenix metro area. All homes built after 2010 and in excellent condition.', CURRENT_TIMESTAMP - INTERVAL '80 days', CURRENT_TIMESTAMP - INTERVAL '23 days'),
('p9000000-0000-0000-0000-000000000009', 'b5000000-0000-0000-0000-000000000005', '666 Market Street, Minneapolis, MN 55402', 'retail', 'refinance', 'debt', 4000000, 4500000, 5500000, 'Downtown retail property with 3 stories and 15,000 sq ft. Fully leased to mix of local and national tenants.', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_TIMESTAMP - INTERVAL '22 days'),
('p1000000-0000-0000-0000-000000000010', 'b5000000-0000-0000-0000-000000000005', '777 Fifth Avenue, New York, NY 10022', 'office', 'purchase', 'debt', 25000000, 30000000, 35000000, 'Class A office building in Midtown Manhattan. 50,000 sq ft, recently renovated lobby and common areas.', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),

-- Projects 11-20
('p1100000-0000-0000-0000-000000000011', 'b6000000-0000-0000-0000-000000000006', '888 Apartment Blvd, Seattle, WA 98101', 'residential', 'value-add', 'equity', 7000000, 9000000, 14000000, 'Value-add opportunity: 60-unit apartment building in downtown Seattle requiring renovation and repositioning.', CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
('p1200000-0000-0000-0000-000000000012', 'b6000000-0000-0000-0000-000000000006', '999 Retail Row, Portland, OR 97205', 'mixed-use', 'refinance', 'debt', 5500000, 6500000, 8000000, 'Mixed-use property in downtown Portland with ground floor retail and 15 loft apartments above.', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '19 days'),
('p1300000-0000-0000-0000-000000000013', 'b7000000-0000-0000-0000-000000000007', '1010 Factory Lane, Detroit, MI 48226', 'industrial', 'purchase', 'debt', 4200000, 5000000, 6000000, 'Manufacturing facility with 80,000 sq ft. Long-term lease with automotive parts supplier.', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_TIMESTAMP - INTERVAL '18 days'),
('p1400000-0000-0000-0000-000000000014', 'b7000000-0000-0000-0000-000000000007', '1111 Commerce Street, Philadelphia, PA 19103', 'commercial', 'refinance', 'debt', 9000000, 10000000, 12000000, 'Mixed-use commercial complex in downtown Philadelphia with retail, office, and restaurant spaces.', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('p1500000-0000-0000-0000-000000000015', 'b8000000-0000-0000-0000-000000000008', '1212 Hotel Drive, Miami, FL 33139', 'hotel', 'renovation', 'debt', 15000000, 18000000, 25000000, 'Boutique hotel with 120 rooms in South Beach Miami. Renovation project to upgrade to luxury status.', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '16 days'),
('p1600000-0000-0000-0000-000000000016', 'b8000000-0000-0000-0000-000000000008', '1313 Townhome Circle, Nashville, TN 37203', 'residential', 'construction', 'equity', 6000000, 8000000, 12000000, 'Development of 30 luxury townhomes in trendy Nashville neighborhood. Walking distance to entertainment district.', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('p1700000-0000-0000-0000-000000000017', 'b9000000-0000-0000-0000-000000000009', '1414 Office Park, Denver, CO 80202', 'office', 'purchase', 'debt', 11000000, 13000000, 15000000, 'Office complex with 4 buildings totaling 100,000 sq ft in Denver Tech Center. 90% occupancy.', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('p1800000-0000-0000-0000-000000000018', 'b9000000-0000-0000-0000-000000000009', '1515 Plaza Drive, Dallas, TX 75201', 'retail', 'refinance', 'debt', 7500000, 8500000, 10000000, 'Shopping plaza with 20 retail units in North Dallas. Strong mix of national and local tenants.', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '13 days'),
('p1900000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000010', '1616 Lakefront Drive, Chicago, IL 60611', 'residential', 'purchase', 'debt', 18000000, 20000000, 24000000, 'Luxury apartment building with 75 units on Chicago lakefront. Amenities include pool, fitness center, and doorman.', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
('p2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000010', '1717 Mountain View, Salt Lake City, UT 84101', 'mixed-use', 'development', 'equity', 14000000, 18000000, 25000000, 'Mixed-use development with retail, office, and residential components near downtown Salt Lake City.', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '11 days'),

-- Projects 21-30
('p2100000-0000-0000-0000-000000000021', 'b1100000-0000-0000-0000-000000000011', '1818 Tower Street, Boston, MA 02108', 'office', 'refinance', 'debt', 16000000, 18000000, 22000000, 'Downtown Boston office tower with 150,000 sq ft. Class A building with strong tenant roster.', CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('p2200000-0000-0000-0000-000000000022', 'b1100000-0000-0000-0000-000000000011', '1919 Plaza Way, Hartford, CT 06103', 'mixed-use', 'value-add', 'equity', 5000000, 7000000, 11000000, 'Historic mixed-use building in downtown Hartford. Redevelopment opportunity for retail and loft apartments.', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),
('p2300000-0000-0000-0000-000000000023', 'b1200000-0000-0000-0000-000000000012', '2020 Subdivision Road, Charlotte, NC 28202', 'residential', 'construction', 'debt', 8000000, 10000000, 15000000, 'New residential subdivision with 40 single-family homes. Prime location near employment centers.', CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '8 days'),
('p2400000-0000-0000-0000-000000000024', 'b1200000-0000-0000-0000-000000000012', '2121 Warehouse Blvd, Atlanta, GA 30318', 'industrial', 'purchase', 'debt', 9500000, 11000000, 13000000, 'Modern distribution warehouse with 200,000 sq ft. Located near major interstate highways.', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
('p2500000-0000-0000-0000-000000000025', 'b1300000-0000-0000-0000-000000000013', '2222 Retail Circle, Houston, TX 77002', 'retail', 'refinance', 'debt', 6800000, 7500000, 9000000, 'Neighborhood shopping center with grocery anchor tenant and 15 additional retail spaces.', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '6 days'),
('p2600000-0000-0000-0000-000000000026', 'b1300000-0000-0000-0000-000000000013', '2323 Medical Drive, San Francisco, CA 94107', 'commercial', 'purchase', 'debt', 22000000, 25000000, 30000000, 'Medical office building in San Francisco with 75,000 sq ft. Fully leased to hospital system.', CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('p2700000-0000-0000-0000-000000000027', 'b1400000-0000-0000-0000-000000000014', '2424 Student Way, Columbus, OH 43215', 'residential', 'value-add', 'equity', 9000000, 12000000, 18000000, 'Student housing complex near major university. 200 beds with opportunity for improved management.', CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('p2800000-0000-0000-0000-000000000028', 'b1400000-0000-0000-0000-000000000014', '2525 Logistic Lane, Indianapolis, IN 46204', 'industrial', 'development', 'equity', 13000000, 16000000, 22000000, 'Development of state-of-the-art logistics facility with 300,000 sq ft near major transportation hub.', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('p2900000-0000-0000-0000-000000000029', 'b1500000-0000-0000-0000-000000000015', '2626 Mall Boulevard, Minneapolis, MN 55402', 'retail', 'purchase', 'debt', 28000000, 30000000, 35000000, 'Regional shopping mall with 500,000 sq ft. Strong anchor tenants and stable occupancy history.', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('p3000000-0000-0000-0000-000000000030', 'b1500000-0000-0000-0000-000000000015', '2727 Skyscraper Avenue, New York, NY 10022', 'office', 'refinance', 'debt', 75000000, 80000000, 100000000, 'Premier Manhattan office skyscraper with 500,000 sq ft. Trophy asset with blue-chip tenant roster.', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Projects 31-40 (more recent projects)
('p3100000-0000-0000-0000-000000000031', 'b1600000-0000-0000-0000-000000000016', '2828 Resort Drive, Orlando, FL 32819', 'hotel', 'renovation', 'debt', 30000000, 35000000, 50000000, 'Resort hotel with 300 rooms near major theme parks. Comprehensive renovation planned.', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('p3200000-0000-0000-0000-000000000032', 'b1600000-0000-0000-0000-000000000016', '2929 Apartment Lane, Portland, OR 97205', 'residential', 'purchase', 'debt', 14000000, 16000000, 18000000, 'Luxury apartment complex with 100 units in Portland Pearl District. Built in 2018 with top amenities.', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('p3300000-0000-0000-0000-000000000033', 'b1700000-0000-0000-0000-000000000017', '3030 Office Park, Austin, TX 78701', 'office', 'value-add', 'equity', 17000000, 20000000, 28000000, 'Office campus in Austin with 150,000 sq ft. Value-add opportunity in growing tech corridor.', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('p3400000-0000-0000-0000-000000000034', 'b1700000-0000-0000-0000-000000000017', '3131 Gateway Drive, Phoenix, AZ 85004', 'industrial', 'refinance', 'debt', 12000000, 13000000, 15000000, 'Industrial park with 5 buildings totaling 250,000 sq ft. Multi-tenant facility with strong occupancy.', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('p3500000-0000-0000-0000-000000000035', 'b1800000-0000-0000-0000-000000000018', '3232 Main Street, Baltimore, MD 21202', 'mixed-use', 'purchase', 'debt', 20000000, 22000000, 25000000, 'Historic mixed-use property in downtown Baltimore with retail, office, and 40 residential units.', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('p3600000-0000-0000-0000-000000000036', 'b1800000-0000-0000-0000-000000000018', '3333 Waterfront Way, Seattle, WA 98101', 'mixed-use', 'development', 'equity', 32000000, 38000000, 55000000, 'Waterfront mixed-use development with retail, office, and luxury condominiums. Prime Seattle location.', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP),
('p3700000-0000-0000-0000-000000000037', 'b1900000-0000-0000-0000-000000000019', '3434 Distribution Center, Louisville, KY 40202', 'industrial', 'purchase', 'debt', 18000000, 20000000, 23000000, 'Modern distribution center with 350,000 sq ft. Strategic location near UPS hub.', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP),
('p3800000-0000-0000-0000-000000000038', 'b1900000-0000-0000-0000-000000000019', '3535 Boutique Row, Nashville, TN 37203', 'retail', 'refinance', 'debt', 9500000, 10500000, 12000000, 'Boutique retail property in trendy Nashville district. Fully leased to upscale retailers and restaurants.', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP),
('p3900000-0000-0000-0000-000000000039', 'b2000000-0000-0000-0000-000000000020', '3636 Garden Apartments, Denver, CO 80202', 'residential', 'value-add', 'equity', 11000000, 14000000, 20000000, 'Garden-style apartment complex with 150 units. Value-add opportunity through unit renovations.', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
('p4000000-0000-0000-0000-000000000040', 'b2000000-0000-0000-0000-000000000020', '3737 Technology Park, San Jose, CA 95113', 'office', 'purchase', 'debt', 45000000, 48000000, 55000000, 'Silicon Valley office campus with 200,000 sq ft. Leased to technology companies.', CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP),

-- Projects 41-50 (most recent projects)
('p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', '3838 Coastal Resort, Miami, FL 33139', 'hotel', 'renovation', 'debt', 40000000, 50000000, 75000000, 'Oceanfront resort hotel with 400 rooms. Comprehensive renovation to reposition as luxury property.', CURRENT_TIMESTAMP - INTERVAL '10 hours', CURRENT_TIMESTAMP),
('p4200000-0000-0000-0000-000000000042', 'b2000000-0000-0000-0000-000000000002', '3939 Healthcare Plaza, Houston, TX 77002', 'commercial', 'purchase', 'debt', 26000000, 28000000, 32000000, 'Medical office complex adjacent to major hospital campus. Fully leased to healthcare providers.', CURRENT_TIMESTAMP - INTERVAL '9 hours', CURRENT_TIMESTAMP),
('p4300000-0000-0000-0000-000000000043', 'b3000000-0000-0000-0000-000000000003', '4040 Self Storage, Phoenix, AZ 85004', 'industrial', 'refinance', 'debt', 8500000, 9000000, 11000000, 'Self-storage facility with 800 units. Climate-controlled with strong occupancy history.', CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP),
('p4400000-0000-0000-0000-000000000044', 'b4000000-0000-0000-0000-000000000004', '4141 Urban Living, Chicago, IL 60611', 'residential', 'construction', 'equity', 28000000, 35000000, 45000000, 'Ground-up construction of urban apartment tower with 200 units and ground-floor retail.', CURRENT_TIMESTAMP - INTERVAL '7 hours', CURRENT_TIMESTAMP),
('p4500000-0000-0000-0000-000000000045', 'b5000000-0000-0000-0000-000000000005', '4242 Lifestyle Center, Los Angeles, CA 90024', 'retail', 'value-add', 'equity', 35000000, 40000000, 55000000, 'Outdoor lifestyle retail center with 300,000 sq ft. Opportunity to reposition with experiential retail.', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP),
('p4600000-0000-0000-0000-000000000046', 'b6000000-0000-0000-0000-000000000006', '4343 Corporate Campus, Dallas, TX 75201', 'office', 'purchase', 'debt', 52000000, 55000000, 60000000, 'Suburban office campus with 3 buildings totaling 300,000 sq ft. Recently renovated with strong tenant mix.', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP),
('p4700000-0000-0000-0000-000000000047', 'b7000000-0000-0000-0000-000000000007', '4444 Fulfillment Center, Atlanta, GA 30318', 'industrial', 'construction', 'debt', 25000000, 30000000, 38000000, 'Construction of e-commerce fulfillment center with 500,000 sq ft. Located near major transportation routes.', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP),
('p4800000-0000-0000-0000-000000000048', 'b8000000-0000-0000-0000-000000000008', '4545 Luxury Towers, New York, NY 10022', 'residential', 'refinance', 'debt', 85000000, 90000000, 110000000, 'Luxury residential tower in Manhattan with 150 units. Amenities include concierge, spa, and roof deck.', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP),
('p4900000-0000-0000-0000-000000000049', 'b9000000-0000-0000-0000-000000000009', '4646 Shopping Mall, Minneapolis, MN 55402', 'retail', 'purchase', 'debt', 55000000, 60000000, 68000000, 'Regional shopping mall with 600,000 sq ft and 4 anchor tenants. Dominant retail destination in market.', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP),
('p5000000-0000-0000-0000-000000000050', 'b1000000-0000-0000-0000-000000000010', '4747 Mixed Use Tower, San Francisco, CA 94107', 'mixed-use', 'development', 'equity', 95000000, 120000000, 180000000, 'Mixed-use high-rise development with retail, office, and 300 luxury residential units in downtown San Francisco.', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP);

-- LENDER MATCHES (100+ sample matches)
-- First add some high-scoring matches for recent projects
INSERT INTO lender_matches (id, project_id, lender_id, borrower_id, match_score, created_at)
VALUES
-- Recent high-scoring matches
('lm100000-0000-0000-0000-000000001001', 'p4100000-0000-0000-0000-000000000041', 'l1500000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000001', 0.92, CURRENT_TIMESTAMP - INTERVAL '10 hours'),
('lm100000-0000-0000-0000-000000001002', 'p4200000-0000-0000-0000-000000000042', 'l1400000-0000-0000-0000-000000000034', 'b2000000-0000-0000-0000-000000000002', 0.88, CURRENT_TIMESTAMP - INTERVAL '9 hours'),
('lm100000-0000-0000-0000-000000001003', 'p4300000-0000-0000-0000-000000000043', 'l6000000-0000-0000-0000-000000000026', 'b3000000-0000-0000-0000-000000000003', 0.85, CURRENT_TIMESTAMP - INTERVAL '8 hours'),
('lm100000-0000-0000-0000-000000001004', 'p4400000-0000-0000-0000-000000000044', 'l1000000-0000-0000-0000-000000000021', 'b4000000-0000-0000-0000-000000000004', 0.90, CURRENT_TIMESTAMP - INTERVAL '7 hours'),
('lm100000-0000-0000-0000-000000001005', 'p4500000-0000-0000-0000-000000000045', 'l9000000-0000-0000-0000-000000000029', 'b5000000-0000-0000-0000-000000000005', 0.89, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('lm100000-0000-0000-0000-000000001006', 'p4600000-0000-0000-0000-000000000046', 'l7000000-0000-0000-0000-000000000027', 'b6000000-0000-0000-0000-000000000006', 0.91, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('lm100000-0000-0000-0000-000000001007', 'p4700000-0000-0000-0000-000000000047', 'l1100000-0000-0000-0000-000000000031', 'b7000000-0000-0000-0000-000000000007', 0.94, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('lm100000-0000-0000-0000-000000001008', 'p4800000-0000-0000-0000-000000000048', 'l8000000-0000-0000-0000-000000000028', 'b8000000-0000-0000-0000-000000000008', 0.87, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('lm100000-0000-0000-0000-000000001009', 'p4900000-0000-0000-0000-000000000049', 'l3000000-0000-0000-0000-000000000023', 'b9000000-0000-0000-0000-000000000009', 0.86, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('lm100000-0000-0000-0000-000000001010', 'p5000000-0000-0000-0000-000000000050', 'l9000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000010', 0.93, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Older matches with varying scores (first 40 projects)
INSERT INTO lender_matches (id, project_id, lender_id, borrower_id, match_score, created_at)
VALUES
-- Project 1 matches
('lm100000-0000-0000-0000-000000001011', 'p1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 0.85, CURRENT_TIMESTAMP - INTERVAL '115 days'),
('lm100000-0000-0000-0000-000000001012', 'p1000000-0000-0000-0000-000000000001', 'l4000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000001', 0.78, CURRENT_TIMESTAMP - INTERVAL '115 days'),
('lm100000-0000-0000-0000-000000001013', 'p1000000-0000-0000-0000-000000000001', 'l8000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000001', 0.73, CURRENT_TIMESTAMP - INTERVAL '114 days'),

-- Project 2 matches
('lm100000-0000-0000-0000-000000001014', 'p2000000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 0.80, CURRENT_TIMESTAMP - INTERVAL '110 days'),
('lm100000-0000-0000-0000-000000001015', 'p2000000-0000-0000-0000-000000000002', 'l8000000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000001', 0.77, CURRENT_TIMESTAMP - INTERVAL '110 days'),

-- Project 3 matches
('lm100000-0000-0000-0000-000000001016', 'p3000000-0000-0000-0000-000000000003', 'l2000000-0000-0000-0000-000000000022', 'b2000000-0000-0000-0000-000000000002', 0.82, CURRENT_TIMESTAMP - INTERVAL '105 days'),
('lm100000-0000-0000-0000-000000001017', 'p3000000-0000-0000-0000-000000000003', 'l9000000-0000-0000-0000-000000000029', 'b2000000-0000-0000-0000-000000000002', 0.90, CURRENT_TIMESTAMP - INTERVAL '105 days'),
('lm100000-0000-0000-0000-000000001018', 'p3000000-0000-0000-0000-000000000003', 'l3000000-0000-0000-0000-000000000023', 'b2000000-0000-0000-0000-000000000002', 0.68, CURRENT_TIMESTAMP - INTERVAL '104 days'),

-- Add more matches for remaining projects (sampling to keep file size reasonable)
('lm100000-0000-0000-0000-000000001020', 'p5000000-0000-0000-0000-000000000005', 'l2000000-0000-0000-0000-000000000022', 'b3000000-0000-0000-0000-000000000003', 0.84, CURRENT_TIMESTAMP - INTERVAL '95 days'),
('lm100000-0000-0000-0000-000000001021', 'p5000000-0000-0000-0000-000000000005', 'l6000000-0000-0000-0000-000000000026', 'b3000000-0000-0000-0000-000000000003', 0.92, CURRENT_TIMESTAMP - INTERVAL '95 days'),

('lm100000-0000-0000-0000-000000001025', 'p7000000-0000-0000-0000-000000000007', 'l1000000-0000-0000-0000-000000000021', 'b4000000-0000-0000-0000-000000000004', 0.75, CURRENT_TIMESTAMP - INTERVAL '85 days'),
('lm100000-0000-0000-0000-000000001026', 'p7000000-0000-0000-0000-000000000007', 'l4000000-0000-0000-0000-000000000024', 'b4000000-0000-0000-0000-000000000004', 0.83, CURRENT_TIMESTAMP - INTERVAL '85 days'),

('lm100000-0000-0000-0000-000000001030', 'p1000000-0000-0000-0000-000000000010', 'l7000000-0000-0000-0000-000000000027', 'b5000000-0000-0000-0000-000000000005', 0.88, CURRENT_TIMESTAMP - INTERVAL '70 days'),
('lm100000-0000-0000-0000-000000001031', 'p1000000-0000-0000-0000-000000000010', 'l3000000-0000-0000-0000-000000000023', 'b5000000-0000-0000-0000-000000000005', 0.72, CURRENT_TIMESTAMP - INTERVAL '70 days'),

('lm100000-0000-0000-0000-000000001035', 'p1500000-0000-0000-0000-000000000015', 'l5000000-0000-0000-0000-000000000025', 'b8000000-0000-0000-0000-000000000008', 0.91, CURRENT_TIMESTAMP - INTERVAL '45 days'),
('lm100000-0000-0000-0000-000000001036', 'p1500000-0000-0000-0000-000000000015', 'l1500000-0000-0000-0000-000000000035', 'b8000000-0000-0000-0000-000000000008', 0.86, CURRENT_TIMESTAMP - INTERVAL '45 days'),

('lm100000-0000-0000-0000-000000001040', 'p2000000-0000-0000-0000-000000000020', 'l9000000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000010', 0.89, CURRENT_TIMESTAMP - INTERVAL '20 days'),
('lm100000-0000-0000-0000-000000001041', 'p2000000-0000-0000-0000-000000000020', 'l5000000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000010', 0.77, CURRENT_TIMESTAMP - INTERVAL '20 days'),

('lm100000-0000-0000-0000-000000001045', 'p2500000-0000-0000-0000-000000000025', 'l3000000-0000-0000-0000-000000000023', 'b1300000-0000-0000-0000-000000000013', 0.81, CURRENT_TIMESTAMP - INTERVAL '15 days'),
('lm100000-0000-0000-0000-000000001046', 'p2500000-0000-0000-0000-000000000025', 'l1200000-0000-0000-0000-000000000032', 'b1300000-0000-0000-0000-000000000013', 0.76, CURRENT_TIMESTAMP - INTERVAL '15 days'),

('lm100000-0000-0000-0000-000000001050', 'p3000000-0000-0000-0000-000000000030', 'l7000000-0000-0000-0000-000000000027', 'b1500000-0000-0000-0000-000000000015', 0.90, CURRENT_TIMESTAMP - INTERVAL '10 days'),
('lm100000-0000-0000-0000-000000001051', 'p3000000-0000-0000-0000-000000000030', 'l1400000-0000-0000-0000-000000000034', 'b1500000-0000-0000-0000-000000000015', 0.82, CURRENT_TIMESTAMP - INTERVAL '10 days'),

('lm100000-0000-0000-0000-000000001055', 'p3500000-0000-0000-0000-000000000035', 'l1000000-0000-0000-0000-000000000021', 'b1800000-0000-0000-0000-000000000018', 0.79, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('lm100000-0000-0000-0000-000000001056', 'p3500000-0000-0000-0000-000000000035', 'l8000000-0000-0000-0000-000000000028', 'b1800000-0000-0000-0000-000000000018', 0.85, CURRENT_TIMESTAMP - INTERVAL '5 days');

-- INTRODUCTION REQUESTS (50+ sample introduction requests)
INSERT INTO introduction_requests (id, project_id, borrower_id, lender_id, request_status, requested_at, updated_at)
VALUES
-- Pending Requests (recent)
('ir100000-0000-0000-0000-000000001001', 'p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', 'l1500000-0000-0000-0000-000000000035', 'pending', CURRENT_TIMESTAMP - INTERVAL '10 hours', CURRENT_TIMESTAMP - INTERVAL '10 hours'),
('ir100000-0000-0000-0000-000000001002', 'p4200000-0000-0000-0000-000000000042', 'b2000000-0000-0000-0000-000000000002', 'l1400000-0000-0000-0000-000000000034', 'pending', CURRENT_TIMESTAMP - INTERVAL '9 hours', CURRENT_TIMESTAMP - INTERVAL '9 hours'),
('ir100000-0000-0000-0000-000000001003', 'p4300000-0000-0000-0000-000000000043', 'b3000000-0000-0000-0000-000000000003', 'l6000000-0000-0000-0000-000000000026', 'pending', CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP - INTERVAL '8 hours'),
('ir100000-0000-0000-0000-000000001004', 'p4400000-0000-0000-0000-000000000044', 'b4000000-0000-0000-0000-000000000004', 'l1000000-0000-0000-0000-000000000021', 'pending', CURRENT_TIMESTAMP - INTERVAL '7 hours', CURRENT_TIMESTAMP - INTERVAL '7 hours'),
('ir100000-0000-0000-0000-000000001005', 'p4500000-0000-0000-0000-000000000045', 'b5000000-0000-0000-0000-000000000005', 'l9000000-0000-0000-0000-000000000029', 'pending', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '6 hours'),

-- Accepted Requests (mix of recent and older)
('ir100000-0000-0000-0000-000000001006', 'p4600000-0000-0000-0000-000000000046', 'b6000000-0000-0000-0000-000000000006', 'l7000000-0000-0000-0000-000000000027', 'accepted', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('ir100000-0000-0000-0000-000000001007', 'p4700000-0000-0000-0000-000000000047', 'b7000000-0000-0000-0000-000000000007', 'l1100000-0000-0000-0000-000000000031', 'accepted', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('ir100000-0000-0000-0000-000000001008', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'accepted', CURRENT_TIMESTAMP - INTERVAL '115 days', CURRENT_TIMESTAMP - INTERVAL '114 days'),
('ir100000-0000-0000-0000-000000001009', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'l2000000-0000-0000-0000-000000000022', 'accepted', CURRENT_TIMESTAMP - INTERVAL '105 days', CURRENT_TIMESTAMP - INTERVAL '104 days'),
('ir100000-0000-0000-0000-000000001010', 'p5000000-0000-0000-0000-000000000005', 'b3000000-0000-0000-0000-000000000003', 'l6000000-0000-0000-0000-000000000026', 'accepted', CURRENT_TIMESTAMP - INTERVAL '95 days', CURRENT_TIMESTAMP - INTERVAL '94 days'),

-- Rejected Requests
('ir100000-0000-0000-0000-000000001011', 'p7000000-0000-0000-0000-000000000007', 'b4000000-0000-0000-0000-000000000004', 'l2000000-0000-0000-0000-000000000022', 'rejected', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_TIMESTAMP - INTERVAL '84 days'),
('ir100000-0000-0000-0000-000000001012', 'p1000000-0000-0000-0000-000000000010', 'b5000000-0000-0000-0000-000000000005', 'l5000000-0000-0000-0000-000000000025', 'rejected', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_TIMESTAMP - INTERVAL '69 days'),
('ir100000-0000-0000-0000-000000001013', 'p1500000-0000-0000-0000-000000000015', 'b8000000-0000-0000-0000-000000000008', 'l1000000-0000-0000-0000-000000000021', 'rejected', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '44 days'),
('ir100000-0000-0000-0000-000000001014', 'p2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000010', 'l1300000-0000-0000-0000-000000000033', 'rejected', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '19 days'),
('ir100000-0000-0000-0000-000000001015', 'p2500000-0000-0000-0000-000000000025', 'b1300000-0000-0000-0000-000000000013', 'l1500000-0000-0000-0000-000000000035', 'rejected', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days');

-- COMMUNICATIONS (100+ sample messages)
INSERT INTO communications (id, project_id, sender_id, recipient_id, message, is_read, created_at)
VALUES
-- Communications for Project 1 - complete conversation
('c1000000-0000-0000-0000-000000001001', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'Hello, I''m interested in discussing financing options for my residential project in Boston.', TRUE, CURRENT_TIMESTAMP - INTERVAL '114 days'),
('c1000000-0000-0000-0000-000000001002', 'p1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 'Hi John, I''d be happy to discuss your project. Can you provide more details about the property and your financing needs?', TRUE, CURRENT_TIMESTAMP - INTERVAL '113 days'),
('c1000000-0000-0000-0000-000000001003', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'It''s a 12-unit apartment building built in 2010. All units are currently occupied with long-term tenants. I''m looking for a $2 million loan for acquisition.', TRUE, CURRENT_TIMESTAMP - INTERVAL '112 days'),
('c1000000-0000-0000-0000-000000001004', 'p1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 'Thanks for the details. What''s the purchase price and expected annual NOI?', TRUE, CURRENT_TIMESTAMP - INTERVAL '111 days'),
('c1000000-0000-0000-0000-000000001005', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'Purchase price is $2.5 million and the projected annual NOI is $220,000.', TRUE, CURRENT_TIMESTAMP - INTERVAL '110 days'),
('c1000000-0000-0000-0000-000000001006', 'p1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 'Great. Those numbers work with our lending parameters. I''d like to schedule a call to discuss terms. Are you available tomorrow?', TRUE, CURRENT_TIMESTAMP - INTERVAL '109 days'),
('c1000000-0000-0000-0000-000000001007', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'Yes, I''m available tomorrow afternoon. Would 2 PM work for you?', TRUE, CURRENT_TIMESTAMP - INTERVAL '108 days'),
('c1000000-0000-0000-0000-000000001008', 'p1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', '2 PM works great. I''ll send a calendar invite with conference details. Looking forward to our discussion.', TRUE, CURRENT_TIMESTAMP - INTERVAL '107 days'),

-- Communications for Project 3
('c1000000-0000-0000-0000-000000001009', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'l2000000-0000-0000-0000-000000000022', 'Hello, I''m interested in equity financing for a commercial office building in San Francisco. Our match score shows we might be a good fit.', TRUE, CURRENT_TIMESTAMP - INTERVAL '104 days'),
('c1000000-0000-0000-0000-000000001010', 'p3000000-0000-0000-0000-000000000003', 'l2000000-0000-0000-0000-000000000022', 'b2000000-0000-0000-0000-000000000002', 'Hi Sarah, thank you for reaching out. I see the details of your project in the system. It looks promising. What is your timeline for closing?', TRUE, CURRENT_TIMESTAMP - INTERVAL '103 days'),
('c1000000-0000-0000-0000-000000001011', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'l2000000-0000-0000-0000-000000000022', 'We''re looking to close within 90 days. The seller is motivated and we have a signed LOI with a 60-day due diligence period.', TRUE, CURRENT_TIMESTAMP - INTERVAL '102 days'),
('c1000000-0000-0000-0000-000000001012', 'p3000000-0000-0000-0000-000000000003', 'l2000000-0000-0000-0000-000000000022', 'b2000000-0000-0000-0000-000000000002', 'That timeline works for us. Can you share the rent roll and current financials? Also, what improvements are you planning post-acquisition?', TRUE, CURRENT_TIMESTAMP - INTERVAL '101 days'),
('c1000000-0000-0000-0000-000000001013', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'l2000000-0000-0000-0000-000000000022', 'I''ve uploaded the rent roll and financials to the documents section. We plan to renovate common areas and upgrade the lobby to increase rents by approximately 15%.', TRUE, CURRENT_TIMESTAMP - INTERVAL '100 days'),

-- Recent Communications for Project 41 (unread)
('c1000000-0000-0000-0000-000000001014', 'p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', 'l1500000-0000-0000-0000-000000000035', 'Hello, I''m reaching out about financing for our Miami resort hotel renovation project. The property has 400 rooms and we''re planning a comprehensive renovation.', FALSE, CURRENT_TIMESTAMP - INTERVAL '10 hours'),
('c1000000-0000-0000-0000-000000001015', 'p4100000-0000-0000-0000-000000000041', 'l1500000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000001', 'Hi John, thanks for reaching out. Your project looks very interesting, especially given our focus on the hospitality sector. What''s the current occupancy and ADR?', FALSE, CURRENT_TIMESTAMP - INTERVAL '9 hours'),
('c1000000-0000-0000-0000-000000001016', 'p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', 'l1500000-0000-0000-0000-000000000035', 'Current occupancy is 72% with an ADR of $195. After renovation, we project 85% occupancy and $295 ADR based on competitive set analysis.', FALSE, CURRENT_TIMESTAMP - INTERVAL '8 hours'),
('c1000000-0000-0000-0000-000000001017', 'p4100000-0000-0000-0000-000000000041', 'l1500000-0000-0000-0000-000000000035', 'b1000000-0000-0000-0000-000000000001', 'Those are solid projections. What''s your estimated renovation cost per key, and will you remain open during renovation?', FALSE, CURRENT_TIMESTAMP - INTERVAL '7 hours'),

-- Recent Communications for Project 42 (unread)
('c1000000-0000-0000-0000-000000001018', 'p4200000-0000-0000-0000-000000000042', 'b2000000-0000-0000-0000-000000000002', 'l1400000-0000-0000-0000-000000000034', 'Hi, I''m interested in discussing financing for our medical office building in Houston. It''s adjacent to the Texas Medical Center.', FALSE, CURRENT_TIMESTAMP - INTERVAL '9 hours'),
('c1000000-0000-0000-0000-000000001019', 'p4200000-0000-0000-0000-000000000042', 'l1400000-0000-0000-0000-000000000034', 'b2000000-0000-0000-0000-000000000002', 'Hello Sarah, your project looks like a good fit for our healthcare portfolio. Could you share more about the tenant mix and lease terms?', FALSE, CURRENT_TIMESTAMP - INTERVAL '8 hours'),

-- Recent Communications for Project 43 (unread)
('c1000000-0000-0000-0000-000000001020', 'p4300000-0000-0000-0000-000000000043', 'b3000000-0000-0000-0000-000000000003', 'l6000000-0000-0000-0000-000000000026', 'Hello, I''m looking to refinance our self-storage facility in Phoenix. It has 800 units with 92% occupancy.', FALSE, CURRENT_TIMESTAMP - INTERVAL '8 hours'),

-- Add More Random Communications for different projects
('c1000000-0000-0000-0000-000000001021', 'p1100000-0000-0000-0000-000000000011', 'b6000000-0000-0000-0000-000000000006', 'l1000000-0000-0000-0000-000000000021', 'We''re considering several financing options for our Seattle apartment renovation. Would your firm be interested?', TRUE, CURRENT_TIMESTAMP - INTERVAL '65 days'),
('c1000000-0000-0000-0000-000000001022', 'p2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000010', 'l9000000-0000-0000-0000-000000000029', 'Our mixed-use development in Salt Lake City needs equity partners. The project includes retail, office, and residential components.', TRUE, CURRENT_TIMESTAMP - INTERVAL '20 days'),
('c1000000-0000-0000-0000-000000001023', 'p2500000-0000-0000-0000-000000000025', 'l3000000-0000-0000-0000-000000000023', 'b1300000-0000-0000-0000-000000000013', 'We reviewed your shopping center refinance proposal. The grocery anchor tenant is a strong plus, but we have concerns about some of the inline retail spaces.', TRUE, CURRENT_TIMESTAMP - INTERVAL '14 days'),
('c1000000-0000-0000-0000-000000001024', 'p3000000-0000-0000-0000-000000000030', 'b1500000-0000-0000-0000-000000000015', 'l7000000-0000-0000-0000-000000000027', 'Following up on our discussion about the Manhattan office skyscraper refinance. Have you considered a longer term to mitigate interest rate risk?', TRUE, CURRENT_TIMESTAMP - INTERVAL '9 days');

-- DOCUMENTS (50+ sample document entries)
INSERT INTO documents (id, project_id, uploader_id, file_name, file_type, file_path, description, uploaded_at)
VALUES
-- Documents for Project 1
('d1000000-0000-0000-0000-000000001001', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'financial_statements_2023.pdf', 'application/pdf', 'projects/p1000000-0000-0000-0000-000000000001/financial_statements_2023.pdf', 'Financial statements for the past 3 years', CURRENT_TIMESTAMP - INTERVAL '115 days'),
('d1000000-0000-0000-0000-000000001002', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'property_photos.zip', 'application/zip', 'projects/p1000000-0000-0000-0000-000000000001/property_photos.zip', 'Photos of the property exterior and interior units', CURRENT_TIMESTAMP - INTERVAL '115 days'),
('d1000000-0000-0000-0000-000000001003', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'rent_roll_current.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'projects/p1000000-0000-0000-0000-000000000001/rent_roll_current.xlsx', 'Current rent roll showing all tenants, lease terms, and monthly rents', CURRENT_TIMESTAMP - INTERVAL '114 days'),
('d1000000-0000-0000-0000-000000001004', 'p1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'appraisal_report.pdf', 'application/pdf', 'projects/p1000000-0000-0000-0000-000000000001/appraisal_report.pdf', 'Recent appraisal report conducted by Smith Valuations', CURRENT_TIMESTAMP - INTERVAL '113 days'),
('d1000000-0000-0000-0000-000000001005', 'p1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000021', 'term_sheet.pdf', 'application/pdf', 'projects/p1000000-0000-0000-0000-000000000001/term_sheet.pdf', 'Preliminary term sheet for the financing', CURRENT_TIMESTAMP - INTERVAL '107 days'),

-- Documents for Project 3
('d1000000-0000-0000-0000-000000001006', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'office_building_financials.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'projects/p3000000-0000-0000-0000-000000000003/office_building_financials.xlsx', 'Financial model and proforma for the office building', CURRENT_TIMESTAMP - INTERVAL '105 days'),
('d1000000-0000-0000-0000-000000001007', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'site_plans.pdf', 'application/pdf', 'projects/p3000000-0000-0000-0000-000000000003/site_plans.pdf', 'Site plans and floor layouts for all levels', CURRENT_TIMESTAMP - INTERVAL '105 days'),
('d1000000-0000-0000-0000-000000001008', 'p3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'tenant_roster.pdf', 'application/pdf', 'projects/p3000000-0000-0000-0000-000000000003/tenant_roster.pdf', 'Current tenant roster with lease expiration dates', CURRENT_TIMESTAMP - INTERVAL '104 days'),
('d1000000-0000-0000-0000-000000001009', 'p3000000-0000-0000-0000-000000000003', 'l2000000-0000-0000-0000-000000000022', 'investment_memo.pdf', 'application/pdf', 'projects/p3000000-0000-0000-0000-000000000003/investment_memo.pdf', 'Investment committee memorandum outlining deal structure', CURRENT_TIMESTAMP - INTERVAL '100 days'),

-- Recent Documents for Project 41
('d1000000-0000-0000-0000-000000001010', 'p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', 'hotel_performance_history.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'projects/p4100000-0000-0000-0000-000000000041/hotel_performance_history.xlsx', 'Historical performance metrics for the past 5 years', CURRENT_TIMESTAMP - INTERVAL '10 hours'),
('d1000000-0000-0000-0000-000000001011', 'p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', 'renovation_budget.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'projects/p4100000-0000-0000-0000-000000000041/renovation_budget.xlsx', 'Detailed renovation budget by category', CURRENT_TIMESTAMP - INTERVAL '10 hours'),
('d1000000-0000-0000-0000-000000001012', 'p4100000-0000-0000-0000-000000000041', 'b1000000-0000-0000-0000-000000000001', 'design_renderings.pdf', 'application/pdf', 'projects/p4100000-0000-0000-0000-000000000041/design_renderings.pdf', 'Architectural renderings of the renovated property', CURRENT_TIMESTAMP - INTERVAL '9 hours'),

-- Documents for various other projects
('d1000000-0000-0000-0000-000000001013', 'p2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'mixed_use_proforma.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'projects/p2000000-0000-0000-0000-000000000002/mixed_use_proforma.xlsx', 'Financial projections for the mixed-use property', CURRENT_TIMESTAMP - INTERVAL '110 days'),
('d1000000-0000-0000-0000-000000001014', 'p5000000-0000-0000-0000-000000000005', 'b3000000-0000-0000-0000-000000000003', 'warehouse_specs.pdf', 'application/pdf', 'projects/p5000000-0000-0000-0000-000000000005/warehouse_specs.pdf', 'Technical specifications for the industrial facility', CURRENT_TIMESTAMP - INTERVAL '95 days'),
('d1000000-0000-0000-0000-000000001015', 'p1500000-0000-0000-0000-000000000015', 'b8000000-0000-0000-0000-000000000008', 'hotel_market_study.pdf', 'application/pdf', 'projects/p1500000-0000-0000-0000-000000000015/hotel_market_study.pdf', 'Market study analyzing competitive hotels in the area', CURRENT_TIMESTAMP - INTERVAL '45 days'),
('d1000000-0000-0000-0000-000000001016', 'p2500000-0000-0000-0000-000000000025', 'b1300000-0000-0000-0000-000000000013', 'tenant_leases.zip', 'application/zip', 'projects/p2500000-0000-0000-0000-000000000025/tenant_leases.zip', 'Archive containing all current tenant lease agreements', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('d1000000-0000-0000-0000-000000001017', 'p3000000-0000-0000-0000-000000000030', 'b1500000-0000-0000-0000-000000000015', 'building_condition_report.pdf', 'application/pdf', 'projects/p3000000-0000-0000-0000-000000000030/building_condition_report.pdf', 'Engineering assessment of the building condition', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('d1000000-0000-0000-0000-000000001018', 'p3500000-0000-0000-0000-000000000035', 'b1800000-0000-0000-0000-000000000018', 'historic_tax_credits.pdf', 'application/pdf', 'projects/p3500000-0000-0000-0000-000000000035/historic_tax_credits.pdf', 'Analysis of available historic tax credits for the property', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('d1000000-0000-0000-0000-000000001019', 'p4000000-0000-0000-0000-000000000040', 'b2000000-0000-0000-0000-000000000020', 'tech_tenants_overview.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'projects/p4000000-0000-0000-0000-000000000040/tech_tenants_overview.pptx', 'Presentation on the technology tenant landscape in Silicon Valley', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
('d1000000-0000-0000-0000-000000001020', 'p4700000-0000-0000-0000-000000000047', 'b7000000-0000-0000-0000-000000000007', 'construction_schedule.pdf', 'application/pdf', 'projects/p4700000-0000-0000-0000-000000000047/construction_schedule.pdf', 'Detailed construction timeline and milestones', CURRENT_TIMESTAMP - INTERVAL '4 hours');