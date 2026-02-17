from .base import *
import dj_database_url

DEBUG = True

ALLOWED_HOSTS = ['*']

DATABASES = {'default': dj_database_url.config(default='postgresql://postgres:postgres@localhost:5432/postgres')}

CORS_ALLOW_ALL_ORIGINS = True