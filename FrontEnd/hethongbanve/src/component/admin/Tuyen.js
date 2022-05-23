import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API, { endpoints } from "../../API";
import date from 'date-and-time'
import '../Style.css';
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import EditTuyen from "./EditTuyen";

export default function Tuyen(){
    const [tuyen, setTuyen] = useState([]);
    const {path, url} = useRouteMatch();
    const [re, setRe] = useState(0);


    useEffect(async ()=>{
        let res = await API.get(endpoints['tuyenduong']);
        res = res.data;
        setTuyen(res)
    },[re])

    const edit = async(event) =>{
        if (window.confirm('Xác nhận xóa?')) {
            let res = await API.delete(`${endpoints['tuyenduong']}${event.target.id}/`)
            setTuyen([...tuyen])
            setRe(1)
            alert("Xóa thành công")
        } 
    }

    return(
        <>
            <Switch>
                <Route exact path ={path}>
                    <MyTable tuyen={tuyen} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditTuyen />
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditTuyen />
                </Route>
            </Switch>
        </>
    )
}

class MyTable extends React.Component{
    render(){
        let tuyen= this.props.tuyen;
        let change= this.props.change;
        return(
            <div className="mycontainer">
            <Table bordered pointer >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Bến đầu</th>
                        <th>Bến đích</th>
                        <th>Quãng đường</th>
                        <th>Trạm dừng</th>
                        <th>
                            <Link className="btn btn-info"  to={`${this.props.url}/add`}>Thêm mới </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tuyen.map((tuyen, idx) =>{
                        return (
                        <tr id = {tuyen.id} className="myrow">
                            <td>{idx+1}</td>
                            <td>{tuyen.ben_dau.ten}</td>
                            <td>{tuyen.ben_cuoi.ten}</td>
                            <td>{tuyen.quang_duong}</td>
                            <td>
                                <ul>
                                    {
                                        tuyen.tramDung_tuyenDuong.map((tram)=>{
                                            return (<li>{tram.tram_dung.ten}</li>)
                                        })
                                    }
                                </ul>
                            </td>
                            
                            <td>
                                <Link className="btn btn-info"  to={`${this.props.url}/${tuyen.id}`}> Sửa </Link>
                                <a className="btn btn-danger"  onClick={change} id = {tuyen.id}> Xóa </a>
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


