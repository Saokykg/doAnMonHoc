from django.contrib import admin
from .models import *
# Register your models here.

class BenXeAdmin(admin.ModelAdmin):
    list_display = ['ten','dia_chi','quan_huyen','mien']
    list_filter = ['quan_huyen','mien']
    list_per_page = 10


class TramInLineTuyen(admin.StackedInline):
    model = TramDung_TuyenDuong
    fk_name = 'tuyen_duong'


class AdminTuyenDuong(admin.ModelAdmin):
    inlines = [TramInLineTuyen]


admin.site.register(User)
admin.site.register(BenXe, BenXeAdmin)
admin.site.register(ModelsXe)
admin.site.register(Xe)
admin.site.register(TuyenDuong, AdminTuyenDuong)
admin.site.register(ChuyenXe)
admin.site.register(TramDung)
admin.site.register(VeXe)
admin.site.register(NhanVien)
admin.site.register(KhachHang)
admin.site.register(BinhLuan)
admin.site.register(TaiXe)
admin.site.register(NhanVienBanVe)
admin.site.register(TramDung_TuyenDuong)
admin.site.register(Banner)