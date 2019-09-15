//https://stackoverflow.com/questions/31084779/how-to-restrict-access-to-routes-in-react-router

import React from 'react';
import { withRouter } from 'react-router';
import AuthService from '../../Services/AuthService';
import { Redirect } from 'react-router-dom';

export default function requireAuth(Component) {

    class AuthenticatedComponent extends React.Component {
        render() {
            const location = this.props.location;
            const redirect = location.pathname + location.search;
            const loginURL = `/login?redirect=${redirect}`;

            return AuthService.isAuthenticated()
                ? <Component {...this.props} />
                : <Redirect to={loginURL} />;
        }

    }

    return withRouter(AuthenticatedComponent);
}