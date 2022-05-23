from django.urls import path, include
from . import views
from rest_framework import routers
from oauth2_provider import  *

router = routers.DefaultRouter()

router.register('banner', views.bannerViewSet, 'banner')
router.register('users', views.UserViewSet, 'users')
router.register('nhanvien', views.NhanVienViewSet, 'nhanvien')
router.register('taixe', views.TaiXeViewSet, 'taixe')
router.register('nhanvienbanve', views.NhanVienBanVeViewSet, 'nhanvienbanve')
router.register('khachhang', views.KhachHangViewSet, 'khachhang')

router.register('xe', views.XeViewSet, 'xe')
router.register('modelxe', views.ModelXeViewSet, 'modelxe')

router.register('benxe', views.BenxeViewSet, 'benxe')
router.register('tramdung', views.TramDungViewSet, 'tramdung')
router.register('tuyenduong', views.TuyenDuongViewSet, 'tuyenduong')

router.register('chuyenxe', views.ChuyenXeViewSet, 'chuyenxe')
router.register('vexe', views.VeXeViewSet, 'vexe')
router.register('giave', views.GiaVeViewSet, 'giave')
router.register('tramtuyen', views.tramDung_tuyenDuongViewSet, 'tramtuyen')
router.register('thongke', views.ThongKeViewset, 'thongke')

urlpatterns = [
    path('', include(router.urls)),
    path('oauthinfo/', views.OauthInfo.as_view())
]

