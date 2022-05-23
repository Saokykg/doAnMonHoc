import React, { useState } from "react";
import {Navbar, Nav, NavDropdown, Container, Form, Row, Col, Button} from "react-bootstrap"
import API, { endpoints } from "../API";
import { useEffect } from "react";
import Select from 'react-select';
import Moment from "react-moment";
import moment from "moment";
import cookies from "react-cookies"
import './Style.css';
import { Redirect } from "react-router";
import { useHistory } from "react-router";
import date from 'date-and-time'

export default function NhanVienBanVe(){
    
    const [bendau, setBenDau] = useState([])
    const [bencuoi, setBenCuoi] = useState([])
    const [giochay, setGioChay] = useState([])
    const [vedadat, setVeDaDat] = useState([])
    const [picked, setPick] = useState([])

    const [tu, setTu] = useState(0)
    const [den, setDen] = useState(0)
    const [gio, setGio] = useState(0)
    
    const [ngay, setNgay] = useState(new Date())

    const [chuyenxe, setChuyenXe] = useState(null)

    const [megaState, setMegaState] = useState({
        giave : 0,
        soluong : 0
    });
    
    const [cus, setCus] = useState({
        name :"",
        sdt :"",
        id: null,
    });

    const history = useHistory();
    
    useEffect(()=>{
        const loadTuyenDuong = async() =>{
            let bendau = await API.get(endpoints['benxedau'])
            let options = []
            await bendau.data.map( p =>{
                options.push({
                    value: p.id,
                    label: `${p.ten} (${p.vi_tri})`
                })
            })
            setBenDau(options)
        }
        loadTuyenDuong()
        setGio(null);
    },[])

    useEffect(() =>{
        var curr = new Date();
        curr.setDate(curr.getDate());
        var date = curr.toISOString().substr(0,10);
        setNgay(date)
    },[den])

    useEffect(async ()=>{
        setGio(null);
        setGioChay([]);
        if (tu!=null && den!=null && ngay!=null){
            let res= await API.get(`${endpoints['giochay']}?diemdi=${tu.value}&diemden=${den.value}&ngay=${ngay}`)
            let list = []
            for(let r of res.data){
                let time = date.format(new Date(r.gio_chay), 'HH:mm');
                list.push({
                    value : r.id,
                    label :time
                })
            }
            setGioChay(list)
        }
    },[ngay])

    useEffect(async ()=>{
        setVeDaDat([]);
        setPick([]);
        setChuyenXe(null);
        if (gio){
            let res= await API.get(`${endpoints['chuyenxe']}${gio.value}/`)
            setChuyenXe(res.data);

            let res2 = await API.get(`${endpoints['chuyenxe']}${gio.value}/vexelist/`);
            let list = [];
            for (const ve of res2.data){
                list.push(ve.ghe)
            }
            setVeDaDat(list);
        }
    },[gio])

    useEffect(async () =>{
        setMegaState({
            ...megaState,
            giave: 0,
            soluong:0
        })
        if (gio){
            let res = await API.get(`${endpoints['chuyenxe']}${gio.value}/giave/`)
            setMegaState({
                ...megaState,
                giave :res.data[0].gia_ve
            });
        }
    },[chuyenxe])

    useEffect(async ()=>{
        setMegaState({
            ...megaState,
            soluong:picked.length
        })
    },[picked])

    const setStart = async(selectedOption) => {
        setTu(selectedOption);
        let bencuoi = await API.get(`${endpoints['benxecuoi']}?bd=${selectedOption.value}`)
        let options = []
        await bencuoi.data.map( p =>{
            options.push({
                value: p.id,
                label: `${p.ten} (${p.vi_tri})`
            })
        })
        setBenCuoi(options);
        setDen(null);
    };

    const pick = async(event) =>{
        event.preventDefault();
        if (!picked.includes(event.target.id))
            setPick(old => [...old, event.target.id])
        else{
            setPick(picked.filter( p => p!=event.target.id ));
        }
    }

    const confirm = async(event) =>{
        event.preventDefault();
        console.log("running")
        try {
            if (!cookies.load("access_token")){
                alert("Đăng nhập để tiếp tục")
                history.push('/dangnhap');
                return;
            }
            var seats = picked;
            let fail = [];
            let success = [];
            for (const seat of seats){
                let res;
                if (cus.id)
                    res = await API.post(`${endpoints['chuyenxe']}${chuyenxe.id}/vexe/`,{
                        "idkh": cus.id,
                        "ghe" : seat
                    })
                else
                    res = await API.post(`${endpoints['chuyenxe']}${chuyenxe.id}/vexe/`,{
                        "ghe" : seat,
                        "name": cus.name,
                        "sdt" : cus.sdt
                    })
                
                if (res.status != 201){
                    fail.push(seat)
                }
                else{
                    success.push(seat)
                }
            }
            let mess =""
            if (success.length > 0)
                mess += "Đặt vé thành công các vé ghế: " + success +"\n"
            if (fail.length > 0 ){
                mess += "Đặt vé thất bại các ghế: " + fail;
            }
            alert(mess);
            history.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    const setCusinfo = (event)=>{
        event.preventDefault();
        setCus({
            ...cus,
            [event.target.id]: event.target.value
        })
    }


    let sodoxe = <h1>Chọn chuyến xe</h1>
    let infoxe;
    if (chuyenxe){
        sodoxe = <>
                    <Floor col = {chuyenxe.xe.model.so_do.col} row = {chuyenxe.xe.model.so_do.row} maps = {chuyenxe.xe.model.so_do.map[0]} 
                                vedadat = {vedadat}
                                picked = {picked}
                                change = {pick}/>
                    <Row className="text-left">
                        <Col className="h3">Giá vé:</Col>
                        <Col className="h3">{megaState.giave}</Col>
                    </Row>
                    <Row className="text-left">
                        <Col className="h3">Số lượng:</Col>
                        <Col className="h3">{megaState.soluong}</Col>
                    </Row>
                    <Row className="text-left">
                        <Col className="h3">Tổng tiền:</Col>
                        <Col className="h3">{megaState.soluong * megaState.giave}</Col>
                    </Row>
                </>
        infoxe =<>
                <Row>
                    <fieldset className="text-left border border-secondary xeinfo">
                        <legend>Thông tin xe</legend>
                        <ul>
                            <li>Biển số: {chuyenxe.xe.bien_so}</li>
                            <li>Hãng xe: {chuyenxe.xe.model.hang_xe}</li>
                            <li>Chi tiết: {chuyenxe.xe.model.mo_ta}</li>
                        </ul>
                    </fieldset>
                </Row>
                <Row>
                    <fieldset className="text-left border border-secondary xeinfo">
                        <legend>Lộ trình</legend>
                            <div>Độ dài quảng đường: {chuyenxe.tuyen_duong.quang_duong}</div>
                            <div>Trạm dừng</div>
                        <ul>
                            {chuyenxe.tuyen_duong.tramDung_tuyenDuong.map((obj, i) =>{
                                return <li>{i+1}, {obj.ten}</li>
                            })}
                        </ul>
                    </fieldset>
                </Row>
                </>
    }

    const checksdt = async (event) =>{
        let res = await API.get(`${endpoints['khachhang']}search/?sdt=${cus.sdt}`)
        res = res.data
        if (res)
            setCus({
                ...cus,
                name : res.ho_ten,
                id : res.id
            })
        console.log(cus);
    }

    return(
        <>  
        <Container>
            <Row>
                <Col sm={5}>
                    <Form className="text-center">
                        <Row className="mb-3">
                            <SelectBox value={tu} change={setStart} ben={bendau} name="Điểm đi"/>
                        </Row>
                        <Row className="mb-3">
                            <SelectBox value={den} change={setDen} ben={bencuoi} name="Điểm đến"/>
                        </Row>
                        <Row className="mb-3">                
                            <Form.Group as={Col}>
                                <Form.Label> Ngày khởi hành</Form.Label>
                                <br/>
                                <input type="date" id="ngaydi" value={ngay} onChange={event => setNgay(event.target.value)}/>
                            </Form.Group>      
                        </Row> 
                        <Row className="mb-3">               
                            <Form.Group as={Col}>
                                <Form.Label> Giờ chạy</Form.Label>
                                <Select value={gio} onChange={setGio} options={giochay}/>
                            </Form.Group>        
                        </Row>
                        {infoxe}
                    </Form>
                </Col>
                <Col className="border" sm={7}>
                    {sodoxe}    
                </Col>
            </Row>
            <div>Thông tin khách hàng</div>
            <Form className="mt-3">
                <Form.Group as={Row} className="mb-3" controlId="sdt">
                    <Form.Label column sm={2}>
                    Số điện thoại
                    </Form.Label>
                    <Col sm={8}>
                    <Form.Control type="text" placeholder="số diện thoại" value ={cus.sdt} onChange={setCusinfo} />
                    </Col>
                    <Col sm={2}>
                        <a onClick = {checksdt} className="btn btn-danger">check</a>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="name">
                    <Form.Label column sm={2}>
                    tên khách hàng
                    </Form.Label>
                    <Col sm={8}>
                    <Form.Control type="text" placeholder="tên khách hàng" value ={cus.name} onChange={setCusinfo}/>
                    </Col>
                </Form.Group>
            </Form>
            <div className="w-100 text-center">
                <a className="btn btn-primary m-auto" onClick={confirm}>Đặt vé</a>
            </div>
        </Container>
        </>
    )
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

class Floor extends React.Component{
    render(){
        var evnt = this.props.change;
        var vedd = this.props.vedadat;
        var picked = this.props.picked;
        var mybookingtable = this.props.maps.map(function (row){
            let hang = row.map((col) =>{
                
                var ava = "";
                if (vedd.includes(col.id))
                    ava = " disable";

                if (picked.includes(col.id))
                    ava += " active";
                return (
                    <Col 
                        className={"m-3 p-2 text-center border seat " + col.type + ava } 
                        id={col.id}    
                        onClick={evnt}>{col.id}
                    </Col>
                )
            })
            return <Row>{hang}</Row>
        });
        return(
            <>
                {mybookingtable}
            </>
        )
    }
}
