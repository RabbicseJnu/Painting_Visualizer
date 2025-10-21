
# from django.contrib import admin
# from .models import Project, Image, Layer

# admin.site.register(Project)
# admin.site.register(Image)
# admin.site.register(Layer)


from django.contrib import admin
from .models import Project, Image, Layer

admin.site.register(Project)
admin.site.register(Image)
admin.site.register(Layer)


from .models import Profile
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id","user","role")
    list_filter = ("role",)
    search_fields = ("user__username","user__email")


