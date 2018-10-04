import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Toastr from './toastr';

import {bindActionCreators} from "redux";
import {UpdateSiteSettings} from "./Redux/Actions";
import {connect} from "react-redux";

import Navbar from "./navbar/Navbar";

import login from "./pages/Login/login";
import home from "./pages/Home/home";
import register from './pages/Login/register';

import './shared.css';
import lostPassword from "./pages/Login/lostPassword";
import editAccount from "./pages/Account/editAccount";

class Router extends Component {
    constructor(props) {
        super(props);

        let cookies = document.cookie;
        if(cookies){
            cookies = JSON.parse(cookies);
            this.props.UpdateSiteSettings({...this.props.SiteSettings, sessionToken: cookies.token, roles: [...cookies.roles]});
        }
    }

    render() {
        return(
            <BrowserRouter>
                <div>
                    <Navbar/>
                    <Toastr/>
                    <Switch>
                        <Route path="/login" component={login}/>
                        <Route path="/register" component={register}/>
                        <Route path="/lostPassword" component={lostPassword}/>
                        {this.props.SiteSettings.sessionToken &&
                        <Route path="/editAccount" component={editAccount}/>
                        }
                        <Route path="/" component={home}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

function mapStateToProps(state) {
    return{
        SiteSettings: state.SiteSettings
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        UpdateSiteSettings: UpdateSiteSettings
    }, dispatch )
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
