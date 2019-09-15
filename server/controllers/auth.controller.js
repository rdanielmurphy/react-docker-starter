import User from '../models/user';
import ForgotPassword from '../models/forgotpassword';
import * as emailer from '../util/emailer';
import * as passUtils from '../util/passwordUtils';
import randomstring from 'randomstring';

/**
 * Get User object
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
    if (req.session && req.session.passport && req.session.passport.user) {
        const _id = req.session.passport.user._id;
        User.findById(_id).exec((err, user) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json(user);
        });
    } else {
        res.send(403, "You do not have rights to visit this page");
    }
}

/**
 * Get confirmation email
 * @param req
 * @param res
 * @returns void
 */
export function confirmEmail(req, res) {
    console.dir(req.body);
    User.findOne({
        email: req.body.email,
        confirmationToken: req.body.token
    }).then(user => {
        if (!user) {
            res.status(403).send({ error: "Invalid token/email." });
        } else {
            if (user.emailVerified) {
                res.status(403).send({ error: "Expired confirmation." });
            } else {
                user.emailVerified = true;
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ error: "Error saving." });
                    } else {
                        res.status(200).send({ message: "Success" });
                    }
                });
            }
        }
    });
}

/**
 * Send password reset email
 * @param req
 * @param res
 * @returns void
 */
export function forgotPassword(req, res) {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            let forgotPassword = new ForgotPassword();
            const resetToken = randomstring.generate();
            forgotPassword.email = req.body.email;
            forgotPassword.token = resetToken;
            let date = new Date(); // expires in 2 days
            forgotPassword.expires = date.setTime(date.getTime() + 2 * 86400000);
            forgotPassword.save(function (err) {
                if (!err) {
                    // send email
                    emailer.sendForgotPasswordEmail(req.body.email, resetToken);
                }
            });
        }
    });

    // Return success no matter what for security reasons
    res.status(200).send({ message: "Reset password email sent!" });
}

export function checkResetCode(req, res) {
    ForgotPassword.findOne({
        email: req.body.email,
        token: req.body.token
    }).then(forgotPassword => {
        if (forgotPassword && new Date() < forgotPassword.expires && !forgotPassword.used) {
            res.status(200).send({ message: "Success" });
        } else {
            res.status(403).send({ error: "Invalid token/email." });
        }
    });
}

export function resetPassword(req, res) {
    ForgotPassword.findOne({
        email: req.body.email,
        token: req.body.token
    }).then(forgotPassword => {
        if (!forgotPassword || forgotPassword.used) {
            res.status(403).send({ error: "Invalid email token combination." });
        } else {
            forgotPassword.used = true;
            forgotPassword.save();

            User.findOne({
                email: req.body.email
            }).then(user => {
                if (!user) {
                    res.status(403).send({ error: "Invalid email." });
                } else {
                    passUtils.saltAndHashPassword(req.body.password).then(saltedAndHashedPassword => {
                        user.password = saltedAndHashedPassword;
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.status(500).send({ error: "Error saving." });
                            } else {
                                ForgotPassword.deleteMany({
                                    email: req.body.email
                                });
                                res.status(200).send({ message: "Success" });
                            }
                        });
                    });
                }
            });
        }
    });
}
