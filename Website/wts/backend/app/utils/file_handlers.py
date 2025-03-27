import os

def get_file_extension(filename):
    """Get the file extension from a filename."""
    return os.path.splitext(filename)[1].lower()

def allowed_file(filename, allowed_extensions=None):
    """Check if a file has an allowed extension."""
    if allowed_extensions is None:
        allowed_extensions = {'.txt', '.pdf', '.doc', '.docx', '.md'}
    
    return get_file_extension(filename) in allowed_extensions