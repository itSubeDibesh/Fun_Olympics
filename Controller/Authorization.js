import Config from '../Config/Http.js';

const authRouter = Config.express.Router();

authRouter.get('/', (req, res) => {
    res.render('Login',{title: 'Login', app_name: Config.app_name});
});

export default authRouter;