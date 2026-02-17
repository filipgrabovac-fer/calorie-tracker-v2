#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    # Get the src directory path
    src_dir = os.path.join(os.path.dirname(__file__), "src")
    
    # Add src directory to Python path
    sys.path.insert(0, src_dir)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.local')
    
    # Only change directory for specific commands that need it
    if len(sys.argv) > 1 and sys.argv[1] in ['startapp', 'startproject']:
        os.chdir(src_dir)
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
