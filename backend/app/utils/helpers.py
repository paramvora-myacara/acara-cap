import jwt
from datetime import datetime, timedelta
from flask import current_app
import hashlib
import os


def generate_password_hash(password):
    """
    Generate a hash for a password.

    Args:
        password (str): The plaintext password

    Returns:
        str: The password hash
    """
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000,
        dklen=128
    )
    return salt.hex() + key.hex()


def verify_password(stored_hash, password):
    """
    Verify a password against a stored hash.

    Args:
        stored_hash (str): The stored password hash
        password (str): The plaintext password to verify

    Returns:
        bool: True if the password matches, False otherwise
    """
    salt = bytes.fromhex(stored_hash[:64])
    stored_key = stored_hash[64:]
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000,
        dklen=128
    )
    return stored_key == key.hex()


def generate_jwt_token(user_id, role, expiration=86400):
    """
    Generate a JWT token for a user.

    Args:
        user_id (int): The user's ID
        role (str): The user's role (borrower, lender, mediator)
        expiration (int, optional): Token expiration time in seconds. Defaults to 86400 (24 hours).

    Returns:
        str: A JWT token
    """
    payload = {
        'exp': datetime.utcnow() + timedelta(seconds=expiration),
        'iat': datetime.utcnow(),
        'sub': user_id,
        'role': role
    }
    return jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )


def decode_jwt_token(token):
    """
    Decode a JWT token.

    Args:
        token (str): The JWT token to decode

    Returns:
        dict: The decoded token payload, or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def is_valid_location(location):
    """
    Validate a location string.

    Args:
        location (str): The location to validate

    Returns:
        bool: True if the location is valid, False otherwise
    """
    # For MVP, a simple length check
    return location and len(location.strip()) >= 3


def format_currency(amount):
    """
    Format a currency amount.

    Args:
        amount (float or str): The amount to format

    Returns:
        str: Formatted currency string
    """
    try:
        value = float(amount)
        return "${:,.2f}".format(value)
    except (ValueError, TypeError):
        return "$0.00"