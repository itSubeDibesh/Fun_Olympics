import Config from '../Config/Http.js';

// Setting Application Routes
const usersRouter = Config.express.Router();
// Setting Firebase Auth
const admin = new Config.Admin_Firebase();

usersRouter.get('/users', Config.isLoggedIn, (req, res) => {
    admin.listAllUsers().then(users => {
        res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, users: users }));
    })
    .catch(err => {
        const error = {
            "message": err.message.replace("Firebase", "Fun Olympics").replace("auth/",""),
            "code": err.code
        }
        res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status, error: error }));
    });
});

export default usersRouter;