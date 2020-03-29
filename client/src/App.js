import React, { Component } from 'react';
import './App.css';
import Navbar from './components/common/Navbar';
import Routes from './components/common/routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import notificationServices from './services/notification';
import 'react-toastify/dist/ReactToastify.min.css';

if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login'
  }
}

notificationServices.init();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div /* className="App" */>
            <Navbar/>
            <Routes/>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
