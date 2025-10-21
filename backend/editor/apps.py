
# from django.apps import AppConfig

# class EditorConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'editor'

from django.apps import AppConfig

class EditorConfig(AppConfig):
    def ready(self):
        import editor.signals  # noqa
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'editor'
