import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'

export default function EditTram(){
    const [tram, setTram] = useState({
        id: null,
        dia_chi:"",
        ten:"",
        loai_tram:"",
    });
    

    const history = useHistory();
    const {path, url} = useRouteMatch();
    
    const { id } = useParams();
    
    useEffect(async()=>{
        if (id){
            let res = await API.get(`${endpoints["tram"]}${id}/`)
            await setTram({
                id: res.data.id,
                dia_chi: res.data.dia_chi,
                ten: res.data.ten,
                loai_tram: res.data.loai_tram,
            })
            console.log(res.data)
        }
    },[])

    const handle = (event)=>{
        setTram({
            ...tram,
            [event.target.id]: event.target.value
        })
    }

    const edit = async() =>{
        
        let tmp =[];
        
        var body = {
            dia_chi: tram.dia_chi,
            ten: tram.ten,
            loai_tram: tram.loai_tram,
        }
        let res ;
        try {
            if (id){
                res = await API.put(`${endpoints['tram']}${id}/`,body)
            }else{
                res = await API.post(`${endpoints['tram']}`,body)
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
                <FormLabel change={handle} type = "text" label="Tên bến xe" value={tram.ten} name="ten"/>
                <FormLabel change={handle} type = "text" label="Loại trạm" value={tram.loai_tram} name="loai_tram"/>
                <FormLabel change={handle} type = "text" label="Địa chỉ" value={tram.dia_chi} name="dia_chi"/>
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


