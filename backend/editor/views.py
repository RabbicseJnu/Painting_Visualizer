# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from .models import Project, Image, Layer
# from .serializers import (
#     ProjectSerializer,
#     ImageSerializer,
#     ImageUploadSerializer,
#     LayerSerializer,
#     ProjectCreateSerializer
# )

# class ProjectViewSet(viewsets.ModelViewSet):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer

#     @action(detail=False, methods=['post'], url_path='upload')
#     def upload_project_with_image(self, request):
#         serializer = ProjectCreateSerializer(data=request.data)
#         if serializer.is_valid():
#             project = serializer.save()
#             return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     @action(detail=True, methods=['get'], url_path='images')
#     def get_images(self, request, pk=None):
#         project = self.get_object()
#         images = project.images.all()
#         serializer = ImageSerializer(images, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['delete'], url_path='delete-with-resources')
#     def delete_with_resources(self, request, pk=None):
#         project = self.get_object()
#         project.delete()  # Cascades to images and layers
#         return Response({"detail": "Project, images, and layers deleted."}, status=status.HTTP_204_NO_CONTENT)


# class ImageViewSet(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer
#     parser_classes = (MultiPartParser, FormParser)

#     @action(detail=False, methods=['post'], url_path='upload-to-project')
#     def upload_to_project(self, request):
#         serializer = ImageUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             image = serializer.save()
#             return Response(ImageSerializer(image).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=True, methods=['get'], url_path='layers')
#     def get_layers(self, request, pk=None):
#         image = self.get_object()
#         layers = image.layers.all()
#         serializer = LayerSerializer(layers, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['delete'], url_path='delete-with-layers')
#     def delete_with_layers(self, request, pk=None):
#         image = self.get_object()
#         image.delete()
#         return Response({"detail": "Image and associated layers deleted."}, status=status.HTTP_204_NO_CONTENT)


# class LayerViewSet(viewsets.ModelViewSet):
#     queryset = Layer.objects.all()
#     serializer_class = LayerSerializer


from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.models import User

from .models import Project, Image, Layer
from .serializers import (
    ProjectSerializer,
    ImageSerializer,
    ImageUploadSerializer,
    LayerSerializer,
    ProjectCreateSerializer,
    RegisterSerializer,
    UserPublicSerializer,
)


# -----------------------------
# Core CRUD ViewSets
# -----------------------------
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=False, methods=['post'], url_path='upload')
    def upload_project_with_image(self, request):
        """
        Create a Project and its first Image in one call.
        """
        serializer = ProjectCreateSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save()
            return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='images')
    def get_images(self, request, pk=None):
        project = self.get_object()
        images = project.images.all()
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], url_path='delete-with-resources')
    def delete_with_resources(self, request, pk=None):
        """
        Deletes a project; assumes FK cascade removes images & layers.
        """
        project = self.get_object()
        project.delete()
        return Response({"detail": "Project, images, and layers deleted."}, status=status.HTTP_204_NO_CONTENT)


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=False, methods=['post'], url_path='upload-to-project')
    def upload_to_project(self, request):
        """
        Upload an image and attach to an existing project.
        """
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.save()
            return Response(ImageSerializer(image).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='layers')
    def get_layers(self, request, pk=None):
        image = self.get_object()
        layers = image.layers.all()
        serializer = LayerSerializer(layers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], url_path='delete-with-layers')
    def delete_with_layers(self, request, pk=None):
        image = self.get_object()
        image.delete()
        return Response({"detail": "Image and associated layers deleted."}, status=status.HTTP_204_NO_CONTENT)


class LayerViewSet(viewsets.ModelViewSet):
    queryset = Layer.objects.all()
    serializer_class = LayerSerializer


# -----------------------------
# Auth / Roles
# -----------------------------
class RegisterView(generics.CreateAPIView):
    """
    POST /api/signup/  (also aliased at /api/accounts/signup/)
    Body: {username, email?, password, role?}
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class MyTokenSerializer(TokenObtainPairSerializer):
    """
    Custom token that embeds the user's role and returns user payload.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        role = getattr(getattr(user, "profile", None), "role", "user")
        token["role"] = role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserPublicSerializer(self.user).data
        return data


class LoginView(TokenObtainPairView):
    """
    POST /api/login/  (also aliased at /api/auth/login/)
    Body: {username, password}
    Returns: {access, refresh, user}
    """
    serializer_class = MyTokenSerializer


class IsAdminRole(permissions.BasePermission):
    """
    Only allow users with profile.role == 'admin' (or Django staff).
    """
    def has_permission(self, request, view):
        u = request.user
        if not (u and u.is_authenticated):
            return False
        role = getattr(getattr(u, "profile", None), "role", "user")
        return role == "admin" or u.is_staff


# -----------------------------
# Utility / Feature Endpoints
# -----------------------------
class DownloadEditedImage(APIView):
    """
    Example protected endpoint for downloads.
    Registered users can download; guests cannot.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, image_id):
        # TODO: implement your real file/bytes stream here.
        return Response({"ok": True, "image_id": image_id})


class AdminOnlyDashboard(APIView):
    """
    Example admin-only data endpoint.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        return Response({"secret": "admin-only data"})


class MeView(APIView):
    """
    GET /api/me/  -> current authenticated user (for frontend bootstrapping)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserPublicSerializer(request.user).data)


class ClaimGuestProjects(APIView):
    """
    POST /api/accounts/claim-guest-projects/
    Frontend calls this right after login to move any 'guest' work to the user.
    If you add ownership in your models later, implement the transfer logic here.
    For now it's a safe no-op so the frontend won't error.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Example skeleton for future:
        # if request.user.is_authenticated:
        #     guest_ids = request.session.get("guest_project_ids", [])
        #     Project.objects.filter(id__in=guest_ids).update(owner=request.user)
        #     request.session["guest_project_ids"] = []
        #     return Response({"claimed": len(guest_ids)})
        return Response({"claimed": 0})

