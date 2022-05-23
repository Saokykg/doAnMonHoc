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
import { AiOutlineArrowLeft } from "react-icons/ai";
import { contextType } from "react-datetime";
export default function Search(){
    
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
            console.log(res.data)
            let res2 = await API.get(`${endpoints['chuyenxe']}${gio.value}/vexelist/`);
            let list = [];
            for (const ve of res2.data){
                list.push(ve.ghe)
            }
            setVeDaDat(list);
            console.log(vedadat)
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
        console.log(chuyenxe);
        console.log(cookies)
        if (!cookies.load("access_token")){
            alert("Đăng nhập để tiếp tục")
            history.push('/home/dangnhap');
            return;
        }
        var seats = picked;
        console.log(chuyenxe, seats);
        let fail = [];
        let success = [];
        for (const seat of seats){
            let res = await API.post(`${endpoints['chuyenxe']}${chuyenxe.id}/vexe/`,{
                "ghe" : seat
            })
            console.log(res)
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
        alert(mess)
        history.push('/');
    }

    const setngaykhoihanh = (event)=>{
        var date = new Date();
        var date2 = new Date(event.target.value);

        if (date.getDate() <= date2.getDate() && date.getMonth() <= date2.getMonth() && date.getYear() <= date2.getYear())
            setNgay(event.target.value);
        else{
            alert("Ngày đi phải chọn từ hiện tại tới!!")
        }
    }


    let sodoxe = <h1>Chọn chuyến xe</h1>
    let infoxe;
    if (chuyenxe){
        sodoxe = <>
                    {chuyenxe.xe.model.so_do.map.map((cx, idx)=>{
                        {console.log(idx, cx)}
                        return <Floor col = {chuyenxe.xe.model.so_do.col} row = {chuyenxe.xe.model.so_do.row} maps = {cx} 
                            vedadat = {vedadat}
                            picked = {picked}
                            change = {pick}/>
                    })}
                    
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
                    <div class="text-center">
                        <Button onClick={confirm}>Đặt vé</Button>
                    </div>
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
                                return <li>{i+1}, {obj.tram_dung.ten}</li>
                            })}
                        </ul>
                    </fieldset>
                </Row>
                </>
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
                                <input type="date" id="ngaydi" value={ngay} onChange={setngaykhoihanh}/>
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