from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *



class UserSerializer(ModelSerializer):

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()

        return user

    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        storage_location = '/static'
        img_url = f'http://127.0.0.1:8000{storage_location}/{obj.avatar}'
        return img_url

    class Meta:
        model = User
        fields = ['id','username','password',
                  'avatar','date_joined', 'role','is_active']
        extra_kwargs ={
            'password':{'write_only' : 'true'},
            'date_joined':{'read_only': 'true'}
        }



class BenXeSerializer(ModelSerializer):

    class Meta:
        model = BenXe
        fields = ['id', 'vi_tri', 'ten', 'dia_chi', 'quan_huyen', 'mien']


class ListModelXeSerializer(ModelSerializer):

    class Meta:
        model = ModelsXe
        fields = ['id', 'mau_ma','hang_xe',
                  'so_ghe', 'trong_tai',
                  'mo_ta','created_date']


class ModelXeSerializer(ModelSerializer):

    class Meta:
        model = ModelsXe
        fields = ['id', 'mau_ma','hang_xe',
                  'so_ghe', 'trong_tai', 'so_do',
                  'mo_ta','created_date','updated_date']


class XeSerializer(ModelSerializer):
    model =ModelXeSerializer(many=False)

    class Meta:
        model = Xe
        fields = ['id','model','bien_so','ghi_chu','created_date']

    def update(self, instance, validated_data):
        print("123")
        print(validated_data)
        model = validated_data.pop('model')
        print("123")
        return 123





class NhanVienSerializer(ModelSerializer):
    account = UserSerializer(many=False)
    ben_xe = BenXeSerializer(many=False)

    class Meta:
        model = NhanVien
        fields = '__all__'


class TaiXeSerializer(ModelSerializer):
    nhan_vien = NhanVienSerializer(many=False)

    class Meta:
        model = TaiXe
        fields = '__all__'


class NhanVienBVSerializer(ModelSerializer):
    nhan_vien = NhanVienSerializer(many=False)

    class Meta:
        model = NhanVienBanVe
        fields = '__all__'


class TramDungSerializer(ModelSerializer):

    class Meta:
        model = TramDung
        fields = '__all__'


class TramDung_TuyenDuongSerializer(ModelSerializer):
    tram_dung = TramDungSerializer(many=False)

    class Meta:
        model = TramDung_TuyenDuong
        fields = ['thu_tu','thoi_gian_dung','tram_dung']

    def get_tram_dung_set(self, instance):
        songs = instance.tram_dung.all().order_by('thu_tu')
        return TramDungSerializer(songs, many=True).data


class TuyenDuongSerializer(ModelSerializer):
    ben_dau = BenXeSerializer(many=False)
    ben_cuoi = BenXeSerializer(many=False)
    tramDung_tuyenDuong = TramDung_TuyenDuongSerializer(source='tramdung_tuyenduong_set', many=True)

    class Meta:
        model = TuyenDuong
        fields = '__all__'


class GiaVeSerializer(ModelSerializer):

    class Meta:
        model = GiaVe
        fields = '__all__'



class KetThucChuyenXeSerializer(ModelSerializer):

    class Meta:
        model = ChuyenXe
        fields = ['id', 'active','gio_ket_thuc']


class ChuyenXeSerializer(ModelSerializer):
    tuyen_duong = TuyenDuongSerializer(many=False)
    xe = XeSerializer(many=False)
    # tai_xe = TaiXeSerializer(many=False)

    class Meta:
        model = ChuyenXe
        fields = '__all__'


class VeXeSerializer(ModelSerializer):
    chuyen_xe = ChuyenXeSerializer(many=False)

    class Meta:
        model = VeXe
        fields = '__all__'


class SmallChuyenXeSerializer(ModelSerializer):

    class Meta:
        model = ChuyenXe
        fields = ['id','gio_chay']


class SmallVexe(ModelSerializer):
    chuyen_xe = SmallChuyenXeSerializer(many=False)
    chuyenxe = serializers.DateTimeField(
        source='chuyen_xe.gio_chay'
    )
    class Meta:
        model = VeXe
        fields = ['id', 'chuyenxe', 'gia_ve', 'chuyen_xe']


class VeXeIdSerializer(ModelSerializer):

    class Meta:
        model = VeXe
        fields = ['ghe']

class KhachHangSerializer(ModelSerializer):

    class Meta:
        model = KhachHang
        fields = ['id','ho_ten','ngay_sinh','cmnd','sdt','email','vip','account_id']
        read_only_fields = ['vip','account_id']


class BinhLuanSerializer(ModelSerializer):
    creator = UserSerializer(many=False)

    class Meta:
        model = BinhLuan
        fields = '__all__'


class ActionSerializer(ModelSerializer):

    class Meta:
        model = Action
        fields = '__all__'


class BannerSerializer(ModelSerializer):

    class Meta:
        model = Banner
        fields = ['created_date', 'content' ,'banner']


class GiochaySerializer(ModelSerializer):

    class Meta:
        model = ChuyenXe
        fields = ['id','gio_chay']


class VeXeTmpSerializer(ModelSerializer):

    class Meta:
        model = VeXe
        fields = ['ghe','status']


class CurChuyenXeSerializer(ModelSerializer):
    vexes = VeXeTmpSerializer(many=True)
    tuyen_duong = TuyenDuongSerializer(many=False)
    xe = XeSerializer(many=False)
    count = serializers.IntegerField(
        source='vexes.count',
        read_only=True
    )
    class Meta:
        model = ChuyenXe
        fields = ['id','xe','tai_xe','tuyen_duong','gio_chay','vexes', 'count']

class RatingSerializer(ModelSerializer):

    class Meta:
        model = Rating
        fields = '__all__'