import React, {useEffect, useState} from "react"
import { 
    Table, 
    Button, 
    Form,
    ButtonGroup,
    ToggleButton
} from "react-bootstrap"
import API, {  endpoints } from "../API";
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

export default function NguoiDung(){
   
    const history = useHistory();
    useEffect( async ()=>{
        if (!cookies.load("access_token")){
            history.push('/home/dangnhap');
            return;
        }

    },[])


    let { path, url } = useRouteMatch();

    const radios = [
        { name: 'Thông tin', link : '/thongtin', value: '0' },
        { name: 'Đổi mật khẩu',link : '/doimatkhau', value: '1' },
        { name: 'Lịch sử chuyến đi',link : '/lichsu', value: '2' },
    ];
    
    const [radioValue, setRadioValue] = useState('-1');

    return(
        <>
            <div>
            <ButtonGroup className="mb-2">
                {radios.map((radio, idx) => (
                <Link to={`${url}${radio.link}`}
                    id = {idx}
                    className={"m-1 btn " + (idx==radioValue?"btn-primary":"btn-secondary") }
                    onClick={(event) => {
                        setRadioValue(event.target.id)
                    }}>
                    {radio.name}
                </Link>
                ))}
            </ButtonGroup>
            <Switch>
                <Route path={`${path}/thongtin`}>
                    <Userinfo />
                </Route>
                <Route path={`${path}/doimatkhau`}>
                    <ChangePassword />
                </Route>
                <Route path={`${path}/lichsu`}>
                    <Lichsu />
                </Route>
            </Switch>
            </div>
            <h1>User page</h1>
            
        </>
    )
}

function Userinfo(){

    const [user, setUser] = useState({
        name : null,
        username : null,
        email : null,
        // avatar : null,
        sdt :null,
        cmnd:null,
        ngay_sinh:null,
        vip :null,
        password:null,
    });

    useEffect( async ()=>{
        let res = await API.get(endpoints['khachhanginfo'])
        res=res.data;
        console.log(res);
        setUser({
            ...user,
            id : res.khachhang.id,
            username : res.user.username,
            name : res.khachhang.ho_ten,
            cmnd : res.khachhang.cmnd,
            // avatar :res.user.avatar,
            sdt : res.khachhang.sdt,
            ngay_sinh : res.khachhang.ngay_sinh,
            email : res.khachhang.email,
            vip : res.khachhang.vip 
        });
    },[])

    const handleInfo = (event) =>{
        if (event.target.id != "username")
            setUser({
                ...user,
                [event.target.id] : event.target.value
            })
    }

    const updateInfo = async () =>{
        const formData = new FormData();
        console.log(user.password)
        if (user.password){
            for (let k in user){
                if (k != "username" && k != "vip" && k != "password")
                    console.log(k, user[k])
                    formData.append(k, user[k])
            }
            try{
                let res = await API.put(`${endpoints['khachhang']}${user.id}/`,
                    formData,{
                    Headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.log(res.data.error);
                if (res.data.error){
                    alert("Sai mật khẩu!!")
                    return;
                }
            }
            catch(error){
                alert("Lỗi server!!!");
            }
            alert("Cập nhật thông tin thành công");
            setUser({
                ...user,
                password : ''
            })
        }
        else{
            alert("Nhập mật khẩu!!!");
        }
    }

    return(
        <Form className="w-50 m-auto">
            <FormBox name = "username" label="Tên đăng nhập" act={true} type = "input" value = {user.username} change = {handleInfo}/>
            <FormBox name = "name" label="Họ và tên" act={false} type = "input" value = {user.name} change = {handleInfo}/>
            <FormBox name = "ngay_sinh" label="Ngày sinh" act={false} type = "date" value = {user.ngay_sinh} change = {handleInfo}/>
            <FormBox name = "cmnd" label="Chứng minh nhân dân" act={false} type = "input" value = {user.cmnd} change = {handleInfo}/>
            <FormBox name = "sdt" label="Số điện thoại" act={false} type = "input" value = {user.sdt} change = {handleInfo}/>
            <FormBox name = "email" label="Email" act={false} type = "input" value = {user.email} change = {handleInfo}/>
            <FormBox name = "password" label="Xác nhận mật khẩu" require ={true} act={false} value = {user.password} type = "password" change = {handleInfo}/>
            <Button onClick={updateInfo}>Cập nhật</Button>
        </Form>
    )
} 

function ChangePassword(){
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [oldpassword, setOldPassword] = useState(null);

    const updateInfo = async() =>{
        
        if (confirmPassword == password){
            try{    
                let res = await API.patch(`${endpoints['users']}`,{
                    "old_password":oldpassword,
                    "password":password
                })
                if(res.data.error){
                    alert("sai mật khẩu")
                }
                else{
                    alert("Đổi mật khẩu thành công");
                    setPassword('');
                    setConfirmPassword('');
                    setOldPassword('');
                }
            }
            catch(error){
                alert("Lỗi server");
            }
        }
        else{
            alert("Mật khẩu nhập lại không chính xác")
        }
    }
    return(
        <Form className="w-50 m-auto">
            <FormBox name = "password" label="Mật khẩu cũ" act={false} type = "password" value = {oldpassword} change = {event => setOldPassword(event.target.value)}/>
            <FormBox name = "confirmpassword" label="Mật khẩu mới" act={false} type = "password" value = {password} change = {event => setPassword(event.target.value)}/>
            <FormBox name = "ngay_sinh" label="Nhập lại mật khẩu" act={false} type = "password" value = {confirmPassword} change = {event => setConfirmPassword(event.target.value)}/>
            <Button onClick={updateInfo}>Cập nhật</Button>
        </Form>
    )
}


function Lichsu(){

    const [lichsus, setlichsus] = useState([])
    const updateInfo = async() =>{
    }

    useEffect( async()=>{
        let res = await API.get(`${endpoints["khachhang"]}vexe/`)
        console.log(res.data); 
        setlichsus(res.data)
    },[])
    return(
        <>
            <Tablebody tab = {lichsus}/>
        </>
    )
}
class FormBox extends React.Component{  
    render(){
        return(
            <>
                <Form.Group controlId={this.props.name}>
                    <Form.Label> {this.props.label}</Form.Label>
                    <Form.Control type={this.props.type} 
                        readOnly={this.props.act}
                        value = {this.props.value}
                        onChange = {this.props.change} 
                        required = {this.props.require}/>
                </Form.Group>
            </>
        )
    }
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
                        <th>Ngày giờ xuất phát</th>
                        <th>Ghế</th>
                        <th>Gía</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.tab.map((obj, i) =>{
                        return (
                        <tr>
                            <td>{i+1}</td>
                            <td>{obj.chuyen_xe.tuyen_duong.ben_dau.ten}</td>
                            <td>{obj.chuyen_xe.tuyen_duong.ben_cuoi.ten}</td>
                            <td>
                                <Moment format="HH:SS DD/MM/YYYY " date= {obj.chuyen_xe.gio_chay} />
                            </td>
                            <td>{obj.ghe}</td>
                            <td>{obj.gia_ve}</td>
                            {/* <td><Button>Chi tiết</Button></td> */}
                        </tr>)
                    })}
                </tbody>
                </Table>
            </>
        )
    }
}

