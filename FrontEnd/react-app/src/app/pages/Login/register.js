import React, { Component } from 'react';

import {UpdateSiteSettings} from "../../Redux/Actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import InputValidation from '../../InputValidation';

import dataAccess from '../../dataAccess';

import './login.css';
import '../../shared.css';
import {Redirect} from "react-router-dom";

class Register extends Component {
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

        let passwordErrors = InputValidation(this.state.password, {req: true});
        this.setState({passwordErrors: passwordErrors});
        if(passwordErrors.length > 0) errors = true;

        let passwordErrors2 = InputValidation(this.state.password2, {req: true});
        if(this.state.password !== this.state.password2) {
            passwordErrors2.push('Passwords must match');
            errors = true;
        }
        this.setState({passwordErrors2: passwordErrors2});
        if(passwordErrors.length > 0) errors = true;

        if(!errors){
            let self = this;
            dataAccess.Account.register({email: this.state.email, password: this.state.password}, result => {
                console.log(result);
                if(result.error){
                    self.props.UpdateSiteSettings({...this.props.SiteSettings, toastType: 'error', toastTitle: 'Register Failure', toastBody: result.reason, toastTimeout: 3})
                } else {
                    self.props.UpdateSiteSettings({...this.props.SiteSettings,
                        toastType: 'success', toastTitle: 'Registration Successful', toastBody: 'You have registered and can now login', toastTimeout: 3});
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

                        <div className="form-group formInput">
                            <label>Password:</label>
                            <input type="password"  value={this.state.password}
                                   onChange={event => this.setState({password: event.target.value})}/>
                            <ul>
                                {this.state.passwordErrors.map((error, index) => {
                                    return(
                                        <li key={error + index}>{error}</li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="form-group formInput">
                            <label>Password:</label>
                            <input type="password"  value={this.state.password2}
                                   onChange={event => this.setState({password2: event.target.value})}/>
                            <ul>
                                {this.state.passwordErrors2.map((error, index) => {
                                    return(
                                        <li key={error + index}>{error}</li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="form-group formButtonMax text-center">
                            <button type="submit" className="btn btn-info">Register</button>
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


export default connect(mapStateToProps, mapDispatchToProps)(Register);