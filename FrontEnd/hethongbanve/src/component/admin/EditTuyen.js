import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'
import Select from 'react-select'
import date from 'date-and-time'
import { relativeTimeRounding } from "moment";

export default function EditTuyen(){
    const [tuyen, setTuyen] = useState({
        dau: {},
        dich: {},
        quang_duong: 0,
    });
    const [tram, setTram] = useState([]);
    const [selecttram, setSelectTram] = useState([]);
    const [benxe, setBenxe] = useState([]);
    
    const history = useHistory();
    const {path, url} = useRouteMatch();
    
    const { id } = useParams();
    const [re, setRe] = useState(0);
    
    useEffect(async()=>{
        let tmp2 = [];
        if (id){
            let res = await API.get(`${endpoints["tuyenduong"]}${id}/`)
            console.log(res.data)
            setTuyen({
                ...tuyen,
                dau:{
                    "value": res.data.ben_dau.id,
                    "label": res.data.ben_dau.ten
                },
                dich:{
                    "value": res.data.ben_cuoi.id,
                    "label": res.data.ben_cuoi.ten
                },
                quang_duong:res.data.quang_duong
            })
            let tmp =[]
            for (const o of res.data.tramDung_tuyenDuong){
                tmp.push({
                    "value":o.tram_dung.id,
                    "label":o.tram_dung.ten,
                    "time":o.thoi_gian_dung
                })
                
                tmp2.push(o.id)
            }
            setTram(tmp)
            console.log(tram)
        }

        let tmp = [];
        let res = await API.get(endpoints["benxe"])
        for (const o of res.data){
            tmp.push({
                value: o.id,
                label : o.ten,
            })
        }    
        setBenxe(tmp)
        
        res = await API.get(endpoints["tram"]);
        tmp = [];

        var tram = res.data
        for (const o of tram){
            if (!tmp2.includes(o.id))
                tmp.push({
                    value: o.id,
                    label : o.ten,
                    time : o.thoi_gian_dung,
                })
        }        
        setSelectTram(tmp);
    },[re])


    const handle = (event)=>{
        setTuyen({
            ...tuyen,
            [event.target.id]: event.target.value
        })
    }
    
    const setDau = async(obj)=>{
        setTuyen({
            ...tuyen,
            dau : obj
        });
    }

    const setDich = async(obj)=>{
        setTuyen({
            ...tuyen,
            dich : obj
        });
    }

    const edit = async() =>{
        
        let tmp =[];
        
        var body = {
            ben_dau: tuyen.dau.value,
            ben_cuoi: tuyen.dich.value,
            quang_duong : tuyen.quang_duong,
            tram: tram
        }
        console.log(body)
        let res ;
        try {
            if (id){
                res = await API.put(`${endpoints['tuyenduong']}${id}/`,body)
            }else{
                res = await API.post(`${endpoints['tuyenduong']}`,body)
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

    const delTram = async(event)=>{
        let tmp = [...tram]
        let tmp2 = selecttram;
        var i =0;
        for(const obj of tmp){
            if (obj.value == event.target.id){
                tmp2.push(obj)
                break;
            }
            i++;
        }
        tmp.splice(i, 1);
        setTram(tmp);
        setSelectTram(tmp2)

    }
    const reset = ()=>{
        let tmp = re+1;
        setRe(tmp)
    }
    const addTram = (obj)=>{
        // console.log(tram)
        let tmp = [...tram]
        tmp.push(obj);
        setTram(tmp)

        tmp = selecttram;
        var i =0;
        for(const o of tmp){
            if (o.value == obj.value)
                break;
            i++;
        }
        tmp.splice(i,1);
        setSelectTram(tmp)
    }

    const test = (e)=>{
        console.log(e.target);
        console.log(selecttram)
        console.log(tuyen)
    }
    let tablebody = "Không có trạm dừng"
    if (tram.length>0){
        tablebody=<>
            {tram.map((obj, idx) =>{
                return(
                <tr>
                    <td>{idx+1}</td>
                    <td>{obj.label}</td>
                    <td><Button onClick={delTram} id={obj.value}>Xóa</Button></td>
                </tr>
                )
            })}
        </>
    }

    return(
        <>
        <a onClick={test}>test</a>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId={"mau_ma"}>
                            <Form.Label>Điểm đi</Form.Label>
                            <Select value={tuyen.dau} onChange={setDau} options={benxe}/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId={"mau_ma"}>
                            <Form.Label>Điểm đích</Form.Label>
                            <Select value={tuyen.dich} onChange={setDich} options={benxe}/>
                        </Form.Group>
                    </Col>
                </Row>
                <FormLabel change={handle} type = "number" label="Quãng đường (km)" value={tuyen.quang_duong} name="quang_duong"/>
                
                {/* <FormLabel change={handle} type = "date" read={true} label="Ngày tạo" 
                value={tram.created_date}
                name="bien_so"/> */}
                        <Form.Group controlId={"tram"}>
                            <Form.Label>Chọn trạm dừng</Form.Label>
                            <Select value="NONE"  onChange={addTram} options={selecttram}/>
                        </Form.Group>
                <Table striped >
                    <thead>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Tên trạm</th>
                            <th><Button onClick={reset}>Làm mới</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tablebody}
                        
                    </tbody>
                </Table>
            </Form>
            <div className="btn btn-danger" onClick={edit}>{action}</div>
            
        </>
    )
}
