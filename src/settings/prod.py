from .base import *
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = ['*']

DATABASES = {'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))}


CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = ['https://*.dokploy.com']