from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Category, Courese, Lesson, Tags


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CourseSerializer(ModelSerializer):
    image = SerializerMethodField()

    def get_image(self, course):
        name = course.image.name
        if name.startswith("static/"):
            path = '/%s' % name
        else:
            path = 'static/%s' % name

        return path

    class Meta:
        model = Courese
        fields = ["id", "subject", "created_date", "category", "image"]


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tags
        fields = "__all__"


class LessonSerializer(ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "subject","image","created_date",
                  "updated_date","course", ]


class LessonDetailSerializer(LessonSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = LessonSerializer.Meta.model
        fields = LessonSerializer.Meta.fields + ['content', 'tags']




