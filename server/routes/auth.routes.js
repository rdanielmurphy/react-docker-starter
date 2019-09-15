import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import User from '../models/user';
import mongoose from 'mongoose';
import randomstring from 'randomstring';
import * as emailer from '../util/emailer';
import * as passUtils from '../util/passwordUtils';

const router = new Router();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const keys = require('../keys.json');
const env = require('../env.json');

mongoose.Promise = Promise;

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_APPID,
    clientSecret: keys.GOOGLE_APPSECRET,
    callbackURL: "http://localhost:8000/public/auth/google/callback",
    scope: ['profile', 'email']
}, function (accessToken, refreshToken, profile, cb) {
    let email = "dummyemail";
    if (profile.emails && profile.emails.length > 0) {
        email = profile.emails[0].value;
    }

    User.findOrCreate(
        { $or: [{ googleId: profile.id }, { email: email }] }, {
            googleId: profile.id,
            displayName: profile.displayName,
            email: email,
            googleJson: JSON.stringify(profile._json),
            emailVerified: true
        }).then(function (result) {
            let user = result.doc;
            return cb(null, user);
        }, function (err) {
            return cb(err, null);
        });
}));

passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APPID,
    clientSecret: keys.FACEBOOK_SECRET,
    callbackURL: "http://localhost:8000/public/auth/facebook/callback",
    scope: ['email']
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, {
            facebookId: profile.id, displayName: profile.displayName,
            facebookJson: JSON.stringify(profile._json), emailVerified: true
        }).then(function (result) {
            let user = result.doc;
            return cb(null, user);
        }, function (err) {
            console.log('FacebookStrategy err');
            return cb(err);
        });
    }
));

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
            passReqToCallback: true
        },
        (req, email, password, done) => {
            try {
                User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        return done(null, false, { message: 'Email already taken.' });
                    } else {
                        const confirmation = randomstring.generate();
                        passUtils.saltAndHashPassword(password).then(hashedPassword => {
                            emailer.sendConfirmationEmail(email, confirmation).then(success => {
                                if (success) {
                                    User.create({ email: email, displayName: "New User", password: hashedPassword, emailVerified: false, confirmationToken: confirmation }).then(user => {
                                        // note the return needed with passport local - remove this return for passport JWT to work
                                        return done(null, user);
                                    });
                                } else {
                                    return done(null, false, { message: 'Email not accepted.' });
                                }
                            });
                        });
                    }
                });
            } catch (err) {
                done(err);
            }
        },
    )
);

passport.use(
    'login',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true,
    },
        (email, password, done) => {
            const errorMsg = 'Bad login';
            try {
                User.findOne({
                    email: email
                }).then(user => {
                    if (user === null) {
                        return done(null, false, { message: errorMsg });
                    } else {
                        passUtils.comparePasswords(password, user.password).then(response => {
                            if (response !== true) {
                                return done(null, false, { message: errorMsg });
                            }
                            // note the return needed with passport local - remove this return for passport JWT
                            return done(null, user);
                        });
                    }
                });
            } catch (err) {
                console.log('LocalStrategy err');
                done(err);
            }
        })
);

// https://stackoverflow.com/questions/13335881/redirecting-to-previous-page-after-authentication-in-node-js-using-passport-js
router.route('/auth/google/callback').get((req, res, next) => {
    var redirect = req.query.redirect;
    if (redirect) {
        req.session.redirectTo = redirect;
    }
    passport.authenticate('google',
        { session: true },
        function (err, user, info) {
            if (err) { return res.redirect('/#/login?result=failed'); }
            // Redirect if it fails
            if (!user) { return res.redirect('/#/login?result=failed'); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                // Redirect if it succeeds
                let redirectUrlFromSession;
                if (req.session && req.session.redirectTo) {
                    redirectUrlFromSession = req.headers.referer + "#" + req.session.redirectTo;
                    req.session.redirectTo = null;
                }
                return res.redirect(redirectUrlFromSession ? redirectUrlFromSession : env[process.env.NODE_ENV].url + '/#/home');
            });
        })(req, res, next)
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
// router.route('/auth/facebook').get((req, res, next) => {
//     return passport.authenticate('facebook');
// });
router.route('/auth/facebook').get(passport.authenticate('facebook', { session: true }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.route('/auth/facebook/callback').get((req, res, next) => {
    var redirect = req.query.redirect;
    if (redirect) {
        req.session.redirectTo = redirect;
    }
    passport.authenticate('facebook',
        { session: true },
        function (err, user, info) {
            if (err) { return res.redirect('/#/login?result=failed'); }
            // Redirect if it fails
            if (!user) { return res.redirect('/#/login?result=failed'); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                // Redirect if it succeeds
                let redirectUrlFromSession;
                if (req.session && req.session.redirectTo) {
                    redirectUrlFromSession = req.headers.referer + "#" + req.session.redirectTo;
                    req.session.redirectTo = null;
                }
                return res.redirect(redirectUrlFromSession ? redirectUrlFromSession : env[process.env.NODE_ENV].url + '/#/home');
            });
        })(req, res, next)
});

// router.route('/auth/facebook/callback').get(
//     passport.authenticate('facebook', {
//         successRedirect: '/#/home',
//         failureRedirect: '/#/login?result=failed'
//     }));

router.route('/emailLogin').post((req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info.message);
            res.send(info.message);
        } else {
            req.logIn(user, err => {
                if (err) {
                    res.status(403).send({
                        auth: false,
                        // token: token,
                        message: 'user not found',
                    });
                } else {
                    // const token = jwt.sign({ id: user.username }, jwtSecret.secret);
                    res.status(200).send({
                        auth: true,
                        // token: token,
                        message: 'user found & logged in',
                    });
                }
            });
        }
    })(req, res, next);
});

router.route('/registerUser').post((req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            res.status(500).send({ error: err });
        }
        if (info !== undefined) {
            res.status(403).send({ error: info.message });
        } else {
            res.status(200).send({
                auth: true,
                // token: token,
                message: 'user registered',
            });
        }
    })(req, res, next);
});

router.route('/logout').post((req, res, next) => {
    req.logout();
    res.status(200).send({
        message: 'user logged out'
    });
});

router.route('/userdetails').get(AuthController.getUser);

router.route('/confirmemail').post(AuthController.confirmEmail);

router.route('/forgotpassword').post(AuthController.forgotPassword);

router.route('/resetpassword').post(AuthController.resetPassword);

router.route('/checkresetcode').post(AuthController.checkResetCode);

export default router;
