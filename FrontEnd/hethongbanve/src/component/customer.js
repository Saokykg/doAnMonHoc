// import logo from './logo.svg';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Mybar from './Mybar';
import Login from './Login';

import { BrowserRouter as Router, Route, Switch, Link , useRouteMatch } from 'react-router-dom';

import Register from './Register';
import Footer from './share/footer/Footer';
import Header from './share/header/Header';

import Search from './Search';
import Lichtrinh from './Lichtrinh'
import NguoiDung from './Nguoidung';
import BannerSilde from './bannerSlide';
import { useEffect } from 'react';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { useHistory } from 'react-router-dom'
import cookies from 'react-cookies'
import Lichsu from './Lichsu';
function Customer() {

  let { path, url } = useRouteMatch();
  const history = useHistory();
  
  useEffect(async()=>{
    let user = cookies.load("user");
    if (user && !(user.role == "customer"))
      history.push('/manage');
      return;
  },[])

  return (
    <div>
        <Header/>
        <br/>
        <BannerSilde />
        <br/>
        <br/>
        <Switch>
          <Route path={`${path}/dangky`} component={Register}/>
          <Route path={`${path}/dangnhap`} component={Login}/>
          <Route path={`${path}/datve`} component={Search}/>
          <Route path={`${path}/lichtrinh`} component={Lichtrinh}/>
          <Route path={`${path}/nguoidung`} component={NguoiDung}/>
          <Route path={`${path}/lichsu`} component={Lichsu}/>
        </Switch>
        <br/>
        <br/>
        <Footer />
    </div>
  );
}

export default Customer;


function Test(){
    return (
        <h1>hello this is test</h1>
    )
}