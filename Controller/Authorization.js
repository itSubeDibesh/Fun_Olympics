import Config from '../Config/Http.js';

// Setting Application Routes
const authRouter = Config.express.Router();
// Setting Firebase Auth
const auth = new Config.Auth_Firebase();

authRouter.get('/', (req, res) => {
    res.render('Pages/Home', Config.dataSet({ title: 'Home', login: req.session.login, status: req.session.status }));
});

authRouter.get('/login', (req, res) => {
    if (req.session.login != undefined && req.session.status == "LoggedIn") {
        res.redirect('/dashboard');
    } else {
        const success = req.session.success;
        const error = req.session.error;
        req.session.success = null;
        req.session.error = null;
        res.render('Login', Config.dataSet({ title: 'Login', error, success }));
    }
});

authRouter.get('/logout', Config.isLoggedIn, (req, res) => {
    // Error Check
    if (req.session.error) {
        // Redirect to Login Page
        res.render('Login', Config.dataSet({ title: 'Login', error: req.session.error }));
    } else {
        // Session Destroy
        req.session.destroy((err) => {
            // Redirect to Login Page
            if (err) res.render('Login', Config.dataSet({ title: 'Login', error: err }));
            auth.logout().then(() => {
                // Logout Success
                res.redirect('/');
            }).catch((err) => {
                // Logout Error
                res.render('Login', Config.dataSet({ title: 'Login', error: err }));
            });
        })
    }
})

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Redirect Error
    if (req.session.error) {
        const error = req.session.error;
        req.session.error = null
        res.render('Login', Config.dataSet({ title: 'Login', error }));
    } else {
        // Validation Check
        if (email && password) {
            // Login
            auth.login(email, password).then(data => {
                // Redirect Success
                req.session.login = data;
                req.session.status = "LoggedIn"
                req.session.success = { "message": `Login Success, Welcome ${data.user.email.split("@")[0]}!` };
                res.redirect('/dashboard');
            }).catch(err => {
                // Redirect Error
                const error = {
                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/",""),
                    "code": err.code
                }
                res.render('Login', Config.dataSet({ title: 'Login', error: error }));
            });
        } else {
            // Validation Error
            req.session.error = { "message": 'Please enter email and password' };
            res.render('Login', Config.dataSet({ title: 'Login', error: req.session.error }));
        }
    }
});

authRouter.get('/register', (req, res) => {
    if (req.session.login != undefined && req.session.status == "LoggedIn") {
        res.redirect('/dashboard');
    } else {
        res.render('Register', Config.dataSet({ title: 'Register' }));
    }
});

authRouter.post('/register', (req, res) => {
    const { email, password, retype } = req.body;
    // Redirect Error
    if (req.session.error) {
        const error = req.session.error;
        req.session.error = null
        res.render('Register', Config.dataSet({ title: 'Register', error }));
    } else {
        // Validation Check
        if (email && password && retype) {
            if (password == retype) {
                // Register
                auth.register(email, password).then(data => {
                    // Redirect Success
                    req.session.success = { "message": `Register Success, Please login ${data.user.email.split("@")[0]}!` };
                    res.redirect('/login');
                }).catch(err => {
                    // Redirect Error
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/",""),
                        "code": err.code
                    }
                    res.render('Register', Config.dataSet({ title: 'Register', error: error }));
                });
            } else {
                req.session.error = { "message": 'Password not match' };
                res.render('Register', Config.dataSet({ title: 'Register', error: req.session.error }));
            }
        } else {
            // Validation Error
            req.session.error = { "message": 'Please enter email password and retype password' };
            res.render('Register', Config.dataSet({ title: 'Register', error: req.session.error }));
        }
    }
});


authRouter.get('/reset', (req, res) => {
    res.render('ForgetPassword', Config.dataSet({ title: 'Forget Password' }));
});

authRouter.post('/reset', (req, res) => {
    const { email } = req.body;
    // Redirect Error
    if (req.session.error) {
        const error = req.session.error;
        req.session.error = null
        res.render('ForgetPassword', Config.dataSet({ title: 'Forget Password', error }));
    } else {
        // Validation Check
        if (email) {
            // Reset Password
            auth.resetPassword(email).then(data => {
                // Redirect Success
                req.session.success = { "message": `Reset Password Success, Please check your email!` };
                res.redirect('/login');
            }).catch(err => {
                // Redirect Error
                const error = {
                    "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/",""),
                    "code": err.code
                }
                res.render('ForgetPassword', Config.dataSet({ title: 'Forget Password', error: error }));
            });
        } else {
            // Validation Error
            req.session.error = { "message": 'Please enter email' };
            res.render('ForgetPassword', Config.dataSet({ title: 'Forget Password', error: req.session.error }));
        }
    }
});


authRouter.get('/dashboard', Config.isLoggedIn, (req, res) => {
    if (req.session.login && req.session.status == "LoggedIn") {
        const success = req.session.success;
        req.session.success = null;
        res.render('Pages/Dashboard', Config.dataSet({ title: 'Dashboard', login: req.session.login, success, status: req.session.status }));
    } else {
        res.redirect('/login');
    }
});

export default authRouter;