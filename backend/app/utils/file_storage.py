import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename


def save_file(file, project_id):
    """
    Save a file to the local file system.

    Args:
        file: File object from request.files
        project_id: Project ID for organizing files

    Returns:
        tuple: (file_path, file_name, file_type)
    """
    filename = secure_filename(file.filename)
    file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    unique_filename = f"{str(uuid.uuid4())}.{file_ext}" if file_ext else str(uuid.uuid4())

    # Create directory if it doesn't exist
    upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'projects', project_id)
    os.makedirs(upload_dir, exist_ok=True)

    # Full path for saving the file
    full_path = os.path.join(upload_dir, unique_filename)
    file.save(full_path)

    # Return relative path for database storage
    relative_path = f"projects/{project_id}/{unique_filename}"
    return relative_path, filename, file.content_type


def get_file_path(relative_path):
    """
    Get the absolute file path from a relative path.

    Args:
        relative_path: Relative path to the file

    Returns:
        str: Absolute file path
    """
    return os.path.join(current_app.config['UPLOAD_FOLDER'], relative_path)

