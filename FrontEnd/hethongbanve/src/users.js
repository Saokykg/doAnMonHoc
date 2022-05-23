import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mybar from './component/Mybar';
import Login from './component/Login';
import Home from './component/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Users() {
  return (
    <> 
      <Mybar/>
    </>
  );
}

export default Users;
