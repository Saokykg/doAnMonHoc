import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API, { endpoints } from "../../API";
import date from 'date-and-time'
import '../Style.css';
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import EditChuyenxe from "./EditChuyenxe";

export default function Laplich(){
    const [chuyenxe, setChuyenxe] = useState([]);
    const {path, url} = useRouteMatch();
    const [re, setRe] = useState(0);


    useEffect(async ()=>{
        let res = await API.get(endpoints['chuyenxe']);
        res = res.data;
        setChuyenxe(res)
        console.log(res)
    },[])

    const edit = async(event) =>{
        if (window.confirm('Xác nhận xóa?')) {
            let res = await API.delete(`${endpoints['chuyenxe']}${event.target.id}/`)
            setChuyenxe([...chuyenxe])
            setRe(1)
        } 
    }

    return(
        <>
            <Switch>
                <Route exact path ={path}>
                    <MyTable chuyenxe={chuyenxe} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditChuyenxe />
                    {/* <h1>1</h1> */}
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditChuyenxe />
                </Route>
            </Switch>
        </>
    )
}

class MyTable extends React.Component{
    render(){
        let chuyenxe= this.props.chuyenxe;
        let change= this.props.change;
        return(
            <div className="mycontainer">
            <Table bordered pointer >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tuyến</th>
                        <th>Giờ khởi hành</th>
                        <th>Giờ đến đích</th>
                        <th>
                            <Link className="btn btn-info"  to={`${this.props.url}/add`}>Thêm mới </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {chuyenxe.map((ben, idx) =>{
                        return (
                        <tr id = {ben.id} className="myrow">
                            <td>{idx+1}</td>
                            <td>{ben.tuyen_duong.ben_dau.ten} - {ben.tuyen_duong.ben_cuoi.ten}</td>
                            <td>{date.format(new Date(ben.gio_chay), 'DD/MM/YYYY HH:mm')}</td>
                            <td>{date.format(new Date(ben.gio_ket_thuc), 'DD/MM/YYYY HH:mm')}</td>
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


