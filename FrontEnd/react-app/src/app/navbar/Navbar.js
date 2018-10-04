import React, { Component } from 'react';

import {UpdateSiteSettings} from "../Redux/Actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";


class Navbar extends Component {
    constructor(props) {
        super(props);


        this.state = {
        };
    }

    componentDidMount(){
    }

    logout(event){
        event.preventDefault();
        this.props.UpdateSiteSettings({...this.props.SiteSettings, sessionToken: null, roles: [], toastType: 'success', toastTitle: 'Logged Out', toastBody: '', toastTimeout: 3});
        document.cookie = '';
    }

    render() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to={'/'} className="navbar-brand">WebSiteName</Link>
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>

                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to={'/'}>Home</Link></li>\
                            {this.props.SiteSettings.sessionToken &&
                            <li><Link to={'/editAccount'}>Account</Link></li>
                            }
                            {!this.props.SiteSettings.sessionToken &&
                            <li><Link to={'/login'} href="#"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                            }
                            {this.props.SiteSettings.sessionToken &&
                            <li><a  href="#" onClick={event => this.logout(event)}><span className="glyphicon glyphicon-log-in"></span> Logout</a></li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
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


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);