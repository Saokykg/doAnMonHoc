import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API, { endpoints } from "../../API";
import date from 'date-and-time'
import '../Style.css';
import { Route, Switch, useParams, useRouteMatch, useHistory } from "react-router";
import { Link } from "react-router-dom";
import EditModel from "./EditModel";
export default function Modelxe(){
    const [benxe, setBenxe] = useState([]);
    const [re, setRe] = useState(0);
    const {path, url} = useRouteMatch();
    const history = useHistory();

    useEffect(async ()=>{
        let res = await API.get(endpoints['modelxe']);
        res = res.data;
        setBenxe(res);
    },[re])

    const edit = async(event) =>{
        if (window.confirm('Xác nhận xóa?')) {
            let res = await API.delete(`${endpoints['modelxe']}${event.target.id}/`)
            setRe(1)
        } 
    }

    return(
        <>
            <Switch>
                <Route exact path ={path}>
                    <MyTable benxe={benxe} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditModel />
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditModel />
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
                        <th>Mã</th>
                        <th>Hãng</th>
                        <th>Số ghế</th>
                        <th>Trọng tải</th>
                        <th>Ngày thêm</th>
                        <th>Mô tả</th>
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
                            <td>{ben.mau_ma}</td>
                            <td>{ben.hang_xe}</td>
                            <td>{ben.so_ghe}</td>
                            <td>{ben.trong_tai}</td>
                            <td>{date.format(new Date(ben.created_date), 'HH:mm DD/MM/YYYY')}</td>
                            <td>{ben.mo_ta}</td>
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


