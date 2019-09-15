import React, { Component } from 'react';
import AuthService from '../../Services/AuthService';
import Typography from '@material-ui/core/Typography';
import './Profile.css';

class ProfileComponent extends Component {
    state = {
        userName: ""
    };

    componentDidMount() {
        const userDto = AuthService.getUserDto();
        this.setState({ userName: userDto.displayName });
    }

    render() {
        return (
            <div className="profile-container">
                <Typography component="h2" variant="h5">
                    {this.state.userName}
                </Typography>
            </div>
        )
    }
}

export default ProfileComponent;