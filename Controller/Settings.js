import Config from '../Config/Http.js';

// Setting Application Routes
const settingsRouter = Config.express.Router();
// Setting Firebase Auth
const auth = new Config.Auth_Firebase();

settingsRouter.get('/Settings', Config.isLoggedIn, (req, res) => {
    res.render('Pages/Settings', Config.dataSet({ title: 'Settings',  login: req.session.login, status: req.session.status  }));
});

settingsRouter.get('/email/verify', Config.isLoggedIn, (req, res) => {
    if(req.session.login){
        auth.verifyEmail(req.session.login.email).then((data) => {
            req.session.login = data
            req.session.success = {message: "Email verification sent."};
            res.redirect('/dashboard');
        }).catch((error) => {
            req.session.error = {message: error.message};
            res.redirect('/dashboard');
        });
    }else{
        req.session.warning = {message: "You must be logged in to verify email."};
        res.redirect('/login');
    }
});

export default settingsRouter;