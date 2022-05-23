from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
        avatar = models.ImageField(upload_to='uploads/%Y/%m')
        role = models.CharField(max_length=10, null=False, default="customer")


class ModelBase(models.Model):
        created_date = models.DateTimeField(auto_now_add=True)
        updated_date = models.DateTimeField(auto_now=True)
        active = models.BooleanField(default=True)
        class Meta:
                abstract = True


class ModelsXe(ModelBase):
        mau_ma = models.CharField(max_length=100, null = False, unique = True)
        hang_xe = models.CharField(max_length=100, null = False)
        so_ghe = models.IntegerField(null = False)
        so_do = models.JSONField(null = False)
        trong_tai = models.IntegerField(null = False)
        mo_ta = models.TextField(null=True)

        def __str__(self):
                return self.mau_ma


class Xe(ModelBase):
        model = models.ForeignKey(ModelsXe, on_delete = models.PROTECT)
        bien_so = models.CharField(max_length=20, unique = True, null = False)
        ghi_chu = models.TextField(null=True)

        def __str__(self):
                return  self.bien_so


class BenXe(ModelBase):
        ten = models.CharField(max_length=100, unique = True, null = False)
        dia_chi = models.CharField(max_length=200, null = False)
        quan_huyen = models.CharField(max_length=200, null = False)
        mien = models.CharField(max_length=20, null = False)
        vi_tri = models.CharField(max_length=100, null=True)

        def __str__(self):
                return self.ten


class userInfo(ModelBase):
        ho_ten = models.CharField(max_length=256, null=False, default='')
        account = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
        ngay_sinh = models.DateField(null=True)
        cmnd = models.CharField(max_length=12, null=True, unique=True)
        email = models.EmailField(null=True, unique=True)
        sdt = models.CharField(max_length=12, null=False, unique=True)

        class Meta:
                abstract = True


class NhanVien(userInfo):
        ngay_vao_lam = models.DateField(null=False)
        chuc_vu = models.CharField(max_length=20, null=False)
        ben_xe = models.ForeignKey(BenXe, null=True, on_delete=models.SET_NULL)

        def __str__(self):
                return self.ho_ten


class TaiXe(models.Model):
        nhan_vien = models.OneToOneField(NhanVien, on_delete=models.CASCADE,primary_key=True)
        bang_lai = models.CharField(max_length=20, null=False, unique=True)
        hieu_luc = models.DateField()

        def __str__(self):
                return str(self.nhan_vien)


class NhanVienBanVe(models.Model):
        nhan_vien = models.OneToOneField(NhanVien, on_delete=models.CASCADE,primary_key=True)
        phong_ve = models.CharField(max_length=20)



class TramDung(ModelBase):
        ten = models.CharField(max_length=100, unique = False)
        dia_chi = models.CharField(max_length=200, null = False)
        loai_tram = models.CharField(max_length=20, null=False)

        def __str__(self):
                return self.ten


class TuyenDuong(ModelBase):
        ben_dau = models.ForeignKey(BenXe, on_delete = models.PROTECT, related_name='ben_bd')
        ben_cuoi = models.ForeignKey(BenXe, on_delete = models.PROTECT, related_name='ben_kt')
        quang_duong = models.IntegerField(null = False)
        tramDung_tuyenDuong = models.ManyToManyField(TramDung, through='TramDung_TuyenDuong')

        def __str__(self):
                return str(self.ben_dau) + " - " + str(self.ben_cuoi)


class TramDung_TuyenDuong(models.Model):
        tram_dung = models.ForeignKey(TramDung, on_delete=models.CASCADE, null=False)
        tuyen_duong = models.ForeignKey(TuyenDuong,on_delete=models.CASCADE, null=False)
        thu_tu = models.IntegerField()
        thoi_gian_dung = models.TimeField(null=True)

        def __str__(self):
                return str(self.thu_tu) + " - "+ str(self.tram_dung)


class GiaVe(models.Model):
        xe = models.ForeignKey(Xe, on_delete=models.PROTECT, null=True)
        tuyen_duong = models.ForeignKey(TuyenDuong, on_delete=models.PROTECT)
        gia_ve = models.FloatField(null=False)


class ChuyenXe(ModelBase):
        xe = models.ForeignKey(Xe, on_delete=models.PROTECT)
        tai_xe = models.ForeignKey(TaiXe, on_delete=models.PROTECT)
        tuyen_duong = models.ForeignKey(TuyenDuong, on_delete=models.PROTECT)
        gio_chay = models.DateTimeField(null=True)
        gio_ket_thuc = models.DateTimeField(null=True)

        def __str__(self):
                return str(self.tuyen_duong) + ' - ' + str(self.gio_chay)


class KhachHang(userInfo):
        vip = models.CharField(max_length=10, null=False)


class VeXe(models.Model):
        chuyen_xe = models.ForeignKey(ChuyenXe, on_delete=models.PROTECT, related_name="vexes")
        khach_hang = models.ForeignKey(KhachHang, null=True, on_delete=models.PROTECT)
        ghe = models.CharField(max_length=5, null=False)
        gia_ve = models.FloatField(null=False)
        creator = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
        status = models.SmallIntegerField(default=0)
        code = models.CharField(max_length=10, blank=True)


class BinhLuan(models.Model):
        created_date = models.DateTimeField(auto_now_add=True)
        updated_date = models.DateTimeField(auto_now=True)
        noi_dung = models.TextField(null=False)
        creator = models.ForeignKey(User, on_delete=models.CASCADE)
        chuyen_xe = models.ForeignKey(ChuyenXe, on_delete=models.CASCADE)


class ActionBase(ModelBase):
        chuyen_xe = models.ForeignKey(ChuyenXe, on_delete=models.CASCADE)
        creator = models.ForeignKey(User, on_delete=models.CASCADE)

        class Meta:
                abstract = True


class Action(ActionBase):
        LIKE, DISLIKE = range(2)
        ACTIONS = [
                (LIKE, 'like'),
                (DISLIKE, 'dislike')
        ]
        type = models.PositiveIntegerField(choices=ACTIONS, default=LIKE)


class Rating(ActionBase):
        type = models.PositiveIntegerField(default=0)


class Banner(ModelBase):
        banner = models.ImageField(upload_to='banners/%Y/%m')
        content = models.TextField(blank=True, null=True)
        description = models.TextField(blank=True, null=True)


