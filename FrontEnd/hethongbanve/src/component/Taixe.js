import React, { useState, useEffect } from "react"
import { Button, Table, Col, Row } from "react-bootstrap"
import API, { endpoints } from "../API";
import date from 'date-and-time';

export default function Taixe(){
    const [xe, setXe] = useState({
        id : null,
        bendau : "",
        bendich:"",
        quangduong:"",
        tramdung:[],
        ghe:"",
        ve:"",
        dalen:"",
        giochay:"",
        model:null,
    })
    const [vedadat, setVeDaDat] = useState([])
    const [picked, setPick] = useState([])

    useEffect( async ()=>{
        var res = await API.get(`${endpoints["chuyenxe"]}current_chuyenxe/`);
        res = res.data[0];
        let tmp = 0, tmp2=[];
        if (res?.vexes){
            for (const r of res.vexes){
                if (r.status ==1){
                    tmp++;
                    tmp2.push(r.ghe)
                }
            }
            setVeDaDat(tmp2)
            let d = new Date(res.gio_chay)
            setXe({
                ...xe,
                id : res.id,
                bendau : res.tuyen_duong.ben_dau.ten,
                bendich: res.tuyen_duong.ben_cuoi.ten,
                quangduong: res.tuyen_duong.quang_duong,
                tramdung: res.tuyen_duong.tramDung_tuyenDuong,
                ghe: res.xe.model.so_ghe,
                ve: res.count,
                dalen: tmp,
                giochay: date.format(d, 'HH:mm:ss DD/MM/YYYY '),
                model: res.xe.model,
            })
            console.log(res)
        }
    },[])
    
    const pick = async(event) =>{
        event.preventDefault();
        if (!picked.includes(event.target.id))
            setPick(old => [...old, event.target.id])
        else{
            setPick(picked.filter( p => p!=event.target.id ));
        }
        console.log(picked)
    }

    const ontheboat = async() =>{
        let suc = [];
        let fai = [];

        for (const ghe of picked){
            try {
                let res = await API.patch(`${endpoints['chuyenxe']}${xe.id}/lenxe/`,{
                    "ghe": ghe
                })
                if (res?.data)
                    suc.push(ghe)
            } catch (error) {
                console.log(error)
                fai.push(ghe)
            }
            
        }
        alert(`Thành công ghế: ${suc} \nThất bại: ${fai}`)
    }

    const finish = async() =>{
        try {
            let res = await API.patch(`${endpoints['chuyenxe']}${xe.id}/ketthuc/`)
            if (res.data){
                alert("Kết thúc hành trình")
            }
        } catch (error) {
            alert("Lỗi hệ thống, thử lại sau")
        }
        
    }

    let sodo=<></>
    if (xe.model)
        sodo = <Row>
                <Col md={8}>
                    <Floor col = {xe.model.so_do.col} row = {xe.model.so_do.row} maps = {xe.model.so_do.map[0]} 
                                        vedadat = {vedadat}
                                        picked = {picked}
                                        change = {pick}/>
                </Col>
                <Col md={4}>
                        <div className="btn btn-secondary" onClick={ontheboat} >Xác nhận lên xe</div>
                        <div className="btn btn-danger" onClick={finish} >Cập bến</div>
                </Col>
            </Row>
    return (
        <>
        <h1>
            Tuyến đang chạy
        </h1>
            <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Bến đầu</th>
                            <th>Bến đích</th>
                            <th>Quãng đường</th>
                            <th>Giờ chạy</th>
                            <th>Trạm dừng chân</th>
                            <th>Số ghế</th>
                            <th>Số vé</th>
                            <th>Đã lên xe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{xe.bendau}</td>
                            <td>{xe.bendich}</td>
                            <td>{xe.quangduong}</td>
                            <td>{xe.giochay}</td>
                            <td>
                                <ul>
                                {xe.tramdung.map((tram) =>{
                                    return(
                                        <>
                                            <li>{tram.tram_dung.ten}</li>
                                        </>
                                    )
                                })}
                                </ul>
                            </td>
                            <td>{xe.ghe}</td>
                            <td>{xe.ve}</td>
                            <td>{xe.dalen}</td>
                            {/* <div className="btn btn-primary">Scan</div> */}
                        </tr>
                    </tbody>
            </Table>
            {sodo}
        <hr/>
            {/* <Tablebody tab={tuyenduong} btnname="Chi tiết"/> */}
        </>
    )
}


class Tablebody extends React.Component{  
    render(){
        return(
            <>
                <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Bến đầu</th>
                        <th>Bến đích</th>
                        <th>Quãng đường</th>
                        <th>Trạm dừng chân</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.tab.map((obj, i) =>{
                        return (
                        <tr>
                            <td>{i+1}</td>
                            <td>{obj.ben_dau.ten}</td>
                            <td>{obj.ben_cuoi.ten}</td>
                            <td>{obj.quang_duong}</td>
                            <ul>
                            {obj.tramDung_tuyenDuong.map((tram) =>{
                                return(
                                    <>
                                        <li>{tram.ten}</li>
                                    </>
                                )
                            })}
                            </ul>
                            <td>
                            <div className="btn btn-primary">{this.props.btnname}</div>
                            </td>
                        </tr>)
                    })}
                </tbody>
                </Table>
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
