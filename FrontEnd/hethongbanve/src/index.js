import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Manager from './Manager';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import mainReducer from './reducer/mainReducer'; 
import Manage from './component/Manage';

const store =  createStore(mainReducer)
ReactDOM.render(
  <Provider store = {store}>
    <Container >
      <Router>
      <App />
      </Router>
    </Container>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
