-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('borrower', 'lender', 'mediator')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    company_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create borrowers table
CREATE TABLE borrowers (
    borrower_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    additional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lenders table
CREATE TABLE lenders (
    lender_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    lending_criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mediators table
CREATE TABLE mediators (
    mediator_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    commission_rate DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    borrower_id INTEGER NOT NULL REFERENCES borrowers(borrower_id) ON DELETE CASCADE,
    project_address TEXT NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    deal_type VARCHAR(50) NOT NULL,
    capital_type VARCHAR(50) NOT NULL,
    debt_request DECIMAL(15, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    completed_value DECIMAL(15, 2) NOT NULL,
    project_description TEXT,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lender_matches table
CREATE TABLE lender_matches (
    match_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    lender_id INTEGER NOT NULL REFERENCES lenders(lender_id) ON DELETE CASCADE,
    borrower_id INTEGER NOT NULL REFERENCES borrowers(borrower_id) ON DELETE CASCADE,
    match_status VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (match_status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, lender_id)
);

-- Create documents table
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
    match_id INTEGER REFERENCES lender_matches(match_id) ON DELETE CASCADE,
    uploader_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (project_id IS NOT NULL AND match_id IS NULL) OR
        (project_id IS NULL AND match_id IS NOT NULL)
    )
);

-- Create communications table
CREATE TABLE communications (
    communication_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create introduction_requests table
CREATE TABLE introduction_requests (
    request_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    borrower_id INTEGER NOT NULL REFERENCES borrowers(borrower_id) ON DELETE CASCADE,
    lender_id INTEGER NOT NULL REFERENCES lenders(lender_id) ON DELETE CASCADE,
    request_status VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (request_status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, lender_id)
);

-- Create sample lenders for preliminary matching
INSERT INTO users (email, password_hash, role, first_name, last_name, company_name) VALUES
('lender1@example.com', 'dummy_hash_replace_in_production', 'lender', 'John', 'Smith', 'ABC Capital'),
('lender2@example.com', 'dummy_hash_replace_in_production', 'lender', 'Jane', 'Doe', 'XYZ Investments'),
('lender3@example.com', 'dummy_hash_replace_in_production', 'lender', 'Mike', 'Johnson', 'Real Estate Finance Group'),
('lender4@example.com', 'dummy_hash_replace_in_production', 'lender', 'Lisa', 'Williams', 'Urban Development Fund'),
('lender5@example.com', 'dummy_hash_replace_in_production', 'lender', 'David', 'Brown', 'Global Property Finance');

-- Insert sample lenders with lending criteria
INSERT INTO lenders (user_id, lending_criteria) VALUES
(1, '{"asset_types": ["Multifamily", "Office"], "deal_types": ["Acquisition", "Refinance"], "capital_types": ["Debt"], "min_loan_amount": 1000000, "max_loan_amount": 10000000, "locations": ["New York, NY", "Los Angeles, CA"], "loan_to_value": 75, "interest_rate_range": {"min": 0.05, "max": 0.07}}'),
(2, '{"asset_types": ["Retail", "Industrial", "Multifamily"], "deal_types": ["Acquisition", "Development"], "capital_types": ["Debt", "Equity"], "min_loan_amount": 5000000, "max_loan_amount": 50000000, "locations": ["Chicago, IL", "Miami, FL"], "loan_to_value": 70, "interest_rate_range": {"min": 0.045, "max": 0.065}}'),
(3, '{"asset_types": ["Hotel", "Mixed Use"], "deal_types": ["Bridge", "Construction"], "capital_types": ["Mezzanine", "Preferred Equity"], "min_loan_amount": 2000000, "max_loan_amount": 15000000, "locations": ["Dallas, TX", "San Francisco, CA"], "loan_to_value": 80, "interest_rate_range": {"min": 0.055, "max": 0.08}}'),
(4, '{"asset_types": ["Multifamily", "Mixed Use", "Industrial"], "deal_types": ["Acquisition", "Refinance", "Bridge"], "capital_types": ["Debt", "Mezzanine"], "min_loan_amount": 3000000, "max_loan_amount": 25000000, "locations": ["Boston, MA", "Seattle, WA"], "loan_to_value": 75, "interest_rate_range": {"min": 0.05, "max": 0.075}}'),
(5, '{"asset_types": ["Office", "Retail", "Industrial"], "deal_types": ["Acquisition", "Development", "Construction"], "capital_types": ["Equity", "Preferred Equity"], "min_loan_amount": 10000000, "max_loan_amount": 100000000, "locations": ["New York, NY", "Los Angeles, CA", "Chicago, IL"], "loan_to_value": 65, "interest_rate_range": {"min": 0.06, "max": 0.09}}');

-- Add extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";