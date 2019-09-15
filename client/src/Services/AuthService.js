import httpClient from './HttpClient';

let isLoggedIn = false;
let userDto;

const AuthClient = {
    isAuthenticated: () => {
        return isLoggedIn;
    },
    getUserDetails: () => {
        return httpClient.get('public/userdetails').then((response) => {
            userDto = response;
            isLoggedIn = true;
        }).catch((e) => {
            userDto = undefined;
            isLoggedIn = false;
        });
    },
    getUserDto: () => {
        return userDto;
    },
    logout: () => {
        return httpClient.post('public/logout');
    },
    emailLogin: (email, password) => {
        return httpClient.post('public/emailLogin', { email: email, password: password });
    },
    register: (email, password) => {
        return httpClient.post('public/registerUser', { email: email, password: password });
    },
    confirmEmail: (email, token) => {
        return httpClient.post('public/confirmemail', { email: email, token: token });
    },
    resetPasswordEmail: (email) => {
        return httpClient.post('public/forgotpassword', { email: email });
    },
    resetPasswordAction: (email, password, token) => {
        return httpClient.post('public/resetpassword', { email: email, password: password, token: token });
    },
    checkResetCode: (email, token) => {
        return httpClient.post('public/checkresetcode', { email: email, token: token });
    }
}

export default AuthClient;