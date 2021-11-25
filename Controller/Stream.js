import Config from '../Config/Http.js';

// Setting Application Routes
const streamRouter = Config.express.Router();

streamRouter.get('/stream', Config.isLoggedIn, (req, res) => {
    res.render('Pages/Stream', Config.dataSet({ title: 'Stream', login: req.session.login, status: req.session.status }));
});

export default streamRouter;