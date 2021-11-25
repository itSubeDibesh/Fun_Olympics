import Config from '../Config/Http.js';

// Setting Application Routes
const settingsRouter = Config.express.Router();
// Setting Firebase Auth
const auth = new Config.Auth_Firebase();

settingsRouter.get('/Settings', Config.isLoggedIn, (req, res) => {
    res.render('Pages/Settings', Config.dataSet({ title: 'Settings', login: req.session.login, status: req.session.status }));
});

settingsRouter.get('/email/verify', Config.isLoggedIn, (req, res) => {
    if (req.session.login) {
        // Verify Email
        auth.verifyEmail(req.session.login.user.email).then((data) => {
            req.session.login = data
            req.session.success = { message: "Email verification sent." };
            res.redirect('/dashboard');
        }).catch((error) => {
            req.session.error = { message: error.message };
            res.redirect('/dashboard');
        });
    } else {
        req.session.warning = { message: "You must be logged in to verify email." };
        res.redirect('/login');
    }
});

settingsRouter.get('/email/reset_logged_in', Config.isLoggedIn, (req, res) => {
    if (req.session.login) {
        // Reset email
        auth.resetPassword(req.session.login.user.email).then((data) => {
            req.session.login = data
            req.session.success = { message: "Reset request approved, email sent for reset." };
            res.redirect('/dashboard');
        }).catch((error) => {
            req.session.error = { message: error.message };
            res.redirect('/dashboard');
        });
    } else {
        req.session.warning = { message: "You must be logged in to reset email." };
        res.redirect('/login');
    }
});


settingsRouter.post('/profile/update', Config.isLoggedIn, (req, res) => {
    const { email, name } = req.body;
    if (req.session.login) {
        // Validation Check
        if (!email || !name) {
            req.session.error = { message: "All fields are required." };
            res.redirect('/settings');
        } else {
            if (email == req.session.login.user.email) {
                // Update Profile
                auth.updateProfile(name).then((data) => {
                    req.session.login = data
                    req.session.success = { message: "Profile updated." };
                    res.redirect('/settings');
                }).catch((error) => {
                    req.session.error = { message: error.message };
                    res.redirect('/settings');
                });
            } else {
                req.session.error = { message: "Email is Tampered! Cannot update profile, Try again later." };
                res.redirect('/logout');
            }
        }
    } else {
        req.session.warning = { message: "You must be logged in to update profile." };
        res.redirect('/login');
    }
})

export default settingsRouter;