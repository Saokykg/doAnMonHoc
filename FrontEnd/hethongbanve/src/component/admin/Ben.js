import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API, { endpoints } from "../../API";
import date from 'date-and-time'
import '../Style.css';
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import EditBen from "./EditBen";

export default function Ben(){
    const [benxe, setBenxe] = useState([]);
    const {path, url} = useRouteMatch();
    const [re, setRe] = useState(0);


    useEffect(async ()=>{
        let res = await API.get(endpoints['benxe']);
        res = res.data;
        await setBenxe(res)
        console.log(benxe)
    },[re])

    const edit = async(event) =>{
        if (window.confirm('Xác nhận xóa?')) {
            let res = await API.delete(`${endpoints['benxe']}${event.target.id}/`)
            setBenxe([...benxe])
            setRe(1)
            alert("Xóa thành công")
        } 
    }

    return(
        <>
            <Switch>
                <Route exact path ={path}>
                    <MyTable benxe={benxe} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditBen />
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditBen />
                </Route>
            </Switch>
        </>
    )
}

class MyTable extends React.Component{
    render(){
        let benxe= this.props.benxe;
        let change= this.props.change;
        return(
            <div className="mycontainer">
            <Table bordered pointer >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Tỉnh/Thành</th>
                        <th>Quận huyện</th>
                        <th>Địa chỉ</th>
                        <th>Miền</th>
                        <th>
                            <Link className="btn btn-info"  to={`${this.props.url}/add`}>Thêm mới </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {benxe.map((ben, idx) =>{
                        return (
                        <tr id = {ben.id} className="myrow">
                            <td>{idx+1}</td>
                            <td>{ben.ten}</td>
                            <td>{ben.vi_tri}</td>
                            <td>{ben.quan_huyen}</td>
                            <td>{ben.dia_chi}</td>
                            <td>{ben.mien}</td>
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


