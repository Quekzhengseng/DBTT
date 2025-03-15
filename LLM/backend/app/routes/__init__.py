# Import and register all blueprints here for easier import in the app factory

from .chat import chat_bp
from .files import files_bp
from .issues import issues_bp

# Export blueprints
__all__ = ['chat_bp', 'files_bp', "issues_bp"]