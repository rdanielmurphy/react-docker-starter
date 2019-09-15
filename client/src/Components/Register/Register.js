import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import './Register.css';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import AuthService from '../../Services/AuthService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ConfirmEmailSentComponent from './ConfirmEmailSent';

const theme = createMuiTheme({});

const passwordMatchError = "Passwords do not match.";
const invalidPasswordError = "Password requirements: min 8 characters, with at least a symbol, upper and lower case letters and a number.";
const invalidEmailError = "Email is not valid.";

class RegisterComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showPasswordsMatchError: false,
            showPasswordInvalidError: false,
            showEmailInvalidError: false,
            submitted: false,
            valid: false,
            password1: '',
            password2: '',
            email: '',
            openErrorDialog: false,
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
            margin: 'auto',
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

    onSubmitClick = () => {
        this.setState({
            submitted: true
        }, () => {
            const validations = this.runValidations();
            this.setState(validations);

            if (!validations.showEmailInvalidError && !validations.showPasswordsMatchError && !validations.showPasswordInvalidError) {
                AuthService.register(this.state.email, this.state.password1)
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

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        }, () => {
            this.setState(this.runValidations());
        });
    }

    handleClose = () => {
        this.setState({
            openErrorDialog: false
        });
    }

    runValidations() {
        return {
            showPasswordsMatchError: this.state.submitted && this.state.password1 !== this.state.password2,
            showPasswordInvalidError: this.state.submitted && this.state.password1 === this.state.password2 &&
                !this.checkPassword(this.state.password1),
            showEmailInvalidError: this.state.submitted && !this.checkEmail(this.state.email),
            valid: this.state.password1 && this.state.password1.length > 0 &&
                this.state.password2 && this.state.password2.length > 0
                && this.state.email.length > 0
        }
    }

    checkPassword(str) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }

    checkEmail(str) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(str);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                {this.state.success ? (
                    <ConfirmEmailSentComponent email={this.state.email} />
                ) : (
                        <div>
                            <Container component="main" maxWidth="xs" className="container">
                                <CssBaseline />
                                <div className={this.classes.paper}>
                                    <Avatar className={this.classes.avatar}>
                                        <LockOutlinedIcon className={this.classes.avatar} />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Register
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
                                            autoFocus
                                            value={this.state.email}
                                            onChange={(event) => this.handleUserInput(event)}
                                            error={this.state.showEmailInvalidError}
                                            helperText={this.state.showEmailInvalidError ? invalidEmailError : ""}
                                        />
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
                                            Complete Registration
                                        </Button>
                                    </form>
                                </div>
                            </Container>
                            <Dialog
                                open={this.state.openErrorDialog}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">Registration Error</DialogTitle>
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
                        </div>
                    )}
            </ThemeProvider>
        );
    }
}

export default RegisterComponent;