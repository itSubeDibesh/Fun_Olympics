import Config from '../Config/Http.js';

const {
    express,
    firebase_admin,
    firebase_auth,
    Db_Collection,
    isLoggedIn,
    HasAccess,
    dataSet,
    returnBool
} = Config,
    // Setting Application Routes
    usersRouter = express.Router(),
    // Setting Firebase Auth
    admin = firebase_admin,
    auth = firebase_auth,
    // Setting Firebase DB
    User = Db_Collection.User;

usersRouter.get('/users', isLoggedIn, HasAccess, (req, res) => {
    admin
        .listAllUsers()
        .then(usersAuth => {
            User
                .get()
                .then(usersData => {
                    let usersDataSet = usersData.docs
                    let list = [];
                    for (let index = 0; index < usersAuth.users.length; index++) {
                        const authData = usersAuth.users[index];
                        for (let i = 0; i < usersDataSet.length; i++) {
                            const otherData = usersDataSet[i].data()
                            if (authData.email != req.session.login.user.email && otherData.email != req.session.login.user.email)
                                if (otherData.email == authData.email) {
                                    authData.country = otherData.country;
                                    authData.role = otherData.role;
                                    list.push(authData);
                                }
                        }
                    }

                    const success = req.session.success,
                        error = req.session.error,
                        warning = req.session.warning;
                    req.session.success = null;
                    req.session.error = null;
                    req.session.warning = null;

                    res.render('Pages/Users', dataSet({
                        title: 'Users',
                        login: req.session.login,
                        status: req.session.status,
                        notice_length: req.session.notice_length,
                        users: list,
                        success,
                        error,
                        warning
                    }));
                })
        })
        .catch(err => {
            const error = {
                "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                "code": err.code
            }
            res.render('Pages/Users', dataSet({
                title: 'Users',
                login: req.session.login,
                status: req.session.status,
                notice_length: req.session.notice_length,
                error: error,
                success: req.session.success,
                warning: req.session.warning
            }));
        });
});

usersRouter.get('/users/reset', isLoggedIn, HasAccess, (req, res) => {
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
    } else {
        req.session.error = {
            "message": "Fun Olympics, Unauthorized Request."
        }
        res.redirect('/users');
    }
});

usersRouter.get('/users/:action', isLoggedIn, HasAccess, (req, res) => {
    const { action } = req.params;
    const { email } = req.query;
    if (action == "edit") {
        if (email) {
            if (email !== req.session.login.user.email) {
                admin
                    .getUserByEmail(email)
                    .then(user_auth_details => {
                        User
                            .getByDoc(email)
                            .then(user_data => {
                                const data = user_data.data();
                                user_auth_details.country = data.country;
                                user_auth_details.role = data.role;
                                res.render('Pages/Users-AddEdit', dataSet({
                                    title: 'Users',
                                    action: "Edit",
                                    login: req.session.login,
                                    status: req.session.status,
                                    notice_length: req.session.notice_length,
                                    user: user_auth_details,
                                }));
                            }).catch(err => {
                                const error = {
                                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                                    "code": err.code
                                }
                                res.render('Pages/Users', dataSet({
                                    title: 'Users',
                                    login: req.session.login,
                                    status: req.session.status,
                                    notice_length: req.session.notice_length,
                                    error: error
                                }));
                            });
                    })
                    .catch(err => {
                        const error = {
                            "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                            "code": err.code
                        }
                        res.render('Pages/Users', dataSet({
                            title: 'Users',
                            login: req.session.login,
                            status: req.session.status,
                            notice_length: req.session.notice_length,
                            error: error
                        }));
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
        res.render('Pages/Users-AddEdit', dataSet({
            title: 'Users',
            action: "Add",
            login: req.session.login,
            notice_length: req.session.notice_length,
            status: req.session.status
        }));
    } else if (action == 'view') {
        if (email !== req.session.login.user.email) {
            admin
                .getUserByEmail(email)
                .then(user_auth_details => {
                    User
                        .getByDoc(email)
                        .then(user_data => {
                            const data = user_data.data();
                            user_auth_details.country = data.country;
                            user_auth_details.role = data.role;
                            res.render('Pages/Users-AddEdit', dataSet({
                                title: 'Users',
                                action: "View",
                                login: req.session.login,
                                status: req.session.status,
                                notice_length: req.session.notice_length,
                                user: user_auth_details,
                            }));
                        }).catch(err => {
                            const error = {
                                "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                                "code": err.code
                            }
                            res.render('Pages/Users', dataSet({
                                title: 'Users',
                                login: req.session.login,
                                notice_length: req.session.notice_length,
                                status: req.session.status,
                                error: error
                            }));
                        });
                })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', dataSet({
                        title: 'Users',
                        login: req.session.login,
                        status: req.session.status,
                        notice_length: req.session.notice_length,
                        error: error
                    }));
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

usersRouter.post('/users/entry', isLoggedIn, HasAccess, (req, res) => {
    let { email, uid, action, displayName, phoneNumber, disabled, password, country, role } = req.body;
    if (action == "Add") {
        if (email && displayName && password) {
            admin
                .createUser(email, password, displayName, phoneNumber)
                .then(() => {
                    User
                        .set(email, {
                            email,
                            country: country || "NP",
                            role: role || "Guest",
                            disabled: false
                        }, "add")
                        .then(() => {
                            req.session.success = { "message": "Fun Olympics: User created successfully!" };
                            res.redirect('/users');
                        })
                        .catch(err => {
                            const error = {
                                "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                                "code": err.code
                            }
                            res.render('Pages/Users', dataSet({
                                title: 'Users',
                                login: req.session.login,
                                status: req.session.status,
                                notice_length: req.session.notice_length,
                                error: error
                            }));
                        });
                })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', dataSet({
                        title: 'Users',
                        login: req.session.login,
                        status: req.session.status,
                        notice_length: req.session.notice_length,
                        error: error
                    }));
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
            admin
                .updateUser(uid, displayName, phoneNumber || null, returnBool(disabled) || false)
                .then(() => {
                    User
                        .set(email, {
                            email,
                            country: country,
                            role: role,
                            disabled: returnBool(disabled)
                        }, "Update")
                        .then(() => {
                            req.session.success = { "message": "Fun Olympics: User updated successfully!" };
                            res.redirect('/users');
                        }).catch(err => {
                            const error = {
                                "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                                "code": err.code
                            }
                            res.render('Pages/Users', dataSet({
                                title: 'Users',
                                login: req.session.login,
                                status: req.session.status,
                                notice_length: req.session.notice_length,
                                error: error
                            }));
                        });
                })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', dataSet({
                        title: 'Users',
                        login: req.session.login,
                        status: req.session.status,
                        notice_length: req.session.notice_length,
                        error: error
                    }));
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

usersRouter.get('/users/user/delete', isLoggedIn, HasAccess, (req, res) => {
    const { email, uid } = req.query;
    if (email && uid) {
        if (email !== req.session.login.user.email) {
            admin
                .deleteUser(uid)
                .then(data => {
                    User
                        .deleteDoc(email)
                        .then(() => {
                            req.session.success = { "message": "Fun Olympics: User deleted successfully!" };
                            res.redirect('/users');
                        })
                        .catch(err => {
                            const error = {
                                "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                                "code": err.code
                            }
                            res.render('Pages/Users', dataSet({
                                title: 'Users',
                                login: req.session.login,
                                status: req.session.status,
                                notice_length: req.session.notice_length,
                                error: error
                            }));
                        });
                })
                .catch(err => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    res.render('Pages/Users', dataSet({
                        title: 'Users',
                        login: req.session.login,
                        status: req.session.status,
                        notice_length: req.session.notice_length,
                        error: error
                    }));
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
