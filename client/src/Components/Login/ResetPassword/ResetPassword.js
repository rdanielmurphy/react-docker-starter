import React, { Component } from 'react';
import './ResetPassword.css';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from '../../../Services/AuthService';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { createMuiTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const theme = createMuiTheme({});

const passwordMatchError = "Passwords do not match.";
const invalidPasswordError = "Password requirements: min 8 characters, with at least a symbol, upper and lower case letters and a number.";

class ResetPasswordComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loaded: false,
            email: props.match.params.email,
            token: props.match.params.token,
            showExpiredError: false,
            showPasswordsMatchError: false,
            showPasswordInvalidError: false,
            submitted: false,
            valid: false,
            password1: '',
            password2: '',
            openErrorDialog: false,
            success: false
        };
    }

    componentDidMount() {
        AuthService.checkResetCode(this.state.email, this.state.token).then(data => {
            this.setState({ loaded: true });
        }).catch((err) => {
            err.response.then((e) => {
                this.setState({
                    loaded: true,
                    showExpiredError: true
                });
            });
        });
    }

    classes = makeStyles(theme => ({
        submit: {
            margin: theme.spacing(3, 0, 2),
        }
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
            showPasswordsMatchError: this.state.submitted && this.state.password1 !== this.state.password2,
            showPasswordInvalidError: this.state.submitted && this.state.password1 === this.state.password2 &&
                !this.checkPassword(this.state.password1),
            valid: this.state.password1 && this.state.password1.length > 0 &&
                this.state.password2 && this.state.password2.length > 0
        }
    }

    onSubmitClick = () => {
        this.setState({
            submitted: true
        }, () => {
            const validations = this.runValidations();
            this.setState(validations);

            if (!validations.showPasswordsMatchError && !validations.showPasswordInvalidError && validations.valid) {
                AuthService.resetPasswordAction(this.state.email, this.state.password1, this.state.token)
                    .then(data => {
                        this.setState({
                            success: true
                        });
                    }).catch((err) => {
                        err.response.then((e) => {
                            this.setState({
                                openErrorDialog: true,
                                errorMsg: e.error
                            });
                        });
                    });
            }
        });
    }

    checkPassword(str) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }

    redirectHome = () => {
        this.props.history.push(`/home`);
    }

    redirectLogin = () => {
        this.props.history.push(`/login/email`);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                {
                    !this.state.loaded ? (
                        <div className="loading">
                            <h2> Loading ... </h2>
                            <CircularProgress size={100} />
                        </div>
                    ) :
                        (this.state.showExpiredError ? (
                            <div className="container">
                                <Typography component="h1" variant="h5">
                                    This reset code is invalid. :(
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.redirectHome}>
                                    Home
                                </Button>
                            </div>
                        ) : (this.state.success ? (
                            <div className="container">
                                <Typography component="h1" variant="h5">
                                    Your password has been reset.  Please login.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.redirectLogin}>
                                    Login
                                </Button>
                            </div>
                        ) : (
                                <div>
                                    <div className="container">
                                        <div className="heading-container">
                                            <Avatar className={this.classes.avatar}>
                                                <LockOutlinedIcon className={this.classes.avatar} />
                                            </Avatar>
                                            <br></br>
                                            <br></br>
                                            <Typography component="h1" variant="h5">
                                                Reset password for {this.state.email}
                                            </Typography>
                                        </div>
                                        <Container component="main" maxWidth="xs">
                                            <CssBaseline />
                                            <div className={this.classes.paper}>
                                                <form className={this.classes.form} noValidate>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name="password1"
                                                        label="Password"
                                                        type="password"
                                                        id="password1"
                                                        onChange={(event) => this.handleUserInput(event)}
                                                        value={this.state.password1}
                                                        error={this.state.showPasswordInvalidError}
                                                        helperText={this.state.showPasswordInvalidError ? invalidPasswordError : ""}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        name="password2"
                                                        label="Password Confirmation"
                                                        type="password"
                                                        id="password2"
                                                        value={this.state.password2}
                                                        onChange={(event) => this.handleUserInput(event)}
                                                        error={this.state.showPasswordsMatchError}
                                                        helperText={this.state.showPasswordsMatchError ? passwordMatchError : ""}
                                                    />
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="primary"
                                                        className={this.classes.submit}
                                                        disabled={!this.state.valid}
                                                        onClick={this.onSubmitClick}
                                                    >
                                                        Reset
                                                    </Button>
                                                </form>
                                            </div>
                                        </Container>
                                    </div>
                                    <Dialog
                                        open={this.state.openErrorDialog}
                                        onClose={this.handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">Password Reset Error</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                {this.state.errorMsg}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                                Close
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div >
                            )))
                }
            </ThemeProvider>
        );
    }
}

export default ResetPasswordComponent;
