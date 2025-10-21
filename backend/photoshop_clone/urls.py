
# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from django.http import HttpResponse

# def backend_status_view(request):
#     return HttpResponse("✅ Backend is Running")

# urlpatterns = [
#     path('', backend_status_view),
#     path('admin/', admin.site.urls),
#     path('api/', include('editor.urls')),
# ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def backend_status_view(request):
    return HttpResponse("✅ Backend is Running")

urlpatterns = [
    path('', backend_status_view),

    path('admin/', admin.site.urls),

    # Existing API under /api/
    path('api/', include('editor.urls')),

    # NEW: Make FE calls like /api/accounts/signup/ work
    path('api/accounts/', include('editor.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
