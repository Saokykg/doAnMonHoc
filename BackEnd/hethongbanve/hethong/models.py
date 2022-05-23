from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    avatar = models.ImageField( upload_to='/uploads/%Y/%m')


class XeKhach(models.model):
    bienso = models.CharField(max_length=10, null = False)
    soghe = models.DecimalField(null = False)
    trongtai = models.DecimalField(null = False)
    loaixe = models.CharField(max_length=100, null = False)
    active = models.BooleanField(default=True)
    create_date = models.DateTimeField(auto_now_add = True)

