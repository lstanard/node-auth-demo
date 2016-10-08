module.exports = function(app, passport) {

    var List = require('./models/list');
    var Todo = require('./models/todo');

    // =====================================
    // LISTS ===============================
    // =====================================

    // get all lists for current user
    app.get('/api/lists', isLoggedIn, function(req, res) {
        List.find({
            subdomain: req.user._id
        }).exec(function(err, lists) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(lists);
        });
    });

    app.post('/api/lists', isLoggedIn, function(req, res) {
        List.create({
            name: req.body.name,
            description: req.body.description,
            subdomain: req.user._id
        }, function (err, list) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(list);
        });
    });

    app.put('/api/lists/:list_id', isLoggedIn, function(req, res) {
        List.findOneAndUpdate({
            _id: req.params.list_id
        }, {
            name: req.body.name,
            completed: req.body.description
        }, { new: true }, function (err, todo) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(list);
        });
    });

    app.delete('/api/lists/:list_id', isLoggedIn, function(req, res) {
        List.remove({
            _id: req.params.list_id
        }, function (err, obj) {
            if (err) {
                return res.status(500).json(err);
            }

            if (obj.result.n === 0)
                res.send('List not found');

            res.send(); // no reponse data
        });
    });

    // =====================================
    // TODOS ===============================
    // =====================================

    // get all todos in the database
    app.get('/api/lists/:list_id/todos', isLoggedIn, function(req, res) {
        Todo.find({
            subdomain: req.user._id
        }).exec(function(err, todos) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(todos);
        });
    });

    // create new todo
    app.post('/api/lists/:list_id/todos', isLoggedIn, function(req, res) {
        Todo.create({
            text: req.body.todo,
            completed: false,
            subdomain: req.user._id
        }, function (err, todo) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(todo); // return new todo as JSON
        });
    });

    // update a todo
    app.put('/api/lists/:list_id/todos/:todo_id', isLoggedIn, function(req, res) {
        Todo.findOneAndUpdate({
            _id: req.params.todo_id
        }, {
            text: req.body.todo,
            completed: req.body.completed
        }, { new: true }, function (err, todo) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(todo); // return updated todo as json
        });
    });

    // delete a todo
    app.delete('/api/lists/:list_id/todos/:todo_id', isLoggedIn, function(req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, obj) {
            if (err) {
                return res.status(500).json(err);
            }

            if (obj.result.n === 0)
                res.send('Todo not found');

            res.send(); // no reponse data
        });
    });

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
        res.status(200).json({
            status: 'Logout successful'
        });
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
    app.post('/signup',
        passport.authenticate('local-signup', {}),
        function (req, res) {
            res.status(200).json({
                status: 'Signup successful'
            });
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

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't send 401
    res.send(401);
}
