import Config from '../Config/Http.js';

// Setting Application Routes
const usersRouter = Config.express.Router();
// Setting Firebase Auth
const admin = Config.firebase_admin;
const auth = Config.firebase_auth;

// Setting Firebase DB
const user = Config.Db_Collection.User;

usersRouter.get('/users', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    admin.listAllUsers().then(users => {
        let list = [];
        for (let index = 0; index < users.users.length; index++) {
            const element = users.users[index];
            if (element.email != req.session.login.user.email) {
                list.push(element);
            }
        }
        res.render('Pages/Users', Config.dataSet({
            title: 'Users',
            login: req.session.login,
            status: req.session.status,
            users: list,
            success: req.session.success,
            error: req.session.error,
            warning: req.session.warning
        }));
    })
        .catch(err => {
            const error = {
                "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                "code": err.code
            }
            res.render('Pages/Users', Config.dataSet({
                title: 'Users',
                login: req.session.login,
                status: req.session.status,
                error: error,
                success: req.session.success,
                warning: req.session.warning
            }));
        });
});

usersRouter.get('/users/reset', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    const { email } = req.query;
    if (email && email != req.session.login.user.email) {
        auth.resetPassword(email).then(() => {
            req.session.success = {
                message: "Reset request approved, email sent for reset."
            }
            res.redirect('/users');
        })
            .catch(err => {
                const error = {
                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                    "code": err.code
                }
                req.session.error = error;
                res.redirect('/users');
            });
    }else{
        req.session.error = {
            "message": "Fun Olympics, Unauthorized Request."
        }
        res.redirect('/users');
    }
});

usersRouter.get('/users/:action', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    const { action } = req.params;
    const { email } = req.query;
    if (action == "edit") {
        if (email) {
            if (email !== req.session.login.user.email) {
                admin.getUserByEmail(email).then(user => {
                    res.render('Pages/Users-AddEdit', Config.dataSet({
                        title: 'Users',
                        action: "Edit",
                        login: req.session.login,
                        status: req.session.status,
                        user: user,
                    }));
                })
                    .catch(err => {
                        const error = {
                            "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                            "code": err.code
                        }
                        res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, error: error }));
                    });
            } else {
                const error = {
                    "message": "Fun Olympics: Unauthorized Request!"
                }
                req.session.error = error;
                res.redirect('/users')
            }
        } else {
            const error = {
                "message": "Fun Olympics: User not found!"
            }
            req.session.error = error;
            res.redirect('/users')
        }
    } else if (action == "add") {
        res.render('Pages/Users-AddEdit', Config.dataSet({
            title: 'Users',
            action: "Add",
            login: req.session.login,
            status: req.session.status
        }));
    } else if(action == 'view') {
        if (email !== req.session.login.user.email) {
            admin.getUserByEmail(email).then(user => {
                res.render('Pages/Users-AddEdit', Config.dataSet({
                    title: 'Users',
                    action: "View",
                    login: req.session.login,
                    status: req.session.status,
                    user: user,
                }));
            })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, error: error }));
                });
        } else {
            const error = {
                "message": "Fun Olympics: Unauthorized Request!"
            }
            req.session.error = error;
            res.redirect('/users')
        }
    } else {
        res.redirect('/users')
    }
});

usersRouter.post('/users/entry', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    let { email, uid, action, displayName, phoneNumber, disabled, password } = req.body;
    if (action == "Add") {
        if (email && displayName && password) {
            admin.createUser(email, password, displayName, phoneNumber).then(user => {
                req.session.success = { "message": "Fun Olympics: User created successfully!" };
                res.redirect('/users');
            })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, error: error }));
                });
        } else {
            const error = {
                "message": "Fun Olympics: Invalid Add Request!"
            }
            req.session.error = error;
            res.redirect('/users')
        }
    } else if (action == "Edit") {
        if (email != req.session.login.user.email) {
            admin.updateUser(uid, displayName, phoneNumber || null, Config.returnBool(disabled) || false).then(user => {
                req.session.success = { "message": "Fun Olympics: User updated successfully!" };
                res.redirect('/users');
            })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, error: error }));
                });
        } else {
            const error = {
                "message": "Fun Olympics: Unauthorized Update Request!"
            }
            req.session.error = error;
            res.redirect('/users')
        }
    } else {
        const error = {
            "message": "Fun Olympics: Unauthorized Access!"
        }
        req.session.error = error;
        res.redirect('/users')
    }
});

usersRouter.get('/users/user/delete', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    const { email, uid } = req.query;
    console.log(email, uid);
    if (email && uid) {
        if (email !== req.session.login.user.email) {
            admin.deleteUser(uid).then(user => {
                req.session.success = { "message": "Fun Olympics: User deleted successfully!" };
                res.redirect('/users');
            })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, error: error }));
                });
        } else {
            const error = {
                "message": "Fun Olympics: Unauthorized Delete Request!"
            }
            req.session.error = error;
            res.redirect('/users')
        }
    }
});

export default usersRouter;
