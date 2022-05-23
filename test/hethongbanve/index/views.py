from itertools import starmap

from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Count
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import Http404
from rest_framework.views import APIView
from django.conf import settings
from .models import *
from .serializers import *
from datetime import datetime
from django.utils.crypto import get_random_string

import logging
# Create your views here.
def index(request):
    return HttpResponse("e-Course App")


class OauthInfo(APIView):
    def get(self, resquest):
        return Response(settings.OAUTH_KEY,
                        status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.CreateAPIView,
                  generics.RetrieveAPIView,
                  generics.UpdateAPIView):
    queryset = User.objects.filter(is_active = True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]

    def get_permissions(self):
        if self.action == 'get_current_user' or self.action == 'patch':
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], detail=False, url_path="check_username")
    def check_username(self, request):
        u = self.request.query_params.get('u')
        if u is not None:
            return Response(User.objects.filter(username=u).exists(), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False, url_path="current_user")
    def get_current_user(self, request):
        return Response(self.serializer_class(request.user).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path="register")
    def register_costumer(self, request):
        user = request.data
        print(user)
        if user is not None:
            if not (User.objects.filter(username=user['username']).exists() or
                    KhachHang.objects.filter(email=user['email']).exists()):
                u = User(
                    username = user['username'],
                    password= user['password'],
                    avatar = user['avatar'],
                    role = "customer"
                )
                u.set_password(u.password)
                u.save()
                try:
                    k = KhachHang(
                        ho_ten = user['name'],
                        email = user['email'],
                        sdt = user['sdt']
                    )
                    k.account = u
                    k.save()
                except Exception as e:
                    u.delete()
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                return Response([UserSerializer(u).data, KhachHangSerializer(k).data],
                                status=status.HTTP_201_CREATED)

            else:
                return Response("Already existed",
                                status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        opw =request.data.get("old_password")
        pw =request.data.get("password")
        if (check_password(opw,self.request.user.password)):
            user = request.user
            user.password = make_password(pw)
            user.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "wrong password"}, status=status.HTTP_200_OK)



    #
    # def get_permissions(self):
    #     if self.action == 'retrieve':
    #         return [permissions.IsAuthenticated()]
    #
    #     return [permissions.AllowAny];


class NhanVienViewSet(viewsets.ViewSet,
                      generics.ListAPIView,
                      generics.RetrieveAPIView,
                      generics.CreateAPIView,
                      generics.UpdateAPIView,
                      generics.DestroyAPIView):
    serializer_class = NhanVienSerializer
    queryset = NhanVien.objects.all()

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def partial_update(self, request, *args, **kwargs):
        obj = request.data.get("oldpassword")
        if check_password(obj, request.user.password):
            if request.data.get("password") is not None and request.data.get("password") != "":
                user = request.user
                user.password = make_password(request.data.get("password"))
                user.save()

            return super().partial_update(request, *args, **kwargs)
        else:
            return Response(False, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["patch"], detail=True, url_path="update")
    def update_nv_info(self, request, *args, **kwargs):
        data = request.data
        nhanvien=self.get_object()
        nhanvien.ten = data["ten"]
        nhanvien.cmnd = data["cmnd"]
        nhanvien.sdt = data["sdt"]
        nhanvien.email = data["email"]
        nhanvien.chuc_vu = data["chuc_vu"]
        nhanvien.ngay_vao_lam = data["ngay_vao_lam"]
        nhanvien.ngay_sinh = data["ngay_sinh"]
        nhanvien.save()
        return Response(NhanVienSerializer(nhanvien,many=False).data,
                        status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path="create_account")
    def create_acc(self):
        nhanvien = self.get_object()
        res = User.objects.create(
            username = nhanvien.email,
            password = make_password(nhanvien.cmnd),
            role = nhanvien.chuc_vu
        )
        nhanvien.account = res
        nhanvien.save()
        return Response(NhanVienSerializer(nhanvien, many=False).data,
                        status=status.HTTP_201_CREATED)

    @action(methods=["patch"], detail=True, url_path="deactive")
    def deactive_acc(self, request, pk):
        nhanvien = self.get_object()
        user = User.objects.get(pk = nhanvien.account.id)
        user.is_active = False
        user.save()
        return Response(UserSerializer(user, many=False).data,
                        status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path="createacc")
    def create_acc(self, request, pk):
        nhanvien = self.get_object()
        print(NhanVienSerializer(nhanvien, many=False).data)
        if nhanvien.account is None:
            user = User.objects.create(
                username=nhanvien.email,
                password=make_password(nhanvien.cmnd),
                role=nhanvien.chuc_vu
            )
        else:
            user = User.objects.get(pk = nhanvien.account.id)
            user.password = make_password(nhanvien.cmnd)
            user.is_active = True
            user.save()

        nhanvien.account = user
        return Response(NhanVienSerializer(nhanvien, many=False).data,
                        status=status.HTTP_201_CREATED)

    def create(self, request, *args, **kwargs):
        data = request.data
        if data["ten"] is not None and data["cmnd"] is not None and data["email"] is not None:
            nhanvien = NhanVien.objects.create(
                ho_ten = data["ten"],
                ngay_sinh = data["ngay_sinh"],
                cmnd = data["cmnd"],
                email = data["email"],
                sdt = data["sdt"],
                ngay_vao_lam = data["ngay_vao_lam"],
                chuc_vu = data["chuc_vu"],
            )
            return Response(NhanVienSerializer(nhanvien, many=False).data,
                            status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class TaiXeViewSet(viewsets.ViewSet,
                   generics.ListAPIView,
                   generics.RetrieveAPIView):
    serializer_class = TaiXeSerializer
    queryset = TaiXe.objects.all()

    @action(methods=["get"], detail=False, url_path="info")
    def get_cur_taixe(self, request):
        nv = NhanVien.objects.filter(account_id=request.user.id).first()
        taixe = TaiXe.objects.filter(nhan_vien__id=nv.id).first()
        return Response(TaiXeSerializer(taixe).data,
                        status=status.HTTP_200_OK)


class NhanVienBanVeViewSet(viewsets.ViewSet, generics.ListAPIView):
    serializer_class = NhanVienBVSerializer
    queryset = NhanVienBanVe.objects.all()

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    @action(methods=["get"], detail=False, url_path="info")
    def get_cur_nvbv(self, request):
        nv = NhanVien.objects.filter(account_id=request.user.id).first()
        nvbv = NhanVienBanVe.objects.filter(nhan_vien__id = nv.id).first()
        return Response(NhanVienBVSerializer(nvbv).data,
                        status=status.HTTP_200_OK)


class KhachHangViewSet(viewsets.ViewSet,
                       generics.ListAPIView,
                       generics.RetrieveAPIView,
                       generics.UpdateAPIView):
    serializer_class = KhachHangSerializer
    queryset = KhachHang.objects.all()

    def update(self, request, *args, **kwargs):
        if (self.request.user.id == self.get_object().account_id):
            pw =request.data.get("password")
            if (check_password(pw, self.request.user.password)):
                return super().update(request, *args, **kwargs)
            else:
                return Response({"error":"wrong password"}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(methods=['get'], detail=False, url_path="cur_costumer")
    def get_cur_costumer(self, request):
        khachinfo = KhachHang.objects.filter(active=True, account_id = request.user.id).first()
        # print(KhachHangSerializer(khachinfo).data)
        if khachinfo is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res = {
            "user" : UserSerializer(request.user).data,
            "khachhang": KhachHangSerializer(khachinfo).data
        }
        return Response(res, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path="check_email")
    def check_email(self, request):
        e = self.request.query_params.get('e')
        if e is not None:
            return Response(KhachHang.objects.filter(email=e).exists(), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False, url_path="vexe")
    def get_lichsu(self, request):
        khachhang = KhachHang.objects.filter(account_id =request.user.id).first()
        print(khachhang.id)
        vexe = VeXe.objects.filter(
            khach_hang_id = khachhang.id,
        )
        vexe = VeXeSerializer(vexe, many=True).data
        return Response(vexe,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path="search")
    def search_khach_hang(self, request):
        sdt = self.request.query_params.get('sdt')
        ten = self.request.query_params.get('ten')
        cmnd = self.request.query_params.get('cmnd')
        if cmnd is None and ten is None and sdt is not None:
            kh = KhachHang.objects.filter(sdt=sdt).first()
            if kh is None:
                return Response(False,
                                status=status.HTTP_200_OK)
            return Response(KhachHangSerializer(kh).data,
                            status=status.HTTP_200_OK)
        else:
            kh = KhachHang.objects
            if cmnd is not None:
                kh = kh.filter(cmnd__icontaint = cmnd)
            if sdt is not None:
                kh = kh.filter(sdt__icontaint = sdt)
            if ten is not None:
                kh = kh.filter(ten__icontaint=ten)
            return Response(KhachHangSerializer(kh).data,
                            status=status.HTTP_200_OK)


class BenxeViewSet(viewsets.ViewSet,
                   generics.ListAPIView,
                   generics.RetrieveAPIView,
                   generics.UpdateAPIView,
                   generics.CreateAPIView,
                   generics.DestroyAPIView):
    serializer_class = BenXeSerializer

    def get_queryset(self):
        benxe = BenXe.objects.filter(active=True)
        return benxe
        # print(self.request.user.has_perm('index.view_benxe'))
        # if self.request.user.has_perm('index.view_bensxe'):
        #     return benxe


class ModelXeViewSet(viewsets.ViewSet,
                     generics.ListAPIView,
                     generics.CreateAPIView,
                     generics.RetrieveAPIView,
                     generics.DestroyAPIView,
                     generics.UpdateAPIView):
    serializer_class = ModelXeSerializer
    queryset = ModelsXe.objects.filter(active=True)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        model = ModelsXe.objects.all()
        return Response(ListModelXeSerializer(model, many=True).data,
                        status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        if (self.request.user.has_perm('index.add_modelsxe')):
            ma = self.request.data.get("mau_ma")
            if ModelsXe.objects.filter(mau_ma = ma).first() is None:
                return super().create(request, *args, **kwargs)
            else:
                return Response({
                    "error": "Trùng mã"
                }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if (self.request.user.has_perm('index.delete_modelsxe')):
            return super().destroy(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        if (self.request.user.has_perm('index.change_modelsxe')):
            return super().partial_update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)


class XeViewSet(viewsets.ViewSet,
                generics.ListAPIView,
                generics.CreateAPIView,
                generics.RetrieveAPIView,
                generics.DestroyAPIView,
                generics.UpdateAPIView):
    serializer_class = XeSerializer
    queryset = Xe.objects.filter(active=True)

    def update(self, request, *args, **kwargs):
        xe = self.get_object()
        # xe.ghi_chu = request.data["ghi_chu"]
        model = request.data["model"]
        model = ModelsXe.objects.get(pk = model)
        xe.model = model
        xe.ghi_chu = request.data["ghi_chu"]
        xe.bien_so = request.data["bien_so"]
        xe.save()
        return Response(XeSerializer(xe,many=False).data,
                        status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        xe = request.data
        if xe["model"] is None or xe["bien_so"] is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res = Xe.objects.create(
            ghi_chu = xe["ghi_chu"],
            bien_so = xe["bien_so"],
            model = ModelsXe.objects.get(pk = xe["model"]),
        )
        return Response(XeSerializer(res, many=False).data,
                        status=status.HTTP_201_CREATED)



class TramDungViewSet(viewsets.ViewSet,
                      generics.ListAPIView,
                      generics.RetrieveAPIView,
                      generics.CreateAPIView,
                      generics.UpdateAPIView,
                      generics.DestroyAPIView):
    serializer_class = TramDungSerializer
    queryset = TramDung.objects.filter(active=True)


class TuyenDuongViewSet(viewsets.ViewSet,
                        generics.ListAPIView,
                        generics.RetrieveAPIView,
                        generics.CreateAPIView,
                        generics.UpdateAPIView,
                        generics.DestroyAPIView):
    serializer_class = TuyenDuongSerializer
    queryset = TuyenDuong.objects.filter(active=True)

    @action(methods=['get'], detail=False, url_path="bendau")
    def get_ben_dau(self, request):
        bencuoi = self.request.query_params.get('bc')
        if bencuoi is not None:
            bd = TuyenDuong.objects.values('ben_dau').filter(ben_cuoi=bencuoi, active=True).distinct()
        else:
            bd = TuyenDuong.objects.values('ben_dau').filter(active=True).distinct()
        bendau = BenXe.objects.filter(id__in=bd)
        return Response(BenXeSerializer(bendau, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path="bencuoi")
    def get_ben_cuoi(self, request):
        bendau = self.request.query_params.get('bd')
        if bendau is not None:
            bc = TuyenDuong.objects.values('ben_cuoi').filter(ben_dau=bendau, active=True).distinct()
        else:
            bc = TuyenDuong.objects.values('ben_cuoi').filter(active=True).distinct()
        print(bc)
        bencuoi = BenXe.objects.filter(id__in=bc)
        return Response(BenXeSerializer(bencuoi, many=True).data,
                        status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        if data is not None:
            if data["ben_dau"] is not None and data["ben_cuoi"] is not None and data["quang_duong"] is not None and data["tram"] is not None:
                res = TuyenDuong.objects.create(
                    ben_dau=BenXe.objects.get(pk = data["ben_dau"]),
                    ben_cuoi=BenXe.objects.get(pk = data["ben_cuoi"]),
                    quang_duong=data["quang_duong"]
                )
                idx = 0
                for obj in data["tram"]:
                    idx = idx+1
                    TramDung_TuyenDuong.objects.create(
                        tuyen_duong=res,
                        thu_tu = idx,
                        tram_dung = TramDung.objects.get(pk = obj["value"])
                    )
                return Response(TuyenDuongSerializer(res).data,
                                status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        data = request.data
        print(data)
        if data is not None:
            if data["ben_dau"] is not None and data["ben_cuoi"] is not None and data["quang_duong"]:
                if data["tram"] is not None:
                    tuyen = self.get_object()
                    tuyen.ben_dau = BenXe.objects.get(pk=data["ben_dau"])
                    tuyen.ben_cuoi = BenXe.objects.get(pk=data["ben_cuoi"])
                    tuyen.quang_duong =  data["quang_duong"]
                    tuyen.save()
                    TramDung_TuyenDuong.objects.filter(tuyen_duong=tuyen).delete()
                    idx = 0
                    for obj in data["tram"]:
                        idx = idx + 1
                        TramDung_TuyenDuong.objects.create(
                            tuyen_duong=tuyen,
                            thu_tu = idx,
                            tram_dung = TramDung.objects.get(pk = obj["value"])
                        )
                    print("???")
                    return Response(TuyenDuongSerializer(tuyen).data,
                                    status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class ChuyenXeViewSet(viewsets.ViewSet,
                      generics.RetrieveAPIView,
                      generics.ListAPIView,
                      generics.UpdateAPIView,
                      generics.CreateAPIView):
    serializer_class = ChuyenXeSerializer
    queryset = ChuyenXe.objects.filter(active=True)

    def get_permissions(self):
        if self.action == 'create_ve_xe':
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        cx = ChuyenXe.objects.filter(active=True)
        return Response(ChuyenXeSerializer(cx, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False, url_path="giochay")
    def get_gio_chay(self, request):
        di = self.request.query_params.get("diemdi")
        den = self.request.query_params.get("diemden")
        ngay = self.request.query_params.get("ngay")
        print(di, den, ngay)
        if di is not None and den is not None:
            if di.isnumeric() and den.isnumeric():
                t = TuyenDuong.objects.filter(ben_dau=di,
                                                ben_cuoi=den,
                                                active=True).first()
                date_obj = datetime.strptime(ngay, '%Y-%m-%d')
                print(t.id)
                giochay = ChuyenXe.objects.filter(tuyen_duong_id = t.id,
                          gio_chay__date = date_obj,
                         active = True)

                return Response(GiochaySerializer(giochay, many=True).data,
                                status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=True, url_path="vexelist")
    def get_ve_xe(self, request, pk):
        vexe = VeXe.objects.filter(chuyen_xe_id = pk)
        return Response(VeXeIdSerializer(vexe, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True, url_path="giave")
    def giave(self, request, pk):
        chuyenxe = ChuyenXe.objects.filter(pk=pk)
        print(chuyenxe[0])
        tuyen = chuyenxe[0].tuyen_duong
        xe = chuyenxe[0].xe
        if xe is not None and tuyen is not None:
            giave = GiaVe.objects.filter(tuyen_duong_id=tuyen,
                                         xe_id=xe)
            return Response(GiaVeSerializer(giave, many=True).data,
                            status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=False, url_path="current_chuyenxe")
    def get_cur_chuyen(self, request):
        taixe = NhanVien.objects.filter(active = True, account_id = request.user.id).first()
        if taixe is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        obj = ChuyenXe.objects.filter(gio_ket_thuc = None, tai_xe_id = taixe.id)

        return Response(CurChuyenXeSerializer(obj, many=True).data,
                        status=status.HTTP_200_OK)
        Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["patch"], detail=True, url_path="lenxe")
    def confirm_len_xe(self, request, pk):
        cx = self.get_object()
        obj = request.data.get("ghe")
        if obj is not None:
            vx = VeXe.objects.filter(chuyen_xe_id=cx.id, ghe=obj).first()
            if vx is not None:
                vx.status = 1
                vx.save()
                return Response(VeXeSerializer(vx).data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=True, url_path="vexe")
    def create_ve_xe(self, request, pk):
        obj = request.data
        idkh = request.data.get("idkh")

        if (request.user.role == "customer"):
            idkh = KhachHang.objects.filter(account_id=request.user.id).first()
            idkh = idkh.id
        else:
            if idkh is None:
                if obj["name"] is None or obj["sdt"] is None:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                kh, mark = KhachHang.objects.get_or_create(
                    ho_ten = obj["name"],
                    sdt = obj["sdt"]
                )
                idkh = kh.id

        chuyen = self.get_object()
        giave = GiaVe.objects.filter(tuyen_duong_id = chuyen.tuyen_duong_id,
                                     xe_id = chuyen.xe_id)
        res, check = VeXe.objects.get_or_create(
            gia_ve = giave[0].gia_ve,
            chuyen_xe_id = pk,
            khach_hang_id = idkh,
            ghe = obj['ghe'],
            creator = self.request.user,
            code=get_random_string(length=10)
        )
        if check is False:
            return Response("picked",status=status.
                            HTTP_208_ALREADY_REPORTED)
        return Response(VeXeSerializer(res).data
                                ,status=status.HTTP_201_CREATED)

    @action(methods=["patch"], detail=True, url_path="ketthuc")
    def ket_thuc_chuyen(self, request, pk):
        cx = ChuyenXe.objects.get(pk = pk)
        cx.gio_ket_thuc =datetime.now()
        # cx.active  = 0
        cx.save()
        return Response(KetThucChuyenXeSerializer(cx).data,
                        status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        data = request.data
        chuyen = self.get_object()
        if data is not None:
            if data["tuyen_duong"] is not None:
                chuyen.tuyen_duong_id =  data["tuyen_duong"]
            if data["gio_chay"] is not None:
                # print(data["gio_chay"])
                chuyen.gio_chay = data["gio_chay"]
            if data["tai_xe"] is not None:
                chuyen.tai_xe_id = data["tai_xe"]
            if data["xe"] is not None:
                chuyen.xe_id = data["xe"]
            if data["gia_ve"] is not None:
                giave = GiaVe.objects.filter(
                    xe_id = chuyen.xe.id,
                    tuyen_duong_id = chuyen.tuyen_duong.id
                ).first()
                giave.gia_ve = data["gia_ve"]
                giave.save()
            chuyen.save()
            return Response(ChuyenXeSerializer(chuyen, many=False).data,
                            status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        data = request.data
        if data is not None:
            if data["tuyen_duong"] is not None \
                    and data["gio_chay"] is not None \
                    and data["tai_xe"] is not None \
                    and data["xe"] is not None \
                    and data["gia_ve"] is not None:
                chuyen = ChuyenXe.objects.create(
                    tuyen_duong_id = data["tuyen_duong"],
                    tai_xe_id = data["tai_xe"],
                    xe_id = data["xe"],
                    gio_chay = data["gio_chay"],
                )
                GiaVe.objects.update_or_create(
                    gia_ve = data["gia_ve"],
                    tuyen_duong_id=data["tuyen_duong"],
                    xe_id = data["xe"],
                )
                return Response(ChuyenXeSerializer(chuyen, many=False).data,
                            status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=True, url_path="add_binhluan")
    def post_cmt(self, request, pk):
        data = request.data
        if self.get_object().gio_ket_thuc is None:
            return Response({"error": "Chưa thể bình luận!!!"},
                            status=status.HTTP_200_OK)
        if data["noi_dung"] is not None:
            bl = BinhLuan.objects.create(
                creator_id=request.user.id,
                chuyen_xe_id = pk,
                noi_dung=data["noi_dung"]
            )
            return Response(BinhLuanSerializer(bl, many=False).data,
                            status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=True, url_path="binhluan")
    def get_cmt(self, request, pk):
        binhluan = BinhLuan.objects.filter(chuyen_xe_id = pk)
        return Response(BinhLuanSerializer(binhluan,many=True).data ,
                        status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path="rating")
    def rate(self, request, pk):
        if self.get_object().gio_ket_thuc is None:
            return Response({"error": "Chưa thể đánh giá!!!"},
                            status=status.HTTP_200_OK)
        try:
            rating = int(request.data['rating'])
        except IndexError or ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            r = Rating.objects.update_or_create(
                active = 1,
                type = rating,
                creator_id = request.user.id,
                chuyen_xe_id = pk
            )
            return Response(True, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=True, url_path="get_rate")
    def get_rate(self, request, pk):
        rate = Rating.objects.filter(
            creator = request.user,
            chuyen_xe_id = self.get_object()
        ).first()
        return Response(RatingSerializer(rate, many=False).data, status=status.HTTP_200_OK)


class VeXeViewSet(viewsets.ViewSet, generics.ListAPIView):
    serializer_class = VeXeSerializer
    queryset = VeXe.objects.all()


class bannerViewSet(viewsets.ViewSet,
                    generics.ListAPIView,
                    generics.RetrieveAPIView,
                    generics.CreateAPIView,
                    generics.DestroyAPIView):
    serializer_class = BannerSerializer
    queryset = Banner.objects.filter(active=True)


class GiaVeViewSet(viewsets.ViewSet,
                   generics.RetrieveAPIView,
                   generics.ListAPIView):
    serializer_class = GiaVeSerializer
    queryset = GiaVe.objects.all()

    def list(self, request, *args, **kwargs):
        key = request.query_params
        if key is None:
            return super().list(request, *args, **kwargs)
        else:
            if key.get("tuyen") is not None and key.get("xe") is not None:
                giave = GiaVe.objects.filter(
                    tuyen_duong_id = key.get("tuyen"),
                    xe_id = key.get("xe")
                ).first()
                if giave is not None:
                    return Response(giave.gia_ve, status=status.HTTP_200_OK)
                else:
                    return Response(0, status=status.HTTP_200_OK)


class tramDung_tuyenDuongViewSet(viewsets.ViewSet,
                                 generics.ListAPIView):
    serializer_class = TramDung_TuyenDuongSerializer
    queryset = TramDung_TuyenDuong.objects.all()


class BinhLuanViewSet(viewsets.ViewSet,
                      generics.UpdateAPIView):
    serializer_class = BinhLuanSerializer
    queryset = BinhLuan.objects.all()

    def partial_update(self, request, *args, **kwargs):
        data = request.data
        bl = self.get_object()
        if data["noi_dung"] is not None:
            if (request.user.id == bl.creator_id):
                bl.noi_dung = data["noi_dung"]
                bl.save()
                return Response(BinhLuanSerializer(bl, many=False).data,
                                status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ThongKeViewset(viewsets.ViewSet,
                     APIView):

    @action(methods=["get"], detail=False, url_path="get_vexe")
    def get_ve(self, request, format=None):
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        res = []
        vexe = VeXe.objects
        if month is not None:
            vexe = vexe.filter(
                chuyen_xe__gio_chay__month = month
            )
        if year is not None:
            ve = VeXe.objects.all().first()
            vexe = vexe.filter(
                chuyen_xe__gio_chay__year = year
            )
        print(month, year)
        return Response(SmallVexe(vexe, many=True).data,
                        status=status.HTTP_200_OK)