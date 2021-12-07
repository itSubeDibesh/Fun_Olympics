import Config from '../Config/Http.js';

const {
    check,
    validationResult,
    HasAccess,
    isLoggedIn,
    Db_Collection,
    dataSet,
    express,
    firebase_admin,
    firebase_auth
} = Config,
    // Setting Application Routes
    authRouter = express.Router(),
    // Setting Firebase Admin
    admin = firebase_admin,
    // Setting Firebase Auth
    auth = firebase_auth,
    // Setting Firebase DB
    user = Db_Collection.User;

authRouter.get('/', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    const warning = req.session.warning;
    req.session.warning = null;
    const success = req.session.success;
    req.session.success = null;
    if (req.session.role == undefined) req.session.role = "Guest"
    res.render('Pages/Home', dataSet({
        title: 'Home',
        login: req.session.login,
        status: req.session.status,
        error,
        warning,
        success
    }));
});

authRouter.get('/login', HasAccess, (req, res) => {
    if (req.session.role == undefined) req.session.role = "Guest"
    if (req.session.login != undefined && req.session.status == "LoggedIn") {
        // Redirect to According to Privilege
        if (req.session.login.roleDetails.includes("Moderate"))
            res.redirect('/dashboard');
        else
            res.redirect('/');
    } else {
        const success = req.session.success;
        const error = req.session.error;
        req.session.success = null;
        req.session.error = null;
        res.render('Login', dataSet({ title: 'Login', error, success }));
    }
});

authRouter.get('/logout', isLoggedIn, HasAccess, (req, res) => {
    // Error Check
    if (req.session.error) {
        req.session.role = "Guest"
        // Redirect to Login Page
        res.render('Login', dataSet({ title: 'Login', error: req.session.error }));
    } else {
        // Session Destroy
        req.session.destroy((err) => {
            // Redirect to Login Page
            if (err) res.render('Login', dataSet({ title: 'Login', error: err }));
            auth.logout().then(() => {
                // Logout Success
                res.redirect('/');
            }).catch((err) => {
                // Logout Error
                res.render('Login', dataSet({ title: 'Login', error: err }));
            });
        })
    }
})


authRouter.post('/login', HasAccess, (req, res) => {
    const { email, password } = req.body;
    // Redirect Error
    if (req.session.error) {
        const error = req.session.error;
        req.session.error = null
        res.render('Login', dataSet({ title: 'Login', error }));
    } else {
        // Validation Check
        if (email && password) {
            // Login
            auth.login(email, password).then(data => {
                // Fetch User data
                user.getByDoc(email)
                    .then(userData => {
                        let
                            // User Dataset 
                            userDataset = userData.data(),
                            // Appending User Dataset to Session
                            dataset = data;
                        dataset.userDetails = userDataset
                        dataset.roleDetails = Config.Privilege[userDataset['role']];
                        // Setting User Role in Session
                        req.session.role = userDataset['role'];
                        // Redirect Success
                        req.session.login = dataset;
                        req.session.status = "LoggedIn"
                        req.session.success = { "message": `Login Success, Welcome ${data.user.email.split("@")[0]}!` };
                        // Redirect to According to Privilege
                        if (dataset.roleDetails.includes("Moderate"))
                            res.redirect('/dashboard');
                        else
                            res.redirect('/');
                    }).catch(err => {
                        // Redirect Error
                        const error = {
                            "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                            "code": err.code
                        }
                        res.render('Login', dataSet({ title: 'Login', error: error }));
                    })
            }).catch(err => {
                // Redirect Error
                const error = {
                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                    "code": err.code
                }
                res.render('Login', dataSet({ title: 'Login', error: error }));
            });
        } else {
            // Validation Error
            req.session.error = { "message": 'Please enter email and password' };
            res.render('Login', dataSet({ title: 'Login', error: req.session.error }));
        }
    }
});

authRouter.get('/register', HasAccess, (req, res) => {
    if (req.session.role == undefined) req.session.role = "Guest"
    if (req.session.login != undefined && req.session.status == "LoggedIn") {
        // Redirect to According to Privilege
        if (req.session.login.roleDetails.includes("Moderate"))
            res.redirect('/dashboard');
        else
            res.redirect('/');
    } else {
        const error = req.session.error;
        req.session.error = null;
        const warning = req.session.warning;
        req.session.warning = null;
        const success = req.session.success;
        req.session.success = null;
        res.render('Register', dataSet({ title: 'Register', error, warning, success }));
    }
});

authRouter.post('/register', HasAccess,
    // Validation Check
    [
        check('email').isEmail().withMessage('Please enter a valid email'),
        check('name').notEmpty().withMessage('Please enter a valid name'),
        check('password').isLength({ min: 6, max: 20 }).withMessage('Password must be at least 6 characters long and 20 characters or less'),
        check('retype').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        check('country').notEmpty().withMessage('Please select a country'),
        check('phoneNumber').notEmpty().withMessage('Please enter a valid phone number'),
    ], (req, res) => {
        const { email, password, name, retype, country, phoneNumber } = req.body;
        // Data Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = { "message": "Fun Olympics - Validation Error, Please check your inputs" };
            req.session.error = error;
            res.render('Register', dataSet({
                title: 'Register',
                validation: errors.array(),
                error
            }));
        } else {
            let flag = false
            // Creating New Auth User
            admin.createUser(email, password, name, phoneNumber.toString())
                .then(data => {
                    flag = true
                    // Creating New User
                    user.set(email, {
                        email: email,
                        country: country,
                        role: "User"
                    }, "add")
                        .then(data => {
                            flag = true
                        })
                        .catch(err => {
                            if (err) {
                                flag = false
                                const error = {
                                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                                    "code": err.code
                                }
                                req.session.error = error;
                            }
                        })
                })
                .catch(err => {
                    if (err) {
                        flag = false
                        const error = {
                            "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                            "code": err.code
                        }
                        req.session.error = error;
                    }
                })
                .finally(() => {
                    if (flag) {
                        req.session.success = {
                            "message": `Registration Success, Welcome ${email.split("@")[0]}!`
                        };
                        res.redirect('/login')
                    } else {
                        req.session.error = req.session.error;
                        res.redirect('/register')
                    }
                })
        }
    });


authRouter.get('/reset', HasAccess, (req, res) => {
    if (req.session.role == undefined) req.session.role = "Guest"
    res.render('ForgetPassword', dataSet({
        title: 'Forget Password'
    }));
});

authRouter.post('/reset', HasAccess, (req, res) => {
    const { email } = req.body;
    // Redirect Error
    if (req.session.error) {
        const error = req.session.error;
        req.session.error = null
        res.render('ForgetPassword', dataSet({
            title: 'Forget Password',
            error
        }));
    } else {
        // Validation Check
        if (email) {
            // Reset Password
            auth.resetPassword(email).then(data => {
                // Redirect Success
                req.session.success = {
                    "message": `Reset Password Success, Please check your email!`
                };
                res.redirect('/login');
            }).catch(err => {
                // Redirect Error
                const error = {
                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                    "code": err.code
                }
                res.render('ForgetPassword', dataSet({
                    title: 'Forget Password',
                    error: error
                }));
            });
        } else {
            // Validation Error
            req.session.error = { "message": 'Please enter email' };
            res.render('ForgetPassword', dataSet({
                title: 'Forget Password',
                error: req.session.error
            }));
        }
    }
});


authRouter.get('/dashboard', isLoggedIn, HasAccess, (req, res) => {
    if (req.session.login && req.session.status == "LoggedIn") {
        const success = req.session.success;
        req.session.success = null;
        res.render('Pages/Dashboard', dataSet({
            title: 'Dashboard',
            login: req.session.login,
            success,
            status: req.session.status
        }));
    } else {
        res.redirect('/login');
    }
});

export default authRouter;