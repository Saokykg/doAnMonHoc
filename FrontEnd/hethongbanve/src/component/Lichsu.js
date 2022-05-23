import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import { useParams } from "react-router";
import API, { endpoints } from "../API";
import { useHistory, useRouteMatch } from 'react-router-dom'
import cookies from 'react-cookies'
import Moment from 'react-moment';
import {AiFillEdit} from 'react-icons/ai'
import Rating from 'react-rating'
import './Style.css';
export default function Lichsu(){
    
    const history = useHistory()
    const user = cookies.load("user")
    const [lichsu, setLichSu] = useState([])
    const [listcmt, setListcmt] = useState([])
    const [focus, setFocus] = useState(null)
    const [binhluan, setBinhluan] = useState()
    const [rate, setRate] =useState(0)

    useEffect(async()=>{
        if (!cookies.load("access_token")){
            alert("Đăng nhập để tiếp tục")
            history.push('/home/dangnhap');
            return;
        }
        
        let res = await API.get(`${endpoints["khachhang"]}vexe/`)
        let ans = []
        var i = 0
        while (i < res.data.length){
            var tmp = (JSON.parse(JSON.stringify(res.data[i])))
            var tmpcx = tmp.chuyen_xe.id
            tmp.ghe = [];
            while (i < res.data.length && res.data[i].chuyen_xe.id == tmpcx){
                tmp.ghe.push(res.data[i].ghe)
                i++
            }
            tmp.ghe.sort()
            ans.push(tmp)
        }
        console.log(res.data);
        setLichSu(ans)

    },[])

    const comment = async(event)=>{
        event.preventDefault();
        console.log(binhluan)
        try {
            var res = await API.post(`${endpoints["chuyenxe"]}${focus}/add_binhluan/`, {
                "noi_dung": binhluan
            })
            if (res.data.error)
                alert(res.data.error)
            else
                setListcmt([...listcmt, res.data])
        } catch (error) {
            console.log(error)
            alert("Lỗi hệ thống")
        }
    }

    
    const opendanhgia = async(event)=>{
        var res = await API.get(`${endpoints["chuyenxe"]}${event.target.id}/binhluan/`)
        setListcmt(res.data)
        console.log(res.data)
        setFocus(event.target.id)
        res = await API.get(`${endpoints["chuyenxe"]}${event.target.id}/get_rate/`)
        setRate(res.data.type)
    }

    const rating = async(value)=>{
        console.log(value);
        var res = await API.post(`${endpoints["chuyenxe"]}${focus}/rating/`,{
            "rating": value
        })
        console.log(res.data)
        if (res.data.error)
            alert(res.data.error)
        else{
            setRate(value);
            alert("Đánh giá thành công");
        }

    }
    const dele = async(event, id)=>{
        // console.log(event.target, id);
        // var res = await API.post(`${endpoints["chuyenxe"]}${focus}/rating/`,{
        //     "rating": value
        // })
    }

    let danhgia = <></>
    if (focus) 
        danhgia = <Danhgia user ={user}  
                binhluan={binhluan}
                listbinhluan = {listcmt}
                change ={(event)=>{
                    setBinhluan(event.target.value)
                }}
                comment = {comment}
                rate = {rate}
                rating = {rating}
                dele = {dele}/>
    
    return(
        <>
            <Tablebody tab={lichsu} change = {opendanhgia}/>
            {danhgia}
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
                        <th>Ghế</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.tab.map((obj, i) =>{
                        return (
                        <tr>
                            <td>{i+1}</td>
                            <td>{obj.chuyen_xe.tuyen_duong.ben_dau.ten}</td>
                            <td>{obj.chuyen_xe.tuyen_duong.ben_cuoi.ten}</td>
                            <td>{obj.chuyen_xe.tuyen_duong.quang_duong}</td>
                            <td>
                                {obj.ghe.map((tram) =>`${tram} `)}
                            </td>
                            <td><Button id = {obj.chuyen_xe.id} 
                                onClick={this.props.change}
                            >Đánh giá</Button></td>
                        </tr>)
                    })}
                </tbody>
                </Table>
            </>
        )
    }
}

class Danhgia extends React.Component{
    render(){
        return(
            <>
                <Form>
                    <Form.Label>{this.props.user.username}</Form.Label>
                    <Form.Control type="text" value = {this.props.binhluan} onChange = {this.props.change}/>
                    <Button className="mt-2" variant="primary" type="submit" onClick={this.props.comment}>
                        Bình luận
                    </Button>
                    <br/>
                    <Rating initialRating={this.props.rate} onClick = {this.props.rating}/>
                </Form>
                <br/>
                {this.props.listbinhluan.map((obj)=>{
                    console.log(this.props.user, obj)
                    let key = <></>
                    if (this.props.user.id == obj.creator.id)
                        // key = <a className="btn btn-danger">Xóa</a>
                    return (
                        <>
                        <Row>
                            <Col md={2}><img style={{"witdh": "50px"}}  src={obj.creator.avatar}/></Col>
                            <Col md={6}>{obj.creator.username}: {obj.noi_dung}</Col>
                            <Col md={3}>
                            <Moment fromNow>{obj.created_date}</Moment>
                            </Col>
                            <Col md={1} onClick={event => this.props.dele(event, obj.id)} >{key}</Col>
                        </Row>
                        <hr/>
                        </>
                    )
                })}
            </>
        )
    }
}