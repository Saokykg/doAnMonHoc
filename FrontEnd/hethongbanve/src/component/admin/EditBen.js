import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'
import Select from 'react-select'
import date from 'date-and-time'
export default function EditBen(){
    const [benxe, setBenxe] = useState({
        id: null,
        dia_chi:"",
        vi_tri:"",
        quan_huyen:"",
        ten:"",
        mien:"",
    });
    

    const history = useHistory();
    const {path, url} = useRouteMatch();
    
    const { id } = useParams();
    
    useEffect(async()=>{
        if (id){
            let res = await API.get(`${endpoints["benxe"]}${id}/`)
            await setBenxe({
                id: res.data.id,
                dia_chi: res.data.dia_chi,
                vi_tri: res.data.vi_tri,
                quan_huyen: res.data.quan_huyen,
                ten: res.data.ten,
                mien: res.data.mien,
            })
            console.log(res.data)
        }
        
    },[])

    const handle = (event)=>{
        setBenxe({
            ...benxe,
            [event.target.id]: event.target.value
        })
    }

    const edit = async() =>{
        
        let tmp =[];
        
        var body = {
            dia_chi: benxe.dia_chi,
            vi_tri: benxe.vi_tri,
            quan_huyen: benxe.quan_huyen,
            ten: benxe.ten,
            mien: benxe.ten,
        }
        let res ;
        try {
            if (id){
                res = await API.put(`${endpoints['benxe']}${id}/`,body)
            }else{
                res = await API.post(`${endpoints['benxe']}`,body)
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
                <FormLabel change={handle} type = "text" label="Tên bến xe" value={benxe.ten} name="ten"/>
                <FormLabel change={handle} type = "text" label="Tỉnh/Thành" value={benxe.vi_tri} name="vi_tri"/>
                <FormLabel change={handle} type = "text" label="Quận/Huyện" value={benxe.quan_huyen} name="quan_huyen"/>
                <FormLabel change={handle} type = "text" label="Địa chỉ" value={benxe.dia_chi} name="dia_chi"/>
                <FormLabel change={handle} type = "text" label="Miền" value={benxe.mien} name="mien"/>
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


