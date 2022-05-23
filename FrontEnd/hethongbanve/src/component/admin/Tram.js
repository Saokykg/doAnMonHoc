import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API, { endpoints } from "../../API";
import date from 'date-and-time'
import '../Style.css';
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import EditTram from "./EditTram";

export default function Tram(){
    const [tram, setTram] = useState([]);
    const {path, url} = useRouteMatch();
    const [re, setRe] = useState(0);


    useEffect(async ()=>{
        let res = await API.get(endpoints['tram']);
        res = res.data;
        await setTram(res)
        console.log(res)
        console.log(tram)
    },[re])

    const edit = async(event) =>{
        if (window.confirm('Xác nhận xóa?')) {
            let res = await API.delete(`${endpoints['tram']}${event.target.id}/`)
            setTram([...tram])
            setRe(1)
        } 
    }

    return(
        <>
            <Switch>
                <Route exact path ={path}>
                    <MyTable tram={tram} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditTram />
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditTram />
                </Route>
            </Switch>
        </>
    )
}

class MyTable extends React.Component{
    render(){
        let tram= this.props.tram;
        let change= this.props.change;
        return(
            <div className="mycontainer">
            <Table bordered pointer >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Loại trạm</th>
                        <th>Địa chỉ</th>
                        <th>
                            <Link className="btn btn-info"  to={`${this.props.url}/add`}>Thêm mới </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tram.map((ben, idx) =>{
                        return (
                        <tr id = {ben.id} className="myrow">
                            <td>{idx+1}</td>
                            <td>{ben.ten}</td>
                            <td>{ben.loai_tram}</td>
                            <td>{ben.dia_chi}</td>
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


