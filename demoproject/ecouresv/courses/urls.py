from django.contrib import admin
from django.urls import  path, include
from  rest_framework import routers
from . import  views

router = routers.DefaultRouter()
router.register("categories", views.CategoryViewSet, 'category')
router.register("courses", views.CourseViewSet, 'course')
router.register("lessons", views.LessonsViewSet, 'lesson')

urlpatterns =[
    path('',include(router.urls))
]