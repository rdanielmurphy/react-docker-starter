import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './EmailLogin.css';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AuthService from '../../../Services/AuthService';

const theme = createMuiTheme({});

class EmailLoginComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            email: '',
            password: '',
            showInvalidLoginError: false,
            valid: false,
            success: false
        };
    }

    classes = makeStyles(theme => ({
        '@global': {
            body: {
                backgroundColor: theme.palette.common.white,
            },
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        }, () => {
            this.setState(this.runValidations());
        });
    }

    runValidations() {
        return {
            valid: (this.state.password && this.state.password.length > 0 &&
                this.state.email && this.state.email.length > 0) ? true : false
        }
    }

    onSubmitClick = () => {
        const validations = this.runValidations();
        this.setState(validations);

        if (validations.valid) {
            AuthService.emailLogin(this.state.email, this.state.password)
                .then(data => {
                    this.setState({
                        success: true
                    });
                }).catch(() => {
                    this.setState({
                        showInvalidLoginError: true
                    });
                });
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs" className="container">
                    <CssBaseline />
                    <div className={this.classes.paper}>
                        <Avatar className={this.classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={this.classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(event) => this.handleUserInput(event)}
                                error={this.state.showInvalidLoginError}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={this.state.showInvalidLoginError}
                                onChange={(event) => this.handleUserInput(event)}
                                helperText={this.state.showInvalidLoginError ? "Invalid email/password combination" : ""}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={this.classes.submit}
                                onClick={this.onSubmitClick}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#login/forgot" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </ThemeProvider>
        );
    }
}

export default EmailLoginComponent;