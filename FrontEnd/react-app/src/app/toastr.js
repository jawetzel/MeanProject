import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {UpdateSiteSettings} from "./Redux/Actions/index";
import  NotificationSystem from 'react-notification-system';


class Toastr extends Component {
    constructor(props) {
        super(props);
        this.addAlert = this.addAlert.bind(this);
    }

    componentWillUpdate(){

    }
    componentDidUpdate(){

    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.SiteSettings.toastType.length > 0 && this.props.SiteSettings.toastType.length === 0){
            this.addAlert(nextProps.SiteSettings.toastTitle, nextProps.SiteSettings.toastBody, nextProps.SiteSettings.toastType, nextProps.SiteSettings.toastTimeout);
            this.props.UpdateSiteSettings({...nextProps.SiteSettings, toastTitle: '', toastBody: '', toastType: '', toastTimeout: 3});
        }
    }
    componentDidMount(){
        this.setState({notifier: this.refs.notificationSystem});
    }
    addAlert(title, message, level, timeout){
        this.state.notifier.addNotification({
            title: title,
            message: message,
            level: level,
            position: 'tc',
            autoDismiss: timeout,
            dismissible: true
        });
    }
    render() {
        return (
            <NotificationSystem ref="notificationSystem" />
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


export default connect(mapStateToProps, mapDispatchToProps)(Toastr);