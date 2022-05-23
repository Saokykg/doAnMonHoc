import React, { useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import Select from "react-select"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'

export default function EditNhanvien(){
    const [nhanvien, setNhanVien] = useState({
        id : null,
        ten : "",
        sdt : "",
        cmnd: "",
        chucvu:"",
        email:"",
        ngaysinh:"",
        ngayvaolam:"",
        account: {},
    })
    
    const listchucvu = [
        {"value" : 1,
        "label": "banve"},
        {"value" : 2,
        "label": "taixe"},
    ]

    const history = useHistory();
    const {path, url} = useRouteMatch();
    
    let { id } = useParams();
    
    useEffect(async()=>{
        if (id){
            let res = await API.get(`${endpoints["nhanvien"]}${id}/`)
            res = res.data
            setNhanVien({
                ...nhanvien,
                id : res.id,
                account : res.account,
                ten : res.ho_ten,
                sdt : res.sdt,
                email : res.email,
                cmnd : res.cmnd,
                chucvu : { "label":res.chuc_vu},
                ngayvaolam : res.ngay_vao_lam,
                ngaysinh : res.ngay_sinh,
            })
        }
        
    },[])

    const handle = (event)=>{
        setNhanVien({
            ...nhanvien,
            [event.target.id]: event.target.value
        })
    }

    const edit = async(kt) =>{
        if (nhanvien.email.includes('@') == false){
            alert("email không hợp lệ!!!")
            return;
        }
        var body = {
            ten : nhanvien.ten,
            sdt : nhanvien.sdt,
            email : nhanvien.email,
            cmnd : nhanvien.cmnd,
            chuc_vu : nhanvien.chucvu.label,
            ngay_vao_lam : nhanvien.ngayvaolam,
            ngay_sinh : nhanvien.ngaysinh,
        }
        
        let res ;
        try {

            if (id){
                res = await API.patch(`${endpoints['nhanvien']}${id}/update/`,body)
            }else{
                res = await API.post(`${endpoints['nhanvien']}`,body)
            }
            console.log(res.data)
            if (res?.data?.error)
                alert(res.data.error)
            else{
                if (id) 
                    alert("Cập nhật thành công");
                else{
                    id = res.data.id;
                    if(!kt)
                        alert("Thêm thành công");
                }
                if (kt){
                    createaccount(true);
                }
                let tmp = path.split('/')
                tmp.pop();
                tmp = tmp.join('/')
                history.push(`${tmp}/${res.data.id}`)
                return;
            }
        } catch (error) {
            console.log(error);
            alert("Lỗi hệ thống vui lòng thử lại sau");
        }
    }
    let action = "Thêm nhân viên"
    if (id) action = "Cập nhật thông tin nhân viên"

    const deleteaccount = async(event) =>{
        if (window.confirm('Xác nhận?')) {
            let res = await API.patch(`${endpoints['nhanvien']}${id}/deactive/`)
            if (res?.data){
                alert("Thành công")
                setNhanVien({
                    ...nhanvien,
                    account : res.data
                })
                console.log(res.data)
                return;
            }
            alert("Lỗi hệ thống, thử lại sau")
        }
    }

    const createaccount = async(kt) =>{

        if (kt || window.confirm('Xác nhận?')) {
            try {
                let res = await API.post(`${endpoints['nhanvien']}${id}/createacc/`)
                if (res?.data){
                    alert(`Tên đăng nhập: ${res.data.account.username}\nMật khẩu: số chứng minh nhân dân`)
                    setNhanVien({
                        ...nhanvien,
                        account : res.data.account,
                    })
                    return;
            }
            } catch (error) {
                console.log(error);
                alert("Lỗi hệ thống, thử lại sau")
            }
        }
    }

    const test =(event) =>{
        console.log(nhanvien)
    }
    
    const setChucVu = (obj) =>{
        setNhanVien({
            ...nhanvien,
            chucvu: obj
        })
    }

    var b = <Button onClick={()=>{createaccount(false)}}>Cấp tài khoản</Button>
    if (nhanvien?.account?.is_active){
        b = <Button onClick={()=>{deleteaccount(false)}}>Xóa tài khoản</Button>
    }
    if (!id) b = <Button onClick={()=>{edit(true)}}>Thêm và cấp tài khoản</Button>
    return(
        <>
            <Form>
                <FormLabel change={handle} type = "text" label="Họ và tên" value={nhanvien.ten} read={false} name="ten"/>
                <FormLabel change={handle} type = "text" label="Cmnd" value={nhanvien.cmnd} read={false} name="cmnd"/>
                <Form.Group controlId={"chucvu"}>
                    <Form.Label>Chức vụ</Form.Label>
                    <Select value={nhanvien.chucvu} onChange={setChucVu} options={listchucvu}/>
                </Form.Group>
                <FormLabel change={handle} type = "date" label="Ngày vào làm" value={nhanvien.ngayvaolam} read={false} name="ngayvaolam"/>
                <FormLabel change={handle} type = "text" label="Số điện thoại" value={nhanvien.sdt} read={false} name="sdt"/>
                <FormLabel change={handle} type = "email" label="Email" value={nhanvien.email} read={false} name="email"/>
                <FormLabel change={handle} type = "date" label="Ngày sinh" value={nhanvien.ngaysinh} read={false} name="ngaysinh"/>
            </Form>
            <div className="btn btn-danger" onClick={()=>{edit(false)}}>{action}</div>
            {b}
        </>
    )
}


