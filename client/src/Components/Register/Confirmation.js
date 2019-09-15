import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './Confirmation.css';
import AuthService from '../../Services/AuthService';
import CircularProgress from '@material-ui/core/CircularProgress';

class ConfirmationComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loaded: true,
            successfulConfirmation: false,
            errorMsg: ""
        };
    }

    componentDidMount = () => {
        const email = this.props.match.params.email;
        const token = this.props.match.params.token;

        AuthService.confirmEmail(email, token)
            .then(data => {
                this.setState({
                    loaded: true,
                    successfulConfirmation: true
                });
            }).catch((err) => {
                err.response.then((e) => {
                    this.setState({
                        loaded: true,
                        successfulConfirmation: false,
                        errorMsg: e.error
                    });
                });
            });
    }

    redirect = () => {
        this.props.history.push(`/login/email`);
    }

    render() {
        return (
            <div className="confirm-container">
                {
                    this.state.loaded ?
                        (
                            this.state.successfulConfirmation ?
                                (
                                    <div className="contents">
                                        <Typography component="h1" variant="h2" className="success-msg">
                                            Successfully confirmed your email!
                                        </Typography>
                                        <div className="spacer" >
                                            <Button
                                                className="loginButton"
                                                variant="contained"
                                                color="primary"
                                                onClick={this.redirect}>
                                                Go Login!
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="contents">
                                        <Typography component="h1" variant="h2">
                                            Error
                                        </Typography>
                                        <div className="small-spacer" >
                                            <Typography component="h4" variant="h5">
                                                {this.state.errorMsg}
                                            </Typography>
                                        </div>
                                    </div>
                                )
                        ) : (
                            <div className="loading">
                                <h2> Loading ... </h2>
                                <CircularProgress size={100} />
                            </div>
                        )
                }
            </div>
        )
    }
}

export default ConfirmationComponent;