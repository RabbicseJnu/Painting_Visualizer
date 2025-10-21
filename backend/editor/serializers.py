# from rest_framework import serializers
# from .models import Project, Image, Layer

# class LayerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Layer
#         fields = '__all__'

# class ImageSerializer(serializers.ModelSerializer):
#     layers = LayerSerializer(many=True, read_only=True)

#     class Meta:
#         model = Image
#         fields = '__all__'
        
# class ImageUploadSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Image
#         fields = ['project', 'title', 'image_file']

# class ProjectSerializer(serializers.ModelSerializer):
#     images = ImageSerializer(many=True, read_only=True)

#     class Meta:
#         model = Project
#         fields = '__all__'

# class ProjectCreateSerializer(serializers.ModelSerializer):
#     image_file = serializers.ImageField(write_only=True)

#     class Meta:
#         model = Project
#         fields = ['title', 'description', 'image_file']

#     def create(self, validated_data):
#         image_file = validated_data.pop('image_file')
#         project = Project.objects.create(**validated_data)
#         Image.objects.create(project=project, title=f"{project.title} Image", image_file=image_file)
#         return project


from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Project, Image, Layer, Profile


# =========================
# Canvas / Project serializers
# =========================
class LayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layer
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):
    # assumes Layer FK has related_name="layers"; if not, set source="layer_set"
    layers = LayerSerializer(many=True, read_only=True)

    class Meta:
        model = Image
        fields = "__all__"


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["project", "title", "image_file"]


class ProjectSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"


class ProjectCreateSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True)

    class Meta:
        model = Project
        fields = ["title", "description", "image_file"]

    def create(self, validated_data):
        image_file = validated_data.pop("image_file")
        project = Project.objects.create(**validated_data)
        Image.objects.create(
            project=project, title=f"{project.title} Image", image_file=image_file
        )
        return project


# =========================
# Auth / Profile serializers
# =========================
class UserPublicSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "role")

    def get_role(self, obj):
        return getattr(getattr(obj, "profile", None), "role", "user")


class RegisterSerializer(serializers.ModelSerializer):
    # adjust min_length if you want weaker/stronger rule
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(
        choices=[("user", "User"), ("admin", "Admin")], required=False
    )

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    # ✅ normalize username so "fazle Rabbi" won't 400; becomes "fazle_Rabbi"
    def validate_username(self, value: str) -> str:
        return value.strip().replace(" ", "_")

    def create(self, validated):
        role = validated.pop("role", "user")
        user = User.objects.create_user(**validated)
        prof, _ = Profile.objects.get_or_create(user=user)
        prof.role = role or "user"
        prof.save()
        return user

