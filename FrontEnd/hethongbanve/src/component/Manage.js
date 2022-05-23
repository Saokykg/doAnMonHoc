import React, {useEffect, useState} from "react"
import { 
    Table, 
    Button, 
    Form,
    ButtonGroup,
    ToggleButton
} from "react-bootstrap"
import API, { endpoints } from "../API";
import cookies from "react-cookies";
import { useHistory } from "react-router";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
  
import Moment from 'react-moment';
import { getAllByPlaceholderText } from "@testing-library/dom";
import NhanVien from './Nhanvien'
import Admin from './Admin'

export default function Manage(){
    const history = useHistory();
    let { path, url } = useRouteMatch();
    
    let user = cookies.load("user");
    if (user){
        if (user.role == "customer")
        history.push('/');
    }
    else{
        if (!cookies.load("access_token")){
            history.push('/home/dangnhap')
        }
    }   

    let page = <></>
    if (user){
        page = NhanVien(user.role)
        if (user.role == "admin")
            page = Admin()
    }
    return(
        <> 
            {page}
        </>
    )
}
