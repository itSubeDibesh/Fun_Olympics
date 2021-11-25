import Config from '../Config/Http.js';

// Setting Application Routes
const noticeRouter = Config.express.Router();

noticeRouter.get('/notice', Config.isLoggedIn, (req, res) => {
    res.render('Pages/Notice', Config.dataSet({ title: 'Notice', login: req.session.login, status: req.session.status }));
});

export default noticeRouter;