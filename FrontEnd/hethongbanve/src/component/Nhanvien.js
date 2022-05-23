
import { Card, Col, Container, Nav, Navbar, Row, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { combineReducers } from "redux"
import NhanVienBanVe from './Nhanvienbanve'
import { useRouteMatch, useHistory, Switch, Route } from "react-router-dom"
import Taixe from './Taixe'
import  cookies  from 'react-cookies'
import { useDispatch } from "react-redux"
import { logoutUser } from "../action/userCreator";
import Userinfo from "./Userinfo"

export default function NhanVien(role){
    
    const { path, url } = useRouteMatch();

    let page = <></>
    if (role == "banve")
        page = <NhanVienBanVe />
    if (role == "taixe")
        page = <Taixe />

    return(
        <>
            <NavBar/>
            <Switch>
                <Route exact path ={`${path}`} >
                    {page}
                </Route> 
                <Route path = {`${path}/userinfo`} component = {Userinfo}/>
            </Switch>
        </>
    )
}


function NavBar(){
    const {path, url} = useRouteMatch()
    const history = useHistory()
    const dispatch = useDispatch();
    const user = cookies.load("user")
    const logout = (event) =>{
        event.preventDefault();
        console.log("test");
        cookies.remove("access_token",  { path: "/" });
        cookies.remove("user",  { path: "/" });
        dispatch(logoutUser());
        history.push("/")
    }

    let tx = <></>
    // if (user.role == "taixe")
    //     tx = <Link to={`${path}/history`} className="w-25 b-0">Lịch sử</Link>
     
    return (
        <>
        <Navbar bg="light" expand="lg"> 
        <Container>
            <Nav className="me-auto w-100 text-center">
                <Link to={`${path}`} className="w-25 b-0">Menu</Link>
                <Link to={`${path}/userinfo`}className="w-25 b-0">Tài khoản</Link>
                {tx}
                <a className="w-25 b-0" onClick={logout}>Đăng xuất</a>
            </Nav>
        </Container>
        </Navbar>
        <br/>
        </>
    )
}