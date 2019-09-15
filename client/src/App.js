import React, { Component } from 'react';
import './App.css';
import AppContainer from './Components/AppContainer/AppContainer';
import { HashRouter } from "react-router-dom";
import AuthService from './Services/AuthService';
import requireAuth from './Components/Authentication/AuthRoute';
import { Route, Switch } from 'react-router-dom';
import LoginComponent from './Components/Login/Login';
import CircularProgress from '@material-ui/core/CircularProgress';
import EmailLoginComponent from './Components/Login/EmailLogin/EmailLogin';
import RegisterComponent from './Components/Register/Register';
import ConfirmationComponent from './Components/Register/Confirmation';
import ForgotPasswordComponent from './Components/Login/ForgotPassword/ForgotPassword';
import ResetPasswordComponent from './Components/Login/ResetPassword/ResetPassword';
import LogoutComponent from './Components/Logout/Logout';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    AuthService.getUserDetails().then(() => {
      this.setState({ loaded: true });
    });
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="App">
          <HashRouter>
            <Switch>
              <Route path='/login/email' component={EmailLoginComponent} />
              <Route path='/login/forgot' component={ForgotPasswordComponent} />
              <Route path='/login/reset/:email/:token' component={ResetPasswordComponent} />
              <Route path='/login' component={LoginComponent} />
              <Route path='/register' component={RegisterComponent} />
              <Route path='/confirmation/:email/:token' component={ConfirmationComponent} />
              <Route path='/logout' component={LogoutComponent} />
              <Route component={requireAuth(AppContainer)} path='*' />
            </Switch>
          </HashRouter>
        </div>
      );
    } else {
      return (
        <div className="loading">
          <h2> Loading ... </h2>
          <CircularProgress size={100} />
        </div>
      );
    }
  }
}

export default App;
