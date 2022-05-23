import React, { useEffect, useState } from "react"
import API, { endpoints } from "../API"
import cookies from 'react-cookies'
import { react } from "@babel/types";
import { Form, Button} from "react-bootstrap";

export default function Userinfo(){

    const [nhanvien, setNhanVien] = useState({
        id : null,
        ten : "",
        sdt : "",
        cmnd: "",
        chucvu:"",
        email:"",
        ngaysinh:"",
        ngayvaolam:"",
        benxe:"",
        password:"",
        oldpassword:"",
        confirmpassword:"",
    })

    const user = cookies.load("user");

    useEffect( async ()=>{
        let res = await API.get(`${endpoints[user.role]}info/`)
        res = res.data
        console.log(res.nhan_vien.id);
        setNhanVien({
            ...nhanvien,
            id :res.nhan_vien.id,
            ten : res.nhan_vien.ho_ten,
            sdt : res.nhan_vien.sdt,
            email : res.nhan_vien.email,
            cmnd : res.nhan_vien.cmnd,
            chucvu : res.nhan_vien.chuc_vu,
            ngayvaolam : res.nhan_vien.ngay_vao_lam,
            ngaysinh : res.nhan_vien.ngay_sinh,
            benxe : res.nhan_vien.ben_xe.ten
        })
    },[])

    const handle = async(event)=>{
        setNhanVien({
            ...nhanvien,
            [event.target.id]: event.target.value
        })
    }

    const submit = async(event)=>{
        event.preventDefault();

        if (!nhanvien.oldpassword){
            alert("Chưa nhập mật khẩu cũ");
            return;
        }

        if (nhanvien.password){
            if (!nhanvien.confirmpassword){
                alert("yêu cầu nhập mật khẩu lần 2")
                return;
            }
            if(nhanvien.password != nhanvien.confirmpassword){
                alert("Mk nhập lại không chính xác")
                return;
            }
        }
        
        try {
            let res = await API.patch(`${endpoints["nhanvien"]}${nhanvien.id}/`,{
                "oldpassword": nhanvien.oldpassword,
                "password": nhanvien.password,
                "email":nhanvien.email,
                "sdt":nhanvien.sdt,
                "ngaysinh":nhanvien.ngaysinh
            })
            if (!res.data){
                alert("Sai mật khẩu");
                return;
            }
            else{
                
            }
        } catch (error) {
            alert("Lỗi server");
            return;
        }

    }
    return (
        <>
            <Form>
                <FormLabel change={handle} type = "text" label="Họ và tên" value={nhanvien.ten} read={true} name="ten"/>
                <FormLabel change={handle} type = "text" label="Cmnd" value={nhanvien.cmnd} read={true} name="cmnd"/>
                <FormLabel change={handle} type = "text" label="Chức vụ" value={nhanvien.chucvu} read={true} name="chucvu"/>
                <FormLabel change={handle} type = "date" label="Ngày vào làm" value={nhanvien.ngayvaolam} read={true} name="ngayvaolam"/>
                <FormLabel change={handle} type = "text" label="Số điện thoại" value={nhanvien.sdt} read={false} name="sdt"/>
                <FormLabel change={handle} type = "text" label="Email" value={nhanvien.email} read={false} name="email"/>
                <FormLabel change={handle} type = "date" label="Ngày sinh" value={nhanvien.ngaysinh} read={false} name="ngaysinh"/>
                <FormLabel change={handle} type = "password" label="Mật khẩu mới" value={nhanvien.password} read={false} name="password"/>
                <FormLabel change={handle} type = "password" label="Nhập lại mật khẩu mới" value={nhanvien.confirmpassword} read={false} name="confirmpassword"/>
                <FormLabel change={handle} type = "password" label="Mật khẩu xác thực" value={nhanvien.oldpassword} read={false} name="oldpassword"/>
                <div className="btn btn-primary" onClick={submit}>
                    Cập nhật thông tin
                </div>
            </Form>
        </>
    )
}

class FormLabel extends React.Component{
    render(){
        return(
            <Form.Group className="mb-3" controlId={this.props.name}>
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control type={this.props.type} value = {this.props.value} readOnly={this.props.read} onChange={this.props.change}/>
            </Form.Group>
        )
    }
}