from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class modelBase(models.Model):
    subject = models.CharField(max_length=255, null= True)
    image = models.ImageField(upload_to='courses/%Y/%m', default=None, null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    avatar = models.ImageField(upload_to='uploads/%y/%m')


class Category(modelBase):
    name = models.CharField(max_length=100, unique= True)

    def __str__(self):
        return self.name


class Courese(modelBase):
    class Meta:
        unique_together = ('subject','category')

    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                 null=True)
    def __str__(self):
        return self.subject


class Lesson(modelBase):
    class Meta:
        unique_together = ('subject','course')

    content = models.TextField(null=True)
    course = models.ForeignKey(Courese, related_name="lessons",
                               on_delete=models.CASCADE, null=True)
    tags = models.ManyToManyField('Tags', null=True, related_name="lessons", blank=True)



class Tags(models.Model):
    name = models.CharField(max_length=100, null=False)



class Emotion(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class like(models.Model):
    lesson_id = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=False)
    emotion_id = models.ForeignKey(Emotion, on_delete=models.PROTECT, null=False)

    def __str__(self):
        return self.name


