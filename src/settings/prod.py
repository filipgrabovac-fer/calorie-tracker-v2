from .base import *
import os
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = ['*']

DATABASES = {'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))}

CORS_ALLOWED_ORIGINS = [
    "https://calorietracker-app-9bvmm7-0fabb8-46-225-125-32.traefik.me",
    "http://calorietracker-app-9bvmm7-0fabb8-46-225-125-32.traefik.me",
    "https://calorietracker-app-9bvmm7-41037d-46-225-125-32.traefik.me",
    "http://calorietracker-app-9bvmm7-41037d-46-225-125-32.traefik.me",
]
CORS_ALLOW_CREDENTIALS = True

CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CSRF_TRUSTED_ORIGINS = [
    'https://*.dokploy.com',
    'https://calorietracker-app-9bvmm7-0fabb8-46-225-125-32.traefik.me',
    'http://calorietracker-app-9bvmm7-0fabb8-46-225-125-32.traefik.me',
    'https://calorietracker-app-9bvmm7-41037d-46-225-125-32.traefik.me',
    'http://calorietracker-app-9bvmm7-41037d-46-225-125-32.traefik.me',
]