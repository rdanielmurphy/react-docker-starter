import React, { Component } from 'react';
import AuthService from '../../Services/AuthService';
import Typography from '@material-ui/core/Typography';
import './Logout.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

class LogoutComponent extends Component {
    state = {
        loaded: false
    };

    componentDidMount() {
        AuthService.logout().then(() => {
            this.setState({ loaded: true });
        });
    }

    render() {
        return (
            <div className="logout-container">
                {this.state.loaded ?
                    (
                        <div>
                            <Typography variant="h2">Skillful.ly</Typography>
                            <Typography variant="h6" color="inherit" className="grow">
                                Succesfully logged out.  See you again soon!
                            </Typography>
                            <Button color="primary" className="popover-item" component={Link} to="/login">
                                Return to Login
                            </Button>
                        </div>
                    ) : (
                        <div className="loading">
                            <h2> Logging you out ... </h2>
                            <CircularProgress size={100} />
                        </div>
                    )
                }
            </div>
        )
    }
}

export default LogoutComponent;