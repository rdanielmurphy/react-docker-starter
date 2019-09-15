import React, { Component } from 'react';
import './ForgotPassword.css';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from '../../../Services/AuthService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const invalidEmailError = "Email is not valid.";

class ForgotPasswordComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showPasswordsMatchError: false,
            showPasswordInvalidError: false,
            showEmailInvalidError: false,
            submitted: false,
            valid: false,
            email: '',
            openErrorDialog: false,
            success: false
        };
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
            showEmailInvalidError: this.state.submitted && !this.checkEmail(this.state.email),
            valid: this.state.email.length > 0
        }
    }

    checkEmail(str) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(str);
    }

    redirect = () => {
        this.props.history.push(`/login/email`);
    }

    onSubmitClick = () => {
        this.setState({
            submitted: true
        }, () => {
            const validations = this.runValidations();
            this.setState(validations);

            if (!validations.showEmailInvalidError) {
                AuthService.resetPasswordEmail(this.state.email)
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

    handleClose = () => {
        this.setState({
            openErrorDialog: false
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.success ? (
                        <div className="forgot-container">
                            <Typography component="h2" variant="h5">
                                A reset password email was sent to {this.state.email}.  Please click the link in the email to reset your password.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.redirect}>
                                Back to Login
                            </Button>
                        </div>
                    ) : (
                            <div className="forgot-container">
                                <Typography component="h1" variant="h5">
                                    Enter your email and a password reset email will be sent
                                </Typography>
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={this.classes.submit}
                                    disabled={!this.state.valid}
                                    onClick={this.onSubmitClick}
                                >
                                    Send
                                </Button>
                                <Dialog
                                    open={this.state.openErrorDialog}
                                    onClose={this.handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description">
                                    <DialogTitle id="alert-dialog-title">Reset Password Error</DialogTitle>
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
                        )
                }
            </div>
        );
    }
}

export default ForgotPasswordComponent;
