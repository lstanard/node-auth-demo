module.exports = function(app, passport) {

    // =====================================
    // LOGIN ===============================
    // =====================================

    // process login requests
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.login(user, function(err) {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }
                res.status(200).json({
                    status: 'Login successful',
                    user: user
                });
            });
        })(req, res, next);
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
    app.post('/signup',
        passport.authenticate('local-signup', {}),
        function (req, res) {
            res.redirect('/profile');
        }
    );

    // =====================================
    // USER SECTION ========================
    // =====================================
    app.get('/user', isLoggedIn, function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // =====================================
    // SINGLE VIEW FILE ====================
    // =====================================

    // load the single view file (angular will handle the page changes on the front-end)
    app.use('/', function(req, res) {
        res.sendfile('./public/index.html');
    });

    // =====================================
    // TODOS ===============================
    // =====================================
    // app.get('/api/todos', function(req, res) {
    //     // Send todos as json
    // });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't send 401
    res.send(401);
}
