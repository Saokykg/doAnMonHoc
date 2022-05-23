import React from "react";
import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap"
import { Link, useRouteMatch } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { BsArrowCounterclockwise } from "react-icons/bs";
import cookies from 'react-cookies'
import { logoutUser } from "../../../action/userCreator";
import { useHistory } from "react-router";


export default function Header(){
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch();
    const history = useHistory();
    let { path, url } = useRouteMatch();
    
    let pathLogin = <Link to={`${url}/dangnhap`}>Đăng nhập</Link>
    let pathLogout =  <Link to={`${url}/dangky`}>Đăng ký</Link>
   

    const logout = (event) =>{
        event.preventDefault();
        cookies.remove("access_token");
        cookies.remove("user");
        dispatch(logoutUser());
        history.push("/")
    }
     
    if (user != null){
        pathLogin = <Link to={`${url}/nguoidung`}>{user.username}</Link>
        pathLogout = <Link onClick={logout}>Đăng xuất</Link>
    }

    return (
        <>
            <Navbar bg="dark" expand="lg" className="fixed-top">
            <Container>
                <Navbar.Brand>
                    <Link to={`${url}`}> LOGO </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto container-fluid" >
                    <Nav.Item>
                        <Nav.Link>
                            <Link to={`${url}`}> Trang chủ</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to={`${url}/lichtrinh`}>Lịch trình</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to={`${url}/datve`}>Đặt vé</Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Link to={`${url}/lichsu`}>Lịch sử di chuyển</Link>
                    </Nav.Item>
                    {/* <Nav.Item>
                        <Nav.Link href="/tuyendung">Tuyển dụng</Nav.Link>
                    </Nav.Item> */}
                    <Nav.Item >
                        <Nav.Link>
                            {pathLogin}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item >
                        <Nav.Link>
                            {pathLogout}
                        </Nav.Link>
                    </Nav.Item> 
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        </>
    )
}