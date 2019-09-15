const mailgun = require("mailgun-js");
const keys = require('../keys.json');
const mg = mailgun({ apiKey: keys.MAILGUN_APIKEY, domain: keys.MAILGUN_DOMAIN });
const packagejson = require("../../package.json");
const env = require("../env.json");
const fs = require('fs');
const path = require('path');

let confirmEmailHTML = null;
function getConfirmEmailHTML() {
    return new Promise(function (resolve, reject) {
        if (confirmEmailHTML) {
            resolve(confirmEmailHTML);
        }
        fs.readFile(path.resolve(__dirname, '../emails/confirmemail.html'), 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                confirmEmailHTML = data;
                resolve(confirmEmailHTML);
            }
        });
    })
}

let passswordResetEmailHTML = null;
function getPasswordResetEmailHTML() {
    return new Promise(function (resolve, reject) {
        if (passswordResetEmailHTML) {
            resolve(passswordResetEmailHTML);
        }
        fs.readFile(path.resolve(__dirname, '../emails/resetpasswordemail.html'), 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                passswordResetEmailHTML = data;
                resolve(passswordResetEmailHTML);
            }
        });
    })
}

export async function sendConfirmationEmail(email, confirmationCode) {
    try {
        let emailString = await getConfirmEmailHTML();
        const baseUrl = env[process.env.NODE_ENV].url;
        emailString = emailString.replace(/%pretext%/g, 'Welcome to ' + packagejson.name + '!  Please confirm your email.');
        emailString = emailString.replace(/%url%/g, baseUrl);
        emailString = emailString.replace(/%name%/g, packagejson.name);
        emailString = emailString.replace(/%confirmationurl%/g, baseUrl + '/#/confirmation/' + email + '/' + confirmationCode);
        const data = {
            from: packagejson.name + ' <n' + keys.NO_REPLY_EMAIL + '>',
            to: `${email}`,
            subject: 'Confirm your email address',
            html: emailString
        };
        mg.messages().send(data, function (error, body) {
            if (error) {
                console.error(error);
            }
        });
        return true;
    } catch (e) {
        console.error('error', e);
        return false;
    }
}

export async function sendForgotPasswordEmail(email, resetCode) {
    try {
        let emailString = await getPasswordResetEmailHTML();
        const baseUrl = env[process.env.NODE_ENV].url;
        emailString = emailString.replace(/%pretext%/g, packagejson.name + ':  Password Reset.');
        emailString = emailString.replace(/%url%/g, baseUrl);
        emailString = emailString.replace(/%name%/g, packagejson.name);
        emailString = emailString.replace(/%reseturl%/g, baseUrl + '/#/login/reset/' + email + '/' + resetCode);
        const data = {
            from: packagejson.name + ' <n' + keys.NO_REPLY_EMAIL + '>',
            to: `${email}`,
            subject: 'Password reset',
            html: emailString
        };
        mg.messages().send(data, function (error, body) {
            if (error) {
                console.error(error);
            }
        });
        return true;
    } catch (e) {
        console.error('error', e);
        return false;
    }
}