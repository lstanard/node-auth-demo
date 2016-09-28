module.exports = function(app, passport) {

    var Todo = require('./models/todo');

    // =====================================
    // TODOS ===============================
    // =====================================
    
    // get all todos in the database
    app.get('/api/todos', isLoggedIn, function(req, res) {
        Todo.find(function(err, todos) {
            if (err) {
                return res.status(500).send(err);
            }

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

    // update a todo
    app.put('/api/todos/:todo_id', isLoggedIn, function(req, res) {
        Todo.findOneAndUpdate({
            _id: req.params.todo_id
        }, {
            text: req.body.todo
        }, { new: true }, function (err, todo) {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(todo); // return updated todo as json
        });
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', isLoggedIn, function(req, res) {
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
