
# from django.db import models

# class Project(models.Model):
#     title = models.CharField(max_length=150)
#     description = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

# class Image(models.Model):
#     project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images') 
#     title = models.CharField(max_length=100)
#     image_file = models.ImageField(upload_to='images/')
#     created_at = models.DateTimeField(auto_now_add=True)

# class Layer(models.Model):
#     image = models.ForeignKey(Image, on_delete=models.CASCADE, related_name='layers')
#     layer_id = models.IntegerField()
#     shape_type = models.CharField(max_length=50)
#     properties = models.JSONField()
#     created_at = models.DateTimeField(auto_now_add=True)



from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Image(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images') 
    title = models.CharField(max_length=100)
    image_file = models.ImageField(upload_to='images/')
    created_at = models.DateTimeField(auto_now_add=True)

class Layer(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE, related_name='layers')
    layer_id = models.IntegerField()
    shape_type = models.CharField(max_length=50)
    properties = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)


# ---- Auth Profile for roles (does NOT touch existing editor_* tables) ----
from django.conf import settings
from django.contrib.auth.models import User
class Profile(models.Model):
    ROLE_CHOICES = (("user","User"), ("admin","Admin"))
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")

    def __str__(self):
        return f"{self.user.username} ({self.role})"
