import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './ConfirmEmailSent.css';

class ConfirmEmailSentComponent extends Component {
    redirect = () => {
        this.context.router.history.push(`/login/email`)
    }

    render() {
        return (
            <div className="confirm-container">
                <Typography component="h2" variant="h5">
                    A confirmation email was sent to {this.props.email}.  Please click the link in the email to confirm your login.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.redirect}>
                    Go to Login
                </Button>
            </div>
        )
    }
}

export default ConfirmEmailSentComponent;