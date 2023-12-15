"""
This module is used to override the settings for local development.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "my_docs",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "postgres",
        "PORT": "5432",
        "OPTIONS": {
            "options": "-c timezone=America/Sao_Paulo",
        },
    },
}

# Silk

SILKY_PYTHON_PROFILER = True
SILKY_ENABLE_PROFILER = True
SILKY_AUTHENTICATION = False
SILKY_AUTHORISATION = False
SILKY_INTERCEPT_PERCENT = 100
SILKY_META = True

# CORS

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = False

# Media

MEDIA_URL = "/storage/"
MEDIA_ROOT = os.path.join(BASE_DIR, "")
