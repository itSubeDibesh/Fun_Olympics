import Config from '../Config/Http.js';

// Setting Application Routes
const settingsRouter = Config.express.Router();
// Setting Firebase Auth
const auth = Config.firebase_auth;
// Setting Firebase Auth
const admin = Config.firebase_admin;

settingsRouter.get('/settings', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    res.render('Pages/Settings', Config.dataSet({ title: 'Settings', login: req.session.login, status: req.session.status, success: req.session.success, error: req.session.error, warning: req.session.warning }));
});

settingsRouter.get('/email/verify', Config.isLoggedIn, Config.HasAccess, (req, res) => {
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

settingsRouter.get('/email/reset_logged_in', Config.isLoggedIn, Config.HasAccess, (req, res) => {
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


settingsRouter.post('/profile/update', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    const { email, name, phoneNumber, uid } = req.body;
    if (req.session.login) {
        // Validation Check
        if (!email || !name) {
            req.session.error = { message: "All fields are required." };
            res.redirect('/settings');
        } else {
            if (email == req.session.login.user.email) {
                // Update Profile
                admin.updateUser(uid, name, phoneNumber, false).then((data) => {
                    req.session.login = data
                    req.session.success = { message: "Profile updated." };
                    res.redirect('/logout');
                }).catch((err) => {
                    const error = {
                        "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/", ""),
                        "code": err.code
                    }
                    req.session.error = error;
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