import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import API, { endpoints } from "../API";
import { Link } from "react-router-dom";
import { Redirect, useHistory } from "react-router";
import cookies from "react-cookies";

export default function Register(){

    const [megaState, setMegaState] = useState({
        name : null,
        username : null,
        password : null,
        email : null,
        confirmpassword : null,
        avatar : null,
        sdt :null
    });
    
    const [email, setEmail] = useState(false)
    const [username, setUsername] = useState(false)
    const [sdt, setSdt] = useState(false)
    const [flag, setflag] = useState(false)
    const history = useHistory();

    let button = <Button disabled className="w-75 bg-danger" type="submit" style={{borderRadius:"10px"}} >Đăng ký</Button>;

    useEffect(()=>{
        var kt = true;
        for (let k in megaState){
            if (megaState[k] == null || megaState[k] == '')
                kt = false;
        }
        setflag(kt);
    },[megaState])

    
    if (cookies.load('access_token') != null)
        return <Redirect to={{ pathname: "/" }}/>

    if (flag)
        button = <Button className="w-75 bg-danger" type="submit" style={{borderRadius:"10px"}} >Đăng ký</Button>;

    const changeHandler = async (event) =>{
        setMegaState({
            ...megaState,
            [event.target.id]: event.target.value
        })
        if (event.target.id == 'username'){
            let check = await API.get(`${endpoints['check-username']}?u=${event.target.value}`);
            console.log(check.data)
            setUsername(check.data);
        }
        if (event.target.id == 'email'){
            let check = await API.get(`${endpoints['check-email']}?e=${event.target.value}`);
            setEmail(check.data);
        }
    }

    const register = async(event) =>{
        event.preventDefault();
        console.log(username, email)
        if (username){
            alert("Tên tài khoản đã có người sữ dụng")
            return;
        }
        if (email){
            alert("Email đã được sữ dụng")
            return;
        }
        if (sdt){
            alert("Số điện thoại đã được sữ dụng")
            return;
        }
        if (megaState.password === megaState.confirmpassword){
            const formData = new FormData();
            for (let k in megaState){
                if (k != "confirmpassword")
                    formData.append(k, megaState[k])
            }
            
            let res = await API.post(endpoints['costumer-register'],
                formData,{
                Headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res.data);
            if (res.data){
                alert("Đăng ký thành công!");
                history.push('/home/dangnhap')
            }
        }
        else{
            alert("Mật khẩu nhập lại chưa chính xác!!!");
        }
    }

    const changeAvatar = async (e) =>{
        await setMegaState({
            ...megaState,
            avatar : e.target.files[0]
        });
        console.log(megaState)
    }


    return (
        <>
            <div className="bg-white w-50 mt-5 mb-5 ml-auto mr-auto rounded">
            <div className="text-center p-3"><h3><b>Đăng ký</b></h3></div>
            <Form  className="w-100 p-3" onSubmit = {register}>
                <RegisterForm id ="email" type="email" label ="email" 
                    change ={changeHandler}/>
                <RegisterForm id ="username" type="text" label ="tên tài khoản" 
                    change ={changeHandler}/>
                <RegisterForm id ="name" type="text" label ="Tên" 
                    change ={changeHandler}/>
                <RegisterForm id ="sdt" type="text" label ="số điện thoại" 
                    change ={changeHandler}/>
                <RegisterForm id ="password" type="password" label ="Mật khẩu" 
                    change ={changeHandler}/>
                <RegisterForm id ="confirmpassword" type="password" label ="Nhập lại mật khẩu" 
                    change ={changeHandler}/>
                <Form.Group className="mb-3 w-75 m-auto">
                    <Form.Label>Avatar</Form.Label>
                    <Form.Control type="file" id="avatar" onChange = {changeAvatar} />
                </Form.Group>
                <div className="text-center p-3">
                    {button}
                </div>
                <div className="text-center">
                    <Link to="/dangnhap">
                        <a className="btn">Đăng nhập</a>
                    </Link>
                </div>
            </Form>
        </div>
        </>        
    )
}


class RegisterForm extends React.Component{
    render(){
        return (
            <Form.Group className="w-75 m-auto" controlId={this.props.id}>
                    <Form.Label className="m-auto">{this.props.label}</Form.Label>
                    <Form.Control type={this.props.type} placeholder={this.props.label} 
                    value = {this.props.field} require
                    onChange = {this.props.change} />
            </Form.Group>
        )
    }


}
