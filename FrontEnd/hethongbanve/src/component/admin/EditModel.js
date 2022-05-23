import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../../API";
import FormLabel from "../share/FormLabel"
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../Style.css'

export default function EditBenXe(){
    const [model, setModel] = useState({
        created_date: "",
        hang_xe: "",
        id: null,
        mau_ma: "",
        mo_ta: "",
        so_do: {col: 0, map: [], row: 0, floors: 0},
        so_ghe: 0,
        trong_tai:0,
    });
    const [so_do, setsodo] = useState({
        col: 1,
        row: 1,
        floors:1,
        map:[[[{"type":"p","id":"A1"}]]]
    });
    const [test, setTest] =useState(1);
    const history = useHistory();
    const {path, url} = useRouteMatch();
    
    const { id } = useParams();
    
    useEffect(async()=>{
        console.log(id)
        if (id){
            let res = await API.get(`${endpoints["modelxe"]}${id}/`)
            console.log(res.data);
            setModel(res.data)
            setsodo(res.data.so_do)
        }
    },[])

    useEffect(async()=>{
        let count = 0;
        so_do.map.map((floor)=>{
            floor.map((row)=>{
                row.map((col)=>{
                    if (col.type == 'p')
                        count++
                })
            })
        })
        setModel({
            ...model,
            so_ghe:count
        })
    },[so_do])

    const handle = (event)=>{
        setModel({
            ...model,
            [event.target.id]: event.target.value
        })
    }
    const setmap =(event) =>{
        let value = parseInt(event.target.value);
        if (value == 0 || Math.abs(value - so_do[event.target.id]) > 1 || Number.isNaN(value))
            return;
        let obj = so_do.map
        if (event.target.id == "row"){
            if (value > so_do.row){
                var tmp =[]
                for (let i = 0 ; i < so_do.col; i++)
                    tmp.push({
                        "type":"p",
                        "id":""
                    })
                obj.map((floor)=>{
                    floor.push(JSON.parse(JSON.stringify(tmp)))
                })
            }else{
                obj.map((floor)=>{
                    floor.pop()
                })
            }
        }
        if (event.target.id == "col"){
            if (value > so_do.col){
                obj.map((floor) =>{
                    for (let i =0; i < floor.length; i++)
                        floor[i].push({
                            "type":"p",
                            "id":""
                        })
                })
            }else{
                obj.map((floor) =>{
                    floor.map((row) => {
                        row.pop()
                    })
                })
            }
        }
        if (event.target.id == "floors"){
            if (value > so_do.floors){
                var tmp =[], tmp2 =[];
                for (let i = 0 ; i < so_do.col; i++)
                    tmp.push({
                        "type":"p",
                        "id":""
                    })

                for (let i = 0 ; i < so_do.row; i++){
                    tmp2.push(JSON.parse(JSON.stringify(tmp)))
                }
                
                obj.push(tmp2)
            }
            else{
                obj.pop()
            }
        }
        console.log(so_do.map)
        
        setsodo({
            ...so_do,
            map : obj,
            [event.target.id]: value
        })
        
    }
    
    const setma = (event)=>{
        console.log("ma")
        let row = event.target.getAttribute("row")
        let col = event.target.getAttribute("col")
        let floor = event.target.getAttribute("floor")
        let map = so_do.map;
        console.log(event.target)
        map[floor][row][col].id = event.target.value
        setsodo({
            ...so_do,
            map : map
        })
    }
    
    const settype = (event)=>{
        event.preventDefault();
        console.log("type")
        let row = event.target.getAttribute("row")
        let col = event.target.getAttribute("col")
        let floor = event.target.getAttribute("floor")
        let map = so_do.map;
        if (map[floor][row][col].type == "p")
            map[floor][row][col].type = "d"
        else if (map[floor][row][col].type == "d"){
                map[floor][row][col].type = "b"
                map[floor][row][col].id = undefined
            }
            else{
                map[floor][row][col].type = "p"
                map[floor][row][col].id = ""
            }
        console.log(event.target.getAttribute("class"))
        setsodo({
            ...so_do,
            map : map
        });
        console.log(so_do)
    }

    const edit = async() =>{
        
        setModel({
            ...model,
            so_do:so_do
        })
        let tmp =[];
        for (const floor of so_do.map){
            for (const row of floor){
                for (const col of row){
                    if (col.id && tmp.includes(col.id) ){
                        alert(`Không được đặt mã ghế trùng nhau: ${col.id}`)
                        return;
                    }
                    tmp.push(col.id)
                }
            }
        }
        var body = {
            hang_xe: model.hang_xe,
            mau_ma: model.mau_ma,
            mo_ta: model.mo_ta,
            so_do: so_do,
            so_ghe: model.so_ghe,
            trong_tai: model.trong_tai,
        }
        let res ;
        try {
            if (id){
                res = await API.put(`${endpoints['modelxe']}${id}/`,body)
            }else{
                res = await API.post(`${endpoints['modelxe']}`,body)
            }
            if (res?.data?.error)
                alert(res.data.error)
            else{
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
            <Row>
                <Col md={6}>
                    <FormLabel change={handle} type = "text" label="Mẫu mã" value={model.mau_ma} name="mau_ma"/>
                </Col>
                <Col md={6}>
                    <FormLabel change={handle} type = "text" label="Hãng xe" value={model.hang_xe}  name="hang_xe"/>
                </Col>
                    <Col md={6}>
                <FormLabel change={handle} type = "number" label="số ghế" read={true} value={model.so_ghe} name="so_ghe"/>
                    </Col>
                <Col md={6}>
                    <FormLabel change={handle} type = "number" label="Trọng tải (kg)" value={model.trong_tai} name="trong_tai"/>
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-3" controlId="mo_ta">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control as="textarea" value = {model.mo_ta} 
                            onChange={handle} style={{ height: '150px' }}/>
                    </Form.Group>
                </Col>
            </Row>
            <div>
            <Row>
                    <Col md={4}>
                        <FormLabel change={setmap} type = "number" label="Số hàng" value={so_do.row} name="row"/>
                    </Col>
                    <Col md={4}>
                        <FormLabel change={setmap} type = "number" label="Số cột" value={so_do.col} name="col"/>
                    </Col>
                    <Col md={4}>
                        <FormLabel change={setmap} type = "number" label="Số tầng" value={so_do.floors} name="floors"/>
                    </Col>
            </Row>
            {so_do.map.map((m, i ) =>{
                return (
                    <>
                        <h1>Tầng: {i+1}</h1>
                        <Floor col = {so_do.col} row = {so_do.row} maps = {m} fl={i}
                                    settype = {settype}
                                    setma = {setma}/>
                    </>
                )
            })}
            
            </div>
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