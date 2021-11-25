import Config from '../Config/Http.js';

// Setting Application Routes
const usersRouter = Config.express.Router();

usersRouter.get('/users', Config.isLoggedIn, (req, res) => {
    res.render('Pages/Users', Config.dataSet({ title: 'Users', login: req.session.login, status: req.session.status }));
});

export default usersRouter;