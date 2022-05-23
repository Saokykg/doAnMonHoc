import React, {useEffect, useState} from "react"
import { Table, Button } from "react-bootstrap"
import API, { endpoints } from "../API";
import cookies from "react-cookies"
import { BsFacebook, BsGoogle } from 'react-icons/bs';
import { useHistory } from "react-router";


export default function Lichtrinh(){

    const history = useHistory();
    const [tuyenduong, setTuyenDuong] = useState([])
    const [finder, setFinder] = useState("")

    const load = async()=>{
        var res = await API.get(endpoints["tuyenduong"]);
        setTuyenDuong(res.data);
    }
    useEffect( async ()=>{
        await load();
    },[])

    const timkiem = async() => {
        if (finder==""){
            await load();
            return;
        }
        var tuyen = JSON.parse(JSON.stringify(tuyenduong));
        tuyen = tuyen.filter((obj)=>{
            return JSON.stringify(obj).toUpperCase().includes(finder.toUpperCase());
        })
        setTuyenDuong(tuyen);
    }


    var body = <h1>Hiện tại không có tuyến đường nào đang hoạt động</h1>
    if (tuyenduong)
        body = <Tablebody tab={tuyenduong}/>
    return (
        <>
            <input type="text" value ={finder} onChange={(event)=>setFinder(event.target.value)} placeholder="Tìm kiếm bến/trạm"/>
            <a className="ml-3 btn btn-danger" onClick={timkiem}>Tìm</a>
            {body}
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
                                        <li>{tram.tram_dung.ten}</li>
                                    </>
                                )
                            })}
                            </ul>
                            {/* <td><Button>Đặt vé</Button></td> */}
                        </tr>)
                    })}
                </tbody>
                </Table>
            </>
        )
    }
}

