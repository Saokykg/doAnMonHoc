import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'
import Select from 'react-select'
import date from 'date-and-time'
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";



export default function EditChuyenxe(){
    const [benxe, setBenxe] = useState([]);
    const [chuyen, setChuyen] = useState({
        id : null,
        tuyenduong: null,
        gio_chay: "",
        tai_xe: null,
        xe : null,
    });
    
    const [tuyenduong, setTuyenduong] = useState([])
    const [taixe, setTaixe] = useState([])
    const [xe, setXe] = useState([])

    const [giave, setGiave] = useState()

    const history = useHistory();
    const {path, url} = useRouteMatch();
    const { id } = useParams();
    
    useEffect(async()=>{
        if (id){
            let res = await API.get(`${endpoints["chuyenxe"]}${id}/`)
            await setChuyen({
                id: res.data.id,
                tuyenduong: res.data.tuyen_duong.id,
                gio_chay: res.data.gio_chay,
                tai_xe: res.data.tai_xe,
                xe : res.data.xe.id,
            })
            console.log(res.data)
        }

        let res = await API.get(`${endpoints["tuyenduong"]}`)
        var tmp =[]
        for (const obj of res.data){
            tmp.push({
                "id": obj.id,
                "label": obj.ben_dau.ten + " - " + obj.ben_cuoi.ten
            })
        }
        setTuyenduong(tmp)

        res = await API.get(`${endpoints["taixe"]}`)
        tmp =[]
        console.log(res.data)
        for (const obj of res.data){
            tmp.push({
                "id": obj.nhan_vien.id,
                "label": obj.nhan_vien.ho_ten
            })
        }
        setTaixe(tmp)

        res = await API.get(`${endpoints["xe"]}`)
        tmp =[]
        for (const obj of res.data){
            tmp.push({
                "id": obj.id,
                "label": obj.model.mau_ma + " - " + obj.bien_so
            })
        }
        setXe(tmp)

    },[])

    useEffect( async(event)=>{
        if (chuyen.tuyenduong && chuyen.xe){
            let res = await API.get(`${endpoints["giave"]}?tuyen=${chuyen.tuyenduong}&xe=${chuyen.xe}`)
            setGiave(res.data)
        }
    },[chuyen])

    const handle = (event, key)=>{
        if (key =="gio_chay")
            setChuyen({
                ...chuyen,
                [key]: new Date(event._d),
            })
        else
            setChuyen({
                ...chuyen,
                [key]: event.target.value,
            })
    }

    const edit = async() =>{
        
        let tmp =[];
        
        var body = {
            tuyen_duong: chuyen.tuyenduong,
            gio_chay: chuyen.gio_chay,
            tai_xe: chuyen.tai_xe,
            xe : chuyen.xe,
            gia_ve : giave,
        }

        let res ;
        try {
            if (id){
                res = await API.put(`${endpoints['chuyenxe']}${id}/`,body)
            }else{
                res = await API.post(`${endpoints['chuyenxe']}`,body)
            }
            if (res?.data?.error)
                alert(res.data.error)
            else{
                if (id) 
                    alert("Cập nhật thành công");
                else
                    alert("Thêm thành công");
                let tmp = path.split('/')
                tmp.pop();
                tmp = tmp.join('/')
                history.push(`${tmp}/${res.data.id}`)
                console.log(res.data)
                return
            }
        } catch (error) {
            console.log(error);
            alert("Lỗi hệ thống vui lòng thử lại sau");
        }
    }
    let action = "Thêm mới"
    if (id) action = "Cập nhật"

    const test = ()=>{
        console.log(chuyen)
    }
    return(
        <>
        <a onClick={(event)=> {test()}}>asdhsa</a>
            <Form>
                <Form.Group>
                    <Form.Label>Tuyến đường</Form.Label>
                    <SelectBox value = {tuyenduong} selected = {chuyen.tuyenduong} change = {(event) => handle(event, "tuyenduong")}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Giờ chạy</Form.Label>
                    <Datetime value ={new Date(chuyen.gio_chay)} dateFormat="DD-MM-YYYY" onChange={(event)=> handle(event, "gio_chay")}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tài xế</Form.Label>
                    <SelectBox value = {taixe} selected = {chuyen.tai_xe} change = {(event) => handle(event, "tai_xe")}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Xe</Form.Label>
                    <SelectBox value = {xe} selected = {chuyen.xe} change = {(event) => handle(event, "xe")}/>
                </Form.Group>
                
                <FormLabel change={(event) => setGiave(event.target.value)} type = "number" label="Giá vé" value={giave} name="ten"/>
            </Form>
            <div className="btn btn-danger" onClick={edit}>{action}</div>

        </>
    )
}

class SelectBox extends React.Component{
    render(){
        let value = this.props.value
        return(
            <>
                <Form.Control as="select" onChange={this.props.change} controlId = {this.props.select}>
                    <option selected={this.props.select == null}></option>
                    {value.map((value)=> {
                        return (
                            <option 
                                value={value.id} 
                                selected = {value.id == this.props.select}>
                                        {value.label}
                            </option>
                        )}
                    )}
                </Form.Control>
            </>
        )
    }
}
