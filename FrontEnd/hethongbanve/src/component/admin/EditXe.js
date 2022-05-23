import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'
import Select from 'react-select'

export default function EditXe(){
    const [xe, setXe] = useState({
        created_date: "",
        bien_so: "",
        id: null,
        mau_ma: null,
        ghi_chu: "",
    });
    const [model, setModel] = useState([]);

    const history = useHistory();
    const {path, url} = useRouteMatch();
    
    const { id } = useParams();
    
    useEffect(async()=>{
        if (id){
            let res = await API.get(`${endpoints["xe"]}${id}/`)
            await setXe({
                created_date: new Date(res.data.created_date),
                bien_so: res.data.bien_so,
                id: res.data.id,
                mau_ma:{
                    value: res.data.model.id,
                    label: res.data.model.hang_xe + " - " + res.data.model.mau_ma
                },
                ghi_chu: res.data.ghi_chu,
            })
            console.log(xe)
        }

        let res = await API.get(endpoints["modelxe"]);
        let tmp = [];
        await res.data.map((model)=>{
            tmp.push({
                value: model.id,
                label : model.hang_xe + " - " + model.mau_ma
            })
        })
        setModel(tmp);
        console.log(xe)
    },[])

    const handle = (event)=>{
        setXe({
            ...xe,
            [event.target.id]: event.target.value
        })
    }
    
    const setModels = async(obj)=>{
            setXe({
                ...xe,
                mau_ma : obj
            });
            console.log(xe)
    }

    const edit = async() =>{
        
        let tmp =[];
        
        var body = {
            bien_so: xe.bien_so,
            model: xe.mau_ma.value,
            ghi_chu: xe.ghi_chu
        }
        let res ;
        try {
            if (id){
                res = await API.put(`${endpoints['xe']}${id}/`,body)
            }else{
                res = await API.post(`${endpoints['xe']}`,body)
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

    return(
        <>
            <Form>
                <Form.Group controlId={"mau_ma"}>
                    <Form.Label> Mẫu mã</Form.Label>
                    <Select value={xe.mau_ma} onChange={setModels} options={model}/>
                </Form.Group>
                <FormLabel change={handle} type = "text" label="Biển số xe" value={xe.bien_so} name="bien_so"/>
                <FormLabel change={handle} type = "text" label="Ghi chú" value={xe.ghi_chu} name="ghi_chu"/>
                {/* <FormLabel change={handle} type = "date" read={true} label="Ngày tạo" 
                value={xe.created_date}
                name="bien_so"/> */}
            </Form>
            <div className="btn btn-danger" onClick={edit}>{action}</div>

        </>
    )
}

class Floor extends React.Component{
    render(){
        var setma = this.props.setma;
        var settype = this.props.settype;
        var floor = this.props.fl;

        var mybookingtable = this.props.maps.map(function (row, idx){
            let hang = row.map((col, jdx) =>{
                return (
                    <Col className={col.type + " m-3 p-2 text-center seatedit "  } >
                            <input type="text" 
                            row = {idx}
                            col = {jdx}
                            floor = {floor}
                            id={col.id}  
                            onChange={setma}
                            onDoubleClick={settype} value ={col.id} 
                            style ={{width : "100%"}}
                            />
                    </Col>
                )
            })
            return <Row>{hang}</Row>
        });
        return(
            <div className = "border bg-secondary">
                {mybookingtable}
            </div>
        )
    }
}


class SelectBox extends React.Component{  
    render(){
        return(
            <>
                <Form.Group as={Col} controlId={this.props.name}>
                    <Form.Label> {this.props.name}</Form.Label>
                    <Select value={this.props.value} onChange={this.props.change} options={this.props.ben}/>
                </Form.Group>
            </>
        )
    }
}
