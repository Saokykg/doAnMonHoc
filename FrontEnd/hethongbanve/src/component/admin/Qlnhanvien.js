import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API, { endpoints } from "../../API";
import date from 'date-and-time'
import '../Style.css';
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import EditNhanvien from "./EditNhanvien";

export default function Qlnhanvien(){
    const [nhanvien, setNhanvien] = useState([]);
    const {path, url} = useRouteMatch();
    const [re, setRe] = useState(0);


    useEffect(async ()=>{
        let res = await API.get(endpoints['nhanvien']);
        res = res.data;
        await setNhanvien(res)
    },[re])

    const edit = async(event) =>{
        if (window.confirm('Xác nhận xóa?')) {
            let res = await API.delete(`${endpoints['benxe']}${event.target.id}/`)
            setNhanvien([...nhanvien])
            setRe(1)
            alert("Xóa thành công")
        } 
    }

    return(
        <>
            <Switch>
                <Route exact path ={path}>
                    <MyTable nhanvien={nhanvien} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditNhanvien />
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditNhanvien />
                </Route>
            </Switch>
        </>
    )
}

class MyTable extends React.Component{
    render(){
        let nhanvien= this.props.nhanvien;
        let change= this.props.change;
        return(
            <div className="mycontainer">
            <Table bordered pointer >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>CMND</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Chức vụ</th>
                        <th>Ngày vào làm</th>
                        <th>
                            <Link className="btn btn-info"  to={`${this.props.url}/add`}>Thêm mới </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {nhanvien.map((ben, idx) =>{
                        return (
                        <tr id = {ben.id} className="myrow">
                            <td>{idx+1}</td>
                            <td>{ben.ho_ten}</td>
                            <td>{ben.ngay_sinh}</td>
                            <td>{ben.cmnd}</td>
                            <td>{ben.sdt}</td>
                            <td>{ben.email}</td>
                            <td>{ben.chuc_vu}</td>
                            <td>{ben.ngay_vao_lam}</td>
                            <td>
                                <Link className="btn btn-info"  to={`${this.props.url}/${ben.id}`}> Sửa </Link>
                                <a className="btn btn-danger"  onClick={change} id = {ben.id}> Xóa </a>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
            </div>
            )
    }
}


