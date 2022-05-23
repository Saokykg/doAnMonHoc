import React, {useState} from "react"
import { Form, Button, Col, Row } from "react-bootstrap"
import API, { endpoints } from "../API";
import cookies from "react-cookies"
import { BsFacebook, BsGoogle } from 'react-icons/bs';
import { useHistory, useRouteMatch } from "react-router";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginUser } from "../action/userCreator";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    const {path} = useRouteMatch();

    const login = async (event) =>{
        event.preventDefault();
        
        let token = await API.get(endpoints['oauthinfo']);

        let accessToken = null;
        await API.post(endpoints['login'],{
            "client_id": token.data.client_id,
            "client_secret": token.data.client_secret,
            "username": username,
            "password": password,
            "grant_type": "password"
        }).then( async (res) =>{           
            accessToken = res.data.access_token;
            
            let user = await API.get(endpoints['current-user']);

            cookies.save("user", user.data);
            
            dispatch(loginUser(user.data))
            if (user.data.role == "customer")
                history.push("/")
            else
                history.push("/manage")
        }
        ).catch( 
            err => {console.log(err)
            alert("Tài khoản không hợp lệ")
        });
}
    let dangkyc = <div className="text-center">
                    <p>Chưa có tài khoản ?</p>
                    <Link to="/home/dangky">
                        <a className="btn">Đăng ký ngay</a>
                    </Link>
                </div>

    return (
        <div className="bg-white w-50 mt-5 mb-5 ml-auto mr-auto rounded">
            <div className="text-center p-3"><h3><b>Đăng nhập</b></h3></div>
            <Form  className="w-100 p-3" onSubmit = {login}>
                <LoginFrom ph='Tên tài khoản, email hoặc sđt' label = "username" type = "text" field= {username}  change={event => setUsername(event.target.value)}/>
                <LoginFrom ph='Mật khẩu' label = "password" type = "password" field= {password}  change={event => setPassword(event.target.value)}/>
                <div className="text-right" ><a className="m-auto btn">quên mật khẩu</a></div>
                <div className="text-center p-3">
                    <Button className="w-75 bg-danger" type="submit" style={{borderRadius:"10px"}} >Đăng nhập</Button>
                </div>
                {/* <div className="text-center pb-3" >
                    <p className="m-auto">đăng nhập bằng</p>
                    <Row className="m-auto">
                        <Col className="btn border bg-primary">
                            <BsFacebook size={30}/><b> Facebook</b>
                        </Col>
                        <Col className="btn border bg-success">
                            <BsGoogle size={30}/><b> Google</b>
                        </Col>
                    </Row>
                </div> */}
                {dangkyc}
                
            </Form>
        </div>
    )
}
class LoginFrom extends React.Component {
    render(){
        return(
            <Form.Group  className="w-75 m-auto" >
                <Form.Label className="m-auto"><small>{this.props.label}</small></Form.Label>
                <Form.Control type={this.props.type} value = {this.props.field} 
                onChange={this.props.change} placeholder={this.props.ph}></Form.Control>
            </Form.Group>
        )
    }    
}

