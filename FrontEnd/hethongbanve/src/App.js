import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mybar from './component/Mybar';
import Login from './component/Login';
import Home from './component/Home';
import { BrowserRouter as Router, Route, Switch, Link , useRouteMatch} from 'react-router-dom';
import Customer from './component/customer';
import Manage from './component/Manage';
import { useHistory, useLocation } from 'react-router-dom'
import cookies from 'react-cookies'

function App() {
  let history = useHistory();
  let location = useLocation();
  
  if (location.pathname == '/')
    history.push('/home')
  return (
    <div className = "mainbg">
        <Switch>
          <Route path="/home" component={Customer}/>
          <Route path="/manage" component={Manage}/>
        </Switch>
    </div>
  );
}

export default App;
