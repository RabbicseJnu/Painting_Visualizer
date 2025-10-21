
# from django.urls import include, path
# from rest_framework.routers import DefaultRouter
# from .views import ProjectViewSet, ImageViewSet, LayerViewSet

# router = DefaultRouter()
# router.register(r'projects', ProjectViewSet)
# router.register(r'images', ImageViewSet)
# router.register(r'layers', LayerViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ProjectViewSet,
    ImageViewSet,
    LayerViewSet,
    RegisterView,
    LoginView,                 # returns access/refresh + user
    DownloadEditedImage,
    AdminOnlyDashboard,
    MeView,                    # <-- add
    ClaimGuestProjects,        # <-- add
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'images', ImageViewSet)
router.register(r'layers', LayerViewSet)

urlpatterns = [
    # CRUD routers
    path('', include(router.urls)),

    # --- Auth: signup (support both paths used by frontend) ---
    path('signup/', RegisterView.as_view(), name='signup'),
    path('accounts/signup/', RegisterView.as_view(), name='accounts-signup'),

    # --- Auth: login (support both paths used by frontend) ---
    path('login/', LoginView.as_view(), name='login'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),

    # --- JWT refresh (if you add refresh logic later) ---
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # --- Current user info (useful after reload) ---
    path('me/', MeView.as_view(), name='me'),

    # --- Claim guest projects after login (safe no-op for now) ---
    path('accounts/claim-guest-projects/', ClaimGuestProjects.as_view(), name='claim-guest-projects'),

    # --- Features you already had ---
    path('images/<int:image_id>/download/', DownloadEditedImage.as_view(), name='image-download'),
    path('admin/dashboard/', AdminOnlyDashboard.as_view(), name='admin-dashboard'),
]

