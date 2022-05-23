import requests
from django.shortcuts import render
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import Http404
from .models import Category, Courese, Lesson, Tags
from .serializer import (CategorySerializer,
                         CourseSerializer,
                         LessonSerializer,
                         LessonDetailSerializer)
from .paginator import BasePagination
# Create your views here.


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        courses = Courese.objects.filter(active = True)
        return courses



class LessonsViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Lesson.objects.filter(active=True)
    serializer_class = LessonDetailSerializer

    @action(methods={'post'}, detail=True, url_path='tags')
    def add_tag(self, request, pk):
        try:
            lesson = self.get_object()
        except Http404:
            return Response(status = status.HTTP_404_NOT_FOUND)
        else:
            tags = request.data.get("tags")
            if tags is not None:
                for tag in tags:
                    t, _ = Tags.objects.get_or_create(name=tag)
                    lesson.tags.add(t)

                lesson.save()

                return Response(self.serializer_class(lesson).data,
                                status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_404_NOT_FOUND)