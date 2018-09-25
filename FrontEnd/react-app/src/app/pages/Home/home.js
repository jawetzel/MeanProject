import React, { Component } from 'react';

import {UpdateSiteSettings} from "../../Redux/Actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";


class Home extends Component {
    constructor(props) {
        super(props);


        this.state = {
        };
    }

    componentDidMount(){
    }


    render() {
        return (
            <div className="home">
                Home
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


export default connect(mapStateToProps, mapDispatchToProps)(Home);