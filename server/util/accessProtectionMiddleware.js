export function accessProtectionMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('auth', req.session);
        next();
    } else {
        res.status(403).json({
            message: 'must be logged in to continue',
        });
    }
}