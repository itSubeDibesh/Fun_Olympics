import Config from '../Config/Http.js';
import Auth from './core/Auth_Firebase.js';

const authRouter = Config.express.Router();
const auth = new Auth(Config.initializeApp, Config.firebaseConfig);

function dataSet(data) {
    data.app_name = Config.app_name;
    return data;
}

authRouter.get('/', (req, res) => {
    res.render('Pages/Home', dataSet({ title: 'Home' }));
});

authRouter.get('/login', (req, res) => {
    if (req.session.login != undefined && req.session.status=="LoggedIn") {
        res.redirect('/dashboard');
    } else {
        res.render('Login', dataSet({ title: 'Login', error: req.session.error }));
    }
});

authRouter.get('/logout',(req,res)=>{
    // Error Check
    if (req.error) {
        // Redirect to Login Page
        res.render('Login', dataSet({ title: 'Login', error: req.error }));
    } else {
        // Session Destroy
        req.session.destroy((err) => {
            // Redirect to Login Page
            if (err)  res.render('Login', dataSet({ title: 'Login', error: err }));
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

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Redirect Error
    if (req.error) {
        res.render('Login', dataSet({ title: 'Login', error: req.error }));
    } else {
        // Validation Check
        if (email && password) {
            // Login
            auth.login(email, password).then(data => {
                // Redirect Success
                req.session.login = data;
                req.session.status="LoggedIn"
                req.session.success={"message" : `Login Success, Welcome ${data.user.email.split("@")[0]}!`};
                res.redirect('/dashboard');
            }).catch(err => {
                // Redirect Error
                res.render('Login', dataSet({ title: 'Login', error: err }));
            });
        } else {
            // Validation Error
            req.session.error= {"message" :'Please enter email and password'};
            res.render('Login', dataSet({ title: 'Login', error: req.session.error }));
        }
    }
});

authRouter.get('/register', (req, res) => {
    res.render('Register', dataSet({ title: 'Register' }));
});

authRouter.get('/reset', (req, res) => {
    res.render('ForgetPassword', dataSet({ title: 'Forget Password' }));
});

authRouter.get('/dashboard', (req, res) => {
    if (req.session.login && req.session.status=="LoggedIn") {
        res.render('Pages/Dashboard', dataSet({ title: 'Dashboard', login: req.session.login, success: req.session.success, status:req.session.status }));
    } else {
        res.redirect('/login');
    }
});

export default authRouter;

// Todo : Email Verification
// https://redfern.dev/articles/email-verification-firebase-vuejs/

// Todo : Password Reset

// ToDo : Register

// Todo : Middleware