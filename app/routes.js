module.exports = function(app, passport) {

    var Todo = require('./models/todo');

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
    // TODOS ===============================
    // =====================================
    app.get('/api/todos', isLoggedIn, function(req, res) {
        // get all todos in the database
        // need to modify to get all todos by user.id
        Todo.find(function(err, todos) {
            if (err)
                res.send(err);

            res.json(todos); // return all todos in JSON format
        });
    });

    // create new todo
    app.post('/api/todos', isLoggedIn, function(req, res) {
        Todo.create({
            text: req.body.todo,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            res.json(todo); // return new todo as JSON
        })
    });

    app.delete('/api/todos/:id', isLoggedIn, function(req, res) {
        Todo.remove({
            id: req.params.id
        }, function(err, todo) {
            if (err)
                res.send(err);

            res.json(todo);
        });
    });

    // =====================================
    // SINGLE VIEW FILE ====================
    // =====================================

    // load the single view file (angular will handle the page changes on the front-end)
    app.use('/', function(req, res) {
        res.sendfile('./public/index.html');
    });

    // app.get('*', function(req, res) {
    //     res.sendfile('./public/index.html');
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
