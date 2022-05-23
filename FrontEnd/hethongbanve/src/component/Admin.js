import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useRouteMatch, Switch, Route, useHistory } from "react-router-dom";
import cookies from "react-cookies"
import Ben from "./admin/Ben";
import Modelxe from "./admin/Modelxe";
import Chuyenxe from "./admin/Chuyenxe";
import Laplich from "./admin/Laplich";
import Qlnhanvien from "./admin/Qlnhanvien";
import Xe from "./admin/Xe";
import Thongke from "./admin/Thongke";
import Tram from "./admin/Tram";
import Tuyen from "./admin/Tuyen";
import { logoutUser } from "../action/userCreator";
import { useDispatch, useSelector } from "react-redux"

export default function Admin(){
    const {path, url} = useRouteMatch();
    const [check, setCheck] = useState(0);
    const history = useHistory();
    const dispatch = useDispatch();

    const handle = (event)=>{
        setCheck(event.target.id)
    }

    const logout = (event)=>{
        cookies.remove("access_token");
        cookies.remove("user");
        dispatch(logoutUser());
        history.push("/")
    }

    return(
        <>
        <Row>
            <PageButton change = {handle} id ={1} checked = {check} url = {`${path}/thongke`} label = "Thống kê"/>
            {/* <PageButton change = {handle} id ={2} checked = {check} url = {`${path}/qlchuyenxe`}  label = "Quản lý chuyến xe"/> */}
            <PageButton change = {handle} id ={3} checked = {check} url = {`${path}/lichchay`}  label = "Lập lịch chạy"/>
            <PageButton change = {handle} id ={4} checked = {check} url = {`${path}/ben`}  label = "Quản lý bến"/>
            <PageButton change = {handle} id ={5} checked = {check} url = {`${path}/tram`}  label = "Quản lý trạm dừng"/>
            <PageButton change = {handle} id ={6} checked = {check} url = {`${path}/tuyen`}  label = "Quản lý tuyến đường"/>
            <PageButton change = {handle} id ={7} checked = {check} url = {`${path}/model`}  label = "Quản lý model xe"/>
            <PageButton change = {handle} id ={8} checked = {check} url = {`${path}/xe`}  label = "Quản lý Xe"/>
            <PageButton change = {handle} id ={9} checked = {check} url = {`${path}/nhanvien`}  label = "Quản lý nhân viên"/>
            <PageButton change = {logout} url = {`/`} checked = {9}  label = "Đăng xuất"/>
        </Row>
        <Switch>
            <Route path = {`${url}/thongke`} component={Thongke}/>
            <Route path = {`${url}/qlchuyenxe`} component={Chuyenxe}/>
            <Route path = {`${url}/lichchay`} component={Laplich}/>
            <Route path = {`${url}/ben`} component={Ben}/>
            <Route path = {`${url}/tuyen`} component={Tuyen}/>
            <Route path = {`${url}/tram`} component={Tram}/>
            <Route path = {`${url}/model`} component={Modelxe}/>
            <Route path = {`${url}/xe`} component={Xe}/>
            <Route path = {`${url}/nhanvien`} component={Qlnhanvien}/>
        </Switch>
        </>
    )
}


class PageButton extends React.Component{
    render(){
        let check=""
        if (this.props.id == this.props.checked){
            check = "btn-primary"
        }
        else{
            check = "btn-secondary"
        }
        return(
        <Col md = {4} className="p-2">
            <Link id={this.props.id} className={"btn p-4 rounded-0 w-100 h-100 " + check} to={this.props.url}  onClick={this.props.change}>
                {this.props.label}
            </Link>
        </Col>
    )}
}