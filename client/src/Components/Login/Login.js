import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './Login.css';
import Link from '@material-ui/core/Link';

const regStyle = {
    textAlign: 'center'
};

const optionStyle = {
    paddingLeft: '10px'
};


class LoginComponent extends Component {
    onGoogleClick = () => {
        window.location.href = '/public/auth/google/callback' + this.props.location.search;
        return null;
    }

    onFacebookClick = () => {
        window.location.href = '/public/auth/facebook' + this.props.location.search;
        return null;
    }

    onEmailClick = () => {
        window.location.href = '/#/login/email';
        return null;
    }

    render() {
        return (
            <div className="root">
                <Typography variant="h2">Skillful.ly Login</Typography>
                <Paper className="paper" onClick={this.onGoogleClick}>
                    <Grid container wrap="nowrap" spacing={10}>
                        <Grid item>
                            <span className="google-icon">
                                <i className="fab fa-google"></i>
                            </span>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" style={optionStyle}>Sign in with Google</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className="paper" onClick={this.onFacebookClick}>
                    <Grid container wrap="nowrap" spacing={10}>
                        <Grid item>
                            <span className="facebook-icon">
                                <i className="fab fa-facebook-square"></i>
                            </span>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" style={optionStyle}>Sign in with Facebook</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className="paper" onClick={this.onEmailClick}>
                    <Grid container wrap="nowrap" spacing={10}>
                        <Grid item>
                            <span className="email-icon">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" style={optionStyle}>Sign in with Email</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container wrap="nowrap" spacing={10}>
                    <Grid item xs>
                        <Typography variant="h6" style={regStyle}>
                            <Link href="#register">Register with email</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </div >
        );
    }
}

export default LoginComponent;