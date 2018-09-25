import React, { Component } from 'react';

import {UpdateSiteSettings} from "../../Redux/Actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import InputValidation from '../../InputValidation';

import dataAccess from '../../dataAccess';

import './login.css';
import '../../shared.css';
import {Redirect} from "react-router-dom";

class LostPassword extends Component {
    constructor(props) {
        super(props);


        this.state = {
            email: '',
            emailErrors: [],
            password: '',
            passwordErrors: [],
            password2: '',
            passwordErrors2: [],
            redirectLogin: false
        };
    }

    componentDidMount(){
    }

    register(event){
        event.preventDefault();
        let errors = false;

        let emailErrors = InputValidation(this.state.email, {req: true, email: true});
        this.setState({emailErrors: emailErrors});
        if(emailErrors.length > 0) errors = true;

        if(!errors){
            let self = this;
            dataAccess.Account.lostPassword({email: this.state.email}, result => {
                console.log(result);
                if(result.error){
                    self.props.UpdateSiteSettings({...this.props.SiteSettings, toastType: 'error', toastTitle: 'Reset Failure', toastBody: result.reason, toastTimeout: 3})
                } else {
                    self.props.UpdateSiteSettings({...this.props.SiteSettings,
                        toastType: 'success', toastTitle: 'Password Reset', toastBody: 'Check your email, your password has been reset', toastTimeout: 3});
                    this.setState({redirectLogin: true});
                }
            })
        }

    }

    render() {
        if(this.state.redirectLogin){
            return(
                <Redirect to={'/login'}/>
            )
        }
        if(this.props.SiteSettings.sessionToken){
            return(
                <Redirect to={'/'}/>
            )
        }
        return (
            <div className="login">
                <div className="row text-center">
                    <div className="col-sm-3"></div>
                    <form className="text-left form col-sm-6" onSubmit={event => this.register(event)}>
                        <div className="form-group formInput">
                            <label>Email:</label>
                            <input placeholder="bill@aol.com" value={this.state.email}
                                   onChange={event => this.setState({email: event.target.value})} />
                            <ul>
                                {this.state.emailErrors.map((error, index) => {
                                    return(
                                        <li key={error + index}>{error}</li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="form-group formButtonMax text-center">
                            <button type="submit" className="btn btn-info">Lost Password</button>
                        </div>
                    </form>
                    <div className="col-sm-3"></div>
                </div>
            </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(LostPassword);