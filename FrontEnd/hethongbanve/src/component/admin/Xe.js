import React, { useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import API, { endpoints } from "../../API";
import  date from 'date-and-time'
import { Table } from "react-bootstrap";
import EditXe from "./EditXe";
export default function Xe(){
    const [xe, setXe] = useState([]);
    const {path, url} = useRouteMatch();
    const [re, setRe] = useState(0);

    useEffect( async()=>{
        let res = await API.get(endpoints["xe"]);
        console.log(res.data)
        setXe(res.data)
    },[re, url])

    const edit = async(event) =>{
        try {
            if (window.confirm('Xác nhận xóa?')) {
                let res = await API.delete(`${endpoints['xe']}${event.target.id}/`)
                if (res?.data){
                    alert("Xóa thành công")
                }
                setRe(1)
                alert("Xóa thành công")

            } 
            
        } catch (error) {
            console.log(error)
            alert("Lỗi hệ thống!!!")
        }
    }

    return(
        <>
             <Switch>
                <Route exact path ={path}>
                    <MyTable xe={xe} change={edit} url = {url}/>
                </Route>
                <Route excat path ={`${path}/add`} >
                    <EditXe />
                </Route>
                <Route path ={`${path}/:id`} >
                    <EditXe />
                </Route>
            </Switch>
        </>
    )
}

class MyTable extends React.Component{
    render(){
        let xe= this.props.xe;
        let change= this.props.change;
        return(
            <div className="mycontainer">
            <Table bordered pointer >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã</th>
                        <th>Hãng</th>
                        <th>Ngày thêm</th>
                        <th>Ghi chú</th>
                        <th>
                            <Link className="btn btn-info"  to={`${this.props.url}/add`}>Thêm mới </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {xe.map((xe, idx) =>{
                        return (
                        <tr id = {xe.id} className="myrow">
                            <td>{idx+1}</td>
                            <td>{xe.bien_so}</td>
                            <td>{xe.model.mau_ma}</td>
                            <td>{date.format(new Date(xe.created_date), 'HH:mm DD/MM/YYYY')}</td>
                            <td>{xe.ghi_chu}</td>
                            <td>
                                <Link className="btn btn-info"  to={`${this.props.url}/${xe.id}`}> Sửa </Link>
                                <a className="btn btn-danger"  onClick={change} id = {xe.id}> Xóa </a>
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


